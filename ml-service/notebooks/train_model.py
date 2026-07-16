# %% [markdown]
# # Equipment Failure Prediction — Model Training
# Trains Logistic Regression vs Random Forest, compares on Recall-priority metrics,
# and exports the winning model + scaler for the FastAPI service.

# %% Imports
import json
import os
from datetime import datetime, timezone

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

RANDOM_STATE = 42

# %% Paths (relative to ml-service/notebooks/)
DATASET_PATH = "../../dataset/raw/ai4i2020.csv"
MODELS_DIR = "../../models"
DOCS_IMAGES_DIR = "../../docs/images"

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DOCS_IMAGES_DIR, exist_ok=True)

# %% Load Data
df = pd.read_csv(DATASET_PATH)
print(f"Shape: {df.shape}")
print(df.head())
print(df.info())

# %% EDA — Class Balance
target_counts = df["Machine failure"].value_counts()
print("\nClass distribution:")
print(target_counts)
print(f"Failure rate: {target_counts[1] / len(df) * 100:.2f}%")

plt.figure(figsize=(5, 4))
sns.countplot(x="Machine failure", data=df)
plt.title("Failure Class Distribution (0 = Healthy, 1 = Failure)")
plt.savefig(f"{DOCS_IMAGES_DIR}/class_distribution.png", bbox_inches="tight")
plt.close()

# %% EDA — Feature Correlations
FEATURE_COLUMNS = [
    "Air temperature [K]",
    "Process temperature [K]",
    "Rotational speed [rpm]",
    "Torque [Nm]",
    "Tool wear [min]",
]
TARGET_COLUMN = "Machine failure"

plt.figure(figsize=(7, 5))
sns.heatmap(df[FEATURE_COLUMNS + [TARGET_COLUMN]].corr(), annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Feature Correlation Matrix")
plt.savefig(f"{DOCS_IMAGES_DIR}/correlation_matrix.png", bbox_inches="tight")
plt.close()

# %% Feature/Target Split
# NOTE: We deliberately exclude UDI, Product ID (identifiers), Type (not in our
# input form), and TWF/HDF/PWF/OSF/RNF (failure-mode flags — these leak the target).
X = df[FEATURE_COLUMNS].copy()
y = df[TARGET_COLUMN].copy()

# %% Train/Test Split (stratified — critical given class imbalance)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)
print(f"Train: {X_train.shape}, Test: {X_test.shape}")

# %% Feature Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# %% Train Logistic Regression
lr_model = LogisticRegression(
    class_weight="balanced", max_iter=1000, random_state=RANDOM_STATE
)
lr_model.fit(X_train_scaled, y_train)

# %% Train Random Forest
rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    class_weight="balanced",
    random_state=RANDOM_STATE,
    n_jobs=-1,
)
rf_model.fit(X_train_scaled, y_train)

# %% Evaluation Helper
def evaluate_model(model, X_test_scaled, y_test, name):
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1]

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred),
        "recall": recall_score(y_test, y_pred),
        "f1_score": f1_score(y_test, y_pred),
        "roc_auc": roc_auc_score(y_test, y_proba),
    }

    cm = confusion_matrix(y_test, y_pred)
    fpr, tpr, _ = roc_curve(y_test, y_proba)

    print(f"\n--- {name} ---")
    for k, v in metrics.items():
        print(f"{k}: {v:.4f}")
    print("Confusion Matrix:")
    print(cm)

    return metrics, cm, (fpr, tpr)


lr_metrics, lr_cm, lr_roc = evaluate_model(lr_model, X_test_scaled, y_test, "Logistic Regression")
rf_metrics, rf_cm, rf_roc = evaluate_model(rf_model, X_test_scaled, y_test, "Random Forest")

# %% Side-by-Side Comparison Table
comparison_df = pd.DataFrame(
    {"Logistic Regression": lr_metrics, "Random Forest": rf_metrics}
).T
print("\n=== Model Comparison (sorted by Recall) ===")
print(comparison_df.sort_values("recall", ascending=False))

# %% Visualization — Confusion Matrices
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
sns.heatmap(lr_cm, annot=True, fmt="d", cmap="Blues", ax=axes[0])
axes[0].set_title("Logistic Regression — Confusion Matrix")
axes[0].set_xlabel("Predicted")
axes[0].set_ylabel("Actual")

sns.heatmap(rf_cm, annot=True, fmt="d", cmap="Blues", ax=axes[1])
axes[1].set_title("Random Forest — Confusion Matrix")
axes[1].set_xlabel("Predicted")
axes[1].set_ylabel("Actual")

plt.tight_layout()
plt.savefig(f"{DOCS_IMAGES_DIR}/confusion_matrices.png", bbox_inches="tight")
plt.close()

# %% Visualization — ROC Curves (overlaid)
plt.figure(figsize=(6, 5))
plt.plot(lr_roc[0], lr_roc[1], label=f"Logistic Regression (AUC={lr_metrics['roc_auc']:.3f})")
plt.plot(rf_roc[0], rf_roc[1], label=f"Random Forest (AUC={rf_metrics['roc_auc']:.3f})")
plt.plot([0, 1], [0, 1], "k--", label="Random Guess")
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve Comparison")
plt.legend()
plt.savefig(f"{DOCS_IMAGES_DIR}/roc_curves.png", bbox_inches="tight")
plt.close()

# %% Feature Importance (Random Forest)
feature_importance = dict(zip(FEATURE_COLUMNS, rf_model.feature_importances_.tolist()))
feature_importance = dict(
    sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
)

plt.figure(figsize=(7, 4))
sns.barplot(x=list(feature_importance.values()), y=list(feature_importance.keys()))
plt.title("Random Forest — Feature Importance")
plt.xlabel("Importance")
plt.savefig(f"{DOCS_IMAGES_DIR}/feature_importance.png", bbox_inches="tight")
plt.close()

print("\nFeature Importance:")
for feat, score in feature_importance.items():
    print(f"  {feat}: {score:.4f}")

# %% Model Selection — Recall-Priority Decision Logic
if rf_metrics["recall"] >= lr_metrics["recall"]:
    best_model = rf_model
    best_name = "Random Forest"
    best_metrics = rf_metrics
    best_cm = rf_cm
else:
    best_model = lr_model
    best_name = "Logistic Regression"
    best_metrics = lr_metrics
    best_cm = lr_cm

print(f"\n✅ Selected model: {best_name} (Recall = {best_metrics['recall']:.4f})")

# %% Save Artifacts
joblib.dump(best_model, f"{MODELS_DIR}/model.pkl")
joblib.dump(scaler, f"{MODELS_DIR}/scaler.pkl")

metrics_output = {
    "model_name": best_name,
    "trained_at": datetime.now(timezone.utc).isoformat(),
    "feature_columns": FEATURE_COLUMNS,
    "metrics": {
        "logistic_regression": lr_metrics,
        "random_forest": rf_metrics,
        "selected_model": best_metrics,
    },
    "confusion_matrix": best_cm.tolist(),
    "feature_importance": feature_importance if best_name == "Random Forest" else None,
    "risk_thresholds": {"low_max": 0.30, "medium_max": 0.70},
}

with open(f"{MODELS_DIR}/metrics.json", "w") as f:
    json.dump(metrics_output, f, indent=2)

print(f"\nSaved: {MODELS_DIR}/model.pkl")
print(f"Saved: {MODELS_DIR}/scaler.pkl")
print(f"Saved: {MODELS_DIR}/metrics.json")