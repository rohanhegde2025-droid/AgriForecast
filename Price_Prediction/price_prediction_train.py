"""
Price Prediction Only - Simple and Focused
Takes crop name as input, trains on price data, predicts prices
No yield prediction, no encoding complexity
"""

import pandas as pd
import numpy as np
import os
import joblib
import warnings
warnings.filterwarnings("ignore")

from prophet import Prophet
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error
from sklearn.preprocessing import LabelEncoder

VALID_CROPS = ["Rice", "Wheat", "Maize", "Cotton", "Barley", "Soybean"]
MODELS_DIR = "models"

# Ensure models directory exists
os.makedirs(MODELS_DIR, exist_ok=True)

# ─────────────────────────────────────────────────────────
# STEP 1: Load & merge price datasets for ALL crops
# ─────────────────────────────────────────────────────────
def load_all_crops_data():
    """
    Load combined historical price data + recent Agmarknet data for ALL crops
    Returns clean daily price time series with crop identifier
    """
    # Load historical data
    hist_path = "data/combined_prices_final.csv"
    if not os.path.exists(hist_path):
        print(f"File not found: {hist_path}")
        return None

    hist = pd.read_csv(hist_path)
    hist["Date"] = pd.to_datetime(hist["Date"])
    hist = hist[hist["Commodity"].isin(VALID_CROPS)].copy()

    # Load recent Agmarknet data
    recent_path = "data/agmarknet_cleaned.csv"
    if not os.path.exists(recent_path):
        print(f"File not found: {recent_path}")
        return None

    recent = pd.read_csv(recent_path)
    recent["Date"] = pd.to_datetime(recent["Date"])
    recent = recent[recent["Commodity"].isin(VALID_CROPS)].copy()

    # Add Min/Max to recent if missing
    if "Min_Price_Rs_Quintal" not in recent.columns:
        recent["Min_Price_Rs_Quintal"] = (
            recent["Modal_Price_Rs_Quintal"] * 0.94).round(2)
    if "Max_Price_Rs_Quintal" not in recent.columns:
        recent["Max_Price_Rs_Quintal"] = (
            recent["Modal_Price_Rs_Quintal"] * 1.06).round(2)

    # Merge datasets
    combined = pd.concat([hist, recent], ignore_index=True)
    combined = combined.drop_duplicates(subset=["Date", "Commodity"]).sort_values(["Commodity", "Date"])
    combined = combined.reset_index(drop=True)

    # Standardize column names
    combined = combined.rename(columns={
        "Date":                   "arrival_date",
        "Commodity":              "crop",
        "Modal_Price_Rs_Quintal": "modal_price",
        "Min_Price_Rs_Quintal":   "min_price",
        "Max_Price_Rs_Quintal":   "max_price",
        "MSP_Rs_Quintal":         "msp",
    })

    combined["modal_price"] = pd.to_numeric(
        combined["modal_price"], errors="coerce")
    combined = combined.dropna(subset=["modal_price"])

    print("\nLoaded all crops:")
    for crop in VALID_CROPS:
        crop_data = combined[combined["crop"] == crop]
        if len(crop_data) > 0:
            print(f"  {crop:10} — {len(crop_data):5} rows "
                  f"({crop_data['arrival_date'].min().date()} → {crop_data['arrival_date'].max().date()})")

    return combined


def load_single_crop_data(crop_name):
    """Load data for a single crop (for prediction)"""
    crop_name = crop_name.strip().title()
    if crop_name not in VALID_CROPS:
        print(f"Invalid crop '{crop_name}'. Choose from: {VALID_CROPS}")
        return None
    
    # Load all crops and filter to this one
    all_data = load_all_crops_data()
    if all_data is None:
        return None
    
    df = all_data[all_data["crop"] == crop_name].copy()
    if len(df) == 0:
        print(f"No data found for {crop_name}")
        return None
    
    print(f"\n{crop_name} — {len(df)} rows")
    print(f"Date range : {df['arrival_date'].min().date()} → {df['arrival_date'].max().date()}")
    print(f"Price range: ₹{df['modal_price'].min():.0f} – ₹{df['modal_price'].max():.0f} /quintal")
    
    return df


# ─────────────────────────────────────────────────────────
# STEP 2: Feature engineering for all crops
# ─────────────────────────────────────────────────────────
def add_features(df):
    """Add lag, rolling average, calendar, and crop encoding features"""
    # Encode crop names
    le = LabelEncoder()
    df["crop_encoded"] = le.fit_transform(df["crop"])
    
    # Process each crop separately for lag/rolling features
    df_processed = []
    
    for crop in df["crop"].unique():
        crop_df = df[df["crop"] == crop].copy()
        crop_df = crop_df.set_index("arrival_date")
        crop_df = crop_df.asfreq("D")
        crop_df["modal_price"] = crop_df["modal_price"].fillna(method="ffill")
        
        # Lag features (per crop)
        crop_df["lag_7"]  = crop_df["modal_price"].shift(7)
        crop_df["lag_14"] = crop_df["modal_price"].shift(14)
        crop_df["lag_30"] = crop_df["modal_price"].shift(30)
        crop_df["lag_60"] = crop_df["modal_price"].shift(60)

        # Rolling averages (per crop)
        crop_df["rolling_7"]  = crop_df["modal_price"].rolling(7).mean()
        crop_df["rolling_14"] = crop_df["modal_price"].rolling(14).mean()
        crop_df["rolling_30"] = crop_df["modal_price"].rolling(30).mean()
        crop_df["rolling_90"] = crop_df["modal_price"].rolling(90).mean()

        # Price momentum (per crop)
        crop_df["momentum_7"]  = crop_df["modal_price"] - crop_df["lag_7"]
        crop_df["momentum_30"] = crop_df["modal_price"] - crop_df["lag_30"]

        # MSP gap
        if "msp" in crop_df.columns:
            crop_df["msp_gap"] = crop_df["modal_price"] - crop_df["msp"]
        else:
            crop_df["msp_gap"] = 0

        # Calendar features (same for all)
        crop_df["month"]    = crop_df.index.month
        crop_df["week"]     = crop_df.index.isocalendar().week.astype(int)
        crop_df["quarter"]  = crop_df.index.quarter
        crop_df["is_rabi"]  = crop_df["month"].isin([11, 12, 1, 2, 3]).astype(int)
        crop_df["is_kharif"]= crop_df["month"].isin([6, 7, 8, 9, 10]).astype(int)
        crop_df["year"]     = crop_df.index.year
        
        crop_df["crop_encoded"] = le.transform([crop])[0]
        crop_df = crop_df.dropna()
        df_processed.append(crop_df)
    
    return pd.concat(df_processed, ignore_index=False).reset_index()



# ─────────────────────────────────────────────────────────
# STEP 3: Train unified model & predict
# ─────────────────────────────────────────────────────────
FEATURES = [
    "crop_encoded",
    "lag_7", "lag_14", "lag_30", "lag_60",
    "rolling_7", "rolling_14", "rolling_30", "rolling_90",
    "momentum_7", "momentum_30", "msp_gap",
    "month", "week", "quarter", "is_rabi", "is_kharif", "year"
]


# ─────────────────────────────────────────────────────────
# Model persistence (unified models for all crops)
# ─────────────────────────────────────────────────────────
def save_unified_models(xgb_model, prophet_model, metrics):
    """Save unified models trained on all crops"""
    xgb_path = os.path.join(MODELS_DIR, "price_xgb_all.pkl")
    prophet_path = os.path.join(MODELS_DIR, "price_prophet_all.pkl")
    metrics_path = os.path.join(MODELS_DIR, "price_metrics_all.pkl")
    
    joblib.dump(xgb_model, xgb_path)
    joblib.dump(prophet_model, prophet_path)
    joblib.dump(metrics, metrics_path)
    
    print(f"  ✓ Unified models saved to {MODELS_DIR}/")


def load_unified_models():
    """Load unified models trained on all crops"""
    xgb_path = os.path.join(MODELS_DIR, "price_xgb_all.pkl")
    prophet_path = os.path.join(MODELS_DIR, "price_prophet_all.pkl")
    metrics_path = os.path.join(MODELS_DIR, "price_metrics_all.pkl")
    
    if os.path.exists(xgb_path) and os.path.exists(prophet_path):
        try:
            xgb_model = joblib.load(xgb_path)
            prophet_model = joblib.load(prophet_path)
            metrics = joblib.load(metrics_path) if os.path.exists(metrics_path) else {}
            return xgb_model, prophet_model, metrics
        except Exception as e:
            print(f"  Warning: Could not load models: {e}")
            return None, None, None
    
    return None, None, None


def unified_models_exist():
    """Check if unified models exist"""
    xgb_path = os.path.join(MODELS_DIR, "price_xgb_all.pkl")
    prophet_path = os.path.join(MODELS_DIR, "price_prophet_all.pkl")
    return os.path.exists(xgb_path) and os.path.exists(prophet_path)


# Keep legacy functions for backward compatibility
def save_models(crop_name, xgb_model, prophet_model, metrics):
    """Legacy: save per-crop models (now saves unified models)"""
    save_unified_models(xgb_model, prophet_model, metrics)

def load_models(crop_name):
    """Legacy: load per-crop models (now loads unified models)"""
    return load_unified_models()

def models_exist(crop_name):
    """Legacy: check per-crop models (now checks unified models)"""
    return unified_models_exist()


# ─────────────────────────────────────────────────────────
# STEP 3: Train models & predict
# ─────────────────────────────────────────────────────────
# ─────────────────────────────────────────────────────────
# STEP 4: Unified prediction function
# ─────────────────────────────────────────────────────────
def predict_price(crop_name, forecast_days=30, retrain=False):
    """
    Use unified model (trained on all crops) to predict price for a specific crop
    
    Args:
        crop_name: Crop to predict
        forecast_days: Days to forecast ahead
        retrain: Force retrain unified model even if it exists
        
    Returns:
        dict with predictions, trends, and forecast
    """
    
    crop_name = crop_name.strip().title()
    
    if crop_name not in VALID_CROPS:
        print(f"Invalid crop '{crop_name}'")
        return None

    print("\n" + "="*60)
    print(f"  PRICE PREDICTION: {crop_name}")
    print(f"  (Using unified model trained on all crops)")
    print("="*60)

    # Step 1: Check for cached unified models
    if not retrain and unified_models_exist():
        print("\n[1/2] Loading pre-trained unified model...")
        xgb, prophet, metrics = load_unified_models()
        mae = metrics.get("mae", 0)
        mape = metrics.get("mape", 0)
        print(f"  ✓ Unified model loaded from cache (MAPE: {mape:.2f}%)")
        
        # Now load single crop data for prediction
        print("\n[2/2] Loading crop data...")
        df = load_single_crop_data(crop_name)
        if df is None:
            return None
        
        print("\n  Adding features...")
        df = add_features(df)
        print(f"  ✓ Features ready for {len(df)} days")
        
    else:
        # Step 2: Load all crops and train unified model
        print("\n[1/2] Training unified model on all crops...")
        
        all_data = load_all_crops_data()
        if all_data is None:
            return None
        
        print("\n  Adding features...")
        all_data = add_features(all_data)
        print(f"  ✓ Total {len(all_data)} rows across all crops")
        
        # Split by crop to maintain temporal order
        train_size = int(0.95 * len(all_data))
        train_df = all_data[:train_size]
        val_df = all_data[train_size:]
        
        print(f"  Train: {len(train_df)} rows | Validation: {len(val_df)} rows")
        
        # Train XGBoost on all crops
        print("\n  Fitting XGBoost on unified data...")
        X_train = train_df[FEATURES]
        y_train = train_df["modal_price"]
        X_val = val_df[FEATURES]
        y_val = val_df["modal_price"]

        xgb = XGBRegressor(
            n_estimators=500,
            learning_rate=0.03,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            min_child_weight=3,
            random_state=42,
            early_stopping_rounds=30,
            eval_metric="mae"
        )
        xgb.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)

        # Validation metrics
        val_preds = xgb.predict(X_val)
        mae = mean_absolute_error(y_val, val_preds)
        mape = mean_absolute_percentage_error(y_val, val_preds) * 100
        print(f"  ✓ XGBoost Validation → MAE: ₹{mae:.2f} | MAPE: {mape:.2f}%")
        
        # Train Prophet on all crops combined
        print("  Fitting Prophet on unified data...")
        prophet_df = all_data.reset_index()[["arrival_date", "modal_price"]]
        prophet_df.columns = ["ds", "y"]
        prophet_df = prophet_df.sort_values("ds")

        prophet = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            seasonality_mode="multiplicative",
            interval_width=0.80,
            changepoint_prior_scale=0.05
        )
        prophet.add_seasonality(name="monthly", period=30.5, fourier_order=5)
        prophet.fit(prophet_df)
        print(f"  ✓ Prophet trained")
        
        # Save unified models
        metrics = {"mae": mae, "mape": mape}
        save_unified_models(xgb, prophet, metrics)
        
        # Now load single crop data for prediction
        print("\n[2/2] Loading crop data for prediction...")
        df = load_single_crop_data(crop_name)
        if df is None:
            return None
        
        print("  Adding features...")
        df = add_features(df)
        print(f"  ✓ Features ready for {len(df)} days")

    # ───────────────────────────────────────────────────────
    # Make predictions using unified model
    # ───────────────────────────────────────────────────────
    
    # Ensemble prediction for next day
    latest_features = df[FEATURES].iloc[[-1]]
    xgb_pred = xgb.predict(latest_features)[0]
    
    # Get prophet forecast
    future = prophet.make_future_dataframe(periods=forecast_days)
    forecast = prophet.predict(future)
    prophet_next = forecast[forecast["ds"] > df["arrival_date"].max()]["yhat"].iloc[0]
    
    ensemble_next = round(0.6 * xgb_pred + 0.4 * prophet_next, 2)

    # 30-day forecast with ensemble
    future_forecast = forecast[forecast["ds"] > df["arrival_date"].max()].head(forecast_days)
    future_xgb_rows = []

    last_row = df[FEATURES].iloc[-1].copy()
    last_price = df["modal_price"].iloc[-1]
    prices_so_far = list(df["modal_price"].values)

    for i, row in future_forecast.iterrows():
        pred_date = row["ds"]
        
        last_row["lag_7"] = prices_so_far[-7] if len(prices_so_far) >= 7 else last_price
        last_row["lag_14"] = prices_so_far[-14] if len(prices_so_far) >= 14 else last_price
        last_row["lag_30"] = prices_so_far[-30] if len(prices_so_far) >= 30 else last_price
        last_row["lag_60"] = prices_so_far[-60] if len(prices_so_far) >= 60 else last_price
        last_row["rolling_7"] = np.mean(prices_so_far[-7:])
        last_row["rolling_14"] = np.mean(prices_so_far[-14:])
        last_row["rolling_30"] = np.mean(prices_so_far[-30:])
        last_row["rolling_90"] = np.mean(prices_so_far[-90:])
        last_row["momentum_7"] = last_price - prices_so_far[-7] if len(prices_so_far) >= 7 else 0
        last_row["momentum_30"] = last_price - prices_so_far[-30] if len(prices_so_far) >= 30 else 0
        last_row["month"] = pred_date.month
        last_row["week"] = pred_date.isocalendar()[1]
        last_row["quarter"] = pred_date.quarter
        last_row["is_rabi"] = int(pred_date.month in [11, 12, 1, 2, 3])
        last_row["is_kharif"] = int(pred_date.month in [6, 7, 8, 9, 10])
        last_row["year"] = pred_date.year

        xgb_p = xgb.predict(pd.DataFrame([last_row]))[0]
        prophet_p = row["yhat"]
        blended = round(0.6 * xgb_p + 0.4 * prophet_p, 2)

        future_xgb_rows.append({
            "date": pred_date.strftime("%Y-%m-%d"),
            "predicted": blended,
            "lower": round(row["yhat_lower"], 2),
            "upper": round(row["yhat_upper"], 2),
        })
        prices_so_far.append(blended)
        last_price = blended

    forecast_30 = pd.DataFrame(future_xgb_rows)

    # Summary stats
    current_price = round(df["modal_price"].iloc[-1], 2)
    rolling_30 = round(df["rolling_30"].iloc[-1], 2)
    msp_val = round(df["msp"].iloc[-1], 2) if "msp" in df.columns else None

    trend = "UP" if ensemble_next > current_price else "DOWN"
    pct_change = round(((ensemble_next - current_price) / current_price) * 100, 2)
    recommendation = "SELL" if ensemble_next > rolling_30 else "HOLD"

    # Display results
    print("\n" + "="*60)
    print(f"  PREDICTIONS")
    print("="*60)
    print(f"  Current Price     : ₹{current_price:,.2f} /quintal")
    print(f"  Predicted Price   : ₹{ensemble_next:,.2f} /quintal")
    print(f"  Price Range       : ₹{round(forecast['yhat_lower'][forecast['ds'] > df['arrival_date'].max()].iloc[0], 2):,.2f} – ₹{round(forecast['yhat_upper'][forecast['ds'] > df['arrival_date'].max()].iloc[0], 2):,.2f}")
    print(f"  30-Day Average    : ₹{rolling_30:,.2f} /quintal")
    print(f"  MSP               : ₹{msp_val:,.2f} /quintal" if msp_val else "  MSP               : N/A")
    print(f"  Price Trend       : {trend} ({pct_change:+.2f}%)")
    print(f"  Recommendation    : {recommendation}")
    print(f"  Model Accuracy    : MAPE {mape:.2f}%")

    print(f"\n  30-DAY FORECAST (first 7 days):")
    print(forecast_30.head(7).to_string(index=False))

    # Save forecast
    os.makedirs("outputs", exist_ok=True)
    forecast_30.to_csv(f"outputs/forecast_30days_{crop_name}.csv", index=False)
    print(f"\n✓ Saved → outputs/forecast_30days_{crop_name}.csv")

    print("="*60 + "\n")

    return {
        "crop": crop_name,
        "current_price": current_price,
        "predicted_price": ensemble_next,
        "trend": trend,
        "recommendation": recommendation,
        "mape": mape,
        "forecast": forecast_30,
    }



# ─────────────────────────────────────────────────────────
# Main execution
# ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        crop = sys.argv[1]
    else:
        crop = "Rice"

    result = predict_price(crop)
