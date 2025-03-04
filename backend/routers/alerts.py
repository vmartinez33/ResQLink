import select
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException
from sqlmodel import SQLModel

from backend.dependencies import SessionDep
from backend.models import Alert

router = APIRouter(
    prefix="/alerts",
    tags=["alerts"],
)

class AlertCreate(SQLModel):
    tracked_user_id: Optional[int] = None
    supervisor_id: Optional[int] = None
    longitude: float
    latitude: float
    alert_type: str  # "high_priority", "medium_priority", "low_priority"
    alert_message: str

class AlertUpdate(SQLModel):
    tracked_user_id: Optional[int] = None
    supervisor_id: Optional[int] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    alert_type: Optional[str] = None
    alert_message: Optional[str] = None


@router.post("/", response_model=Alert)
async def create_alert(alert_data: AlertCreate, session: SessionDep):
    alert = Alert(**alert_data.model_dump())
    session.add(alert)
    session.commit()
    session.refresh(alert)
    return alert


@router.put("/{alert_id}", response_model=Alert)
async def update_alert(alert_id: int, alert_data: AlertUpdate, session: SessionDep):
    statement = select(Alert).where(Alert.id == alert_id)
    alert = session.exec(statement).first()

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert_dict = alert_data.model_dump(exclude_unset=True)
    for key, value in alert_dict.items():
        setattr(alert, key, value)

    session.add(alert)
    session.commit()
    session.refresh(alert)
    return alert
