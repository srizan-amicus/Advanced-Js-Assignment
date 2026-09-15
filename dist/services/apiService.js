import { apiRequest } from "../utils/api.js";
const GITHUB_API = "https://api.github.com";
export class ApiService {
    async getUsers(since) {
        const url = since
            ? `${GITHUB_API}/users?per_page=10&since=${since}`
            : `${GITHUB_API}/users?per_page=10`;
        const result = await apiRequest(url);
        if (!result.success) {
            throw new Error(result.error);
        }
        return result.data;
    }
    async getUser(username) {
        const result = await apiRequest(`${GITHUB_API}/users/${encodeURIComponent(username)}`);
        if (!result.success) {
            throw new Error(result.error);
        }
        return result.data;
    }
    async getFollowers(username) {
        const result = await apiRequest(`${GITHUB_API}/users/${encodeURIComponent(username)}/followers`);
        if (!result.success) {
            throw new Error(result.error);
        }
        return result.data;
    }
    async getRepositories(username) {
        const result = await apiRequest(`${GITHUB_API}/users/${encodeURIComponent(username)}/repos`);
        if (!result.success) {
            throw new Error(result.error);
        }
        return result.data;
    }
    async searchRepositories(query, page, perPage) {
        const url = `${GITHUB_API}/search/repositories` +
            `?q=${encodeURIComponent(query)}` +
            `&page=${page}` +
            `&per_page=${perPage}`;
        const result = await apiRequest(url);
        if (!result.success) {
            throw new Error(result.error);
        }
        return result.data.items;
    }
}
