import React from 'react';
import {DateTime, Duration} from 'luxon';
import PropTypes from 'prop-types';

import './Ticket.css';

class Ticket extends React.Component {
  renderSegment(segment) {
    const {date, duration, origin, destination, stops} = segment;

    const departure = DateTime.fromISO(date);
    const arrival = DateTime.fromISO(date).plus({minute: duration});
    const normalizedDuration = Duration.fromObject({hours: 0, minutes: duration}).normalize().toObject();

    return (
      <div className='row justify-content-center mb-3'>
        <div className='col-4'>
          <span
            className='d-block text-uppercase text-secondary'>{origin} - {destination}</span>
          <span className='d-block text-uppercase fw-bold'>
            {departure.toLocaleString(DateTime.TIME_24_SIMPLE)} - {arrival.toLocaleString(DateTime.TIME_24_SIMPLE)}
          </span>
        </div>
        <div className='col-4'>
          <span
            className='d-block text-uppercase text-secondary'>
                    В пути
          </span>
          <span className='d-block fw-bold'>
            {normalizedDuration.hours}ч {normalizedDuration.minutes}м
          </span>
        </div>
        <div className='col-4'>
          <span
            className='d-block text-uppercase text-secondary'>
            {stops.length === 0 ?
              'Без пересадок' :
              stops.length === 1 ?
                '1 пересадка' :
                `${stops.length} пересадки`
            }
          </span>
          <span className='d-block fw-bold'>
            {stops.length > 0 ? stops.reduce((prev, curr) => `${prev}, ${curr}`) : ''}
          </span>
        </div>
      </div>
    );
  }

  render() {
    const {price, carrier, segments} = this.props.ticket;

    return (
      <div className='ticket shadow'>
        <div className='row justify-content-center align-content-center mb-3'>
          <div className='col d-flex align-items-center'>
            <span className='fs-3 text-primary'>{price} Р</span>
          </div>
          <img className='col-3 career' src={`https://pics.avs.io/99/36/${carrier}.png`}
            alt={carrier}/>
        </div>
        {this.renderSegment(segments[0])}
        {this.renderSegment(segments[1])}
      </div>
    );
  }
}

Ticket.propTypes = {
  ticket: PropTypes.shape({
    price: PropTypes.number.isRequired,
    carrier: PropTypes.string.isRequired,
    segments: PropTypes.arrayOf(PropTypes.shape(
      {
        date: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        origin: PropTypes.string.isRequired,
        destination: PropTypes.string.isRequired,
        stops: PropTypes.arrayOf(PropTypes.string).isRequired,
      }
    )).isRequired,
  })
};

export default Ticket;
