from typing import Annotated

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select

from backend.database import create_db_and_tables
from backend.dependencies import SessionDep
from backend.models import Group, SupervisorUserBase, User


async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    # clean up code goes here

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

    
@app.get("/")
async def read_root():
    return {"Hello": "World"}


class SupervisorUserResponse(SupervisorUserBase):
    user: User
    
@app.get("/groups/{group_id}/supervisors", response_model=list[SupervisorUserResponse])
async def read_root(
    session: SessionDep,
    group_id: int
):
    statement = select(Group).where(Group.id == group_id)
    result = session.exec(statement)
    group = result.one()
      
    return group.supervisors
