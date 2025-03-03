from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, Relationship, SQLModel

class GroupSupervisor(SQLModel, table=True):
    __tablename__ = "group_supervisor"
    
    id: int | None = Field(default=None, primary_key=True)
    group_id: int | None = Field(default=None, foreign_key="group.id", primary_key=True)  # FK
    supervisor_id: int | None = Field(default=None, foreign_key="supervisor_user.id", primary_key=True)  # FK

class Organization(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    country: str
    phone: str
    
    groups: list["Group"] = Relationship(back_populates="organization")
    users: list["User"] = Relationship(back_populates="organization")

class Group(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    color: str
    organization_id: int | None = Field(default=None, foreign_key="organization.id") # FK
    
    organization: Organization | None = Relationship(back_populates="groups")
    tracked_users: list["TrackedUser"] = Relationship(back_populates="group")
    supervisors: list["SupervisorUser"] = Relationship(back_populates="groups", link_model=GroupSupervisor)

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    username: str
    email: str
    observations: str
    role: str  # tracked / supervisor / admin
    organization_id: int | None = Field(default=None, foreign_key="organization.id")  # FK
    
    organization: Organization | None = Relationship(back_populates="users")
    tracked_user: Optional["TrackedUser"] | None = Relationship(back_populates="user")
    supervisor_user: Optional["SupervisorUser"] | None = Relationship(back_populates="user")

class TrackedUser(SQLModel, table=True):
    __tablename__ = "tracked_user"
    
    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")  # FK
    group_id: int | None = Field(default=None, foreign_key="group.id")  # FK
    color: str
    icon: str
    
    user: User | None = Relationship(back_populates="tracked_user")
    group: Group | None = Relationship(back_populates="tracked_users")
    device: Optional["Device"] | None = Relationship(back_populates="tracked_user")
    alerts: list["Alert"] = Relationship(back_populates="tracked_user")
    areas: list["Area"] = Relationship(back_populates="tracked_user")
    paths: list["Path"] = Relationship(back_populates="tracked_user")

class SupervisorUser(SQLModel, table=True):
    __tablename__ = "supervisor_user"
    
    id: int | None = Field(default=None, primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="user.id")  # FK
    
    user: User | None = Relationship(back_populates="supervisor_user")
    alerts: list["Alert"] = Relationship(back_populates="supervisor")
    groups: list[Group] = Relationship(back_populates="supervisors", link_model=GroupSupervisor)

class Device(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    tracked_user_id: int | None = Field(default=None, foreign_key="tracked_user.id")  # FK
    phone_number: str | None
    network_access_id: str | None
    
    tracked_user: TrackedUser | None = Relationship(back_populates="device")
    locations: list["Location"] = Relationship(back_populates="device")
    connections: list["Connection"] = Relationship(back_populates="device")

class Alert(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    tracked_user_id: int | None = Field(default=None, foreign_key="tracked_user.id")  # FK
    supervisor_id: int | None = Field(default=None, foreign_key="supervisor_user.id")  # FK
    longitude: float
    latitude: float
    alert_type: str  # high_priority / medium_priority / low_priority
    alert_message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    tracked_user: TrackedUser | None = Relationship(back_populates="alerts")
    supervisor: SupervisorUser | None = Relationship(back_populates="alerts")

class Area(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    tracked_user_id: int | None = Field(default=None, foreign_key="tracked_user.id")  # FK
    longitude: float
    latitude: float
    radius: float
    
    tracked_user: TrackedUser | None = Relationship(back_populates="areas")

class Path(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    tracked_user_id: int | None = Field(default=None, foreign_key="tracked_user.id")  # FK
    # ???
    
    tracked_user: TrackedUser | None = Relationship(back_populates="paths")

class Location(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    device_id: int | None = Field(default=None, foreign_key="device.id")  # FK
    longitude: float
    latitude: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    device: Device | None = Relationship(back_populates="locations")

class Connection(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    device_id: int | None = Field(default=None, foreign_key="device.id")  # FK
    notification_type: str  # connectivity-data / connectivity-disconnected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    device: Device | None = Relationship(back_populates="connections")
