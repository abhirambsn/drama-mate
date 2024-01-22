from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar('T')

class ResponseModel(BaseModel, Generic[T]):
    data: T
    code: int
    status: str
    message: Optional[str] = ""
    error: Optional[bool] = None