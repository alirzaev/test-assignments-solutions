from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import asc

from ..database.models import Booking, Room
from ..dto import BookingIn


def get_bookings_of_room(db: Session, room: Room) -> List[Booking]:
    return db.query(Booking).join(Room, Booking.room_id == room.id).order_by(Booking.begin_date.asc()).all()


def save_booking(db: Session, data: BookingIn) -> Booking:
    booking = Booking(**data.dict())

    ok = db.query(Booking) \
        .join(Room, Booking.room_id == booking.room_id) \
        .filter(
            (booking.begin_date <= Booking.begin_date) & (Booking.end_date <= booking.end_date) |
            (Booking.begin_date < booking.begin_date) & (booking.end_date < Booking.end_date) |
            (Booking.begin_date < booking.begin_date) & (booking.begin_date <= Booking.end_date) |
            (Booking.begin_date <= booking.end_date) & (booking.end_date < Booking.end_date)
        ) \
        .count() == 0
    if not ok:
        raise ValueError('OVERLAPPING_DATES')

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return booking


def delete_booking(db: Session, booking_id) -> Optional[Booking]:
    booking = db.query(Booking).get(booking_id)

    if booking is not None:
        db.delete(booking)
        db.commit()

    return booking
