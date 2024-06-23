from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .. import models, schemas

async def get_agent(db: AsyncSession, agent_id: int):
    result = await db.execute(select(models.Agent).filter(models.Agent.id == agent_id))
    return result.scalars().first()

async def get_agents(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.Agent).offset(skip).limit(limit)
    )
    return result.scalars().all()


async def create_agent(db: AsyncSession, agent: schemas.AgentCreate):
    db_agent = models.Agent(**agent.dict())
    db.add(db_agent)
    await db.commit()
    await db.refresh(db_agent)
    return db_agent


async def update_agent(db: AsyncSession, agent_id: int, agent: schemas.AgentCreate):
    result = await db.execute(select(models.Agent).filter(models.Agent.id == agent_id))
    db_agent = result.scalars().first()
    if db_agent:
        for key, value in agent.dict().items():
            setattr(db_agent, key, value)
        await db.commit()
        await db.refresh(db_agent)
    return db_agent


async def delete_agent(db: AsyncSession, agent_id: int):
    result = await db.execute(select(models.Agent).filter(models.Agent.id == agent_id))
    db_agent = result.scalars().first()
    if db_agent:
        await db.delete(db_agent)
        await db.commit()
    return db_agent
