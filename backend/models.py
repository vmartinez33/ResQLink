from datetime import datetime
from sqlalchemy import table
from sqlmodel import Field, SQLModel


class Organization(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    country: str
    phone: str

class Group(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    color: str
    organization_id: int  # FK

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    username: str
    email: str
    observations: str
    role: str  # tracked / supervisor / admin
    organization_id: int  # FK

class TrackedUser(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int  # FK
    group_id: int  # FK
    color: str
    icon: str

class Device(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    user_id: int  # FK
    phone_number: str | None
    network_access_id: str | None

class Alert(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int  # FK
    supervisor_id: int | None  # FK
    longitude: float
    latitude: float
    alert_type: str  # high_priority / medium_priority / low_priority
    alert_message: str
    created_at: datetime = Field(default=datetime.now)

class Area(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int  # FK
    longitude: float
    latitude: float
    radius: float

class Path(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int  # FK
    # ???

class Location(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    device_id: int  # FK
    longitude: float
    latitude: float
    created_at: datetime = Field(default=datetime.now)

class Connection(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    device_id: int  # FK
    notification_type: str  # connectivity-data / connectivity-disconnected
    created_at: datetime = Field(default=datetime.now)

class GroupSupervisor(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    group_id: int  # FK
    user_id: int  # FK
