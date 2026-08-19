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
  "login" | "id" | "avatar_url"
>;

export interface GitHubFollower {
  login: string;
  avatar_url: string;
}

export interface GitHubRepository {
  name: string;
  description: string | null;
}

export type UserCard = Omit<GitHubUserBasic, "avatar_url"> & {
  avatar: string;
};