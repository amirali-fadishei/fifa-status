import { getPlayers, getPlayersNationality, getPlayersPositions } from "./api";
import { SortKey, Key } from "../constants/SortKey";
import { SERVER_URL } from "../constants/Server";

let players = [];
let positions = [];
let nationalities = [];
let searchKey = null;
let selectedPosition = null;
let selectedNationality = null;
let sortKey = SortKey.OVERALL;

function setOverallClass(overall) {
  if (overall >= 90) {
    return "one";
  }
  if (overall >= 80) {
    return "two";
  }
  return "three";
}

function generatePlayerRow(player, idx) {
  return `
  <tr>
    <th scope="row">${idx}</th>
    <td>
      <img src="${SERVER_URL}/${player.imageUrl}" width="60" />
    </td>
    <td>${player.shortName}</td>
    <td>${player.clubName}</td>
    <td>
      <span class="overall overall--${setOverallClass(
        Number(player.overall)
      )}">${player.overall}</span>
    </td>
    <td>${player.age}</td>
    <td>${player.nationality}</td>
  </tr>
  `;
}

const filterBasedOnSearchKey = (el) => {
  return searchKey === null || el.shortName.includes(searchKey);
};

const filterBasedOnPosition = (el) => {
  return selectedPosition === null || el.positions.includes(selectedPosition);
};

const filterBasedOnNationality = (el) => {
  return selectedNationality === null || el.nationality === selectedNationality;
};

function renderPlayers() {
  const table = document.getElementById("players-table").querySelector("tbody");
  table.innerHTML = "";

  players
    .filter(
      (el) =>
        filterBasedOnSearchKey(el) &&
        filterBasedOnPosition(el) &&
        filterBasedOnNationality(el)
    )
    .sort((a, b) => {
      const key = Key[sortKey];
      return b[key] > a[key] ? 1 : a[key] > b[key] ? -1 : 0;
    })
    .forEach((player, idx) => {
      table.innerHTML += generatePlayerRow(player, idx + 1);
    });
}

function renderPositions() {
  const elm = document.getElementById("position-select");
  positions.forEach((position) => {
    elm.innerHTML += `<option value="${position}">${position}</option>`;
  });
}

function renderNationality() {
  const elm = document.getElementById("nationality-select");
  nationalities.forEach((nationality) => {
    elm.innerHTML += `<option value="${nationality}">${nationality}</option>`;
  });
}

function loadPlayers() {
  getPlayers()
    .then((result) => {
      players = result;
      renderPlayers();
    })
    .catch((err) => {
      console.log(err);
    });
}

function loadPositions() {
  getPlayersPositions()
    .then((result) => {
      positions = result;
      renderPositions();
    })
    .catch((err) => {
      console.log(err);
    });
}

function loadNationality() {
  getPlayersNationality()
    .then((result) => {
      nationalities = result;
      renderNationality();
    })
    .catch((err) => {
      console.log(err);
    });
}

function setupEventListener() {
  document.getElementById("search-field").addEventListener("input", (e) => {
    searchKey = e.target.value;
    renderPlayers();
  });

  document.getElementById("filter-btn").addEventListener("click", (e) => {
    const nationalityElm = document.getElementById("nationality-select");
    const positionElm = document.getElementById("position-select");
    if (nationalityElm.value) {
      selectedNationality = nationalityElm.value;
    }
    if (positionElm.value) {
      selectedPosition = positionElm.value;
    }
    renderPlayers();
  });

  const radios = document.querySelectorAll(
    'input[type=radio][name="sort-radio"]'
  );

  radios.forEach((el) => {
    // # Notice Here arrow function
    el.addEventListener("change", function () {
      if (this.value !== sortKey) {
        sortKey = this.value;
        renderPlayers();
      }
    });
  });
}

export function initialApp() {
  loadPlayers();
  loadPositions();
  loadNationality();

  setupEventListener();
}
