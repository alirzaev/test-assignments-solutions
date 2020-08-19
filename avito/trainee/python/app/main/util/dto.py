from marshmallow import Schema, fields, validate, post_load

from app.main.model.ad import Ad
from app.main.model.photo import Photo


class PhotoSchema(Schema):
    class Meta:
        fields = ['id', 'url']

    id = fields.Integer()

    url = fields.Url(required=True)

    @post_load
    def make_photo(self, data, **kwargs):
        return Photo(**data)


class AdSchema(Schema):
    class Meta:
        fields = ['id', 'name', 'description', 'price', 'photos', 'main_photo']

    id = fields.Integer()

    name = fields.Str(validate=validate.Length(max=200), required=True)

    description = fields.Str(validate=validate.Length(max=1000), required=True)

    price = fields.Float(validate=validate.Range(min=0.01, min_inclusive=True), required=True)

    photos = fields.List(fields.Nested(PhotoSchema), validate=validate.Length(min=1, max=3), required=True)

    main_photo = fields.Function(lambda ad: PhotoSchema().dump(ad.photos[0]))

    @post_load
    def make_ad(self, data, **kwargs):
        return Ad(**data)
