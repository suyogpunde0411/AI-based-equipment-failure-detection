import joblib

from config import MODEL_PATH, SCALER_PATH


def load_model():
    return joblib.load(MODEL_PATH)


def load_scaler():
    return joblib.load(SCALER_PATH)