from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import asc, desc

from . import SortOrder
from ..database.models import Room
from ..dto import RoomIn


def get_rooms(db: Session, price_order: Optional[SortOrder], date_order: Optional[SortOrder]) -> List[Room]:
    order = {
        SortOrder.ASC: asc,
        SortOrder.DESC: desc
    }

    query = db.query(Room)
    order_criteria = []

    if date_order is not None:
        order_criteria.append(order[date_order](Room.created_at))
    if price_order is not None:
        order_criteria.append(order[price_order](Room.price))
    query = query.order_by(*order_criteria).all()

    return query


def get_room_by_id(db: Session, room_id: int) -> Optional[Room]:
    return db.query(Room).get(room_id)


def save_room(db: Session, data: RoomIn) -> Room:
    room = Room(**data.dict())

    db.add(room)
    db.commit()
    db.refresh(room)

    return room


def delete_room(db: Session, room_id: int) -> Optional[Room]:
    room = db.query(Room).get(room_id)

    if room is not None:
        db.delete(room)
        db.commit()
    
    return room
