import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBRegressor
import joblib
import os

def create_synthetic_data(n_samples=1000):
    np.random.seed(42)
    
    # Generate features
    accuracy = np.random.uniform(0.1, 1.0, n_samples)
    avg_time = np.random.uniform(300, 3600, n_samples)
    attempts = np.random.randint(1, 15, n_samples)
    error_rate = np.random.uniform(0.0, 0.8, n_samples)
    
    coverage = np.random.uniform(0.1, 1.0, n_samples)
    consistency = np.random.uniform(0.1, 1.0, n_samples)
    hard_ratio = np.random.uniform(0.0, 0.5, n_samples)
    
    # Generate labels (Weakness Model)
    # A topic is more likely weak if accuracy is low, time is high, attempts are high, error_rate is high
    weakness_score = (1 - accuracy) * 0.4 + (avg_time / 3600) * 0.2 + (attempts / 15) * 0.2 + error_rate * 0.2
    weak_topic = (weakness_score > 0.55).astype(int)
    
    # Generate labels (Readiness Model)
    # Readiness is high if accuracy is high, coverage is high, consistency is high, hard_ratio is decent
    readiness_raw = (accuracy * 0.4 + coverage * 0.3 + consistency * 0.2 + hard_ratio * 0.1) * 100
    readiness_score = np.clip(readiness_raw + np.random.normal(0, 5, n_samples), 0, 100).astype(int)
    
    df = pd.DataFrame({
        'accuracy': accuracy,
        'avg_time': avg_time,
        'attempts': attempts,
        'error_rate': error_rate,
        'coverage': coverage,
        'consistency': consistency,
        'hard_ratio': hard_ratio,
        'weak_topic': weak_topic,
        'readiness_score': readiness_score
    })
    
    df.to_csv('student_dataset.csv', index=False)
    print("Created student_dataset.csv with", n_samples, "samples.")
    return df

def train_models():
    df = pd.read_csv('student_dataset.csv')
    
    # Train Weakness Model
    X_weak = df[['accuracy', 'avg_time', 'attempts', 'error_rate']]
    y_weak = df['weak_topic']
    
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_weak, y_weak)
    joblib.dump(rf_model, 'weakness.pkl')
    print("Saved weakness.pkl")
    
    # Train Readiness Model
    X_ready = df[['accuracy', 'coverage', 'consistency', 'hard_ratio', 'error_rate']]
    y_ready = df['readiness_score']
    
    xgb_model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
    xgb_model.fit(X_ready, y_ready)
    joblib.dump(xgb_model, 'readiness.pkl')
    print("Saved readiness.pkl")

if __name__ == "__main__":
    create_synthetic_data()
    train_models()
