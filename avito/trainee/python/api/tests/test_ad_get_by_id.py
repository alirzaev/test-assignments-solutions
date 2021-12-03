import pytest
from rest_framework.reverse import reverse

from ..models import Ad, Photo


@pytest.fixture
def ad_sample(db, ad_sample_input):
    photos = ad_sample_input.pop('photos')
    ad = Ad.objects.create(**ad_sample_input)
    for photo in photos:
        Photo.objects.create(**photo, ad=ad)
    
    return ad


@pytest.mark.django_db
def test_get_ad_success(client, ad_sample):
    response = client.get(reverse('ad-detail', args=[ad_sample.id]))

    assert response.status_code == 200

    data = response.json()
    assert data['id'] == ad_sample.id
    assert data['title'] == ad_sample.title
    assert data['price'] == ad_sample.price
    assert data['first_photo'] == ad_sample.photos.values('url').first()


@pytest.mark.django_db
def test_get_ad_with_description_success(client, ad_sample):
    response = client.get(reverse('ad-detail', args=[ad_sample.id]), data={'fields': ['description']})

    assert response.status_code == 200

    data = response.json()
    assert data['id'] == ad_sample.id
    assert data['title'] == ad_sample.title
    assert data['description'] == ad_sample.description
    assert data['price'] == ad_sample.price
    assert data['first_photo'] == ad_sample.photos.values('url').first()


@pytest.mark.django_db
def test_get_ad_with_photos_success(client, ad_sample):
    response = client.get(reverse('ad-detail', args=[ad_sample.id]), data={'fields': ['photos']})

    assert response.status_code == 200

    data = response.json()
    assert data['id'] == ad_sample.id
    assert data['title'] == ad_sample.title
    assert data['price'] == ad_sample.price
    assert data['first_photo'] == ad_sample.photos.values('url').first()
    assert data['photos'] == list(ad_sample.photos.values('url').all())


@pytest.mark.django_db
def test_get_ad_with_description_and_photos_success(client, ad_sample):
    response = client.get(reverse('ad-detail', args=[ad_sample.id]), data={'fields': ['photos', 'description']})

    assert response.status_code == 200

    data = response.json()
    assert data['id'] == ad_sample.id
    assert data['title'] == ad_sample.title
    assert data['description'] == ad_sample.description
    assert data['price'] == ad_sample.price
    assert data['first_photo'] == ad_sample.photos.values('url').first()
    assert data['photos'] == list(ad_sample.photos.values('url').all())


@pytest.mark.django_db
def test_get_ad_with_unknown_field_success(client, ad_sample):
    response = client.get(reverse('ad-detail', args=[ad_sample.id]), data={'fields': ['unknown']})

    assert response.status_code == 400


@pytest.mark.django_db
def test_get_ad_not_found(client):
    response = client.get(reverse('ad-detail', args=[1]))

    assert response.status_code == 404
