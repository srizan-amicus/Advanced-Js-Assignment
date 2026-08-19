import { ApiService } from "./services/apiService.js";
import {
  GitHubFollower,
  GitHubRepository,
  GitHubUser,
} from "./types/card.js";

const apiService = new ApiService();

// DOM elements
const profileSkeleton = document.getElementById("profile-skeleton");
const profileContent = document.getElementById("profile-content");
const profileError = document.getElementById("profile-error");

const profileAvatar = document.getElementById(
  "profile-avatar",
) as HTMLImageElement;

const profileUsername = document.getElementById(
  "profile-username",
) as HTMLElement;

const profileId = document.getElementById("profile-id") as HTMLElement;

const followersCount = document.getElementById(
  "followers-count",
) as HTMLElement;

const reposCount = document.getElementById(
  "repos-count",
) as HTMLElement;

const followersContainer = document.getElementById(
  "followers-container",
) as HTMLElement;

const reposContainer = document.getElementById(
  "repos-container",
) as HTMLElement;

// Get username from URL
function getUsername(): string | null {
  return new URLSearchParams(window.location.search).get("username");
}

// Loading state
function showProfileSkeleton(): void {
  profileSkeleton?.classList.remove("hidden");
  profileContent?.classList.add("hidden");
  profileError?.classList.add("hidden");
}

function hideProfileSkeleton(): void {
  profileSkeleton?.classList.add("hidden");
}

// Error state
function showProfileError(): void {
  profileError?.classList.remove("hidden");
}

// Render profile
function renderProfile(profile: GitHubUser): void {
  profileAvatar.src = profile.avatar_url;
  profileAvatar.alt = profile.login;

  profileUsername.textContent = profile.login;
  profileId.textContent = `ID · ${profile.id}`;

  followersCount.textContent = String(profile.followers ?? 0);
  reposCount.textContent = String(profile.public_repos ?? 0);
}

// Render followers
function renderFollowers(followers: GitHubFollower[]): void {
  const firstFive = followers.slice(0, 5);

  followersContainer.innerHTML = firstFive.length
    ? firstFive
        .map(
          (follower) => `
            <div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <img
                src="${follower.avatar_url}"
                alt="${follower.login}"
                class="h-10 w-10 rounded-xl"
              />

              <p class="truncate text-sm font-medium">
                ${follower.login}
              </p>
            </div>
          `,
        )
        .join("")
    : '<p class="text-sm text-zinc-500">No followers found.</p>';
}

// Render repositories
function renderRepositories(
  repositories: GitHubRepository[],
): void {
  const firstFive = repositories.slice(0, 5);

  reposContainer.innerHTML = firstFive.length
    ? firstFive
        .map(
          (repo) => `
            <div class="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <h3 class="truncate text-sm font-semibold">
                ${repo.name}
              </h3>

              <p class="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                ${repo.description || "No description available."}
              </p>
            </div>
          `,
        )
        .join("")
    : '<p class="text-sm text-zinc-500">No repositories found.</p>';
}

// Load profile
async function loadProfile(): Promise<void> {
  const username = getUsername();

  if (!username) {
    hideProfileSkeleton();
    showProfileError();
    return;
  }

  showProfileSkeleton();

  try {
    const profile = await apiService.getUser(username);

    renderProfile(profile);

    const [followersResult, repositoriesResult] =
      await Promise.allSettled([
        apiService.getFollowers(username),
        apiService.getRepositories(username),
      ]);

    if (followersResult.status === "fulfilled") {
      renderFollowers(followersResult.value);
    } else {
      followersContainer.innerHTML =
        '<p class="text-sm text-red-400">Could not load followers.</p>';
      console.error("Followers request failed:", followersResult.reason);
    }

    if (repositoriesResult.status === "fulfilled") {
      renderRepositories(repositoriesResult.value);
    } else {
      reposContainer.innerHTML =
        '<p class="text-sm text-red-400">Could not load repositories.</p>';
      console.error(
        "Repositories request failed:",
        repositoriesResult.reason,
      );
    }

    profileContent?.classList.remove("hidden");
  } catch (error) {
    console.error("Profile request failed:", error);
    showProfileError();
  } finally {
    hideProfileSkeleton();
  }
}

loadProfile();