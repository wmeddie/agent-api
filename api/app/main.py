from fastapi import FastAPI
from .controller import router as agent_router
import sys
import os
from dotenv import load_dotenv

load_dotenv('../.env')  # Adjust this path if needed to correctly point to your .env file

# Adjust the path to ensure the parent directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = FastAPI()

# Include the agent router
app.include_router(agent_router, prefix="")

# Optionally, you can include additional startup or shutdown events if needed
@app.on_event("startup")
async def startup_event():
    # Here you can perform any startup actions such as opening async database connections if required
    print("Application has started")

@app.on_event("shutdown")
async def shutdown_event():
    # Cleanup actions, like closing database connections, can be placed here
    print("Application is shutting down")
