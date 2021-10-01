import json
from datetime import date

import pytest
from rest_framework.test import APIClient

from trainee.models import Stats


@pytest.mark.django_db
def test_stats_save_new():
    client = APIClient()
    response = client.post('/stats/save/', data={
        'date': '2021-09-30',
        'clicks': 1,
        'views': 1,
        'cost': 10
    })

    assert response.status_code == 200

    stats = Stats.objects.get(date=date(2021, 9, 30))

    assert stats.clicks == 1
    assert stats.views == 1
    assert stats.cost == 10.0


@pytest.mark.django_db
def test_stats_save_add():
    Stats.objects.create(date=date(2021, 9, 30), clicks=10, views=10, cost=10.0)

    client = APIClient()
    response = client.post('/stats/save/', data={
        'date': '2021-09-30',
        'clicks': 30,
        'views': 20,
        'cost': 10.0
    })

    assert response.status_code == 200

    stats = Stats.objects.get(date=date(2021, 9, 30))

    assert stats.clicks == 40
    assert stats.views == 30
    assert stats.cost == 20.0


@pytest.mark.django_db
def test_stats_save_only_date():
    client = APIClient()
    response = client.post('/stats/save/', data={
        'date': '2021-09-30'
    })

    assert response.status_code == 200

    stats = Stats.objects.get(date=date(2021, 9, 30))

    assert stats.clicks == 0
    assert stats.views == 0
    assert stats.cost == 0.0


@pytest.mark.django_db
def test_stats_save_invalid_date():
    client = APIClient()
    response = client.post('/stats/save/', data={
        'date': '2021-09-31',
        'clicks': 10,
        'views': 10,
        'cost': 10
    })

    assert response.status_code == 400


@pytest.mark.django_db
def test_stats_save_invalid_clicks():
    client = APIClient()
    response = client.post('/stats/save/', data={
        'date': '2021-09-30',
        'clicks': -1,
        'views': 10,
        'cost': 10
    })

    assert response.status_code == 400


@pytest.mark.django_db
def test_stats_save_invalid_views():
    client = APIClient()
    response = client.post('/stats/save/', data={
        'date': '2021-09-30',
        'clicks': 10,
        'views': -1,
        'cost': 10
    })

    assert response.status_code == 400


@pytest.mark.django_db
def test_stats_save_invalid_cost():
    client = APIClient()
    response = client.post('/stats/save/', data={
        'date': '2021-09-30',
        'clicks': 10,
        'views': 10,
        'cost': -1
    })

    assert response.status_code == 400


@pytest.mark.django_db
def test_stats_save_too_large_cost():
    client = APIClient()
    response = client.post('/stats/save/', data={
        'date': '2021-09-30',
        'clicks': 10,
        'views': 10,
        'cost': 10000000.00
    })

    assert response.status_code == 400


@pytest.mark.django_db
def test_stats_show():
    Stats.objects.create(date=date(2021, 9, 29), clicks=5, views=20, cost=25.0)
    Stats.objects.create(date=date(2021, 9, 30), clicks=10, views=10, cost=10.0)

    client = APIClient()
    response = client.get('/stats/show/', data={
        'from': '2021-09-29',
        'to': '2021-09-30'
    })

    assert response.status_code == 200

    expected = {
        'ok': True,
        'stats': [
            {
                'date': '2021-09-29',
                'clicks': 5,
                'views': 20,
                'cost': '25.00',
                'cpc': 5,
                'cpm': 1250
            },
            {
                'date': '2021-09-30',
                'clicks': 10,
                'views': 10,
                'cost': '10.00',
                'cpc': 1,
                'cpm': 1000
            }
        ]
    }

    assert json.loads(response.content) == expected


@pytest.mark.django_db
def test_stats_show_empty():
    client = APIClient()
    response = client.get('/stats/show/', data={
        'from': '2021-09-29',
        'to': '2021-09-30'
    })

    assert response.status_code == 200

    expected = {
        'ok': True,
        'stats': []
    }

    assert json.loads(response.content) == expected


@pytest.mark.django_db
def test_stats_reset():
    Stats.objects.create(date=date(2021, 9, 29), clicks=5, views=20, cost=25.0)
    Stats.objects.create(date=date(2021, 9, 30), clicks=10, views=10, cost=10.0)

    client = APIClient()
    response = client.put('/stats/reset/')

    assert response.status_code == 200

    count = Stats.objects.count()

    assert count == 0
