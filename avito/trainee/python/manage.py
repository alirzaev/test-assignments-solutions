import os

from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

from app.main import create_app
# noinspection PyUnresolvedReferences
from app.main.model import ad, photo
from app.main.model import db

app = create_app(os.getenv('FLASK_ENV', 'development'))

app.app_context().push()

manager = Manager(app)

migrate = Migrate(app, db)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
