from fastapi import APIRouter, Request, Response, Depends
from controllers.auth import AuthController
from middleware.auth import get_auth_header
from models import SessionModel, ResponseModel, UserProfileModel

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
authController = AuthController()

@router.get("/me", dependencies=[Depends(get_auth_header)])
async def me(user = Depends(get_auth_header)) -> ResponseModel[UserProfileModel]:
    user = user.user
    data = {
        'id': user.id,
        'email': user.user_metadata['email'],
        'name': user.user_metadata['full_name'],
        'avatar': user.user_metadata['avatar_url'],
        'last_sign_in': user.last_sign_in_at,
        'provider': user.app_metadata['provider']
    }
    return {"status": "ok", "code": 200, "data": data}

# To be phased out
@router.post("/login")
async def login(request: Request, response: Response):
    resp = authController.authUserWithProvider('google')
    return resp

# To be phased out
@router.get("/callback")
async def callback_fn():
    return {"status": "ok", "code": 200}

@router.post('/refresh')
async def refresh(request: Request, response: Response) -> ResponseModel[SessionModel]:
    data = await request.json()
    resp = authController.refreshUserSession(data['token'])
    response.status_code = 200
    result = {
        'status': "ok",
        'code': 200,
        'data': {
            'access_token': resp.session.access_token,
            'refresh_token': resp.session.refresh_token,
            'expires_in': resp.session.expires_in,
            'expires_at': resp.session.expires_at,
            'id': resp.user.id
        }
    }
    return result