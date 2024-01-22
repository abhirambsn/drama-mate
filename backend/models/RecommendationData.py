from pydantic import BaseModel

class RecommendationDataModel(BaseModel):
    title: str
    link: str
    genre: str
    image: str