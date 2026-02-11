import playersData from '../data/players.json';

export const getPlayers = async () => {
  return playersData;
};

export const getPositions = async () => {
  const positions = new Set();
  playersData.forEach(p => p.positions.forEach(pos => positions.add(pos)));
  return Array.from(positions);
};

export const getNationalities = async () => {
  const nationalities = new Set(playersData.map(p => p.nationality));
  return Array.from(nationalities);
};