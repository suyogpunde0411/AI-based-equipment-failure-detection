from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

DATASET_PATH = BASE_DIR / "dataset" / "ai4i2020.csv"

MODELS_DIR = BASE_DIR / "models"

MODEL_PATH = MODELS_DIR / "model.pkl"

SCALER_PATH = MODELS_DIR / "scaler.pkl"

DOCS_IMAGES_DIR = BASE_DIR / "docs" / "images"

METRICS_PATH = MODELS_DIR / "metrics.json"

RANDOM_STATE = 42

LOW_RISK_THRESHOLD = 0.30
MEDIUM_RISK_THRESHOLD = 0.70