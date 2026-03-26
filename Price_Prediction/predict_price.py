"""
Price Prediction - Load Pre-trained Model & Predict
Takes crop name as input, loads saved unified model, makes predictions
No training - just prediction using existing models
"""

import pandas as pd
import numpy as np
import os
import joblib
import warnings
warnings.filterwarnings("ignore")

from sklearn.preprocessing import LabelEncoder

VALID_CROPS = ["Rice", "Wheat", "Maize", "Cotton", "Barley", "Soybean"]
MODELS_DIR = "models"

# ─────────────────────────────────────────────────────────
# STEP 1: Load pre-trained models
# ─────────────────────────────────────────────────────────
def load_models():
    """Load pre-trained unified models from disk"""
    xgb_path = os.path.join(MODELS_DIR, "price_xgb_all.pkl")
    prophet_path = os.path.join(MODELS_DIR, "price_prophet_all.pkl")
    metrics_path = os.path.join(MODELS_DIR, "price_metrics_all.pkl")
    
    if not os.path.exists(xgb_path) or not os.path.exists(prophet_path):
        print("❌ Error: Pre-trained models not found!")
        print(f"   Please run 'python price_prediction.py Rice' first to train the models.")
        return None, None, None
    
    try:
        xgb_model = joblib.load(xgb_path)
        prophet_model = joblib.load(prophet_path)
        metrics = joblib.load(metrics_path) if os.path.exists(metrics_path) else {}
        print("✓ Models loaded successfully")
        return xgb_model, prophet_model, metrics
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return None, None, None


# ─────────────────────────────────────────────────────────
# STEP 2: Load crop data
# ─────────────────────────────────────────────────────────
def load_crop_data(crop_name):
    """Load historical + recent data for a specific crop"""
    crop_name = crop_name.strip().title()
    
    if crop_name not in VALID_CROPS:
        print(f"❌ Invalid crop '{crop_name}'")
        print(f"   Valid crops: {', '.join(VALID_CROPS)}")
        return None
    
    # Load historical data
    hist_path = "data/combined_prices_final.csv"
    if not os.path.exists(hist_path):
        print(f"❌ File not found: {hist_path}")
        return None
    
    hist = pd.read_csv(hist_path)
    hist["Date"] = pd.to_datetime(hist["Date"])
    hist = hist[hist["Commodity"] == crop_name].copy()
    
    # Load recent data
    recent_path = "data/agmarknet_cleaned.csv"
    if not os.path.exists(recent_path):
        print(f"❌ File not found: {recent_path}")
        return None
    
    recent = pd.read_csv(recent_path)
    recent["Date"] = pd.to_datetime(recent["Date"])
    recent = recent[recent["Commodity"] == crop_name].copy()
    
    # Add Min/Max to recent if missing
    if "Min_Price_Rs_Quintal" not in recent.columns:
        recent["Min_Price_Rs_Quintal"] = (recent["Modal_Price_Rs_Quintal"] * 0.94).round(2)
    if "Max_Price_Rs_Quintal" not in recent.columns:
        recent["Max_Price_Rs_Quintal"] = (recent["Modal_Price_Rs_Quintal"] * 1.06).round(2)
    
    # Merge and clean
    combined = pd.concat([hist, recent], ignore_index=True)
    combined = combined.drop_duplicates(subset=["Date"]).sort_values("Date")
    combined = combined.reset_index(drop=True)
    
    # Standardize columns
    combined = combined.rename(columns={
        "Date": "arrival_date",
        "Commodity": "crop",
        "Modal_Price_Rs_Quintal": "modal_price",
        "Min_Price_Rs_Quintal": "min_price",
        "Max_Price_Rs_Quintal": "max_price",
        "MSP_Rs_Quintal": "msp",
    })
    
    combined["modal_price"] = pd.to_numeric(combined["modal_price"], errors="coerce")
    combined = combined.dropna(subset=["modal_price"])
    
    print(f"\n✓ {crop_name}: {len(combined)} rows loaded")
    print(f"  Date range: {combined['arrival_date'].min().date()} → {combined['arrival_date'].max().date()}")
    print(f"  Price range: ₹{combined['modal_price'].min():.0f} – ₹{combined['modal_price'].max():.0f} /quintal")
    
    return combined


# ─────────────────────────────────────────────────────────
# STEP 3: Add features
# ─────────────────────────────────────────────────────────
def add_features(df):
    """Add lag, rolling, and calendar features"""
    # Encode crop
    le = LabelEncoder()
    df["crop_encoded"] = le.fit_transform(df["crop"])
    
    # Process time series features
    df_sorted = df.sort_values("arrival_date").copy()
    df_sorted = df_sorted.set_index("arrival_date")
    df_sorted = df_sorted.asfreq("D")
    df_sorted["modal_price"] = df_sorted["modal_price"].fillna(method="ffill")
    
    # Lag features
    df_sorted["lag_7"] = df_sorted["modal_price"].shift(7)
    df_sorted["lag_14"] = df_sorted["modal_price"].shift(14)
    df_sorted["lag_30"] = df_sorted["modal_price"].shift(30)
    df_sorted["lag_60"] = df_sorted["modal_price"].shift(60)
    
    # Rolling averages
    df_sorted["rolling_7"] = df_sorted["modal_price"].rolling(7).mean()
    df_sorted["rolling_14"] = df_sorted["modal_price"].rolling(14).mean()
    df_sorted["rolling_30"] = df_sorted["modal_price"].rolling(30).mean()
    df_sorted["rolling_90"] = df_sorted["modal_price"].rolling(90).mean()
    
    # Momentum
    df_sorted["momentum_7"] = df_sorted["modal_price"] - df_sorted["lag_7"]
    df_sorted["momentum_30"] = df_sorted["modal_price"] - df_sorted["lag_30"]
    
    # MSP gap
    if "msp" in df_sorted.columns:
        df_sorted["msp_gap"] = df_sorted["modal_price"] - df_sorted["msp"]
    else:
        df_sorted["msp_gap"] = 0
    
    # Calendar features
    df_sorted["month"] = df_sorted.index.month
    df_sorted["week"] = df_sorted.index.isocalendar().week.astype(int)
    df_sorted["quarter"] = df_sorted.index.quarter
    df_sorted["is_rabi"] = df_sorted["month"].isin([11, 12, 1, 2, 3]).astype(int)
    df_sorted["is_kharif"] = df_sorted["month"].isin([6, 7, 8, 9, 10]).astype(int)
    df_sorted["year"] = df_sorted.index.year
    
    return df_sorted.dropna().reset_index()


# ─────────────────────────────────────────────────────────
# STEP 4: Make predictions
# ─────────────────────────────────────────────────────────
FEATURES = [
    "crop_encoded",
    "lag_7", "lag_14", "lag_30", "lag_60",
    "rolling_7", "rolling_14", "rolling_30", "rolling_90",
    "momentum_7", "momentum_30", "msp_gap",
    "month", "week", "quarter", "is_rabi", "is_kharif", "year"
]


def predict(crop_name, forecast_days=30):
    """
    Load model and predict price for a crop
    
    Args:
        crop_name: Crop to predict
        forecast_days: Days to forecast ahead
    
    Returns:
        dict with predictions and forecast
    """
    
    crop_name = crop_name.strip().title()
    
    if crop_name not in VALID_CROPS:
        print(f"❌ Invalid crop: {crop_name}")
        return None
    
    print("\n" + "="*60)
    print(f"  PRICE PREDICTION: {crop_name}")
    print("="*60)
    
    # Load models
    print("\n[1/3] Loading pre-trained model...")
    xgb, prophet, metrics = load_models()
    if xgb is None:
        return None
    
    mae = metrics.get("mae", 0)
    mape = metrics.get("mape", 0)
    print(f"  Model accuracy: MAPE {mape:.2f}%, MAE ₹{mae:.2f}")
    
    # Load crop data
    print("\n[2/3] Loading crop data...")
    df = load_crop_data(crop_name)
    if df is None:
        return None
    
    # Add features
    print("\n[3/3] Adding features and predicting...")
    df = add_features(df)
    print(f"  ✓ Features ready for {len(df)} days")
    
    # Get latest features for prediction
    latest_features = df[FEATURES].iloc[[-1]]
    xgb_pred = xgb.predict(latest_features)[0]
    
    # Prophet forecast
    future = prophet.make_future_dataframe(periods=forecast_days)
    forecast = prophet.predict(future)
    prophet_next = forecast[forecast["ds"] > df["arrival_date"].max()]["yhat"].iloc[0]
    
    # Ensemble: 60% XGBoost + 40% Prophet
    ensemble_next = round(0.6 * xgb_pred + 0.4 * prophet_next, 2)
    
    # 30-day forecast
    future_forecast = forecast[forecast["ds"] > df["arrival_date"].max()].head(forecast_days)
    forecast_rows = []
    
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
        
        forecast_rows.append({
            "date": pred_date.strftime("%Y-%m-%d"),
            "predicted": blended,
            "lower": round(row["yhat_lower"], 2),
            "upper": round(row["yhat_upper"], 2),
        })
        prices_so_far.append(blended)
        last_price = blended
    
    forecast_df = pd.DataFrame(forecast_rows)
    
    # Summary stats
    current_price = round(df["modal_price"].iloc[-1], 2)
    rolling_30 = round(df["rolling_30"].iloc[-1], 2)
    msp_val = round(df["msp"].iloc[-1], 2) if "msp" in df.columns else None
    
    trend = "UP" if ensemble_next > current_price else "DOWN"
    pct_change = round(((ensemble_next - current_price) / current_price) * 100, 2)
    recommendation = "SELL" if ensemble_next > rolling_30 else "HOLD"
    
    # Display results
    print("\n" + "="*60)
    print(f"  RESULTS")
    print("="*60)
    print(f"  Current Price     : ₹{current_price:,.2f} /quintal")
    print(f"  Predicted Price   : ₹{ensemble_next:,.2f} /quintal")
    print(f"  30-Day Average    : ₹{rolling_30:,.2f} /quintal")
    print(f"  MSP               : ₹{msp_val:,.2f} /quintal" if msp_val else "  MSP               : N/A")
    print(f"  Price Trend       : {trend} ({pct_change:+.2f}%)")
    print(f"  Recommendation    : {recommendation}")
    print(f"  Model Accuracy    : MAPE {mape:.2f}%")
    
    print(f"\n  30-DAY FORECAST (first 7 days):")
    print(forecast_df.head(7).to_string(index=False))
    
    # Save forecast
    os.makedirs("outputs", exist_ok=True)
    forecast_df.to_csv(f"outputs/forecast_30days_{crop_name}.csv", index=False)
    print(f"\n✓ Saved → outputs/forecast_30days_{crop_name}.csv")
    
    print("="*60 + "\n")
    
    return {
        "crop": crop_name,
        "current_price": current_price,
        "predicted_price": ensemble_next,
        "trend": trend,
        "recommendation": recommendation,
        "mape": mape,
        "forecast": forecast_df,
    }


# ─────────────────────────────────────────────────────────
# Main - Get user input
# ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        crop = sys.argv[1]
    else:
        print("\n" + "="*60)
        print("  PRICE PREDICTION - Pre-trained Model")
        print("="*60)
        print(f"\n  Available crops: {', '.join(VALID_CROPS)}")
        crop = input("\n  Enter crop name: ").strip()
    
    result = predict(crop)
