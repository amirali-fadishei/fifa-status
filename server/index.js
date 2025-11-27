const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, 'data', 'players-24.json');

const app = express();
app.use(cors());
app.use(express.json());

const loadPlayers = () => {
  const fileContents = fs.readFileSync(DATA_PATH, 'utf-8');
  const rows = JSON.parse(fileContents);
  return rows.map((player) => ({
    ...player,
    positions: player.positions || [],
  }));
};

const players = loadPlayers();
const positions = Array.from(
  new Set(players.flatMap((player) => player.positions))
).sort();
const nationalities = Array.from(
  new Set(players.map((player) => player.nationality))
).sort();

const sorters = {
  overall: (a, b) => b.overall - a.overall,
  age: (a, b) => a.age - b.age,
  name: (a, b) => a.name.localeCompare(b.name),
  potential: (a, b) => b.potential - a.potential,
};

const filterPlayers = ({ search, position, nationality }) => {
  const normalizedSearch = search?.toLowerCase() ?? '';
  return players.filter((player) => {
    const matchesName =
      !normalizedSearch ||
      player.name.toLowerCase().includes(normalizedSearch) ||
      player.club.toLowerCase().includes(normalizedSearch);
    const matchesPosition =
      !position || player.positions.some((slot) => slot === position);
    const matchesNationality =
      !nationality || player.nationality === nationality;

    return matchesName && matchesPosition && matchesNationality;
  });
};

app.get('/api/meta', (_req, res) => {
  res.json({
    success: true,
    data: {
      positions,
      nationalities,
      totalPlayers: players.length,
      updated: 'FC 24 / 2024 season snapshot',
    },
  });
});

app.get('/api/players', (req, res) => {
  const { search, position, nationality, sort = 'overall' } = req.query;

  const filtered = filterPlayers({ search, position, nationality });
  const sorter = sorters[sort] || sorters.overall;
  const sortedPlayers = [...filtered].sort(sorter);

  res.json({
    success: true,
    meta: {
      count: sortedPlayers.length,
      sort,
    },
    data: sortedPlayers,
  });
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${PORT}`);
});
