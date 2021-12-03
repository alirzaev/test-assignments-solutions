import datetime

import pytest
from rest_framework.reverse import reverse

from ..models import Ad, Photo


@pytest.fixture
def ads_small_input():
    return [{
        'title': f'Ad #{i}',
        'description': f'Ad #{i} description',
        'price': price,
        'photos': [
            {
                'url': 'http://example.com/1.jpg'
            },
            {
                'url': 'http://example.com/2.jpg'
            }
        ]
    } for i, price in zip(range(1, 4), (200, 100, 100))] # 1..3


@pytest.fixture
def ads_small_list(db, ads_small_input):
    ads = []
    for i, data in enumerate(ads_small_input):
        photos = data.pop('photos')
        ad = Ad.objects.create(**data)
        ad.created_at = datetime.datetime(2021, 1, 1, 0, 0, i)
        ad.save()
        for photo in photos:
            Photo.objects.create(**photo, ad=ad)
        ads.append(ad)
    
    return ads


@pytest.fixture
def ads_large_input():
    return [{
        'title': f'Ad #{i}',
        'description': f'Ad #{i} description',
        'price': i * 100,
        'photos': [
            {
                'url': 'http://example.com/1.jpg'
            }
        ]
    } for i in range(1, 21)] # 1..20


@pytest.fixture
def ads_large_list(db, ads_large_input):
    ads = []
    for i, data in enumerate(ads_large_input):
        photos = data.pop('photos')
        ad = Ad.objects.create(**data)
        ad.created_at = datetime.datetime(2021, 1, 1, 0, 0, i)
        ad.save()
        for photo in photos:
            Photo.objects.create(**photo, ad=ad)
        ads.append(ad)
    
    return ads


@pytest.fixture
def page_size(settings):
    return settings.REST_FRAMEWORK['PAGE_SIZE']


@pytest.mark.django_db
def test_get_ads_empty_db(client):
    response = client.get(reverse('ad-list'))

    assert response.status_code == 200

    actual = response.json()

    assert actual['count'] == 0
    assert actual['results'] == []


@pytest.mark.django_db
def test_get_ads_price_asc(client, ads_small_list, page_size):
    response = client.get(reverse('ad-list'), data={
        'page': 1,
        'ordering': 'price'
    })

    assert response.status_code == 200

    actual = [ad['id'] for ad in response.json()['results']]
    expected = list(Ad.objects.order_by('price').values_list('id', flat=True)[:page_size])

    assert actual == expected


@pytest.mark.django_db
def test_get_ads_price_desc(client, ads_small_list, page_size):
    response = client.get(reverse('ad-list'), data={
        'page': 1,
        'ordering': '-price'
    })

    assert response.status_code == 200

    actual = [ad['id'] for ad in response.json()['results']]
    expected = list(Ad.objects.order_by('-price').values_list('id', flat=True)[:page_size])

    assert actual == expected


@pytest.mark.django_db
def test_get_ads_date_asc(client, ads_small_list, page_size):
    response = client.get(reverse('ad-list'), data={
        'page': 1,
        'ordering': 'created_at'
    })

    assert response.status_code == 200

    actual = [ad['id'] for ad in response.json()['results']]
    expected = list(Ad.objects.order_by('created_at').values_list('id', flat=True)[:page_size])

    assert actual == expected


@pytest.mark.django_db
def test_get_ads_date_desc(client, ads_small_list, page_size):
    response = client.get(reverse('ad-list'), data={
        'page': 1,
        'ordering': '-created_at'
    })

    assert response.status_code == 200

    actual = [ad['id'] for ad in response.json()['results']]
    expected = list(Ad.objects.order_by('-created_at').values_list('id', flat=True)[:page_size])

    assert actual == expected


@pytest.mark.django_db
def test_get_ads_date_asc_price_asc(client, ads_small_list, page_size):
    response = client.get(reverse('ad-list'), data={
        'page': 1,
        'ordering': 'created_at,price'
    })

    assert response.status_code == 200

    actual = [ad['id'] for ad in response.json()['results']]
    expected = list(Ad.objects.order_by('created_at', 'price').values_list('id', flat=True)[:page_size])

    assert actual == expected


@pytest.mark.django_db
def test_get_ads_date_desc_price_desc(client, ads_small_list, page_size):
    response = client.get(reverse('ad-list'), data={
        'page': 1,
        'ordering': '-created_at,-price'
    })

    assert response.status_code == 200

    actual = [ad['id'] for ad in response.json()['results']]
    expected = list(Ad.objects.order_by('-created_at', '-price').values_list('id', flat=True)[:page_size])

    assert actual == expected


@pytest.mark.parametrize('page', [1, 2])
@pytest.mark.django_db
def test_get_ads_pagination(client, ads_large_list, page, page_size):
    response = client.get(reverse('ad-list'), data={
        'page': page,
        'ordering': 'created_at'
    })
    db_slice = slice(
        (page - 1) * page_size,
        page * page_size
    )

    assert response.status_code == 200

    data = response.json()
    
    assert data['count'] == len(ads_large_list)

    actual = [ad['id'] for ad in data['results']]
    expected = list(Ad.objects.order_by('created_at').values_list('id', flat=True)[db_slice])

    assert actual == expected


@pytest.mark.django_db
def test_get_ads_pagination_out_of_range(client, ads_large_list, page_size):
    page = len(ads_large_list) // page_size + 2 # the page after the last non-empty page

    response = client.get(reverse('ad-list'), data={
        'page': page,
        'ordering': 'created_at'
    })

    assert response.status_code == 404


@pytest.mark.django_db
def test_get_ads_pagination_negative_page_number(client, ads_large_list):
    response = client.get(reverse('ad-list'), data={
        'page': -1,
        'ordering': 'created_at'
    })

    assert response.status_code == 404
