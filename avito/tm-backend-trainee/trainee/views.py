from decimal import Decimal

from django.db.models import FloatField
from django.db.models.functions import Cast
from rest_framework.decorators import api_view
from rest_framework.response import Response

from trainee.models import Stats
from trainee.serializers import SaveStatsSerializer, ShowStatsQuerySerializer, ShowStatsListItemSerializer


@api_view(['GET'])
def show(request):
    params = ShowStatsQuerySerializer(data=request.query_params)
    params.is_valid(raise_exception=True)
    data = params.validated_data

    queryset = Stats.objects.filter(
        date__gte=data['from'], date__lte=data['to']
    ).annotate(
        cpc=Cast('cost', FloatField()) / Cast('clicks', FloatField()),
        cpm=Cast('cost', FloatField()) / Cast('views', FloatField()) * 1000
    ).order_by('date')
    stats = ShowStatsListItemSerializer(queryset, many=True)

    return Response({'ok': True, 'stats': stats.data})


@api_view(['POST'])
def save(request):
    params = SaveStatsSerializer(data=request.data)
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

    return Response({'ok': True})


@api_view(['PUT'])
def reset(_):
    Stats.objects.all().delete()

    return Response({'ok': True})
