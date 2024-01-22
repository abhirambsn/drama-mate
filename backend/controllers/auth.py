from utils import getSupabaseClient
from supabase import Client

class AuthController:
    dbClient: Client

    def __init__(self):
        self.dbClient = getSupabaseClient() 
    
    def getAuthenticatedUserByToken(self, token):
        return self.dbClient.auth.get_user(token)
    
    def loginUserEmailPassword(self, email, password):
        return self.dbClient.auth.sign_in(email=email, password=password)
    
    def authUserWithProvider(self, provider):
        return self.dbClient.auth.sign_in_with_oauth({
            'provider': provider,
        })
    
    def refreshUserSession(self, token):
        return self.dbClient.auth.refresh_session(token)
    