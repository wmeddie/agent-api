from pydantic import BaseModel, validator
from datetime import datetime

class AgentBase(BaseModel):
    name: str
    description: str
    instructions: str
    model: str

class AgentCreate(AgentBase):
    pass

class Agent(AgentBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        orm_mode = True

    @validator("created_at", "updated_at", pre=True, always=True)
    def datetime_to_string(cls, value: datetime) -> str:
        return value.isoformat() if value else None