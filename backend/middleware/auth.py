from fastapi import Header, HTTPException
from controllers.auth import AuthController

controller = AuthController()
async def get_auth_header(authorization: str = Header(...)):
    if authorization == '':
        raise HTTPException(status_code=401, detail="Unauthorized")
    if authorization.split(' ')[0] != 'Bearer':
        raise HTTPException(status_code=400, detail="Bad Format")
    
    token = authorization.split(' ')[1]
    user = controller.getAuthenticatedUserByToken(token)
    return user