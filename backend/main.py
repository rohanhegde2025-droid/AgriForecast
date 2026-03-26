import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.advisory_service import generate_advisory
from backend.model_service import predict_yield, predict_price
from backend.schemas import PredictRequest, PredictResponse

logger = logging.getLogger(__name__)

app = FastAPI(title="AgriForecast Backend", version="0.2.0")

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    from backend.model_service import model_store
    
    return {
        "status": "ok",
        "yield_model": model_store.yield_model is not None,
        "price_xgb": model_store.price_xgb is not None,
        "price_prophet": model_store.price_prophet is not None
    }


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    # Yield prediction
    yield_pred = predict_yield(request.dict())

    # Price prediction
    price_pred_info = predict_price(request.dict())

    # Advisory
    advisory = generate_advisory(
        yield_pred,
        price_pred_info["price_prediction"],
        price_pred_info["price_trend"],
        request.crop,
    )

    return PredictResponse(
        yield_prediction=yield_pred,
        price_prediction=price_pred_info["price_prediction"],
        price_trend=price_pred_info["price_trend"],
        confidence=price_pred_info["confidence"],
        advisory=advisory,
    )
