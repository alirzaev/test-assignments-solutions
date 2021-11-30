from decimal import Decimal

from django.db.models import FloatField
from django.db.models.functions import Cast
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter, OpenApiResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Stats
from .serializers import AggregatedStatsSerializer, StatsQueryParamsSerializer, StatsSerializer


@extend_schema(
    summary='Show stats',
    tags=['stats'],
    auth=[{}],
        parameters=[
            OpenApiParameter(
                name='from',
                description='The start date of the period.',
                type=OpenApiTypes.DATE
            ),
            OpenApiParameter(
                name='to',
                description='The end date of the period.',
                type=OpenApiTypes.DATE
            )
        ],
    responses={
        200: OpenApiResponse(
            response=AggregatedStatsSerializer(many=True),
            examples=[
                OpenApiExample(
                    name='A valid output example',
                    value=[
                        {
                            "date": "2021-01-01",
                            "views": 10,
                            "clicks": 50,
                            "cost": "100.50",
                            "cpc": 2.01,
                            "cpm": 10050.0
                        }
                    ],
                    response_only=True
                )
            ]
        )
    },
)
@api_view(['GET'])
def show(request):
    params = StatsQueryParamsSerializer(data=request.query_params)
    params.is_valid(raise_exception=True)
    data = params.validated_data

    queryset = Stats.objects.filter(
        date__gte=data['from'], date__lte=data['to']
    ).annotate(
        cpc=Cast('cost', FloatField()) / Cast('clicks', FloatField()),
        cpm=Cast('cost', FloatField()) / Cast('views', FloatField()) * 1000
    ).order_by('date')
    stats = AggregatedStatsSerializer(queryset, many=True)

    return Response(stats.data)


@extend_schema(
    summary='Save stats',
    tags=['stats'],
    auth=[{}],
    request=StatsSerializer,
    responses={
        201: OpenApiResponse(
            response=None
        )
    },
    examples=[
        OpenApiExample(
            name='A valid input example',
            value={
                'date': '2021-01-01',
                'clicks': 5,
                'views': 10,
                'cost': 10.50
            },
            request_only=True
        )
    ]
)
@api_view(['POST'])
def save(request):
    params = StatsSerializer(data=request.data)
    params.is_valid(raise_exception=True)
    data = params.validated_data

    stats, created = Stats.objects.get_or_create(
        date=data['date'],
        defaults=data
    )

    if not created:
        stats.views += data['views']
        stats.clicks += data['clicks']
        stats.cost += Decimal(data['cost'])

        stats.save()

    return Response(status=201)


@extend_schema(
    summary='Reset stats',
    tags=['stats'],
    auth=[{}],
    responses={
        204: OpenApiResponse(
            response=None
        )
    }
)
@api_view(['PUT'])
def reset(_):
    Stats.objects.all().delete()

    return Response(status=204)
