import os
from fastapi import APIRouter, Header, Response

from backend.nac import Notification

router = APIRouter(
    prefix="/webhooks",
    tags=["webhooks"],
)


@router.post("/notifications")
async def recive_notification(
    notification: Notification,
    authorization: str = Header(None)
):
    print(authorization)
    print(notification.model_dump_json())
    if authorization == "Bearer " + os.getenv("AUTHORIZATION_TOKEN"):
        return {"status": "ok"}
    else:
        return Response(status_code=401)
