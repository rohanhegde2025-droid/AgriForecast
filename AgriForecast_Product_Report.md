# AgriForecast — Product Report

> **Precision Agriculture Platform for Indian Farmers**
> Version 0.2.0 · March 2026

---

## 1. Executive Summary

**AgriForecast** is a full-stack AI-powered precision agriculture platform designed to help Indian farmers make data-driven decisions about crop yield expectations, market pricing, and optimal selling strategies. It combines machine learning inference (XGBoost, Prophet), real-time generative AI advisory (Google Gemma), and cloud-based data persistence (Firebase) into a single, premium "Deep Emerald & Gold" dashboard experience.

The platform accepts nine agronomic parameters — including crop type, region, soil conditions, rainfall, and temperature — and returns a three-part prediction: **estimated yield** (quintals/acre), **forecasted market price** (₹/quintal), and an **AI-generated selling recommendation**.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A["Next.js Frontend<br/>(Port 3001)"]
    end

    subgraph "Authentication & Storage"
        B["Firebase Auth<br/>(Google SSO)"]
        C["Cloud Firestore<br/>(Prediction History)"]
    end

    subgraph "Backend Services"
        D["FastAPI Server<br/>(Port 8000)"]
        E["Model Service<br/>(ML Inference)"]
        F["Advisory Service<br/>(Gemma 3 27B)"]
    end

    subgraph "ML Models (.pkl)"
        G["Yield Model<br/>(XGBoost Pipeline)"]
        H["Price XGBoost<br/>(Market Forecast)"]
        I["Price Prophet<br/>(Time Series)"]
    end

    A -->|"Google Sign-In"| B
    A -->|"Save/Fetch History"| C
    A -->|"POST /predict"| D
    D --> E
    D --> F
    E --> G
    E --> H
    E --> I

    style A fill:#04291E,stroke:#D4A017,color:#E8F0E4
    style B fill:#1a3a2a,stroke:#D4A017,color:#E8F0E4
    style C fill:#1a3a2a,stroke:#D4A017,color:#E8F0E4
    style D fill:#04291E,stroke:#D4A017,color:#E8F0E4
    style E fill:#1a3a2a,stroke:#D4A017,color:#E8F0E4
    style F fill:#1a3a2a,stroke:#D4A017,color:#E8F0E4
    style G fill:#2a1a00,stroke:#D4A017,color:#D4A017
    style H fill:#2a1a00,stroke:#D4A017,color:#D4A017
    style I fill:#2a1a00,stroke:#D4A017,color:#D4A017
```

### 2.2 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16.2 (Turbopack) | Server-side rendering, routing, premium UI |
| **Styling** | Tailwind CSS + Custom CSS Variables | "Deep Emerald & Gold" glass-morphism theme |
| **Auth** | Firebase Authentication | Google SSO via popup flow |
| **Database** | Cloud Firestore | User-scoped prediction history persistence |
| **Backend** | FastAPI + Uvicorn | RESTful ML inference API |
| **ML (Yield)** | scikit-learn Pipeline + XGBoost | Yield prediction with OneHotEncoding preprocessor |
| **ML (Price)** | XGBoost + Facebook Prophet | Ensemble price forecasting (60/40 blend) |
| **Advisory** | Google Gemma 3 27B (Generative AI) | Natural-language selling recommendations |

---

## 3. Prediction Pipeline — End-to-End Flow

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant FE as Next.js Frontend
    participant FA as Firebase Auth
    participant FS as Cloud Firestore
    participant API as FastAPI Backend
    participant YM as Yield Model
    participant PM as Price Model
    participant AI as Gemma 3 AI

    U->>FE: Opens /login
    FE->>FA: signInWithPopup(Google)
    FA-->>FE: User credential + UID
    FE->>FE: Redirect to /dashboard

    U->>FE: Fills prediction form (9 parameters)
    FE->>API: POST /predict {crop, region, soil, rainfall, temp, ...}

    API->>YM: predict_yield(features)
    Note over YM: Pipeline: OneHotEncode → Scale → XGBoost
    YM-->>API: yield = 4.24 quintals/acre

    API->>PM: predict_price(features)
    Note over PM: MSP-anchored lags → XGBoost (60%)<br/>+ Prophet time-series (40%)
    PM-->>API: price = ₹2,321, trend = "up"

    API->>AI: generate_advisory(yield, price, trend, crop)
    AI-->>API: "Sell 60% now, hold 40% for price rise..."

    API-->>FE: {yield, price, trend, advisory}
    FE->>FS: saveToHistory(request, response, userId)
    FE->>U: Render premium results dashboard
```

### 3.1 Input Parameters

The user provides **nine agronomic features** through a guided three-step form:

| Step | Parameter | Type | Options |
|---|---|---|---|
| 01 — Foundational | Crop Type | Select | Maize, Rice, Barley, Wheat, Cotton, Soybean |
| 01 — Foundational | Soil Type | Select | Sandy, Loam, Chalky, Silt, Clay, Peaty |
| 01 — Foundational | Region | Select | North, South, West, East |
| 01 — Foundational | Days to Harvest | Slider | 10–250 days |
| 02 — Environment | Avg Rainfall (mm) | Numeric | Free input |
| 02 — Environment | Avg Temperature (°C) | Numeric | Free input |
| 02 — Environment | Weather Condition | Radio | Sunny, Rainy, Cloudy |
| 03 — Management | Irrigation Used | Radio | Automated / None |
| 03 — Management | Fertilizer Used | Radio | Synthetic / None |

### 3.2 ML Model Details

#### Yield Model (`yield_model.pkl`)
- **Type**: scikit-learn `Pipeline` wrapping an `XGBRegressor`
- **Preprocessing**: `ColumnTransformer` with:
  - `OneHotEncoder` for categorical features (Region, Soil_Type, Crop, Weather_Condition)
  - `FunctionTransformer` for boolean features (Fertilizer_Used, Irrigation_Used)
  - `StandardScaler` for numeric features (Rainfall_mm, Temperature_Celsius, Days_to_Harvest)
- **Output**: Predicted yield in **quintals/acre**

#### Price Model Ensemble (`price_xgb_all.pkl` + `price_prophet_all.pkl`)
- **XGBoost Regressor** — Takes 18 engineered features including crop encoding, price lags (7/14/30/60 day), rolling averages, momentum signals, MSP gap, and seasonal indicators
- **Facebook Prophet** — Time-series model providing trend-based forecasts
- **Ensemble Strategy**: `final_price = 0.6 × XGBoost + 0.4 × Prophet`
- **Anchoring**: Lag features are seeded using each crop's official **Minimum Support Price (MSP)**, ensuring crop-specific predictions (e.g., Cotton ≈ ₹6,700 vs Wheat ≈ ₹2,300)

---

## 4. Data & Persistence Architecture

```mermaid
erDiagram
    USERS ||--o{ PREDICTIONS : makes
    USERS {
        string uid PK "Firebase Auth UID"
        string email
        string displayName
        string photoURL
    }
    PREDICTIONS {
        string id PK "Firestore auto-ID"
        string userId FK "Scoped to user"
        timestamp createdAt
        string crop
        string region
        string soil_type
        float rainfall_mm
        float temperature_celsius
        boolean fertilizer_used
        boolean irrigation_used
        string weather_condition
        int days_to_harvest
        float yield_prediction
        float price_prediction
        string price_trend
        string advisory
        string status "verified"
    }
```

- **Authentication**: Firebase Auth with Google Sign-In (popup flow). Auth state is managed client-side via Firebase listeners. All entry points (landing page, header CTA) redirect to `/login`.
- **History Storage**: Each prediction is persisted to the `predictions` Firestore collection, scoped by `userId`. Users can view their entire prediction timeline in the **Prediction History** tab, and download individual results as `.txt` reports.

---

## 5. Frontend — User Experience

The dashboard follows a **"Deep Emerald & Gold"** design language with glass-morphism panels, subtle micro-animations, and AI-generated aerial farm imagery. Key screens include:

| Screen | Path | Function |
|---|---|---|
| Landing Page | `/` | Marketing hero with CTA → Login |
| Login | `/login` | Google SSO authentication |
| Dashboard | `/dashboard` | Summary metrics, recent predictions |
| New Prediction | `/predict` | 3-step input form → Results |
| Prediction History | `/history` | Firestore-backed table of past predictions |
| Settings | `/settings` | User profile, sign-out |

### Key UX Features
- **Guided 3-Step Form**: Foundational Data → Environment → Active Management → Generate
- **Rich Result Cards**: Yield prediction with confidence score, market price with Mandi trend indicator
- **AI Advisory Panel**: Priority action card with natural-language selling recommendation
- **Download Report**: One-click `.txt` export of the full prediction result
- **Responsive Design**: Optimized glass-morphism panels with reduced `backdrop-filter` blur for smooth performance

---

## 6. Deployment & Repository

| Item | Detail |
|---|---|
| **Repository** | [github.com/rohanheg025-droid/AgriForecast](https://github.com/rohanheg025-droid/AgriForecast) |
| **Frontend** | `npx next dev -p 3001` (Turbopack) |
| **Backend** | `uvicorn backend.main:app --port 8000 --reload` |
| **Firebase Project** | `agriforecast01` |
| **Python Dependencies** | fastapi, uvicorn, pandas, joblib, xgboost, prophet, google-generativeai |
| **Node Dependencies** | next, react, firebase, lucide-react, tailwindcss |

---

> *AgriForecast — Empowering Indian farmers with satellite-grade AI predictions. Built March 2026.*
