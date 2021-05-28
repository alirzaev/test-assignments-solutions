import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setSortOrder } from '../actions';
import SortOrder from '../enum/SortOrder';

class Sort extends React.Component {
  updateSortOrder(event) {
    this.props.setSortOrder(event.target.value);
  }

  render() {
    const { order } = this.props;

    return (
      <div className="w-100 btn-group">
        <input
          type="radio"
          className="btn-check"
          name="order"
          id="cheapest"
          autoComplete="off"
          onChange={(event) => this.updateSortOrder(event)}
          value={SortOrder.CHEAPEST}
          checked={order === SortOrder.CHEAPEST}
        />
        <label className="btn btn-outline-primary" htmlFor="cheapest">Самый дешевый</label>

        <input
          type="radio"
          className="btn-check"
          name="order"
          id="fastest"
          autoComplete="off"
          onChange={(event) => this.updateSortOrder(event)}
          value={SortOrder.FASTEST}
          checked={order === SortOrder.FASTEST}
        />
        <label className="btn btn-outline-primary" htmlFor="fastest">Самый быстрый</label>
      </div>
    );
  }
}

const mapStateToProps = ({ filters }) => ({
  order: filters.order,
});

const mapDispatchToProps = (dispatch) => ({
  setSortOrder: (order) => dispatch(setSortOrder(order)),
});

Sort.propTypes = {
  order: PropTypes.string.isRequired,
  setSortOrder: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sort);
