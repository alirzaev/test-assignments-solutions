from . import db


class Ad(db.Model):
    __tablename__ = 'ad'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    name = db.Column(db.String(200), nullable=False)

    description = db.Column(db.String(1000), nullable=False)

    price = db.Column(db.DECIMAL, index=True)

    date = db.Column(db.DateTime, index=True, server_default=db.func.now())

    photos = db.relationship('Photo')
