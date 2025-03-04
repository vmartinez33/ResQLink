import os
from fastapi import APIRouter, Header, Response

from backend.nac import Notification
from telegram import send_telegram_notification

router = APIRouter(
    prefix="/webhooks",
    tags=["webhooks"],
)


@router.post("/notifications")
async def recive_notification(
    notification: Notification,
    authorization: str = Header(None)
):
    print(notification.model_dump_json())
    if authorization == "Bearer " + os.getenv("AUTHORIZATION_TOKEN"):
        if "connectivity-disconnected" in notification.type:
            # send_telegram_notification("Device disconnected from the network")
            pass
        elif "connectivity-data" in notification.type:
            # send_telegram_notification("Device connected to the network")
            pass
        
        return {"status": "ok"}
    else:
        return Response(status_code=401)
