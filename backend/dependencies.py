from typing import Annotated

from fastapi import Depends
from sqlmodel import Session
from network_as_code import NetworkAsCodeClient

from backend.database import get_session
from backend.nac import get_network_as_code_client

SessionDep = Annotated[Session, Depends(get_session)]

NetworkAsCodeClientDep = Annotated[NetworkAsCodeClient, Depends(get_network_as_code_client)]
