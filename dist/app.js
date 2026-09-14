import { ApiService } from "./services/apiService.js";
// API SERVICE
const apiService = new ApiService();
// STATE
let transformedUsers = [];
let filteredUsers = [];
let currentPage = 1;
let hasNextPage = true;
let lastUserId = null;
const usersPerPage = 10;
// DOM ELEMENTS
const input = document.getElementById("input");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageNumber = document.getElementById("page-number");
const usersContainer = document.getElementById("users-container");
const loading = document.getElementById("loading");
const usersCount = document.getElementById("users-count");
// LOADING UI
function showLoading() {
    loading.innerHTML = `
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      ${Array.from({ length: 6 })
        .map(() => `
            <div class="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div class="h-20 w-20 rounded-2xl bg-white/10"></div>

              <div class="mt-6 h-3 w-20 rounded bg-white/10"></div>

              <div class="mt-2 h-6 w-32 rounded bg-white/10"></div>

              <div class="mt-2 h-4 w-16 rounded bg-white/10"></div>

              <div class="mt-6 h-11 rounded-xl bg-white/10"></div>
            </div>
          `)
        .join("")}
    </div>
  `;
}
// ERROR UI
function showError() {
    loading.innerHTML = "";
    usersContainer.innerHTML = `
    <div class="col-span-full rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
      <p class="text-lg font-semibold text-red-400">
        Could not load users
      </p>

      <p class="mt-2 text-sm text-zinc-500">
        Something went wrong while fetching GitHub users.
      </p>
    </div>
  `;
}
//picking only the field required for cards
function transformUser(user) {
    return {
        login: user.login,
        id: user.id,
        name: user.name,
        avatar: user.avatar_url,
    };
}
// searching
function applySearch(event) {
    const target = event.currentTarget;
    const searchTerm = target.value.trim().toLowerCase();
    filteredUsers = transformedUsers.filter((user) => user.login.toLowerCase().includes(searchTerm) ||
        user.name?.toLowerCase().includes(searchTerm));
    renderUsers(filteredUsers);
}
// PAGINATION
async function goToNextPage(event) {
    event.preventDefault();
    if (!hasNextPage || lastUserId === null) {
        return;
    }
    showLoading();
    try {
        const users = await apiService.getUsers(lastUserId);
        hasNextPage = users.length === usersPerPage;
        if (users.length > 0) {
            lastUserId = users[users.length - 1].id;
        }
        currentPage++;
        pageNumber.textContent = String(currentPage);
        transformedUsers = users.map(transformUser);
        filteredUsers = transformedUsers;
        renderUsers(filteredUsers);
    }
    catch (error) {
        console.error("Failed to load next page:", error);
        showError();
    }
}
//previous page pagination logic
async function goToPreviousPage(event) {
    event.preventDefault();
    if (currentPage <= 1) {
        return;
    }
    currentPage--;
    pageNumber.textContent = String(currentPage);
    showLoading();
    try {
        const users = await apiService.getUsers(currentPage);
        hasNextPage = users.length === usersPerPage;
        transformedUsers = users.map(transformUser);
        filteredUsers = transformedUsers;
        renderUsers(filteredUsers);
    }
    catch (error) {
        console.error("Failed to load previous page:", error);
        showError();
    }
}
// RENDER USERS
function renderUsers(users) {
    usersCount.textContent = `${users.length} users`;
    loading.innerHTML = "";
    usersContainer.innerHTML = "";
    const paginatedUsers = users;
    // No results
    if (paginatedUsers.length === 0) {
        usersContainer.innerHTML = `
      <div class="col-span-full rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
        <p class="text-lg font-semibold text-white">
          No users found
        </p>

        <p class="mt-2 text-sm text-zinc-500">
          Try a different name or username.
        </p>
      </div>
    `;
    }
    // Render cards
    paginatedUsers.forEach((user) => {
        usersContainer.innerHTML += `
      <article
        class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
      >
        <div
          class="absolute right-5 top-5 h-2 w-2 rounded-full bg-emerald-400 opacity-70 shadow-lg shadow-emerald-400/50"
        ></div>

        <img
          src="${user.avatar}"
          alt="${user.login}"
          class="h-20 w-20 rounded-2xl border border-white/10 object-cover"
        />

        <div class="mt-6">
          <p class="text-xs uppercase tracking-wider text-zinc-600">
            GitHub user
          </p>

          <h2 class="mt-1 truncate text-xl font-semibold text-white">
            ${user.login}
          </h2>

          <p class="mt-2 text-sm text-zinc-500">
            ID · ${user.id}
          </p>
        </div>

        <a
          href="profile.html?username=${encodeURIComponent(user.login)}"
          data-profile-link
          rel="noopener noreferrer"
          class="mt-6 flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
        >
          View profile
        </a>
      </article>
    `;
    });
    updatePagination();
}
usersContainer.addEventListener("click", (event) => {
    const target = event.target;
    const profileLink = target.closest("[data-profile-link]");
    if (!profileLink) {
        return;
    }
    event.preventDefault();
    const profileWindow = window.open(profileLink.href, "_blank");
    profileWindow?.focus();
});
// PAGINATION UI
function updatePagination() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = !hasNextPage;
}
// EVENT LISTENERS
nextBtn.addEventListener("click", goToNextPage);
prevBtn.addEventListener("click", goToPreviousPage);
input.addEventListener("input", applySearch);
// INITIALIZATION
async function init() {
    showLoading();
    try {
        const users = await apiService.getUsers();
        hasNextPage = users.length === usersPerPage;
        if (users.length > 0) {
            lastUserId = users[users.length - 1].id;
        }
        transformedUsers = users.map(transformUser);
        filteredUsers = transformedUsers;
        renderUsers(filteredUsers);
    }
    catch (error) {
        console.error("Failed to initialize users:", error);
        showError();
    }
}
init();
