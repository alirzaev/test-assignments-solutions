import uvicorn
from fastapi import FastAPI

from .config import get_config
from .routers import booking, room

config = get_config()

application = FastAPI(
    debug=config.DEBUG,
    title='Booking service',
    description='A service for managing hotel rooms and bookings'
)
application.include_router(booking.router)
application.include_router(room.router)


if __name__ == '__main__':
    uvicorn.run(application, port=8000, debug=config.DEBUG)
