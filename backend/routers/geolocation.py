from fastapi import APIRouter, Response
from sqlmodel import select

from backend.dependencies import NetworkAsCodeClientDep, SessionDep
from backend.models import Location, User

router = APIRouter(
    prefix="/geolocation",
    tags=["geolocation"],
)


@router.get("/location")
async def get_location(
    session: SessionDep,
    client: NetworkAsCodeClientDep
):
    my_device = client.devices.get("device@testcsp.net")
    location = my_device.location()
    
    location_db = Location(device_id=1, longitude=location.longitude, latitude=location.latitude)
    session.add(location_db)
    session.commit()

    return location_db


@router.get("/check-area/{user_id}")
async def get_location(
    session: SessionDep,
    client: NetworkAsCodeClientDep,
    user_id: int
):
    statement = select(User).where(User.id == user_id)
    result = session.exec(statement)
    user = result.one()
    
    if not user.tracked_user:
        return Response(status_code=404)
    
    areas = user.tracked_user.areas
    
    if not areas:
        return Response(status_code=404)
    
    area = areas[0]
    
    my_device = client.devices.get("device@testcsp.net")
    result = my_device.verify_location(
        longitude=area.longitude,
        latitude=area.latitude,
        radius=area.radius,
        max_age=3600
    )
    return {"result": result.result_type}
