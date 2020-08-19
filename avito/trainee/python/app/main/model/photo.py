from . import db


class Photo(db.Model):
    __tablename__ = 'photo'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    url = db.Column(db.String(512), nullable=False)

    ad_id = db.Column(db.Integer, db.ForeignKey('ad.id'))
