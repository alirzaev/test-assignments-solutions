from application.crud import room as crud_room, booking as crud_booking
from application.database.models import Booking
from application.dto import BookingIn, RoomIn


def test_delete_booking_success(client, test_db, room_input, booking_input):
    room = crud_room.save_room(test_db, RoomIn(**room_input))

    input_data = {**booking_input, 'room_id': room.id}
    booking = crud_booking.save_booking(test_db, BookingIn(**input_data))
    booking_id = booking.id

    response = client.delete(f'/booking/{booking_id}')

    assert response.status_code == 204

    deleted_booking = test_db.query(Booking).get(booking_id)

    assert deleted_booking is None


def test_delete_room_not_found(client, test_db, room_input, booking_input):
    room = crud_room.save_room(test_db, RoomIn(**room_input))

    input_data = {**booking_input, 'room_id': room.id}
    booking = crud_booking.save_booking(test_db, BookingIn(**input_data))
    booking_id = booking.id

    response = client.delete(f'/booking/{booking_id + 1}')

    assert response.status_code == 404
