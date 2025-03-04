from typing import Annotated, Optional
from fastapi import APIRouter, Header, Request

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
    return {"status": "ok"}
