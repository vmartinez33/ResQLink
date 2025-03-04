from datetime import datetime, timedelta, timezone
import os
from fastapi import APIRouter

from backend.dependencies import NetworkAsCodeClientDep

router = APIRouter(
    prefix="/subscriptions",
    tags=["subscriptions"],
)


@router.get("/")
async def get_subscriptions(
    client: NetworkAsCodeClientDep
):
    return client.connectivity.get_subscriptions()


@router.delete("/")
async def delete_subscriptions(
    client: NetworkAsCodeClientDep
):
    for subscription in client.connectivity.get_subscriptions():
        subscription.delete()
    
    return {"status": "ok"}


@router.post("/connectivity")
async def subscribe_to_connectivity(
    client: NetworkAsCodeClientDep
):
    my_device = client.devices.get("device@testcsp.net")
    
    my_subscription = client.connectivity.subscribe(
        event_type="org.camaraproject.device-status.v0.connectivity-data",
        device=my_device,
        subscription_expire_time=datetime.now(timezone.utc) + timedelta(minutes=1),
        
        notification_url=os.getenv("APP_URL") + "/webhooks/notifications",
        notification_auth_token=os.getenv("AUTHORIZATION_TOKEN"),
    )
    
    starts_at = my_subscription.starts_at
    expires_at = my_subscription.expires_at
    
    return {"starts_at": starts_at, "expires_at": expires_at}
