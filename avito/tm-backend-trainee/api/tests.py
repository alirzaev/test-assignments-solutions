from datetime import date
from decimal import Decimal

import pytest
from rest_framework.reverse import reverse
from rest_framework.test import APIClient

from .models import Stats


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def stats_input():
    return {
        'date': '2021-09-30',
        'clicks': 10,
        'views': 10,
        'cost': 10
    }


@pytest.mark.django_db
def test_stats_save_new(client, stats_input):
    response = client.post(reverse('save'), data=stats_input)

    assert response.status_code == 201

    stats = Stats.objects.get(date=stats_input['date'])

    assert stats.clicks == stats_input['clicks']
    assert stats.views == stats_input['views']
    assert stats.cost == stats_input['cost']


@pytest.mark.django_db
def test_stats_save_add(client, stats_input):
    Stats.objects.create(**stats_input)

    patch = {
        **stats_input,
        'clicks': 30,
        'views': 20,
        'cost': 10.0
    }

    response = client.post(reverse('save'), data=patch)

    assert response.status_code == 201

    stats = Stats.objects.get(date=stats_input['date'])

    assert stats.clicks == stats_input['clicks'] + patch['clicks']
    assert stats.views == stats_input['views'] + patch['views']
    assert stats.cost == stats_input['cost'] + patch['cost']


@pytest.mark.django_db
def test_stats_save_only_date(client):
    response = client.post(reverse('save'), data={
        'date': '2021-09-30'
    })

    assert response.status_code == 201

    stats = Stats.objects.get(date=date(2021, 9, 30))

    assert stats.clicks == 0
    assert stats.views == 0
    assert stats.cost == 0.0


@pytest.mark.django_db
def test_stats_save_invalid_date(client, stats_input):
    response = client.post(reverse('save'), data={
        **stats_input,
        'date': '2021-09-31',
    })

    assert response.status_code == 400


@pytest.mark.django_db
def test_stats_save_invalid_clicks(client, stats_input):
    response = client.post(reverse('save'), data={
        **stats_input,
        'clicks': -1,
    })

    assert response.status_code == 400


@pytest.mark.django_db
def test_stats_save_invalid_views(client, stats_input):
    response = client.post(reverse('save'), data={
        **stats_input,
        'views': -1,
    })

    assert response.status_code == 400


@pytest.mark.parametrize('cost', [-1, 10000000.00])
@pytest.mark.django_db
def test_stats_save_invalid_cost(client, cost, stats_input):
    response = client.post(reverse('save'), data={
        **stats_input,
        'cost': cost
    })

    assert response.status_code == 400


@pytest.mark.django_db
def test_stats_show(client):
    stats_inputs = [
        {
            'date': '2021-01-01',
            'clicks': 5,
            'views': 20,
            'cost': Decimal(25)
        },
        {
            'date': '2021-01-01',
            'clicks': 6,
            'views': 12,
            'cost': Decimal(25)
        },
        {
            'date': '2021-01-02',
            'clicks': 10,
            'views': 10,
            'cost': Decimal(10)
        },
        {
            'date': '2021-01-02',
            'clicks': 100,
            'views': 60,
            'cost': Decimal(100)
        }
    ]
    for data in stats_inputs:
        client.post(reverse('save'), data=data)
    
    response = client.get(reverse('show'), data={
        'from': '2021-01-01',
        'to': '2021-01-02'
    })

    assert response.status_code == 200

    actual = response.json()
    for item in actual:
        item['cost'] = Decimal(item['cost'])
    expected = [
        {
            'date': s1['date'],
            'clicks': s1['clicks'] + s2['clicks'],
            'views': s1['views'] + s2['views'],
            'cost': s1['cost'] + s2['cost'],
            'cpc': float(s1['cost'] + s2['cost']) / (s1['clicks'] + s2['clicks']),
            'cpm': float(s1['cost'] + s2['cost']) / (s1['views'] + s2['views']) * 1000,
        } for s1, s2 in (stats_inputs[:2], stats_inputs[2:])
    ]

    assert actual == expected


@pytest.mark.django_db
def test_stats_show_empty(client, stats_input):
    data = {**stats_input, 'date' :'2021-09-08'}
    Stats.objects.create(**data)

    response = client.get(reverse('show'), data={
        'from': '2021-09-01',
        'to': '2021-09-07'
    })

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.django_db
def test_stats_reset(client):
    Stats.objects.create(date=date(2021, 9, 29), clicks=5, views=20, cost=25.0)
    Stats.objects.create(date=date(2021, 9, 30), clicks=10, views=10, cost=10.0)

    assert Stats.objects.count() != 0

    response = client.put(reverse('reset'))

    assert response.status_code == 204

    assert Stats.objects.count() == 0
