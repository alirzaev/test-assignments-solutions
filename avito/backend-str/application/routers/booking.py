from typing import List

from fastapi import APIRouter, Depends, Path
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from ..crud import booking as crud_booking, room as crud_room
from ..database import get_db
from ..dto import BookingCreated, BookingIn, BookingOut, Message

router = APIRouter(prefix='/booking', tags=['booking'])


@router.get(
    '/{room_id}',
    response_model=List[BookingOut],
    summary='Get a booking list of the specified room',
    responses={
        404: {'model': Message, 'description': 'Room not found'}
    }
)
def get_bookings_of_room(room_id: int, db: Session = Depends(get_db)):
    room = crud_room.get_room_by_id(db, room_id)

    if room is None:
        raise HTTPException(404, detail='ROOM_NOT_FOUND')
    
    return crud_booking.get_bookings_of_room(db, room)


@router.post(
    '/',
    status_code=201,
    response_model=BookingCreated,
    summary='Add a new booking',
    responses={
        404: {'model': Message, 'description': 'Room not found'},
        422: {'model': Message, 'description': 'Booking overlaps dates'}
    }
)
def add_booking(booking: BookingIn, db: Session = Depends(get_db)):
    room = crud_room.get_room_by_id(db, booking.room_id)

    if room is None:
        raise HTTPException(404, detail='ROOM_NOT_FOUND')
    
    try:
        return crud_booking.save_booking(db, booking)
    except ValueError as ex:
        raise HTTPException(status_code=422, detail=str(ex))


@router.delete(
    '/{booking_id}',
    status_code=204,
    summary='Delete a booking',
    responses={
        404: {'model': Message, 'description': 'Booking not found'}
    }
)
def delete_booking(booking_id: int = Path(..., title='Booking ID'), db: Session = Depends(get_db)):
    booking = crud_booking.delete_booking(db, booking_id)

    if booking is None:
        raise HTTPException(status_code=404, detail='NOT_FOUND')
