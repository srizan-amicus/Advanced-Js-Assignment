import { apiRequest } from "../utils/api.js";
const GITHUB_API = "https://api.github.com";
export class ApiService {
    async getUsers() {
        const result = await apiRequest(`${GITHUB_API}/users`);
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
}
