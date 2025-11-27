# FC 24 Player Radar

A refreshed take on the original FIFA 21 table. The project now exposes a lightweight API with modern data (FC 24 snapshot) and a cleaner, modular UI for exploring standout players.

## Tech stack
- **API:** Express + CORS, serving a curated FC 24 dataset with filter/sort query parameters.
- **Client:** Webpack + Bootstrap, modernized styling, and modular JavaScript with fetch-based data access.

## Running the API
1. Navigate to the `server` folder.
2. Install dependencies (if needed):
   ```bash
   npm install
   ```
3. Start the API:
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:3000/api`.

## Running the client
1. Navigate to the `client` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm start
   ```
   The UI will be served at `http://localhost:5000` (configured by webpack-dev-server). Ensure the API is running locally on port 3000.

## API overview
- `GET /api/meta` – positions, nationalities, total players, and data freshness.
- `GET /api/players` – accepts `search`, `position`, `nationality`, and `sort` (`overall|potential|name|age`) query parameters.

## Notes
- Player images use public CDN URLs from the latest FC/Ultimate Team snapshots.
- The UI updates dynamically as you type or adjust filters for a smoother UX.
