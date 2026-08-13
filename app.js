let transformedUsers = [];
let filteredUsers = [];

let currentPage = 1;
const usersPerPage = 6;

//dom elements

const input = document.getElementById("input");
const btn = document.getElementById("btn");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageNumber = document.getElementById("page-number");

const usersContainer = document.getElementById("users-container");

const detailsPage = document.getElementById("details-page");
const backBtn = document.getElementById("back-btn");

const detailsUsername = document.getElementById("details-username");

const detailsAvatar = document.getElementById("details-avatar");

const detailsId = document.getElementById("details-id");

const detailsLoading = document.getElementById("details-loading");

const detailsError = document.getElementById("details-error");

const followersCount = document.getElementById("followers-count");

const reposCount = document.getElementById("repos-count");

const followersContainer = document.getElementById("followers-container");

const reposContainer = document.getElementById("repos-container");

// loading

function showLoading() {
  const loading = document.getElementById("loading");

  loading.innerHTML = `
    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

      ${Array.from({ length: 6 })
        .map(
          () => `
            <div class="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-6">

              <div class="h-20 w-20 rounded-2xl bg-zinc-800"></div>

              <div class="mt-6 h-3 w-20 rounded bg-zinc-800"></div>

              <div class="mt-2 h-6 w-32 rounded bg-zinc-800"></div>

              <div class="mt-2 h-4 w-16 rounded bg-zinc-800"></div>

              <div class="mt-6 h-11 rounded-xl bg-zinc-800"></div>

            </div>
          `,
        )
        .join("")}

    </div>
  `;
}

//error

function showError() {
  const loading = document.getElementById("loading");

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

// fetch users

async function fetchUsers() {
  try {
    const response = await fetch("https://api.github.com/users");

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const users = await response.json();

    return users;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//filter

btn.addEventListener("click", () => {
  const minLength = Number(input.value);

  filteredUsers = transformedUsers.filter((user) => {
    return user.login.length >= minLength;
  });

  currentPage = 1;

  pageNumber.textContent = currentPage;

  renderUsers(filteredUsers);
});

//next page
nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (currentPage < totalPages) {
    currentPage++;

    pageNumber.textContent = currentPage;

    renderUsers(filteredUsers);
  }
});

//previous page

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;

    pageNumber.textContent = currentPage;

    renderUsers(filteredUsers);
  }
});

//render users

function renderUsers(users) {
  const total = document.getElementById("users-count");

  total.textContent = `${users.length} users`;

  // Hide loading

  const loading = document.getElementById("loading");

  loading.innerHTML = "";

  // Clear old users

  usersContainer.innerHTML = "";

  // Calculate pagination

  const start = (currentPage - 1) * usersPerPage;

  const paginatedUsers = users.slice(start, start + usersPerPage);

  // No results

  if (paginatedUsers.length === 0) {
    usersContainer.innerHTML = `
      <div class="col-span-full rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">

        <p class="text-lg font-semibold text-white">
          No users found
        </p>

        <p class="mt-2 text-sm text-zinc-500">
          Try using a smaller login length.
        </p>

      </div>
    `;
  }

  // Render cards

  paginatedUsers.forEach((user) => {
    const card = `
      <article
        class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
      >

        <!-- Online indicator -->

        <div
          class="absolute right-5 top-5 h-2 w-2 rounded-full bg-emerald-400 opacity-70 shadow-lg shadow-emerald-400/50"
        ></div>


        <!-- Avatar -->

        <img
          src="${user.avatar}"
          alt="${user.login}"
          class="h-20 w-20 rounded-2xl border border-white/10 object-cover"
        />


        <!-- User info -->

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


        <!-- View profile -->

        <button
          data-login="${user.login}"
          class="mt-6 flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
        >

          <span>
            View profile
          </span>

        </button>

      </article>
    `;

    usersContainer.innerHTML += card;
  });

  // Pagination

  const totalPages = Math.ceil(users.length / usersPerPage);

  prevBtn.disabled = currentPage === 1;

  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

//show user details

async function showUserDetails(login) {
  // Show details page on the same page layout

  detailsPage.classList.remove("hidden");
  detailsPage.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  usersContainer.classList.add("hidden");
  loading = document.getElementById("loading");
  loading.classList.add("hidden");

  const paginationControls = prevBtn.parentElement.parentElement;

  paginationControls.classList.add("hidden");

  // Find selected user

  const selectedUser = transformedUsers.find((user) => user.login === login);

  // Set profile information

  if (selectedUser) {
    detailsAvatar.src = selectedUser.avatar;

    detailsAvatar.alt = selectedUser.login;

    detailsUsername.textContent = selectedUser.login;

    detailsId.textContent = `ID · ${selectedUser.id}`;
  }

  // Reset state

  detailsLoading.textContent = "Loading details...";

  detailsError.textContent = "";

  followersContainer.innerHTML = "";

  reposContainer.innerHTML = "";

  followersCount.textContent = "—";

  reposCount.textContent = "—";

  try {
    // Fetch followers + repos together

    const [followersResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${login}/followers`),

      fetch(`https://api.github.com/users/${login}/repos`),
    ]);

    if (!followersResponse.ok || !reposResponse.ok) {
      throw new Error("Could not load user details");
    }

    // Convert responses to JSON

    const [followers, repos] = await Promise.all([
      followersResponse.json(),

      reposResponse.json(),
    ]);

    // Update counts

    followersCount.textContent = followers.length;

    reposCount.textContent = repos.length;

    // Show only first 5

    const firstFiveFollowers = followers.slice(0, 5);

    const firstFiveRepos = repos.slice(0, 5);

    detailsLoading.textContent = "";

    // followers

    if (firstFiveFollowers.length === 0) {
      followersContainer.innerHTML = `
        <p class="text-sm text-zinc-500">
          No followers found.
        </p>
      `;
    } else {
      followersContainer.innerHTML = firstFiveFollowers
        .map(
          (follower) => `
              <div
                class="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]"
              >

                <img
                  src="${follower.avatar_url}"
                  alt="${follower.login}"
                  class="h-10 w-10 rounded-xl"
                >

                <div class="min-w-0">

                  <p class="truncate text-sm font-medium text-white">
                    ${follower.login}
                  </p>

                  <p class="text-xs text-zinc-600">
                    GitHub user
                  </p>

                </div>

              </div>
            `,
        )
        .join("");
    }

    // repositories

    if (firstFiveRepos.length === 0) {
      reposContainer.innerHTML = `
        <p class="text-sm text-zinc-500">
          No repositories found.
        </p>
      `;
    } else {
      reposContainer.innerHTML = firstFiveRepos
        .map(
          (repo) => `
              <div
                class="rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
              >

                <div class="flex items-start justify-between gap-4">

                  <h4 class="truncate text-sm font-semibold text-white">
                    ${repo.name}
                  </h4>

                  <span class="shrink-0 rounded-lg bg-purple-500/10 px-2 py-1 text-[10px] font-medium text-purple-400">
                    Repo
                  </span>

                </div>


                <p class="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                  ${repo.description || "No description available."}
                </p>

              </div>
            `,
        )
        .join("");
    }
  } catch (error) {
    console.error(error);

    detailsLoading.textContent = "";

    detailsError.textContent = "Could not load user details.";
  }
}

// view profile

usersContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-login]");

  if (!button) {
    return;
  }

  const login = button.dataset.login;

  showUserDetails(login);
});

// back to users

backBtn.addEventListener("click", () => {
  detailsPage.classList.add("hidden");

  usersContainer.classList.remove("hidden");

  const loading = document.getElementById("loading");

  loading.classList.remove("hidden");

  const paginationControls = prevBtn.parentElement.parentElement;

  paginationControls.classList.remove("hidden");
});

// init function

async function init() {
  showLoading();

  try {
    const users = await fetchUsers();

    // Transform API data

    transformedUsers = users.map((user) => {
      return {
        login: user.login,

        id: user.id,

        avatar: user.avatar_url,
      };
    });

    // Initially show all

    filteredUsers = transformedUsers;

    renderUsers(filteredUsers);
  } catch (error) {
    showError();
  }
}

init();
