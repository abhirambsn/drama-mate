from pydantic import BaseModel

class WatchlistDBDataModel:
    link: str
    state: str
    name: str
    image: str
    recommended_by: None | str

    def __init__(self, link, state, name, image, recommended_by = None):
        self.link = link
        self.state = state
        self.name = name
        self.image = image
        self.recommended_by = recommended_by

    def __str__(self):
        return f"WatchlistDBDataModel(link={self.link}, state={self.state}, name={self.name}, image={self.image}, recommended_by={self.recommended_by})"
    
    def toJSON(self):
        return {
            "link": self.link,
            "state": self.state,
            "name": self.name,
            "image": self.image,
            "recommended_by": self.recommended_by
        }