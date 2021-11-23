import pytest

from application.database.models import Room


def test_room_create_success(client, test_db, room_input):
    response = client.post('/room/', json=room_input)

    assert response.status_code == 201

    data = response.json()
    assert 'id' in data

    room = test_db.query(Room).get( data['id'])
    assert room.description == room_input['description']
    assert room.price == room_input['price']


@pytest.mark.parametrize('field', ['description', 'price'])
def test_room_create_without_required_field(client, test_db, room_input, field):
    input_data = {**room_input}
    del input_data[field]
    response = client.post('/room/', json=input_data)

    assert response.status_code == 422


@pytest.mark.parametrize('description', [None, '', 'N' * 4, 'N' * 201])
def test_room_create_invalid_description(client, room_input, description):
    response = client.post('/room/', json={**room_input, 'description': description})

    assert response.status_code == 422


@pytest.mark.parametrize('price', [None, 0, 0.99, 10_000_000.00])
def test_room_create_invalid_price(client, room_input, price):
    response = client.post('/room/', json={**room_input, 'price': price})

    assert response.status_code == 422