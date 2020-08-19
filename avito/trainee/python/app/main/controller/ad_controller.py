from flask import request
from flask_restplus import Resource, reqparse, inputs, Namespace
from marshmallow import ValidationError

from ..service.ad_service import save_new_ad, get_ads, get_ad
from ..util.dto import AdSchema

api = Namespace('ad')

ad_list_parser = reqparse.RequestParser()
ad_list_parser.add_argument('price_order', type=inputs.regex('(asc|desc)'), default='desc', location='args')
ad_list_parser.add_argument('date_order', type=inputs.regex('(asc|desc)'), default='desc', location='args')
ad_list_parser.add_argument('page', type=int, default=1, location='args')

ad_parser = reqparse.RequestParser()
ad_parser.add_argument('fields', type=inputs.regex(r'[a-z_]*'), default='', location='args')


@api.route('/')
class AdList(Resource):
    @api.expect(ad_list_parser)
    def get(self):
        args = ad_list_parser.parse_args()
        ads = get_ads(args['price_order'], args['date_order'], args['page'])

        return AdSchema(only=('id', 'name', 'price', 'main_photo')).dump(ads, many=True)

    @api.response(201, 'Ad created')
    def post(self):
        data = request.get_json()
        try:
            ad = AdSchema().load(data)
            return save_new_ad(ad), 201
        except ValidationError as ex:
            api.abort(500, ex.messages)


@api.route('/<ad_id>')
class Ad(Resource):
    @api.expect(ad_parser)
    def get(self, ad_id):
        ad = get_ad(ad_id)
        if ad is None:
            api.abort(404, 'Ad not found')

        args = ad_parser.parse_args()
        requested_fields = args['fields'].split('_')
        allowed_fields = ('description', 'photos')
        fields = ['id', 'name', 'price', 'main_photo'] + [f for f in requested_fields if f in allowed_fields]

        return AdSchema(only=fields).dump(ad)
