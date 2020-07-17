import os

BASEDIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASEDIR, '../../db.sqlite')


class ProdConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI')


config_by_name = dict(
    development=DevelopmentConfig,
    production=ProdConfig
)
