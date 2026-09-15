export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name?: string | null;
  public_repos?: number;
  followers?: number;
}

export type GitHubUserBasic = Pick<
  GitHubUser,
  "login" | "id" | "avatar_url" | "name"
>;

export interface GitHubFollower {
  login: string;
  avatar_url: string;
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  owner: {
    login: string;
  };
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export interface GitHubRepositorySearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

export type RepositoryCard = Pick<GitHubRepository,
  "name" | "description" | "stargazers_count" | "language" | "html_url"> &
  {
    ownerLogin:string;
  }

export type UserCard = Omit<GitHubUserBasic, "avatar_url"> & {
  avatar: string;
};