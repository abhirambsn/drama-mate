from pydantic import BaseModel

class DramaDetails(BaseModel):
    name: str
    thumbnail: str
    native_title: str
    genre: str
    score: str
    aka: list[str]
    date: str
    synopsis: str
    type: str
    cast: list[str]
    country: str
    duration: str