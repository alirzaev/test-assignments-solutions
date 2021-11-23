import os


class Config:
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/postgres')


class ProdConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL')


class TestConfig(DevelopmentConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URL = os.getenv('DATABASE_URL')


def get_config():
    config_by_name = dict(
        development=DevelopmentConfig,
        production=ProdConfig,
        test=TestConfig
    )

    return config_by_name[os.getenv('CONFIG', 'development')]
