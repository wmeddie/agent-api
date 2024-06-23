from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from . import schemas
from .services import crud
from .services.database import get_db

router = APIRouter()

@router.post("/agents/", response_model=schemas.Agent)
async def create_agent(agent: schemas.AgentCreate, db: AsyncSession = Depends(get_db)):
    ag = await crud.create_agent(db=db, agent=agent)
    return ag

@router.get("/agents/{agent_id}", response_model=schemas.Agent)
async def read_agent(agent_id: int, db: AsyncSession = Depends(get_db)):
    db_agent = await crud.get_agent(db=db, agent_id=agent_id)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@router.get("/agents/", response_model=list[schemas.Agent])
async def read_agents(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    agents = await crud.get_agents(db=db, skip=skip, limit=limit)
    return agents

@router.put("/agents/{agent_id}", response_model=schemas.Agent)
async def update_agent(agent_id: int, agent: schemas.AgentCreate, db: AsyncSession = Depends(get_db)):
    db_agent = await crud.update_agent(db=db, agent_id=agent_id, agent=agent)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@router.delete("/agents/{agent_id}", response_model=schemas.Agent)
async def delete_agent(agent_id: int, db: AsyncSession = Depends(get_db)):
    db_agent = await crud.delete_agent(db=db, agent_id=agent_id)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent
