from typing import List, Optional

from fastapi import APIRouter, Depends, Path, Query
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from ..crud import room as crud_room, SortOrder
from ..database import get_db
from ..dto import Message, RoomCreated, RoomIn, RoomOut

router = APIRouter(prefix='/room', tags=['room'])


@router.get('/', response_model=List[RoomOut], summary='Get a list of rooms')
def get_rooms(
    date_order: Optional[SortOrder] = Query(None, title='Sort by date'),
    price_order: Optional[SortOrder] = Query(None, title='Sort by price'),
    db: Session = Depends(get_db)
):
    return crud_room.get_rooms(db, price_order, date_order)


@router.post('/', status_code=201, response_model=RoomCreated, summary='Add a new room')
def add_room(room: RoomIn, db: Session = Depends(get_db)):
    return crud_room.save_room(db, room)


@router.delete(
    '/{room_id}',
    status_code=204,
    summary='Delete a room and all related bookings',
    responses={
        404: {'model': Message, 'description': 'Room not found'}
    }
)
def delete_room(room_id: int = Path(..., title='Room ID'), db: Session = Depends(get_db)):
    room = crud_room.delete_room(db, room_id)

    if room is None:
        raise HTTPException(status_code=404, detail='NOT_FOUND')
