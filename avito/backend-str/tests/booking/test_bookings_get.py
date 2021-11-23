import pytest

from application.crud import room as crud_room, booking as crud_booking
from application.dto import BookingIn, RoomIn


@pytest.fixture
def bookings_inputs():
    return [
        [
            {
                'begin_date': '2021-01-01',
                'end_date': '2021-01-07',
                'room_id': 1
            },
            {
                'begin_date': '2021-01-08',
                'end_date': '2021-01-14',
                'room_id': 1
            }
        ],
        [
            {
                'begin_date': '2021-02-01',
                'end_date': '2021-02-07',
                'room_id': 2
            },
            {
                'begin_date': '2021-02-08',
                'end_date': '2021-02-14',
                'room_id': 2
            }
        ]
    ]


@pytest.fixture
def rooms_input():
    return [
        {
            'description': 'Room #1',
            'price': 100
        },
        {
            'description': 'Room #2',
            'price': 100
        }
    ]


def test_get_bookings_several_rooms_success(client, test_db, rooms_input, bookings_inputs):
    assert len(rooms_input) == len(bookings_inputs)

    rooms = [crud_room.save_room(test_db, RoomIn(**data)) for data in rooms_input]

    bookings = [
        [
            crud_booking.save_booking(test_db, BookingIn(**{**data, 'room_id': room.id}))
            for data in bookings_input
        ] for room, bookings_input in zip(rooms, bookings_inputs)
    ]

    for room, bookings in zip(rooms, bookings):
        response = client.get(f'/booking/{room.id}')

        assert response.status_code == 200

        actual = [booking['id'] for booking in response.json()]
        expected = [
            booking.id for booking in sorted(bookings, key=lambda b: b.begin_date)
        ]

        assert actual == expected


def test_get_bookings_room_not_found(client, test_db, room_input):
    room = crud_room.save_room(test_db, RoomIn(**room_input))

    response = client.get(f'/booking/{room.id + 1}')

    assert response.status_code == 404
