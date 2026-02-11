import "./style.css";
import { getPlayers, getPositions, getNationalities } from "./js/playerApi";
import { SortKey } from "./constants/index";

let state = {
  players: [],
  positions: [],
  nationalities: [],
  filters: {
    search: "",
    position: null,
    nationality: null
  },
  sort: SortKey.OVERALL
};

function getRatingClass(ovr) {
  if (ovr >= 90) return "bg-green-600 shadow-green-900/20";
  if (ovr >= 80) return "bg-lime-500 shadow-lime-900/20";
  return "bg-amber-500 shadow-amber-900/20";
}

function createPlayerRow(player) {
  return `
  <tr class="hover:bg-slate-800/50 transition-colors group">
    <td class="px-6 py-4">
      <div class="flex items-center gap-4">
        <img src="${player.imageUrl}" class="w-12 h-12 rounded-lg object-cover bg-slate-800 group-hover:scale-110 transition-transform" />
        <span class="font-medium text-slate-200">${player.shortName}</span>
      </div>
    </td>
    <td class="px-6 py-4 text-slate-400 text-sm">${player.clubName}</td>
    <td class="px-6 py-4 text-center">
      <span class="${getRatingClass(player.overall)} text-white px-2.5 py-1 rounded-md text-sm font-bold shadow-lg">
        ${player.overall}
      </span>
    </td>
    <td class="px-6 py-4">
        <div class="flex flex-col">
            <span class="text-xs text-slate-500">Age: ${player.age}</span>
            <span class="text-xs text-slate-400">${player.nationality}</span>
        </div>
    </td>
  </tr>
  `;
}

function renderPlayers() {
  const tbody = document.querySelector("#players-table tbody");

  const filtered = state.players
    .filter(p =>
      p.shortName.toLowerCase().includes(state.filters.search.toLowerCase()) &&
      (!state.filters.position || p.positions.includes(state.filters.position)) &&
      (!state.filters.nationality || p.nationality === state.filters.nationality)
    )
    .sort((a, b) => {
      const key = state.sort;
      return typeof a[key] === 'string'
        ? a[key].localeCompare(b[key])
        : b[key] - a[key];
    });

  tbody.innerHTML = filtered.map(createPlayerRow).join("");
}

function updateSortUI(activeId) {
  const buttons = ['overall', 'name', 'age'];

  buttons.forEach(id => {
    const btn = document.getElementById(`sort-${id}`);
    if (!btn) return;

    if (id === activeId) {
      btn.classList.add('bg-orange-600', 'shadow-sm', 'text-white');
      btn.classList.remove('hover:bg-slate-700', 'text-slate-400');
    } else {
      btn.classList.remove('bg-orange-600', 'shadow-sm', 'text-white');
      btn.classList.add('hover:bg-slate-700', 'text-slate-400');
    }
  });
}

function setupEvents() {
  document.getElementById("search-field").addEventListener("input", (e) => {
    state.filters.search = e.target.value;
    renderPlayers();
  });

  ['overall', 'name', 'age'].forEach(id => {
    document.getElementById(`sort-${id}`)?.addEventListener("click", () => {
      state.sort = id === 'name' ? 'shortName' : id;

      renderPlayers();

      updateSortUI(id);
    });
  });

  document.getElementById("filter-btn").addEventListener("click", () => {
    state.filters.nationality = document.getElementById("nationality-select").value || null;
    state.filters.position = document.getElementById("position-select").value || null;
    renderPlayers();
  });
}

export async function initialApp() {
  try {
    const [players, positions, nationalities] = await Promise.all([
      getPlayers(),
      getPositions(),
      getNationalities()
    ]);

    state.players = players;
    state.positions = positions;
    state.nationalities = nationalities;

    const posSelect = document.getElementById("position-select");
    state.positions.forEach(p => posSelect.innerHTML += `<option value="${p}">${p}</option>`);

    const natSelect = document.getElementById("nationality-select");
    state.nationalities.forEach(n => natSelect.innerHTML += `<option value="${n}">${n}</option>`);

    setupEvents();
    renderPlayers();
  } catch (err) {
    console.error("Failed to Initialize App", err);
  }
}

initialApp();