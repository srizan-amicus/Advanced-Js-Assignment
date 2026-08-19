const username = getUsername();
const skeleton = document.getElementById("profile-skeleton");
const content = document.getElementById("profile-content");
const errorState = document.getElementById("profile-error");

function getUsername() {
  return new URLSearchParams(window.location.search).get("username");
}

async function fetchProfile(profileUsername) {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(profileUsername)}`);
  if (!response.ok) throw new Error("Could not load profile");
  return response.json();
}

async function fetchFollowers(profileUsername) {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(profileUsername)}/followers`);
  if (!response.ok) throw new Error("Could not load followers");
  return response.json();
}

async function fetchRepositories(profileUsername) {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(profileUsername)}/repos`);
  if (!response.ok) throw new Error("Could not load repositories");
  return response.json();
}

function showProfileSkeleton() {
  skeleton.classList.remove("hidden");
  content.classList.add("hidden");
  errorState.classList.add("hidden");
}

function hideProfileSkeleton() {
  skeleton.classList.add("hidden");
}

function renderProfile(profile) {
  document.getElementById("profile-avatar").src = profile.avatar_url;
  document.getElementById("profile-avatar").alt = profile.login;
  document.getElementById("profile-username").textContent = profile.login;
  document.getElementById("profile-id").textContent = `ID · ${profile.id}`;
  document.getElementById("followers-count").textContent = profile.followers;
  document.getElementById("repos-count").textContent = profile.public_repos;
}

function renderFollowers(followers) {
  const container = document.getElementById("followers-container");
  const firstFive = followers.slice(0, 5);
  container.innerHTML = firstFive.length
    ? firstFive.map((follower) => `<div class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3"><img src="${follower.avatar_url}" alt="${follower.login}" class="h-10 w-10 rounded-xl" /><p class="truncate text-sm font-medium">${follower.login}</p></div>`).join("")
    : '<p class="text-sm text-zinc-500">No followers found.</p>';
}

function renderRepositories(repositories) {
  const container = document.getElementById("repos-container");
  const firstFive = repositories.slice(0, 5);
  container.innerHTML = firstFive.length
    ? firstFive.map((repo) => `<div class="rounded-2xl border border-white/5 bg-white/[0.03] p-4"><h3 class="truncate text-sm font-semibold">${repo.name}</h3><p class="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">${repo.description || "No description available."}</p></div>`).join("")
    : '<p class="text-sm text-zinc-500">No repositories found.</p>';
}

function showProfileError() {
  errorState.classList.remove("hidden");
}

async function loadProfile() {
  if (!username) {
    hideProfileSkeleton();
    showProfileError();
    return;
  }

  showProfileSkeleton();

  try {
    const profile = await fetchProfile(username);
    const [followers, repositories] = await Promise.all([
      fetchFollowers(username),
      fetchRepositories(username),
    ]);

    renderProfile(profile);
    renderFollowers(followers);
    renderRepositories(repositories);
    hideProfileSkeleton();
    content.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    hideProfileSkeleton();
    showProfileError();
  }
}

loadProfile();
