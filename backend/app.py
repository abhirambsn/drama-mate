import fastapi
import uvicorn
import os
from utils import *
from routes import auth, recommend

logger = createLogger('app')
app = fastapi.FastAPI()
initializeClient()

app.include_router(auth.router)
app.include_router(recommend.router)

@app.get("/api/v1/healthz")
def index():
    return {"status": "ok", "code": 200}

@app.post("/register")
async def register(request: fastapi.Request,response: fastapi.Response):
    response.status_code = 201
    data = await request.json()
    apiKey = os.urandom(16).hex()
    print(f"Device ID: {data['device_id']}\tAPI Key: {apiKey}")
    return {"status": "ok", "code": 201}