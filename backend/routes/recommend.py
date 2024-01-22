from fastapi import APIRouter, Request, Response, Depends
from controllers.recommender import *
from middleware.auth import get_auth_header
from models import *

router = APIRouter(prefix="/api/v1", tags=["recommend"])
recommendationController = RecommenderController()

@router.post("/recommend")
async def recommend(request: Request, response: Response) -> ResponseModel[list[RecommendationDataModel]]:
    response.status_code = 200
    data = await request.json()
    resp, code =  recommendationController.generate_recommendations(data['title'], data['genre'], data['language'], data['type'], num=data.get('num', 10))
    response.status_code = code
    return resp

@router.post("/info")
async def get_info(request: Request, response: Response) -> ResponseModel[DramaDetails]:
    data = await request.json()
    resp, code = recommendationController.get_drama_info(data['link'])
    response.status_code = code
    return resp

@router.get("/list", dependencies=[Depends(get_auth_header)])
async def get_watch_list(response: Response, user = Depends(get_auth_header)) -> ResponseModel[None | WatchlistDataModel]:
    user = user.user
    resp, code = recommendationController.get_watch_list(user)
    response.status_code = code
    return resp

@router.post("/list", dependencies=[Depends(get_auth_header)])
async def add_to_watch_list(request: Request, response: Response, user = Depends(get_auth_header)):
    user = user.user
    body = await request.json()
    link = body['link']
    state = body['state']
    name = body['name']
    image = body['image']
    recommended_by = body.get('recommended_by', None)
    resp, code = recommendationController.add_to_watch_list(user, link, state, name, image, recommended_by)
    response.status_code = code
    return resp

@router.delete("/list", dependencies=[Depends(get_auth_header)])
async def remove_from_watch_list(request: Request, response: Response, user = Depends(get_auth_header)):
    user = user.user
    body = await request.json()
    link = body['link']
    resp, code = recommendationController.remove_from_watch_list(user, link)
    response.status_code = code
    return resp

@router.get("/all")
async def all(request: Request, response: Response) -> ResponseModel[list[SearchResultsModel]]:
    params = dict(request.query_params)
    language = params.get('language', 'korean')
    s_type = params.get('type', 'drama')
    name_q = params.get('q', None)
    resp, code = recommendationController.search(name_q, language, s_type)
    response.status_code = code

    return resp