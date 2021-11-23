import pytest

from application.crud import room as crud_room, booking as crud_booking
from application.database.models import Booking
from application.dto import BookingIn, RoomIn


def test_booking_create_success(client, test_db, room_input, booking_input):
    room = crud_room.save_room(test_db, RoomIn(**room_input))

    input_data = {**booking_input, 'room_id': room.id}
    response = client.post('/booking/', json=input_data)

    assert response.status_code == 201

    data = response.json()
    expected_data = BookingIn(**input_data)
    assert 'id' in data

    booking = test_db.query(Booking).get(data['id'])
    assert booking.begin_date == expected_data.begin_date
    assert booking.end_date == expected_data.end_date
    assert booking.room_id == expected_data.room_id


@pytest.mark.parametrize('field', ['begin_date', 'end_date', 'room_id'])
def test_booking_create_without_required_field(client, booking_input, field):
    input_data = {**booking_input}
    del input_data[field]
    response = client.post('/booking/', json=input_data)

    assert response.status_code == 422


@pytest.mark.parametrize('begin_date', [None, '', '2021-01-0', '2021-02-30'])
def test_booking_create_invalid_begin_date(client, booking_input, begin_date):
    response = client.post('/booking/', json={**booking_input, 'begin_date': begin_date})

    assert response.status_code == 422


@pytest.mark.parametrize('end_date', [None, '', '2021-01-0', '2021-02-30'])
def test_booking_create_invalid_end_date(client, booking_input, end_date):
    response = client.post('/booking/', json={**booking_input, 'end_date': end_date})

    assert response.status_code == 422


@pytest.mark.parametrize('room_id', [None, '', 'N'])
def test_booking_create_invalid_room_id(client, booking_input, room_id):
    response = client.post('/booking/', json={**booking_input, 'room_id': room_id})

    assert response.status_code == 422


def test_booking_create_end_date_preceds_begin_date(client):
    response = client.post('/booking/', json={
        'begin_date': '2021-01-07',
        'end_date': '2021-01-01',
        'room_id': 1
    })

    assert response.status_code == 422


@pytest.mark.parametrize('dates', [
    # inside of the date range
    {'begin_date': '2021-01-07', 'end_date': '2021-01-13'},
    {'begin_date': '2021-01-06', 'end_date': '2021-01-14'},
    {'begin_date': '2021-01-07', 'end_date': '2021-01-14'},
    # outside of the date range
    {'begin_date': '2021-01-06', 'end_date': '2021-01-15'},
    {'begin_date': '2021-01-06', 'end_date': '2021-01-14'},
    {'begin_date': '2021-01-07', 'end_date': '2021-01-15'},
    # crosses the left border
    {'begin_date': '2021-01-06', 'end_date': '2021-01-13'},
    {'begin_date': '2021-01-06', 'end_date': '2021-01-07'},
    # crosses the right border
    {'begin_date': '2021-01-13', 'end_date': '2021-01-15'},
    {'begin_date': '2021-01-14', 'end_date': '2021-01-15'},
])
def test_booking_create_overlapping_dates(client, test_db, room_input, dates):
    room = crud_room.save_room(test_db, RoomIn(**room_input))

    booking_1 = {
        'begin_date': '2021-01-07',
        'end_date': '2021-01-14',
        'room_id': room.id
    }
    crud_booking.save_booking(test_db, BookingIn(**booking_1))

    booking_2 = {
        **dates,
        'room_id': room.id
    }
    response = client.post('/booking/', json=booking_2)

    assert response.status_code == 422
