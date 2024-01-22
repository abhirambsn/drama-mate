from pydantic import BaseModel

class WatchlistDataModel(BaseModel):
    id: str
    user_id: str
    watch_list: list[dict[str, str | None]]