import os

from dotenv import load_dotenv
from network_as_code import NetworkAsCodeClient

load_dotenv()


def get_network_as_code_client() -> NetworkAsCodeClient:
    client = NetworkAsCodeClient(token=os.getenv("NAC_TOKEN"))
    return client
