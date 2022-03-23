import axios from "axios";

import {
  Repository,
  RepositoryContributor,
  RepositoryExtended,
  RepositoryLanguages,
  SearchParams,
  SearchResults,
} from "./types";

export async function searchGitHubRepositories(
  input: string,
  page: number
): Promise<SearchResults> {
  let params: SearchParams;

  if (input !== "") {
    params = {
      q: input,
      sort: "stars",
      order: "desc",
      per_page: 10,
      page: page,
    };
  } else {
    params = {
      q: "stars:>=1",
      order: "desc",
      per_page: 10,
      page: page,
    };
  }

  const response = await axios.get<SearchResults>(
    "https://api.github.com/search/repositories",
    { params }
  );

  return response.data;
}

export async function getGitHubRepository(
  fullName: string
): Promise<RepositoryExtended> {
  const repo = await axios.get<Repository>(
    `https://api.github.com/repos/${fullName}`
  );
  const languages = await axios.get<RepositoryLanguages>(
    `https://api.github.com/repos/${fullName}/languages`
  );
  const contributors = await axios.get<RepositoryContributor[]>(
    `https://api.github.com/repos/${fullName}/contributors`,
    { params: { per_page: 10 } }
  );

  return {
    ...repo.data,
    languages: languages.data,
    contributors: contributors.data,
  };
}
