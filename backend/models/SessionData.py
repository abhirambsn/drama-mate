from pydantic import BaseModel

class SessionModel(BaseModel):
    id: str
    access_token: str
    refresh_token: str
    expires_in: int
    expires_at: int