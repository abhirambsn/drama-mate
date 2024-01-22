from pydantic import BaseModel

class SearchResultsModel(BaseModel):
    title: str
    link: str
    image: str