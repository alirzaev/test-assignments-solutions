import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { searchRepos, setSearchField } from "../../store/slices/searchSlice";
import Paginator from "../../components/Paginator";

import "./index.css";

export default function Search() {
  const { repos, isFetching, input, page, error } = useAppSelector(
    (state) => state.search
  );
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const input = searchParams.get("q") ?? "";
    const page = searchParams.get("p") ?? "1";

    dispatch(searchRepos({ input, page: +page }));
  }, [dispatch, searchParams]);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSearchParams([
      ["q", input],
      ["p", "1"],
    ]);
  };

  const setInput = (value: string) => {
    dispatch(setSearchField(value));
  };

  const setPage = (page: number) => {
    setSearchParams([
      ["q", input],
      ["p", `${page}`],
    ]);
  };

  return (
    <div className="container">
      <div className="home">
        <form className="home__search" onSubmit={submitForm}>
          <input
            type="text"
            placeholder="Type here..."
            className="home__search-field"
            value={input}
            onChange={({ target }) => setInput(target.value)}
          />
          <button type="submit" className="home__search-button">
            Search
          </button>
        </form>
        {error ? (
          <div className="home__error">Error: {error}</div>
        ) : (
          !isFetching && (
            <React.Fragment>
              <div className="home__repos">
                <ul className="home__repos-list">
                  {(repos.items || []).map((repo) => (
                    <li className="home__repos-repo" key={repo.id}>
                      <div className="home__repos-repo-first-row">
                        <Link
                          to={`/repo/${repo.full_name}`}
                          className="home__repos-repo-name"
                        >
                          {repo.full_name}
                        </Link>
                        <div className="home__repos-repo-stars">
                          {repo.stargazers_count}
                        </div>
                      </div>
                      <div className="home__repos-repo-second-row">
                        <div className="home__repos-repo-last-commit">
                          Last commit:{" "}
                          {new Date(repo.updated_at).toLocaleDateString()}
                        </div>
                        <a
                          className="home__repos-repo-link"
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="home__paginator">
                <Paginator
                  onPageClick={setPage}
                  active={page}
                  count={Math.ceil((repos.total_count ?? 0) / 10)}
                />
              </div>
            </React.Fragment>
          )
        )}
      </div>
    </div>
  );
}
