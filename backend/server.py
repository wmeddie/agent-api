import asyncio
from urllib import request

import ray
import argparse
import asyncpg

from actors import *

from dotenv import load_dotenv

load_dotenv()

from quart import Quart, websocket


async def get_db():
    import os
    user = os.getenv("DB_USER")
    password = os.getenv("DB_PASSWORD")
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    database = os.getenv("DB_DATABASE")

    conn = await asyncpg.connect(f'postgresql://{user}:{password}@{host}:{port}/{database}')
    return conn



async def main(args):
    print(args)
    ray.init()


    # Create the actors
    llmproxy = LLMProxy.remote()

    agent = AgentActor.remote()

    agent.add_language_model.remote(llmproxy)

    app = Quart(__name__)

    @app.route("/")
    async def hello():
        return await agent.ping.remote()

    @app.route("/api")
    async def json():
        return {"hello": "world"}

    @app.route("/api/v1/agents", methods=["POST"])
    async def create_agent():
        data = await request.json
        conn = await get_db()
        try:
            # Insert a record into the created table.
            res = await conn.fetchval(
                'INSERT INTO agents(name, description, instructions, model) VALUES($1, $2, $3, $4) RETURNING id',
                data["name"],
                data["description"],
                data["instructions"],
                data["model"]
            )
            # Return inserted id.
            return res, 200
        finally:
            await conn.close()

    @app.route("/api/v1/agents/", methods=["GET"])
    async def agents():
        conn = await get_db()
        try:
            # Insert a record into the created table.
            res = await conn.fetch(
                'SELECT name, description, instructions, model FROM agents'
            )

            return res, 200
        finally:
            await conn.close()

    @app.websocket("/ws")
    async def ws():
        while True:
            await websocket.send("hello")
            await websocket.send_json({"hello": "world"})


    print("Creating DB schema...")
    conn = await get_db()
    # Execute a statement to create a new table.
    await conn.execute('''
            CREATE TABLE IF NOT EXISTS agents(
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                instructions TEXT NOT NULL,
                model TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

    print("Running app.")

    return await app.run_task()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Mind')
    loop = asyncio.get_event_loop()
    app = loop.run_until_complete(main(parser.parse_args()))
    loop.run_forever()
