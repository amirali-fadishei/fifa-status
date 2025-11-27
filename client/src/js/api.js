import { API_BASE } from "../constants/Server";

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const payload = await response.json();
  if (!payload.success) {
    throw new Error("API responded without success flag");
  }
  return payload;
};

export const fetchMeta = async () => {
  const response = await fetch(`${API_BASE}/meta`);
  const payload = await handleResponse(response);
  return payload.data;
};

export const fetchPlayers = async (filters) => {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.position) params.set("position", filters.position);
  if (filters.nationality) params.set("nationality", filters.nationality);
  if (filters.sort) params.set("sort", filters.sort);

  const response = await fetch(`${API_BASE}/players?${params.toString()}`);
  const payload = await handleResponse(response);
  return payload.data;
};
