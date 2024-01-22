from pydantic import BaseModel
import datetime

class UserProfileModel(BaseModel):
    id: str
    email: str
    name: str
    avatar: str
    last_sign_in: datetime.datetime
    provider: str
    