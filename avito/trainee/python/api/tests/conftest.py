import pytest
from rest_framework.test import APIClient


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def ad_sample_input():
    return {
        'title': "Ad's name",
        'description': "Ad's description",
        'price': 100,
        'photos': [
            {
                'url': 'http://1example.com/1.jpg'
            },
            {
                'url': 'http://example.com/2.jpg'
            }
        ]
    }
