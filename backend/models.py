from datetime import datetime, timezone
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
    organization_id: int | None = Field(default=None, foreign_key="organization.id") # FK

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    username: str
    email: str
    observations: str
    role: str  # tracked / supervisor / admin
    organization_id: int | None = Field(default=None, foreign_key="organization.id")  # FK

class TrackedUser(SQLModel, table=True):
    __tablename__ = "tracked_user"
    
    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")  # FK
    group_id: int | None = Field(default=None, foreign_key="group.id")  # FK
    color: str
    icon: str

class Device(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    user_id: int | None = Field(default=None, foreign_key="user.id")  # FK
    phone_number: str | None
    network_access_id: str | None

class Alert(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")  # FK
    supervisor_id: int | None = Field(default=None, foreign_key="user.id")  # FK
    longitude: float
    latitude: float
    alert_type: str  # high_priority / medium_priority / low_priority
    alert_message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Area(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")  # FK
    longitude: float
    latitude: float
    radius: float

class Path(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")  # FK
    # ???

class Location(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    device_id: int | None = Field(default=None, foreign_key="device.id")  # FK
    longitude: float
    latitude: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Connection(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    device_id: int | None = Field(default=None, foreign_key="device.id")  # FK
    notification_type: str  # connectivity-data / connectivity-disconnected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GroupSupervisor(SQLModel, table=True):
    __tablename__ = "group_supervisor"
    
    id: int | None = Field(default=None, primary_key=True)
    group_id: int | None = Field(default=None, foreign_key="group.id")  # FK
    user_id: int | None = Field(default=None, foreign_key="user.id")  # FK
