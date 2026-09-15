import { apiRequest } from "../utils/api.js";
import {
  GitHubFollower,
  GitHubRepository,
  GitHubRepositorySearchResponse,
  GitHubUser,
} from "../types/card.js";

const GITHUB_API = "https://api.github.com";

export class ApiService {
async getUsers(since?: number): Promise<GitHubUser[]> {
  const url = since
    ? `${GITHUB_API}/users?per_page=10&since=${since}`
    : `${GITHUB_API}/users?per_page=10`;

  const result = await apiRequest<GitHubUser[]>(url);

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}


  async getUser(username: string): Promise<GitHubUser> {
    const result = await apiRequest<GitHubUser>(
      `${GITHUB_API}/users/${encodeURIComponent(username)}`,
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  }

  async getFollowers(username: string): Promise<GitHubFollower[]> {
    const result = await apiRequest<GitHubFollower[]>(
      `${GITHUB_API}/users/${encodeURIComponent(username)}/followers`,
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  }

  async getRepositories(
    username: string,
  ): Promise<GitHubRepository[]> {
    const result = await apiRequest<GitHubRepository[]>(
      `${GITHUB_API}/users/${encodeURIComponent(username)}/repos`,
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  }

  async searchRepositories(
  query: string,
  page: number,
  perPage: number,
): Promise<GitHubRepository[]> {
  const url =
    `${GITHUB_API}/search/repositories` +
    `?q=${encodeURIComponent(query)}` +
    `&page=${page}` +
    `&per_page=${perPage}`;

  const result =
    await apiRequest<GitHubRepositorySearchResponse>(url);

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data.items;
}
}