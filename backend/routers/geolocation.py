from fastapi import APIRouter

from backend.dependencies import NetworkAsCodeClientDep

router = APIRouter(
    prefix="/geolocation",
    tags=["geolocation"],
)


@router.get("/location")
async def get_location(
    client: NetworkAsCodeClientDep
):
    my_device = client.devices.get("device@testcsp.net")
    location = my_device.location()
    return {"device": "device@testcsp.net", "longitude": location.longitude, "latitude": location.latitude}

@router.get("/check-area")
async def get_location(
    client: NetworkAsCodeClientDep
):
    my_device = client.devices.get("device@testcsp.net")
    result = my_device.verify_location(
        longitude=60.252,
        latitude=25.227,
        radius=10_000,
        max_age=3600
    )
    return {"result": result.result_type}
