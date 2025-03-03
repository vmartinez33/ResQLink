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
        session.commit()
        
        # Create supervisor users
        supervisor_user1 = SupervisorUser(user_id=user1.id)
        session.add(supervisor_user1)
        supervisor_user2 = SupervisorUser(user_id=user2.id)
        session.add(supervisor_user2)
        session.commit()
        
        # Create group supervisors
        group_supervisor1 = GroupSupervisor(group_id=group1.id, supervisor_id=supervisor_user1.id)
        session.add(group_supervisor1)
        group_supervisor2 = GroupSupervisor(group_id=group1.id, supervisor_id=supervisor_user2.id)
        session.add(group_supervisor2)
        session.commit()
