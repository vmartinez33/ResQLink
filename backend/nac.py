import os
from typing import Optional

from dotenv import load_dotenv
from network_as_code import NetworkAsCodeClient
from pydantic import BaseModel

load_dotenv()


class Device(BaseModel):
    phoneNumber: Optional[str] = None
    networkAccessIdentifier: Optional[str] = None
    ipv4Address: Optional[str] = None
    ipv6Address: Optional[str] = None

class ConnectivityEventDetail(BaseModel):
    device: Optional[Device] = None  # Puede ser None si no se incluye
    subscriptionId: Optional[str] = None
    deviceStatus: Optional[str] = None
    terminationReason: Optional[str] = None

class Event(BaseModel):
    eventType: Optional[str] = None
    eventTime: Optional[str] = None
    eventDetail: Optional[ConnectivityEventDetail] = None

class Data(BaseModel):
    device: Optional[Device] = None
    subscriptionId: Optional[str] = None
    terminationReason: Optional[str] = None

class Notification(BaseModel):
    id: Optional[str] = None
    source: Optional[str] = None
    type: Optional[str] = None
    specversion: Optional[str] = None
    datacontenttype: Optional[str] = None
    time: Optional[str] = None
    eventSubscriptionId: Optional[str] = None
    event: Optional[Event] = None
    data: Optional[Data] = None


def get_network_as_code_client() -> NetworkAsCodeClient:
    client = NetworkAsCodeClient(token=os.getenv("NAC_TOKEN"))
    return client
