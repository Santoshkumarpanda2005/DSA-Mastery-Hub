from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Load models on startup
try:
    weakness_model = joblib.load('weakness.pkl')
    readiness_model = joblib.load('readiness.pkl')
except FileNotFoundError:
    print("Warning: Model files not found. Run train.py first.")

class TopicStats(BaseModel):
    topic: str
    accuracy: float
    avg_time: float
    attempts: int
    error_rate: float

class UserStats(BaseModel):
    accuracy: float
    coverage: float
    consistency: float
    hard_ratio: float
    error_rate: float

@app.get("/")
def health_check():
    return {"status": "ML Service is running"}

@app.post("/predict/weakness")
def predict_weakness(stats: list[TopicStats]):
    if not stats:
        return {"weak_topics": []}
    
    df = pd.DataFrame([s.dict() for s in stats])
    X = df[['accuracy', 'avg_time', 'attempts', 'error_rate']]
    
    predictions = weakness_model.predict(X)
    
    weak_topics = []
    for i, pred in enumerate(predictions):
        if pred == 1:
            weak_topics.append(df.iloc[i]['topic'])
            
    return {"weak_topics": weak_topics}

@app.post("/predict/readiness")
def predict_readiness(stats: UserStats):
    df = pd.DataFrame([stats.dict()])
    X = df[['accuracy', 'coverage', 'consistency', 'hard_ratio', 'error_rate']]
    
    score = readiness_model.predict(X)[0]
    # Ensure score is within 0-100 bounds
    score = max(0, min(100, int(score)))
    return {"readiness_score": score}

@app.post("/recommend")
def recommend_problems(weak_topics: list[str]):
    # Rule-based MVP recommendation as requested by user
    recommendations = []
    for topic in weak_topics:
        t = topic.lower()
        if t == "dynamic programming" or t == "dp":
            recommendations.extend(["Climbing Stairs", "House Robber", "Coin Change"])
        elif t == "graphs" or t == "graph":
            recommendations.extend(["Number of Islands", "Clone Graph", "Course Schedule"])
        elif t == "trees" or t == "tree":
            recommendations.extend(["Maximum Depth of Binary Tree", "Invert Binary Tree", "Lowest Common Ancestor"])
        elif t == "array" or t == "arrays":
            recommendations.extend(["Two Sum", "Best Time to Buy and Sell Stock", "Contains Duplicate"])
        else:
            recommendations.append(f"Basic {topic} Problem")
            
    # Deduplicate
    recommendations = list(set(recommendations))
    return {"recommendations": recommendations[:5]}
