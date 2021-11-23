import datetime

import pytest

from application.database.models import Room
from application.dto import RoomIn
from application.crud import room as crud, SortOrder


@pytest.fixture
def rooms_input():
    return [{
        'description': f'Room #{i}',
        'price': price
    } for i, price in enumerate((200, 100, 100, 150), 1)] # 1..4


def test_get_rooms_empty_response(client, test_db):
    response = client.get('/room/')

    assert response.status_code == 200
    assert response.json() == []


def test_get_rooms_price_asc(client, test_db, rooms_input):
    for data in rooms_input:
        crud.save_room(test_db, RoomIn(**data))

    response = client.get('/room/', params={
        'price_order': SortOrder.ASC
    })

    assert response.status_code == 200

    actual = [room['id'] for room in response.json()]
    expected = [
        room.id for room in test_db.query(Room)
            .order_by(Room.price.asc())
    ]

    assert actual == expected


def test_get_rooms_price_desc(client, test_db, rooms_input):
    for data in rooms_input:
        crud.save_room(test_db, RoomIn(**data))

    response = client.get('/room/', params={
        'price_order': SortOrder.DESC
    })

    assert response.status_code == 200

    actual = [room['id'] for room in response.json()]
    expected = [
        room.id for room in test_db.query(Room)
            .order_by(Room.price.desc())
    ]

    assert actual == expected


def test_get_rooms_date_asc(client, test_db, rooms_input):
    rooms = [crud.save_room(test_db, RoomIn(**data)) for data in rooms_input]

    for i, room in enumerate(rooms, 1):
        room.created_at = datetime.date(2021, 1, i)
        test_db.add(room)
    test_db.commit()

    response = client.get('/room/', params={
        'date_order': SortOrder.ASC
    })

    assert response.status_code == 200

    actual = [room['id'] for room in response.json()]
    expected = [
        room.id for room in test_db.query(Room)
            .order_by(Room.created_at.asc())
    ]

    assert actual == expected


def test_get_rooms_date_desc(client, test_db, rooms_input):
    rooms = [crud.save_room(test_db, RoomIn(**data)) for data in rooms_input]

    for i, room in enumerate(rooms, 1):
        room.created_at = datetime.date(2021, 1, i)
        test_db.add(room)
    test_db.commit()

    response = client.get('/room/', params={
        'date_order': SortOrder.DESC
    })

    assert response.status_code == 200

    actual = [room['id'] for room in response.json()]
    expected = [
        room.id for room in test_db.query(Room)
            .order_by(Room.created_at.desc())
    ]

    assert actual == expected


def test_get_rooms_price_asc_date_asc(client, test_db, rooms_input):
    rooms = [crud.save_room(test_db, RoomIn(**data)) for data in rooms_input]

    for i, room in enumerate(rooms, 1):
        room.created_at = datetime.date(2021, 1, i)
        test_db.add(room)
    test_db.commit()

    response = client.get('/room/', params={
        'price_order': SortOrder.ASC,
        'date_order': SortOrder.ASC
    })

    assert response.status_code == 200

    actual = [room['id'] for room in response.json()]
    expected = [
        room.id for room in test_db.query(Room)
            .order_by(Room.created_at.asc(), Room.price.asc())
    ]

    assert actual == expected


def test_get_rooms_price_desc_date_desc(client, test_db, rooms_input):
    rooms = [crud.save_room(test_db, RoomIn(**data)) for data in rooms_input]

    for i, room in enumerate(rooms, 1):
        room.created_at = datetime.date(2021, 1, i)
        test_db.add(room)
    test_db.commit()

    response = client.get('/room/', params={
        'price_order': SortOrder.DESC,
        'date_order': SortOrder.DESC
    })

    assert response.status_code == 200

    actual = [room['id'] for room in response.json()]
    expected = [
        room.id for room in test_db.query(Room)
            .order_by(Room.created_at.desc(), Room.price.desc())
    ]

    assert actual == expected
