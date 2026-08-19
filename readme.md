# GitHub Users Dashboard

A responsive, feature-rich GitHub Users Dashboard built with **HTML5, Tailwind CSS, TypeScript, and the GitHub REST API**.

This application allows users to browse profiles, filter accounts by username length, paginate seamlessly, and inspect comprehensive user details—including followers and repositories.

> **Project Focus:** This application serves as a practical **JavaScript-to-TypeScript migration** case, emphasizing strict type safety, generic API layers, union/utility types, modular composition, asynchronous programming patterns, and robust error management.

---

##  Key Features

* **User Discovery:** Fetch and display public GitHub user accounts.
* **Smart Filtering:** Filter loaded users dynamically by minimum username length.
* **Client-Side Pagination:** Browse through datasets with a clean 6-users-per-page setup.
* **Detailed Profiles:** Dedicated profile view displaying key statistics and user details.
* **Concurrent Fetching:** Load followers and repositories in parallel for optimized performance.
* **Resilient Error Handling:** Gracefully handle partial API failures using `Promise.allSettled()`.
* **State Management:** Complete UI states covering loading, success, empty results, and failures.
* **Strict Typing:** Built entirely with strict TypeScript configuration and typed DOM interactions.

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| **HTML5** | Semantic structural markup |
| **Tailwind CSS** | Responsive styling, layout, and utility classes |
| **TypeScript** | Type-safe application architecture and compile-time checks |
| **GitHub REST API** | External data provider |
| **Fetch API** | Native HTTP interface for server communication |
| **Node.js / npm** | Package management and development tooling |
| **TypeScript Compiler (`tsc`)** | Translating `.ts` source files to vanilla JavaScript |

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your local environment:

* [Node.js](https://nodejs.org/) (includes npm)
* [Git](https://git-scm.com/)
* A local development server (such as VS Code Live Server)

### Installation

```bash
git clone <your-repository-url>
cd <project-folder>
npm install

```

### Build & Development

* **Compile the project once:**
```bash
npm run build

```


* **Run in watch mode (auto-recompile on file changes):**
```bash
npm run watch

```



> **Note:** Browsers execute the compiled JavaScript files found in the `dist` directory, not the raw TypeScript source files in `src`.

---

## Project Structure

```text
Advanced-Js-Assignment/
├── index.html
├── profile.html
├── src/
│   ├── app.ts
│   ├── profile.ts
│   ├── services/
│   │   └── apiService.ts
│   ├── types/
│   │   └── github.ts
│   └── utils/
│       └── api.ts
├── dist/
│   └── compiled JavaScript files
├── tsconfig.json
├── package.json
└── README.md

```

### File Responsibilities

| File | Primary Responsibility |
| --- | --- |
| `app.ts` | Dashboard state management, filtering, pagination logic, and DOM rendering |
| `profile.ts` | Profile page orchestration and profile-specific UI binding |
| `apiService.ts` | Centralized GitHub API service layer |
| `api.ts` | Generic HTTP request utility wrapper |
| `github.ts` | Interfaces, type aliases, and custom utility types |

## TypeScript Configuration

The project uses `tsconfig.json` to configure TypeScript compilation.

Important compiler settings include:

- `strict: true` - Enables strict type checking.
- `noImplicitAny: true` - Prevents variables and parameters from implicitly receiving the `any` type.
- `rootDir: "./src"` - Defines the TypeScript source directory.
- `outDir: "./dist"` - Places compiled JavaScript files in the `dist` directory.
- `module` / `target` - Configure the JavaScript module system and output version used by the browser.

---

##  Architecture & TypeScript Implementation

### 1. API Types & Custom Utilities

The application maps external payloads directly to strongly-typed interfaces, leveraging utility types like `Pick` and `Omit` to cleanly segregate raw API models from internal UI models.

```ts
interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name?: string | null;
  public_repos?: number;
  followers?: number;
}

type GitHubUserBasic = Pick<GitHubUser, "login" | "id" | "avatar_url">;

type UserCard = Omit<GitHubUserBasic, "avatar_url"> & {
  avatar: string;
};

```

### 2. Architecture Layering

The project implements a clean separation of concerns using composition over inheritance:

```text
UI Layer (app.ts / profile.ts)
  │
  ▼
ApiService Class (apiService.ts)
  │
  ▼
Generic API Helper (api.ts)
  │
  ▼
GitHub REST API

```

---

##  Core Logic Highlights

* **Data Transformation:** External data passes through a transformation layer before reaching the UI components, decoupling the layout from structural changes in the external API.
* **Filtering & Pagination:** Users can be filtered by username length instantly on already-cached data. Pagination logic slices the dataset into chunks of 6 per page while updating UI 
* **Concurrent Requests (`Promise.allSettled`):** Profile pages fetch user followers and repositories simultaneously. If one resource request fails, the application still renders the successfully fetched data instead of breaking completely.

---

##  GitHub API Endpoints

The dashboard interacts with the following unauthenticated endpoints:

```http
GET https://api.github.com/users
GET https://api.github.com/users/{username}
GET https://api.github.com/users/{username}/followers
GET https://api.github.com/users/{username}/repos

```

> **Rate Limit Note:** Unauthenticated requests are subject to strict hourly rate limits by GitHub, which may result in `403 Forbidden` responses under heavy usage.

---

## Screenshots


* **Dashboard View:** ![alt text](/screenshots/image.png)
* **Filtered Results:** ![alt text](/screenshots/filtered.png)
* **Profile View:** ![alt text](/screenshots/profile.png)

---
### Why Promise.allSettled()?

The profile page requires two independent resources: followers and repositories.

`Promise.all()` would reject the entire operation if either request failed. That would make successfully retrieved data unavailable when only one endpoint had failed.

Therefore, the application uses `Promise.allSettled()`.

This allows both requests to complete independently. If the followers request succeeds while the repositories request fails, the followers can still be displayed and the repository section can show its own error state.

This makes the profile page more resilient to partial API failures.


![alt text](/screenshots/onlyRepos.png)

# and

![alt text](/screenshots/onlyFollowers.png)



---
### TypeScript Architecture & Design Patterns

* **Interfaces:** Define strict contracts for external data structures (e.g., `GitHubUser`) to ensure consistent data shapes across the application and prevent runtime type mismatches.
* **Generics:** Power the reusable `apiRequest<T>()` utility function, allowing it to handle diverse return types (`GitHubUser[]`, `GitHubFollower[]`, etc.) safely without losing type information or resorting to `any`.
* **Union Types:** Implement robust result wrappers (such as `ApiResult<T>`) that explicitly represent either a successful data payload or a failure state, enabling safe, exhaustive error checking.
* **Utility Types:** Leverage built-in TypeScript utilities like `Pick` and `Omit` to derive concise internal UI models from larger external API contracts, cleanly separating API data from component state.
* **`ApiService`:** Centralizes all HTTP communication in a dedicated service layer, abstracting endpoint URLs and raw fetch logic away from the UI components.
* **Composition:** Combines smaller, focused modules (`api.ts`, `apiService.ts`, and component logic) together rather than relying on complex class inheritance, resulting in a flexible and maintainable codebase.