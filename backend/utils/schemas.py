from typing import Literal

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    magnitude: float = Field(..., ge=0, le=10, description="Earthquake magnitude")
    depth: float = Field(..., ge=0, le=700, description="Earthquake depth in km")
    lat: float = Field(..., ge=-90, le=90, description="Latitude")
    lon: float = Field(..., ge=-180, le=180, description="Longitude")


class PredictionResponse(BaseModel):
    prediction: Literal["Low", "Medium", "High"]


class FeatureImportanceItem(BaseModel):
    name: str
    value: float


class FeatureImportanceResponse(BaseModel):
    features: list[FeatureImportanceItem]
