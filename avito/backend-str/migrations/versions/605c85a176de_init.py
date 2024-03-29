"""init

Revision ID: 605c85a176de
Revises: 
Create Date: 2021-11-23 10:54:36.997837

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '605c85a176de'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('room',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(length=200), nullable=False),
    sa.Column('price', sa.DECIMAL(), nullable=False),
    sa.Column('created_at', sa.Date(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_room_created_at'), 'room', ['created_at'], unique=False)
    op.create_index(op.f('ix_room_price'), 'room', ['price'], unique=False)
    op.create_table('booking',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('begin_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.Column('room_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['room_id'], ['room.id'], ondelete='cascade'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_booking_begin_date'), 'booking', ['begin_date'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_booking_begin_date'), table_name='booking')
    op.drop_table('booking')
    op.drop_index(op.f('ix_room_price'), table_name='room')
    op.drop_index(op.f('ix_room_created_at'), table_name='room')
    op.drop_table('room')
    # ### end Alembic commands ###
