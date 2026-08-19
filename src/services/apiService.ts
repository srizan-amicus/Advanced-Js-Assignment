import { apiRequest } from "../utils/api.js";
import {
  GitHubFollower,
  GitHubRepository,
  GitHubUser,
} from "../types/card.js";

const GITHUB_API = "https://api.github.com";

export class ApiService {
  async getUsers(): Promise<GitHubUser[]> {
    const result = await apiRequest<GitHubUser[]>(
      `${GITHUB_API}/users`,
    );

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
}