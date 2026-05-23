import os
import pickle
from datetime import datetime
from pathlib import Path
from typing import Any

import joblib

from utils.logging_config import get_logger
from utils.schemas import FeatureImportanceItem, PredictionRequest

logger = get_logger(__name__)


class ModelServiceError(Exception):
    pass


class ModelService:
    def __init__(self) -> None:
        default_model_path = Path(__file__).resolve().parents[2] / "earthquake_model_full.pkl"
        self.model_path = Path(os.getenv("MODEL_PATH", str(default_model_path)))
        self.model: Any | None = None
        self.feature_order = ["magnitude", "depth", "lat", "lon", "year", "month", "day"]

    @property
    def is_ready(self) -> bool:
        return self.model is not None

    def load_model(self) -> None:
        if not self.model_path.exists():
            raise ModelServiceError(
                f"Model file not found at '{self.model_path}'. "
                "Set MODEL_PATH environment variable to your .pkl file."
            )

        try:
            # Most sklearn training workflows persist models via joblib.
            self.model = joblib.load(self.model_path)
            logger.info("Model loaded with joblib from %s", self.model_path)
        except Exception as joblib_exc:
            try:
                with open(self.model_path, "rb") as model_file:
                    self.model = pickle.load(model_file)
                logger.info("Model loaded with pickle from %s", self.model_path)
            except Exception as pickle_exc:
                raise ModelServiceError(
                    f"Failed to load model using joblib ({joblib_exc}) "
                    f"and pickle ({pickle_exc})"
                ) from pickle_exc

    def _build_feature_vector(self, payload: PredictionRequest) -> list[float]:
        now = datetime.utcnow()
        return [
            payload.magnitude,
            payload.depth,
            payload.lat,
            payload.lon,
            float(now.year),
            float(now.month),
            float(now.day),
        ]

    def _normalize_prediction(self, raw_prediction: Any) -> str:
        if isinstance(raw_prediction, (list, tuple)) and raw_prediction:
            raw_prediction = raw_prediction[0]

        if hasattr(raw_prediction, "item"):
            raw_prediction = raw_prediction.item()

        if isinstance(raw_prediction, str):
            value = raw_prediction.strip().lower()
            if value in {"low", "medium", "high"}:
                return value.capitalize()

        mapping = {
            0: "Low",
            1: "Medium",
            2: "High",
        }
        if isinstance(raw_prediction, (int, float)) and int(raw_prediction) in mapping:
            return mapping[int(raw_prediction)]

        raise ModelServiceError(f"Unsupported prediction output: {raw_prediction}")

    def predict(self, payload: PredictionRequest) -> str:
        if self.model is None:
            self.load_model()

        features = self._build_feature_vector(payload)
        logger.info(
            "Running prediction for magnitude=%.2f depth=%.2f lat=%.4f lon=%.4f",
            payload.magnitude,
            payload.depth,
            payload.lat,
            payload.lon,
        )

        try:
            raw = self.model.predict([features])
            return self._normalize_prediction(raw)
        except ModelServiceError:
            raise
        except Exception as exc:
            raise ModelServiceError(f"Model prediction failed: {exc}") from exc

    def get_feature_importance(self) -> list[FeatureImportanceItem]:
        if self.model is None:
            self.load_model()

        if not hasattr(self.model, "feature_importances_"):
            raise ModelServiceError("Model does not expose feature_importances_")

        importances = getattr(self.model, "feature_importances_")
        if len(importances) != len(self.feature_order):
            raise ModelServiceError(
                "Feature importances length does not match expected model feature count"
            )

        result = [
            FeatureImportanceItem(name=name, value=float(value))
            for name, value in zip(self.feature_order, importances)
        ]
        result.sort(key=lambda item: item.value, reverse=True)
        return result
