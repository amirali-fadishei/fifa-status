import { fetchMeta, fetchPlayers } from "./api";
import { SortKey } from "../constants/SortKey";

const state = {
  players: [],
  meta: { positions: [], nationalities: [], totalPlayers: 0, updated: "" },
  filters: {
    search: "",
    position: "",
    nationality: "",
    sort: SortKey.OVERALL,
  },
};

const playerGrid = document.getElementById("players-grid");
const summaryBar = document.getElementById("summary-text");
const positionSelect = document.getElementById("position-select");
const nationalitySelect = document.getElementById("nationality-select");
const sortSelect = document.getElementById("sort-select");
const searchField = document.getElementById("search-field");
const resetButton = document.getElementById("reset-btn");
const loadingBanner = document.getElementById("loading-banner");

const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "EUR", notation: "compact" }).format(value);

const renderMeta = () => {
  positionSelect.innerHTML = '<option value="">Any position</option>';
  nationalitySelect.innerHTML = '<option value="">Any nationality</option>';

  state.meta.positions.forEach((position) => {
    positionSelect.innerHTML += `<option value="${position}">${position}</option>`;
  });

  state.meta.nationalities.forEach((nationality) => {
    nationalitySelect.innerHTML += `<option value="${nationality}">${nationality}</option>`;
  });
};

const createBadge = (value) => `<span class="badge rounded-pill bg-dark-subtle text-dark me-1">${value}</span>`;

const renderPlayers = () => {
  playerGrid.innerHTML = "";
  const template = document.createDocumentFragment();

  state.players.forEach((player) => {
    const card = document.createElement("article");
    card.className = "player-card shadow-sm";
    card.innerHTML = `
      <div class="player-card__header">
        <div>
          <p class="text-uppercase small text-muted mb-1">${player.league}</p>
          <h3 class="h5 mb-0">${player.name}</h3>
          <p class="mb-0 text-body-secondary">${player.club}</p>
        </div>
        <div class="rating-badge rating-badge--${player.overall >= 90 ? "elite" : "pro"}">${player.overall}</div>
      </div>
      <div class="player-card__body">
        <img class="player-card__image" src="${player.image}" alt="${player.name}" loading="lazy" />
        <div>
          <p class="fw-semibold mb-1">${player.nationality} · ${player.age} yrs · ${player.foot}-footed</p>
          <div class="mb-2">${player.positions.map(createBadge).join("")}</div>
          <dl class="row g-2 mb-0 small">
            <dt class="col-6 text-muted">Potential</dt>
            <dd class="col-6 text-end fw-semibold">${player.potential}</dd>
            <dt class="col-6 text-muted">Market value</dt>
            <dd class="col-6 text-end fw-semibold">${formatCurrency(player.valueEur)}</dd>
            <dt class="col-6 text-muted">Weekly wage</dt>
            <dd class="col-6 text-end fw-semibold">${formatCurrency(player.wageEur)}</dd>
          </dl>
        </div>
      </div>
    `;
    template.appendChild(card);
  });

  playerGrid.appendChild(template);
  summaryBar.textContent = `${state.players.length} players · Updated from ${state.meta.updated}`;
};

const toggleLoading = (isLoading) => {
  loadingBanner.classList.toggle("d-none", !isLoading);
};

const refreshPlayers = async () => {
  toggleLoading(true);
  try {
    state.players = await fetchPlayers(state.filters);
    renderPlayers();
  } catch (err) {
    summaryBar.textContent = `Something went wrong: ${err.message}`;
  } finally {
    toggleLoading(false);
  }
};

const handleFilterChange = (key, value) => {
  state.filters[key] = value;
  refreshPlayers();
};

const wireEvents = () => {
  searchField.addEventListener("input", (event) => {
    handleFilterChange("search", event.target.value.trim());
  });

  positionSelect.addEventListener("change", (event) => {
    handleFilterChange("position", event.target.value);
  });

  nationalitySelect.addEventListener("change", (event) => {
    handleFilterChange("nationality", event.target.value);
  });

  sortSelect.addEventListener("change", (event) => {
    handleFilterChange("sort", event.target.value);
  });

  resetButton.addEventListener("click", () => {
    state.filters = { search: "", position: "", nationality: "", sort: SortKey.OVERALL };
    searchField.value = "";
    positionSelect.value = "";
    nationalitySelect.value = "";
    sortSelect.value = SortKey.OVERALL;
    refreshPlayers();
  });
};

const bootstrap = async () => {
  toggleLoading(true);
  try {
    state.meta = await fetchMeta();
    renderMeta();
    await refreshPlayers();
  } catch (err) {
    summaryBar.textContent = `Unable to load data: ${err.message}`;
  } finally {
    toggleLoading(false);
  }
  wireEvents();
};

export const initialApp = () => {
  bootstrap();
};
