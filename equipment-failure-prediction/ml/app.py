from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

MODEL = joblib.load(BASE_DIR / "models" / "model.pkl")
SCALER = joblib.load(BASE_DIR / "models" / "scaler.pkl")

with open(BASE_DIR / "models" / "metrics.json") as f:
    METRICS = json.load(f)

app = FastAPI(
    title="Equipment Failure Prediction API",
    version="1.0.0"
)


class PredictionRequest(BaseModel):
    airTemperature: float
    processTemperature: float
    rotationalSpeed: float
    torque: float
    toolWear: float


@app.get("/")
def home():
    return {
        "service": "Equipment Failure Prediction",
        "status": "Running"
    }


@app.post("/predict")
def predict(request: PredictionRequest):

    data = np.array([[
        request.airTemperature,
        request.processTemperature,
        request.rotationalSpeed,
        request.torque,
        request.toolWear
    ]])

    data = SCALER.transform(data)

    prediction = MODEL.predict(data)[0]

    probability = float(MODEL.predict_proba(data)[0][1])

    feature_importance = METRICS.get("feature_importance", {})

    top_factors = sorted(
        feature_importance.items(),
        key=lambda x: x[1],
        reverse=True
    )[:3]

    return {
        "failure": bool(prediction),
        "probability": probability,
        "confidence": round(probability * 100, 2),
        "topFactors": [factor[0] for factor in top_factors]
    }