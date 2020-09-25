import React from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import './Repository.css';
import {fetchRepository} from '../actions/RepositoryActions';

class Repository extends React.Component {
  componentDidMount() {
    const {owner, repo} = this.props.match.params;

    this.props.fetchRepositoryAction(`${owner}/${repo}`);
  }

  render() {
    const {isFetching, repo, error} = this.props.repo;
      
    return (
      <div className="container">
        <div className="repository">
          {!isFetching ?
            (error ?
              <div className="home__error">Error: {error}</div> :
              <React.Fragment>
                <div className="repository__head">
                  <h1 className="repository__head-title">
                    <span className="repository__head-owner">{repo.owner.login}</span>
                    <span className="repository__head-slash"/>
                    <span className="repository__head-name">{repo.name}</span>
                  </h1>
                  <div className="repository__head-side">
                    <span className="repository__head-stars">{repo.stargazers_count}</span>
                    <span className="repository__head-commit-date">
                      Updated at: {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="repository__owner">
                  <div className="repository__owner-photo">
                    <img src={repo.owner.avatar_url} alt={repo.owner.login}/>
                  </div>
                  <div className="repository__owner-name">
                    <a href={repo.owner.html_url} target="_blank" rel="noopener noreferrer">{repo.owner.login}</a>
                  </div>
                </div>
                <div className="repository__languages">
                  <span className="repository__languages-title">Languages:</span>
                  <ul className="repository__languages-list">
                    {Object.keys(repo.languages)
                      .map(language => <li key={language} className="repository__languages-list-item">
                        {language}
                      </li>)}
                  </ul>
                </div>
                <div className="repository__description">{repo.description}</div>
                <div className="repository__top-contributors">
                  <span className="repository__top-contributors-title">Top-10 contributors:</span>
                  <ul className="repository__top-contributors-list">
                    {repo.contributors
                      .map(contributor =>
                        <li key={contributor.id} className="repository__top-contributors-list-item">
                          <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                            {contributor.login}
                          </a>
                        </li>
                      )}
                  </ul>
                </div>
              </React.Fragment>) :
            <React.Fragment/>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  repo: store.repository.toObject()
});

const mapDispatchToProps = (dispatch) => ({
  fetchRepositoryAction: (fullName) => dispatch(fetchRepository(fullName))
});

Repository.propTypes = {
  repo: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  fetchRepositoryAction: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Repository));
