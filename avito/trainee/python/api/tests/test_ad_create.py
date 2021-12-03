import pytest
from rest_framework.reverse import reverse

from ..models import Ad


@pytest.mark.django_db
def test_ad_create_success(client, ad_sample_input):
    response = client.post(reverse('ad-list'), data=ad_sample_input)

    assert response.status_code == 201

    data = response.json()
    assert 'id' in data

    ad = Ad.objects.get(pk=data['id'])
    assert ad.title == ad_sample_input['title']
    assert ad.description == ad_sample_input['description']
    assert ad.price == ad_sample_input['price']
    assert list(ad.photos.values('url').all()) == ad_sample_input['photos']


@pytest.mark.parametrize('field', ['title', 'description', 'price', 'photos'])
@pytest.mark.django_db
def test_ad_create_without_required_field(client, ad_sample_input, field):
    input_data = {**ad_sample_input}
    del input_data[field]
    response = client.post(reverse('ad-list'), data=input_data)

    assert response.status_code == 400


@pytest.mark.parametrize('title', [None, '', 'N' * 201])
@pytest.mark.django_db
def test_ad_create_invalid_name(client, ad_sample_input, title):
    response = client.post(reverse('ad-list'), data={**ad_sample_input, 'title': title})

    assert response.status_code == 400


@pytest.mark.parametrize('description', [None, '', 'N' * 2001])
@pytest.mark.django_db
def test_ad_create_invalid_description(client, ad_sample_input, description):
    response = client.post(reverse('ad-list'), data={**ad_sample_input, 'description': description})

    assert response.status_code == 400


@pytest.mark.parametrize('price', [None, 0, 0.99, 100_000_000.00])
@pytest.mark.django_db
def test_ad_create_invalid_price(client, ad_sample_input, price):
    response = client.post(reverse('ad-list'), data={**ad_sample_input, 'price': price})

    assert response.status_code == 400


@pytest.mark.parametrize('photos', [
    [],
    [{}, {}],
    [
        {
            'url': 'invalid_url'
        },
        {
            'url': 'http://example.com/1.jpg'
        }
    ],
    [
        {
            'url': 'http://example.com/1.jpg'
        },
        {
            'url': 'http://example.com/2.jpg'
        },
        {
            'url': 'http://example.com/3.jpg'
        },
        {
            'url': 'http://example.com/4.jpg'
        }
    ]
])
@pytest.mark.django_db
def test_ad_create_invalid_photos(client, ad_sample_input, photos):
    response = client.post(reverse('ad-list'), data={**ad_sample_input, 'photos': photos})

    assert response.status_code == 400
