import React from 'react';
import { connect } from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import './Home.css';
import {searchRepos, updateSearchField} from '../actions/HomeActions';
import Paginator from '../components/Paginator';

class Home extends React.Component {
  componentDidMount() {
    const {history} = this.props;
    const searchParams = new URLSearchParams(history.location.search);

    const input = searchParams.get('q') || '';
    const page = Number.parseInt(searchParams.get('p')) || 1;
    this.props.searchReposAction(input, page, history, false);
  }

  handleSubmit(event) {
    event.preventDefault();

    const {history} = this.props;
    const {input} = this.props.home;

    this.props.searchReposAction(input, 1, history);
  }

  handleChange(event) {
    const value = event.target.value;

    this.props.updateSearchFieldAction(value);
  }

  handlePageClick(page) {
    const {history} = this.props;
    const {input} = this.props.home;

    this.props.searchReposAction(input, page, history);
  }

  renderRepoCard(item) {
    const {id, full_name, stargazers_count, updated_at, html_url} = item;
    const date = new Date(updated_at);

    return (
      <li className="home__repos-repo" key={id}>
        <div className="home__repos-repo-first-row">
          <Link to={`/repo/${full_name}`} className="home__repos-repo-name">{full_name}</Link>
          <div className="home__repos-repo-stars">{stargazers_count}</div>
        </div>
        <div className="home__repos-repo-second-row">
          <div className="home__repos-repo-last-commit">Last commit: {date.toLocaleDateString()}</div>
          <a className="home__repos-repo-link" href={html_url} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </li>
    );
  }

  render() {
    const {repos, isFetching, input, page, error} = this.props.home;

    return (
      <div className='container'>
        <div className='home'>
          <form className='home__search' onSubmit={(e) => this.handleSubmit(e)}>
            <input type='text' placeholder='Type here...' className='home__search-field'
              value={input}
              onChange={(e) => this.handleChange(e)}/>
            <button type='submit' className='home__search-button'>Search</button>
          </form>
          {error ?
            <div className="home__error">Error: {error}</div> :
            <React.Fragment>
              <div className="home__repos">
                <ul className="home__repos-list">
                  {!isFetching ?
                    (repos.items || []).map((item) => this.renderRepoCard(item)) :
                    <React.Fragment/>
                  }
                </ul>
              </div>
              {!isFetching ?
                <div className="home__paginator">
                  <Paginator
                    onPageClick={(p) => this.handlePageClick(p)}
                    active={page}
                    count={Math.ceil((repos.total_count || 0) / 10)}/>
                </div> :
                <React.Fragment/>
              }
            </React.Fragment>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  home: store.home.toObject()
});

const mapDispatchToProps = (dispatch) => ({
  searchReposAction: (input, page, history) => dispatch(searchRepos(input, page, history)),
  updateSearchFieldAction: (input) => dispatch(updateSearchField(input))
});

Home.propTypes = {
  home: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  searchReposAction: PropTypes.func.isRequired,
  updateSearchFieldAction: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Home));
