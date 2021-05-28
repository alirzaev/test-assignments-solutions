import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {setStopsCount} from '../actions';

class Stops extends React.Component {
  updateStops(stop, event) {
    const stops = new Set([...this.props.stops.values()]);

    if (event.target.checked) {
      stops.add(stop);
    } else {
      stops.delete(stop);
    }

    this.props.setStopsCount(stops);
  }

  toggleAllStops(event) {
    if (event.target.checked) {
      this.props.setStopsCount(new Set([0, 1, 2, 3]));
    } else {
      this.props.setStopsCount(new Set());
    }
  }

  render() {
    const {stops, all} = this.props;

    return (
      <form>
        <fieldset>
          <legend className='text-uppercase'>Количество пересадок</legend>

          <div className='form-check mb-3'>
            <input className='form-check-input' type='checkbox' id='all'
              onChange={(event) => this.toggleAllStops(event)}
              checked={all}
            />
            <label className='form-check-label' htmlFor='all'>Все</label>
          </div>

          <div className='form-check mb-3'>
            <input className='form-check-input' type='checkbox' id='zero'
              onChange={(event) => this.updateStops(0, event)}
              checked={stops.has(0)}
            />
            <label className='form-check-label' htmlFor='zero'>Без пересадок</label>
          </div>

          <div className='form-check mb-3'>
            <input className='form-check-input' type='checkbox' id='one'
              onChange={(event) => this.updateStops(1, event)}
              checked={stops.has(1)}/>
            <label className='form-check-label' htmlFor='one'>1 пересадка</label>
          </div>

          <div className='form-check mb-3'>
            <input className='form-check-input' type='checkbox' id='two'
              onChange={(event) => this.updateStops(2, event)}
              checked={stops.has(2)}/>
            <label className='form-check-label' htmlFor='two'>2 пересадки</label>
          </div>

          <div className='form-check mb-3'>
            <input className='form-check-input' type='checkbox' id='three'
              onChange={(event) => this.updateStops(3, event)}
              checked={stops.has(3)}/>
            <label className='form-check-label' htmlFor='three'>3 пересадки</label>
          </div>
        </fieldset>
      </form>
    );
  }
}

const mapStateToProps = ({filters}) => ({
  stops: new Set(filters.stops),
  all: filters.stops.length === 4,
});

const mapDispatchToProps = (dispatch) => ({
  setStopsCount: (stops) => dispatch(setStopsCount(stops))
});

Stops.propTypes = {
  stops: PropTypes.instanceOf(Set).isRequired,
  all: PropTypes.bool.isRequired,
  setStopsCount: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Stops);
