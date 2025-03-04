from sqlmodel import Session, SQLModel, create_engine

from backend.models import *


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    populate_database()

def get_session():
    with Session(engine) as session:
        yield session

def populate_database():
    with Session(engine) as session:
        # Drop all tables
        # session.exec("DROP TABLE IF EXISTS group_supervisor")
        # session.exec("DROP TABLE IF EXISTS supervisor_user")
        # session.exec("DROP TABLE IF EXISTS user")
        # session.exec("DROP TABLE IF EXISTS 'group'")
        # session.exec("DROP TABLE IF EXISTS organization")
        # session.exec("DROP TABLE IF EXISTS tracked_user")
        # session.exec("DROP TABLE IF EXISTS device")
        # session.exec("DROP TABLE IF EXISTS alert")
        # session.exec("DROP TABLE IF EXISTS area")
        
        # Create organizations
        org1 = Organization(name="Org1", country="Country1", phone="123456")
        session.add(org1)
        session.commit()
        
        # Create groups
        group1 = Group(name="Group1", color="red", organization_id=org1.id)
        session.add(group1)
        group2 = Group(name="Group2", color="blue", organization_id=org1.id)
        session.add(group2)
        session.commit()
        
        # Create users
        user1 = User(name="User1", username="user1", email="", observations="", role="supervisor", organization_id=org1.id)
        session.add(user1)
        user2 = User(name="User2", username="user2", email="", observations="", role="supervisor", organization_id=org1.id)
        session.add(user2)
        user3 = User(name="User3", username="user3", email="", observations="", role="tracked", organization_id=org1.id)
        session.add(user3)
        session.commit()
        
        # Create tracked users
        tracked_user1 = TrackedUser(user_id=user3.id, group_id=group1.id, color="#ffffff", icon="icon.png")
        session.add(tracked_user1)
        session.commit()
        
        # Create supervisor users
        supervisor_user1 = SupervisorUser(user_id=user2.id)
        session.add(supervisor_user1)
        supervisor_user2 = SupervisorUser(user_id=user3.id)
        session.add(supervisor_user2)
        session.commit()
        
        # Create group supervisors
        group_supervisor1 = GroupSupervisor(group_id=group1.id, supervisor_id=supervisor_user1.id)
        session.add(group_supervisor1)
        group_supervisor2 = GroupSupervisor(group_id=group1.id, supervisor_id=supervisor_user2.id)
        session.add(group_supervisor2)
        session.commit()
        
        # Create devices
        device1 = Device(name="Device1", tracked_user_id=tracked_user1.id, phone_number="")
        session.add(device1)
        session.commit()
        
        # Create alerts
        alert1 = Alert(tracked_user_id=tracked_user1.id, supervisor_id=supervisor_user1.id, longitude=25.5, latitude=25.5, alert_type='high_priority', alert_message="Alert message")
        session.add(alert1)
        session.commit()
        
        # Create areas
        area1 = Area(tracked_user_id=tracked_user1.id, longitude=2.1505, latitude=41.374023, radius=2000)
        session.add(area1)
        session.commit()
        
        # Create paths
        
        # Create locations
        
        # Create connections
