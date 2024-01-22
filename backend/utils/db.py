import os
from supabase import create_client, Client
from utils import createLogger, info_log

supabase_client: Client = None
logger = createLogger('supabase')

def initializeClient() -> None:
    assert os.getenv('SUPABASE_URL', None) is not None, "SUPABASE_URL not found"
    assert os.getenv('SUPABASE_KEY', None) is not None, "SUPABASE_KEY not found"
    global supabase_client
    supabase_client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_KEY'))
    info_log(logger, "Supabase client initialized")

def getSupabaseClient() -> Client:
    global supabase_client
    if supabase_client is None:
        initializeClient()
    return supabase_client