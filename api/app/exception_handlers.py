from fastapi import Request
from fastapi.responses import JSONResponse


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    print(f"Unhandled exception: {exc} - Path: {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={"message": "An issue occurred, and we are looking into it."}
    )
