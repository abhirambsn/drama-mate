import uvicorn
from utils import *
if __name__ == "__main__":
    config = ConfigManager()
    HOT_RELOAD = config.HOT_RELOAD
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=HOT_RELOAD, workers=4)