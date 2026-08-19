let transformedUsers = [];
let filteredUsers = [];

let currentPage = 1;
const usersPerPage = 6;

const input = document.getElementById("input");
const btn = document.getElementById("btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageNumber = document.getElementById("page-number");
const usersContainer = document.getElementById("users-container");

function showLoading() {
  const loading = document.getElementById("loading");

  loading.innerHTML = `
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      ${Array.from({ length: 6 })
        .map(
          () => `
            <div class="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div class="h-20 w-20 rounded-2xl bg-white/10"></div>
              <div class="mt-6 h-3 w-20 rounded bg-white/10"></div>
              <div class="mt-2 h-6 w-32 rounded bg-white/10"></div>
              <div class="mt-2 h-4 w-16 rounded bg-white/10"></div>
              <div class="mt-6 h-11 rounded-xl bg-white/10"></div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function showError() {
  document.getElementById("loading").innerHTML = "";
  usersContainer.innerHTML = `
    <div class="col-span-full rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
      <p class="text-lg font-semibold text-red-400">Could not load users</p>
      <p class="mt-2 text-sm text-zinc-500">Something went wrong while fetching GitHub users.</p>
    </div>
  `;
}

async function fetchUsers() {
  const response = await fetch("https://api.github.com/users");

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}

btn.addEventListener("click", () => {
  const minLength = Number(input.value);
  const validationMessage = document.getElementById("filter-error");

  if (!input.value.trim() || !Number.isInteger(minLength) || minLength < 1) {
    validationMessage.textContent = "Enter a whole number of at least 1.";
    input.focus();
    return;
  }

  validationMessage.textContent = "";
  filteredUsers = transformedUsers.filter((user) => user.login.length >= minLength);
  currentPage = 1;
  pageNumber.textContent = currentPage;
  renderUsers(filteredUsers);
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    pageNumber.textContent = currentPage;
    renderUsers(filteredUsers);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    pageNumber.textContent = currentPage;
    renderUsers(filteredUsers);
  }
});

function renderUsers(users) {
  document.getElementById("users-count").textContent = `${users.length} users`;
  document.getElementById("loading").innerHTML = "";
  usersContainer.innerHTML = "";

  const start = (currentPage - 1) * usersPerPage;
  const paginatedUsers = users.slice(start, start + usersPerPage);

  if (paginatedUsers.length === 0) {
    usersContainer.innerHTML = `
      <div class="col-span-full rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
        <p class="text-lg font-semibold text-white">No users found</p>
        <p class="mt-2 text-sm text-zinc-500">Try using a smaller login length.</p>
      </div>
    `;
  }

  paginatedUsers.forEach((user) => {
    usersContainer.innerHTML += `
      <article class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <div class="absolute right-5 top-5 h-2 w-2 rounded-full bg-emerald-400 opacity-70 shadow-lg shadow-emerald-400/50"></div>
        <img src="${user.avatar}" alt="${user.login}" class="h-20 w-20 rounded-2xl border border-white/10 object-cover" />
        <div class="mt-6">
          <p class="text-xs uppercase tracking-wider text-zinc-600">GitHub user</p>
          <h2 class="mt-1 truncate text-xl font-semibold text-white">${user.login}</h2>
          <p class="mt-2 text-sm text-zinc-500">ID · ${user.id}</p>
        </div>
        <a href="profile.html?username=${encodeURIComponent(user.login)}" target="_blank" rel="noopener noreferrer" class="mt-6 flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white">
          View profile
        </a>
      </article>
    `;
  });

  const totalPages = Math.ceil(users.length / usersPerPage);
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

async function init() {
  showLoading();

  try {
    const users = await fetchUsers();
    transformedUsers = users.map((user) => ({
      login: user.login,
      id: user.id,
      avatar: user.avatar_url,
    }));
    filteredUsers = transformedUsers;
    renderUsers(filteredUsers);
  } catch (error) {
    console.error(error);
    showError();
  }
}

init();
