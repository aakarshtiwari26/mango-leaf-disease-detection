from pydantic import BaseModel, Field
from typing import List


class ProbabilityItem(BaseModel):
    disease: str
    confidence: float


class PredictionResponse(BaseModel):
    diseaseName: str
    confidence: float
    treatment: str
    symptoms: List[str]
    causes: List[str]
    prevention: str
    probabilities: List[ProbabilityItem] = Field(default_factory=list)
