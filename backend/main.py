from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from services.model_service import ModelService, ModelServiceError
from utils.logging_config import get_logger, setup_logging
from utils.schemas import FeatureImportanceResponse, PredictionRequest, PredictionResponse

load_dotenv()
setup_logging()
logger = get_logger(__name__)

model_service = ModelService()


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        model_service.load_model()
        logger.info("Model initialized successfully")
    except ModelServiceError as exc:
        logger.exception("Failed to initialize model: %s", exc)
    yield


app = FastAPI(
    title="Earthquake Risk Prediction API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict[str, str]:
    if not model_service.is_ready:
        return {"status": "degraded", "message": "API is running, model is not loaded"}
    return {"status": "ok", "message": "API and model are ready"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(payload: PredictionRequest) -> PredictionResponse:
    try:
        prediction = model_service.predict(payload)
        return PredictionResponse(prediction=prediction)
    except ModelServiceError as exc:
        logger.warning("Prediction error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - defensive safety net
        logger.exception("Unhandled prediction error: %s", exc)
        raise HTTPException(status_code=500, detail="Unexpected prediction error") from exc


@app.get("/feature-importance", response_model=FeatureImportanceResponse)
async def feature_importance() -> FeatureImportanceResponse:
    try:
        data = model_service.get_feature_importance()
        return FeatureImportanceResponse(features=data)
    except ModelServiceError as exc:
        logger.warning("Feature importance error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": True, "message": exc.detail},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(_, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled server error: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"error": True, "message": "Internal server error"},
    )
