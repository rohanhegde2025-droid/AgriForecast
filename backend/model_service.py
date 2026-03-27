"""
Model Service - Centralized model loading and prediction.
Loads yield and price models at startup, provides prediction functions.
Falls back to safe defaults when models are missing or fail.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

import pandas as pd
import joblib

from backend.config import settings

logger = logging.getLogger(__name__)

# ── Fallback values ──
YIELD_FALLBACK = 3.5
PRICE_FALLBACK = 1450.0

# ── Feature list for price XGBoost model ──
PRICE_FEATURES = [
    "crop_encoded",
    "lag_7", "lag_14", "lag_30", "lag_60",
    "rolling_7", "rolling_14", "rolling_30", "rolling_90",
    "momentum_7", "momentum_30", "msp_gap",
    "month", "week", "quarter", "is_rabi", "is_kharif", "year",
]

# ── Crop encoding (must match training order) ──
CROP_ENCODING = {
    "Barley": 0, "Cotton": 1, "Maize": 2,
    "Rice": 3, "Soybean": 4, "Wheat": 5,
}

# ── MSP reference prices (Minimum Support Price ₹/Quintal) ──
# These anchor the lag features so the price model sees realistic inputs
MSP_PRICES = {
    "Barley": 1735, "Cotton": 6620, "Maize": 2090,
    "Rice": 2203, "Soybean": 4600, "Wheat": 2275,
}

# ── Expected columns for the yield pipeline ──
YIELD_COLUMNS = [
    "Region", "Soil_Type", "Crop", "Rainfall_mm", "Temperature_Celsius",
    "Fertilizer_Used", "Irrigation_Used", "Weather_Condition", "Days_to_Harvest",
]

# ── Frontend -> Model column name mapping ──
COLUMN_MAPPING = {
    "region": "Region",
    "soil_type": "Soil_Type",
    "crop": "Crop",
    "rainfall_mm": "Rainfall_mm",
    "temperature_celsius": "Temperature_Celsius",
    "fertilizer_used": "Fertilizer_Used",
    "irrigation_used": "Irrigation_Used",
    "weather_condition": "Weather_Condition",
    "days_to_harvest": "Days_to_Harvest",
}


# ────────────────────────────────────────────────────────
# Model Loading
# ────────────────────────────────────────────────────────
class ModelStore:
    """Global model store — loads once, reuses forever."""

    def __init__(self) -> None:
        self.yield_model: Any | None = None
        self.price_xgb: Any | None = None
        self.price_prophet: Any | None = None
        self.price_metrics: dict = {}
        self._loaded = False

    def load_models(self) -> None:
        """Load all available models from disk."""
        if self._loaded:
            return

        # Use absolute paths for reliability
        base_dir = os.path.dirname(os.path.abspath(__file__))
        models_dir = os.path.join(base_dir, "models")
        
        if not os.path.exists(models_dir):
            models_dir = os.path.join(os.getcwd(), "backend", "models")
        
        self.yield_model = self._try_load(os.path.join(models_dir, "yield_model.pkl"))
        self.price_xgb = self._try_load(os.path.join(models_dir, "price_xgb_all.pkl"))
        self.price_prophet = self._try_load(os.path.join(models_dir, "price_prophet_all.pkl"))
        self.price_metrics = self._try_load(os.path.join(models_dir, "price_metrics_all.pkl")) or {}

        self._loaded = True
        logger.info(
            "Models loaded — yield: %s, price_xgb: %s, price_prophet: %s",
            self.yield_model is not None,
            self.price_xgb is not None,
            self.price_prophet is not None,
        )

    def _try_load(self, path: str) -> Any | None:
        """Try loading a model file using joblib."""
        if not os.path.exists(path):
            return None
        try:
            model = joblib.load(path)
            return model
        except Exception as exc:
            logger.warning("Failed to load %s: %s", path, exc)
            return None

    @property
    def models_loaded(self) -> bool:
        return self.yield_model is not None or self.price_xgb is not None


# ── Singleton ──
model_store = ModelStore()


# ────────────────────────────────────────────────────────
# Yield Prediction
# ────────────────────────────────────────────────────────
def predict_yield(features: dict) -> float:
    """Run yield model or return fallback."""
    if model_store.yield_model is None:
        return YIELD_FALLBACK

    try:
        # Rename frontend keys to model keys
        renamed = {COLUMN_MAPPING.get(k, k): v for k, v in features.items()}
        
        # Build DataFrame with ONLY the columns the model expects, in the right order
        row = {}
        for col in YIELD_COLUMNS:
            if col in renamed:
                row[col] = renamed[col]
            else:
                logger.warning("Missing yield feature: %s", col)
                row[col] = None
        
        df = pd.DataFrame([row])
        
        # Ensure correct types
        df["Rainfall_mm"] = pd.to_numeric(df["Rainfall_mm"], errors="coerce")
        df["Temperature_Celsius"] = pd.to_numeric(df["Temperature_Celsius"], errors="coerce")
        df["Days_to_Harvest"] = pd.to_numeric(df["Days_to_Harvest"], errors="coerce").astype(int)
        df["Fertilizer_Used"] = df["Fertilizer_Used"].astype(bool)
        df["Irrigation_Used"] = df["Irrigation_Used"].astype(bool)
        
        prediction = model_store.yield_model.predict(df)
        result = float(prediction[0])
        logger.info("Yield prediction: %s for crop=%s, region=%s", result, row.get("Crop"), row.get("Region"))
        return result
    except Exception as exc:
        logger.warning("Yield prediction failed, using fallback: %s", exc)
        return YIELD_FALLBACK


# ────────────────────────────────────────────────────────
# Price Prediction
# ────────────────────────────────────────────────────────
def predict_price(features: dict) -> dict:
    """
    Run price model ensemble or return fallback.
    Returns dict with price_prediction, price_trend, confidence.
    """
    if model_store.price_xgb is None:
        return {
            "price_prediction": PRICE_FALLBACK,
            "price_trend": "stable",
            "confidence": 0.0,
        }

    try:
        crop = features.get("crop", "Wheat")
        crop_clean = crop.strip().title()
        crop_encoded = CROP_ENCODING.get(crop_clean, 5)  # Default to Wheat

        # Get the MSP base price for this specific crop
        base_price = MSP_PRICES.get(crop_clean, 2275)  # Default to Wheat MSP
        
        import datetime
        now = datetime.datetime.now()

        # Build feature row using crop-specific MSP base prices
        # This ensures different crops get different price predictions
        feature_row = pd.DataFrame([{
            "crop_encoded": crop_encoded,
            "lag_7": base_price * 1.02,       # Recent price slightly above MSP
            "lag_14": base_price * 1.01,
            "lag_30": base_price * 0.99,
            "lag_60": base_price * 0.97,
            "rolling_7": base_price * 1.01,
            "rolling_14": base_price * 1.005,
            "rolling_30": base_price * 0.995,
            "rolling_90": base_price * 0.98,
            "momentum_7": base_price * 0.02,  # Positive momentum
            "momentum_30": base_price * 0.03,
            "msp_gap": base_price * 0.05,     # 5% above MSP
            "month": now.month,
            "week": now.isocalendar()[1],
            "quarter": (now.month - 1) // 3 + 1,
            "is_rabi": int(now.month in [11, 12, 1, 2, 3]),
            "is_kharif": int(now.month in [6, 7, 8, 9, 10]),
            "year": now.year,
        }])

        xgb_pred = float(model_store.price_xgb.predict(feature_row[PRICE_FEATURES])[0])

        # Prophet prediction
        prophet_pred = xgb_pred  # Default fallback if prophet missing
        if model_store.price_prophet is not None:
            try:
                future = model_store.price_prophet.make_future_dataframe(periods=1)
                forecast = model_store.price_prophet.predict(future)
                prophet_pred = float(forecast["yhat"].iloc[-1])
            except Exception as e:
                logger.warning("Prophet prediction failed: %s", e)

        # Ensemble: 60% XGBoost + 40% Prophet
        final_price = 0.6 * xgb_pred + 0.4 * prophet_pred

        # Confidence based on gap between models
        confidence = max(0, 100 - abs(xgb_pred - prophet_pred) / base_price * 100)

        # Trend based on comparison to MSP
        trend = "up" if final_price > base_price else "down" if final_price < base_price * 0.95 else "stable"
        
        logger.info("Price prediction: %.2f for crop=%s (MSP=%d)", final_price, crop_clean, base_price)

        return {
            "price_prediction": round(final_price, 2),
            "price_trend": trend,
            "confidence": round(confidence, 2),
        }

    except Exception as exc:
        logger.warning("Price prediction failed, using fallback: %s", exc)
        return {
            "price_prediction": PRICE_FALLBACK,
            "price_trend": "stable",
            "confidence": 0.0,
        }

# Load models at startup as requested
model_store.load_models()
