from flask import Flask, Blueprint
from flask_restplus import Api

from .config import config_by_name
from .controller import ad_controller
from .model import db


def create_app(config_name):
    app = Flask(__name__)

    app.config.from_object(config_by_name[config_name])
    db.init_app(app)

    api_blueprint = Blueprint('api', __name__)
    api = Api(api_blueprint,
              title='RESTful service for publishing ads',
              version='0.1.0',
              )

    api.add_namespace(ad_controller.api, path='/ad')

    app.register_blueprint(api_blueprint)

    return app
