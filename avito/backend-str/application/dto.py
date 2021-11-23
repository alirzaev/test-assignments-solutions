import datetime

from pydantic import BaseModel, Field, root_validator
from pydantic.types import condecimal, constr


class Message(BaseModel):
    detail: str = Field(..., example='NOT_FOUND')


class RoomIn(BaseModel):
    description: constr(min_length=5, max_length=200) = Field(..., example='Double room')

    price: condecimal(ge=1.00, max_digits=9, decimal_places=2) = Field(..., example=100.00)


class RoomCreated(BaseModel):
    id: int = Field(..., example=1)

    class Config:
        orm_mode = True


class RoomOut(RoomCreated, RoomIn):
    price: float = Field(..., example=100.00) # sqlite has some problems with decimals

    created_at: datetime.date = Field(..., example=datetime.date(2021, 1, 1))

    class Config:
        orm_mode = True


class BookingIn(BaseModel):
    begin_date: datetime.date = Field(..., example=datetime.date(2021, 1, 1))

    end_date: datetime.date = Field(..., example=datetime.date(2021, 1, 7))

    room_id: int = Field(..., example=1)

    @root_validator
    def validate_dates(cls, values):
        if 'begin_date' not in values or 'end_date' not in values:
            return values
        
        begin_date = values['begin_date']
        end_date = values['end_date']

        if begin_date > end_date:
            raise ValueError('begin_date must be less than or equal to end_date')
        
        return values


class BookingCreated(BaseModel):
    id: int = Field(..., example=1)
    
    class Config:
        orm_mode = True


class BookingOut(BookingCreated, BookingIn):
    class Config:
        orm_mode = True
