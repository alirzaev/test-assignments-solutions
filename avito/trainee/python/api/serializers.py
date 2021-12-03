from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.utils.formatting import lazy_format

from .models import Ad, Photo


FIELDS = ('photos', 'description',)


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo

        fields = ('url',)


class AdSerializer(serializers.ModelSerializer):
    price = serializers.FloatField()

    first_photo = serializers.SerializerMethodField()

    photos = PhotoSerializer(many=True, required=False)

    class Meta:
        model = Ad

        fields = ('id', 'title', 'description', 'price', 'created_at', 'first_photo', 'photos',)
    
    def __init__(self, *args, **kwargs):
        '''
        Drop optional fields not presented in the 'fields' query parameter
        '''
        super().__init__(*args, **kwargs)
        
        fields_ = kwargs.get('context', dict()).get('fields', set())
        for field in FIELDS:
            if field not in fields_:
                self.fields.pop(field)
    
    @extend_schema_field(field=PhotoSerializer)
    def get_first_photo(self, obj):
        photo = obj.photos.first()

        if photo is None:
            return None
        else:
            return PhotoSerializer(photo).data


class CreateAdSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, allow_empty=False)

    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=1.00)

    class Meta:
        model = Ad

        fields = ('id', 'title', 'description', 'price', 'photos',)
    
    def validate_photos(self, value):
        if len(value) > 3:
            raise serializers.ValidationError(
                lazy_format(_('Ensure this field has no more than {max_length} elements.'), max_length=3)
            )
        
        return value
    
    def create(self, validated_data):
        photos = validated_data.pop('photos')

        ad = Ad.objects.create(**validated_data)
        for photo in photos:
            Photo.objects.create(url=photo['url'], ad=ad)
        
        return ad


class FieldsSerializer(serializers.Serializer):
    fields = serializers.MultipleChoiceField(choices=FIELDS, allow_blank=True, required=False)
