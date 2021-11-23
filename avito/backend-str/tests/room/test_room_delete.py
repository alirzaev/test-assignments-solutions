import datetime

import pytest

from application.crud import room as crud_room, booking as crud_booking
from application.database.models import Booking, Room
from application.dto import BookingIn, RoomIn


def test_delete_room_success(client, test_db, room_input):
    room = crud_room.save_room(test_db, RoomIn(**room_input))
    room_id = room.id

    response = client.delete(f'/room/{room_id}')

    assert response.status_code == 204

    deleted_room = test_db.query(Room).get(room_id)

    assert deleted_room is None


def test_delete_room_not_found(client, test_db, room_input):
    room = crud_room.save_room(test_db, RoomIn(**room_input))
    room_id = room.id + 1

    response = client.delete(f'/room/{room_id}')

    assert response.status_code == 404


def test_delete_room_with_booking(client, test_db, room_input):
    room = crud_room.save_room(test_db, RoomIn(**room_input))
    room_id = room.id
    crud_booking.save_booking(
        test_db,
        BookingIn(room_id=room.id, begin_date=datetime.date(2021, 1, 1), end_date=datetime.date(2021, 1, 7))
    )

    response = client.delete(f'/room/{room_id}')

    assert response.status_code == 204

    bookings_count = test_db.query(Booking).filter(Booking.room_id==room_id).count()

    assert bookings_count == 0
