from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import filters, mixins, viewsets

from .models import Ad
from .serializers import AdSerializer, CreateAdSerializer, FieldsSerializer


@extend_schema_view(
    list=extend_schema(
        summary='Get a paginated list of ads',
        tags=['ad'],
        auth=[{}]
    ),
    create=extend_schema(
        summary='Create a new ad',
        tags=['ad'],
        auth=[{}]
    ),
    retrieve=extend_schema(
        summary='Get an ad by ID',
        tags=['ad'],
        auth=[{}],
        parameters=[
            FieldsSerializer,
        ]
    )
)
class AdViewSet(mixins.CreateModelMixin,
                mixins.ListModelMixin,
                mixins.RetrieveModelMixin,
                viewsets.GenericViewSet):
    filter_backends = (filters.OrderingFilter,)

    ordering_fields = ('price', 'created_at',)

    queryset = Ad.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateAdSerializer
        else:
            return AdSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()

        if self.action == 'retrieve':
            params = FieldsSerializer(data=self.request.query_params)
            params.is_valid(raise_exception=True)

            context['fields'] = params.validated_data['fields']
        
        return context
