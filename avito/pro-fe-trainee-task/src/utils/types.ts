export interface RepositoryOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface RepositoryContributor {
  login: string;
  id: number;
  html_url: string;
}

export type RepositoryLanguages = Record<string, number>;

export interface RepositoryShort {
  id: number;
  full_name: string;
  html_url: string;
  updated_at: string;
  stargazers_count: number;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: RepositoryOwner;
  html_url: string;
  description: string;
  updated_at: string;
  stargazers_count: number;
}

export interface RepositoryExtended extends Repository {
  languages: RepositoryLanguages;
  contributors: RepositoryContributor[];
}

export interface SearchParams {
  q: string;
  sort?: string;
  order: string;
  per_page: number;
  page: number;
}

export interface SearchResults {
  total_count: number;
  incomplete_results: boolean;
  items: RepositoryShort[];
}
