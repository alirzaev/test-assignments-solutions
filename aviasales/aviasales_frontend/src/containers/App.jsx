import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Stops from '../components/Stops';
import Sort from '../components/Sort';
import Ticket from '../components/Ticket';
import {fetchTickets, showMoreTickets} from '../actions';

import './App.css';

class App extends React.Component {
  componentDidMount() {
    this.props.fetchTickets();
  }

  renderTicketsList() {
    const {isFetching, filtered, shown, showMoreTickets} = this.props;

    if (isFetching) {
      return (
        <div className="mt-3 mb-3 row justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className='mt-3 mb-3'>
          <h2 className='d-none'>Билеты</h2>
          {filtered.slice(0, shown).map((ticket, index) => (<Ticket ticket={ticket} key={index}/>))}
        </div>
        {shown <= filtered.length ?
          <div className='d-flex justify-content-center'>
            <button type="button" className="btn btn-primary m-auto"
              onClick={() => showMoreTickets()}
            >Показать еще 5 билетов</button>
          </div> :
          <React.Fragment/>
        }
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="container">
        <header className="header">
          <h1 className='text-center pt-2 pb-2'>Aviasales</h1>
        </header>
        <main>
          <div className='row justify-content-center'>
            <div className='col-md-3 col-sm-12'>
              <Stops/>
            </div>
            <div className='col-md-9 col-sm-12 mb-3'>
              <Sort/>
              {this.renderTicketsList()}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = ({filters, tickets}) => ({
  stops: new Set(filters.stops),
  order: filters.order,
  filtered: tickets.filtered,
  shown: tickets.shown,
  isFetching: tickets.isFetching
});

const mapDispatchToProps = (dispatch) => ({
  fetchTickets: () => dispatch(fetchTickets()),
  showMoreTickets: () => dispatch(showMoreTickets())
});

App.propTypes = {
  order: PropTypes.string.isRequired,
  stops: PropTypes.instanceOf(Set).isRequired,
  filtered: PropTypes.array.isRequired,
  shown: PropTypes.number.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchTickets: PropTypes.func.isRequired,
  showMoreTickets: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
