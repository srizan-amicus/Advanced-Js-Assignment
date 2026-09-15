import { ApiService } from "./services/apiService.js";
import {
  GitHubRepository,
  RepositoryCard,
} from "./types/card.js";

// API SERVICE
const apiService = new ApiService();

// TYPES
type UiState =
  | "idle"
  | "loading"
  | "success"
  | "empty"
  | "error";

// STATE
let currentPage = 1;
const repositoriesPerPage = 10;

let currentQuery = "";
let hasNextPage = false;

// DOM ELEMENTS
const searchForm = document.getElementById(
  "search-form",
) as HTMLFormElement;

const searchInput = document.getElementById(
  "repository-search",
) as HTMLInputElement;

const searchError = document.getElementById(
  "search-error",
) as HTMLParagraphElement;

const status = document.getElementById(
  "status",
) as HTMLDivElement;

const repositoriesContainer = document.getElementById(
  "repositories-container",
) as HTMLDivElement;

const prevBtn = document.getElementById(
  "prev-btn",
) as HTMLButtonElement;

const nextBtn = document.getElementById(
  "next-btn",
) as HTMLButtonElement;

const pageNumber = document.getElementById(
  "page-number",
) as HTMLSpanElement;

// UI STATE
function setUiState(state: UiState): void {
  switch (state) {
    case "idle":
      status.textContent = "";
      break;

    case "loading":
      status.textContent = "Loading repositories...";
      break;

    case "success":
      status.textContent = "Repositories found";
      break;

    case "empty":
      status.textContent = "";
      break;

    case "error":
      status.textContent = "Something went wrong.";
      break;
  }
}

// LOADING UI
function showLoading(): void {
  repositoriesContainer.innerHTML = `
    ${Array.from({ length: 6 })
      .map(
        () => `
          <article
            class="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >
            <div class="h-6 w-3/4 rounded bg-white/10"></div>

            <div class="mt-4 h-4 w-full rounded bg-white/10"></div>

            <div class="mt-2 h-4 w-5/6 rounded bg-white/10"></div>

            <div class="mt-6 h-4 w-1/3 rounded bg-white/10"></div>

            <div class="mt-6 h-10 rounded-xl bg-white/10"></div>
          </article>
        `,
      )
      .join("")}
  `;
}

// ERROR UI
function showError(message: string): void {
  repositoriesContainer.innerHTML = `
    <div
      class="col-span-full rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center"
    >
      <p class="text-lg font-semibold text-red-400">
        Could not load repositories
      </p>

      <p class="mt-2 text-sm text-zinc-500">
        ${message}
      </p>
    </div>
  `;
}

// EMPTY UI
function showEmpty(): void {
  repositoriesContainer.innerHTML = `
    <div
      class="col-span-full rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center"
    >
      <p class="text-lg font-semibold text-white">
        No repositories found.
      </p>

      <p class="mt-2 text-sm text-zinc-500">
        Try a different search term.
      </p>
    </div>
  `;
}

// TRANSFORM API DATA INTO UI MODEL
function transformRepository(
  repository: GitHubRepository,
): RepositoryCard {
  return {
    name: repository.name,
    description: repository.description,
    stargazers_count: repository.stargazers_count,
    language: repository.language,
    html_url: repository.html_url,
    ownerLogin: repository.owner.login,
  };
}

// RENDER REPOSITORIES
function renderRepositories(
  repositories: RepositoryCard[],
): void {
  repositoriesContainer.innerHTML = "";

  repositories.forEach(
    (repository: RepositoryCard) => {
      repositoriesContainer.innerHTML += `
        <article
          class="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-purple-500/30 hover:bg-white/[0.06]"
        >

          <div class="flex-1">

            <h2
              class="truncate text-xl font-semibold text-white"
            >
              ${repository.name}
            </h2>

            <p class="mt-3 min-h-12 text-sm leading-6 text-zinc-500">
              ${
                repository.description ??
                "No description available."
              }
            </p>

            <div class="mt-5 flex flex-wrap gap-2 text-xs">

              <span
                class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-zinc-400"
              >
                👤 ${repository.ownerLogin}
              </span>

              <span
                class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-zinc-400"
              >
                ⭐ ${repository.stargazers_count}
              </span>

              <span
                class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-zinc-400"
              >
                ${
                  repository.language ??
                  "Language not specified"
                }
              </span>

            </div>

          </div>

          <a
            href="${repository.html_url}"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
          >
            View on GitHub
          </a>

        </article>
      `;
    },
  );
}

// PAGINATION UI
function updatePagination(): void {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = !hasNextPage;

  pageNumber.textContent = `Page ${currentPage}`;
}

// CLEAR LOADING STATUS
function clearLoading(): void {
  if (status.textContent === "Loading repositories...") {
    status.textContent = "";
  }
}

// SEARCH
async function searchRepositories(): Promise<void> {
  const query = searchInput.value.trim();

  // Empty query validation
  if (!query) {
    searchError.textContent =
      "Please enter a repository search term.";

    searchError.classList.remove("hidden");

    repositoriesContainer.innerHTML = "";

    setUiState("idle");

    prevBtn.disabled = true;
    nextBtn.disabled = true;

    return;
  }

  searchError.textContent = "";
  searchError.classList.add("hidden");

  currentQuery = query;
  currentPage = 1;

  setUiState("loading");
  showLoading();

  try {
    const repositories =
      await apiService.searchRepositories(
        currentQuery,
        currentPage,
        repositoriesPerPage,
      );

    if (repositories.length === 0) {
      hasNextPage = false;

      setUiState("empty");
      showEmpty();

      updatePagination();

      return;
    }

    hasNextPage =
      repositories.length === repositoriesPerPage;

    // Transform API data into UI data
    const repositoryCards =
      repositories.map(transformRepository);

    setUiState("success");

    renderRepositories(repositoryCards);
    updatePagination();
  } catch (error) {
    console.error(
      "Failed to search repositories:",
      error,
    );

    hasNextPage = false;

    setUiState("error");

    showError(
      error instanceof Error
        ? error.message
        : "Please try again later.",
    );

    updatePagination();
  } finally {
    clearLoading();
  }
}

// NEXT PAGE
async function goToNextPage(
  event: MouseEvent,
): Promise<void> {
  event.preventDefault();

  if (!hasNextPage) {
    return;
  }

  currentPage++;

  setUiState("loading");
  showLoading();

  try {
    const repositories =
      await apiService.searchRepositories(
        currentQuery,
        currentPage,
        repositoriesPerPage,
      );

    if (repositories.length === 0) {
      hasNextPage = false;

      setUiState("empty");
      showEmpty();

      updatePagination();

      return;
    }

    hasNextPage =
      repositories.length === repositoriesPerPage;

    // Transform API data into UI data
    const repositoryCards =
      repositories.map(transformRepository);

    setUiState("success");

    renderRepositories(repositoryCards);
    updatePagination();
  } catch (error) {
    console.error(
      "Failed to load next repository page:",
      error,
    );

    currentPage--;

    setUiState("error");

    showError(
      error instanceof Error
        ? error.message
        : "Please try again later.",
    );

    updatePagination();
  } finally {
    clearLoading();
  }
}

// PREVIOUS PAGE
async function goToPreviousPage(
  event: MouseEvent,
): Promise<void> {
  event.preventDefault();

  if (currentPage <= 1) {
    return;
  }

  currentPage--;

  setUiState("loading");
  showLoading();

  try {
    const repositories =
      await apiService.searchRepositories(
        currentQuery,
        currentPage,
        repositoriesPerPage,
      );

    if (repositories.length === 0) {
      setUiState("empty");
      showEmpty();

      updatePagination();

      return;
    }

    hasNextPage =
      repositories.length === repositoriesPerPage;

    // Transform API data into UI data
    const repositoryCards =
      repositories.map(transformRepository);

    setUiState("success");

    renderRepositories(repositoryCards);
    updatePagination();
  } catch (error) {
    console.error(
      "Failed to load previous repository page:",
      error,
    );

    currentPage++;

    setUiState("error");

    showError(
      error instanceof Error
        ? error.message
        : "Please try again later.",
    );

    updatePagination();
  } finally {
    clearLoading();
  }
}

// EVENT LISTENERS
searchForm.addEventListener(
  "submit",
  (event: SubmitEvent): void => {
    event.preventDefault();
    void searchRepositories();
  },
);

nextBtn.addEventListener(
  "click",
  goToNextPage,
);

prevBtn.addEventListener(
  "click",
  goToPreviousPage,
);