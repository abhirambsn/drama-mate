from pathlib import Path
from dotenv import load_dotenv
import os

ENV = os.getenv('ENV', 'development')
if ENV == 'development':
    load_dotenv()

class ConfigManager:
    BASE_PATH: Path
    LOG_PATH: Path
    DATA_PATH: Path
    HOT_RELOAD: str
    SUPABASE_URL: str
    SUPABASE_KEY: str

    def __init__(self) -> None:
        self.BASE_PATH = Path(__file__).resolve().parent.parent
        self.LOG_PATH = self.BASE_PATH / "logs"
        self.DATA_PATH = self.BASE_PATH / "data"

        # Create LOG_PATH
        if not self.LOG_PATH.exists():
            self.LOG_PATH.mkdir()
        self.HOT_RELOAD = os.getenv('HOT_RELOAD', False)
        self.SUPABASE_URL = os.getenv('SUPABASE_URL', None)
        self.SUPABASE_KEY = os.getenv('SUPABASE_KEY', None)
