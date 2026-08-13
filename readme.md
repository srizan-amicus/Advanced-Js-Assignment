# GitHub Users Dashboard

A small GitHub Users dashboard built with HTML, Tailwind CSS and vanilla JavaScript.

The project uses the GitHub Users API to fetch users, display them in a paginated layout, filter them by username length, and show additional information for individual users.

## working features
--Fetches GitHub users automatically when the page loads
--Uses `async/await` for API requests
--Checks for failed API responses and handles errors

--Shows a loading skeleton while users are being fetched
-- Displays the total number of users
--Transforms the API response to only keep:
  - `login`
  - `id`
  - `avatar`
--Filters users by minimum login length
--Shows the updated user count after filtering
--Pagination with 6 users per page

--User profile/details view
--Fetches followers and repositories in parallel using `Promise.all()`
--Displays the first 5 followers and first 5 repositories

--Shows an error message if a request fails
--Provides a button to return to the users list
-=Responsive Layout



## API Endpoints

The project uses the following GitHub API endpoints:
https://api.github.com/users