from sqlalchemy import Column, Date, DECIMAL, ForeignKey, Integer, String, func

from . import Base


class Room(Base):
    __tablename__ = 'room'

    id = Column(Integer, primary_key=True)

    description = Column(String(200), nullable=False)

    price = Column(DECIMAL, nullable=False, index=True)

    created_at = Column(Date, server_default=func.now(), nullable=False, index=True)


class Booking(Base):
    __tablename__ = 'booking'

    id = Column(Integer, primary_key=True)

    begin_date = Column(Date, nullable=False, index=True)

    end_date = Column(Date, nullable=False)

    room_id = Column(Integer, ForeignKey('room.id', ondelete='cascade'))
