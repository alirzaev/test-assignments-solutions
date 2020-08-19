from app.main.model import db
from app.main.model.ad import Ad

ADS_PER_PAGE = 10


def get_ads(price_order, date_order, page=1):
    price_order = db.asc if price_order == 'asc' else db.desc
    date_order = db.asc if date_order == 'asc' else db.desc

    query = Ad.query.order_by(price_order(Ad.price)).order_by(date_order(Ad.date))

    return query.paginate(page=page, per_page=ADS_PER_PAGE).items


def get_ad(ad_id):
    return Ad.query.filter(Ad.id == ad_id).first()


def save_new_ad(ad):
    save_changes(ad)

    return ad.id


def save_changes(*data):
    if isinstance(data, (tuple, list, set, frozenset)):
        db.session.add_all(data)
    else:
        db.session.add(data)
    db.session.commit()
