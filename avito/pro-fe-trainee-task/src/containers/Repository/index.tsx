import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchRepository } from "../../store/slices/repositorySlice";

import "./index.css";

export default function Repository() {
  const params = useParams();
  const { isFetching, repo, error } = useAppSelector(
    (state) => state.reposiory
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { owner, repo } = params;

    dispatch(fetchRepository(`${owner}/${repo}`));
  }, [dispatch, params]);

  return (
    <div className="container">
      <div className="repository">
        {!isFetching &&
          (error || !repo ? (
            <div className="home__error">Error: {error}</div>
          ) : (
            <React.Fragment>
              <div className="repository__head">
                <h1 className="repository__head-title">
                  <span className="repository__head-owner">
                    {repo.owner.login}
                  </span>
                  <span className="repository__head-slash" />
                  <span className="repository__head-name">{repo.name}</span>
                </h1>
                <div className="repository__head-side">
                  <span className="repository__head-stars">
                    {repo.stargazers_count}
                  </span>
                  <span className="repository__head-commit-date">
                    Updated at: {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="repository__owner">
                <div className="repository__owner-photo">
                  <img src={repo.owner.avatar_url} alt={repo.owner.login} />
                </div>
                <div className="repository__owner-name">
                  <a
                    href={repo?.owner.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo?.owner.login}
                  </a>
                </div>
              </div>
              <div className="repository__languages">
                <span className="repository__languages-title">Languages:</span>
                <ul className="repository__languages-list">
                  {Object.keys(repo.languages).map((language) => (
                    <li
                      key={language}
                      className="repository__languages-list-item"
                    >
                      {language}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="repository__description">{repo.description}</div>
              <div className="repository__top-contributors">
                <span className="repository__top-contributors-title">
                  Top-10 contributors:
                </span>
                <ul className="repository__top-contributors-list">
                  {repo.contributors.map((contributor) => (
                    <li
                      key={contributor.id}
                      className="repository__top-contributors-list-item"
                    >
                      <a
                        href={contributor.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {contributor.login}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}
