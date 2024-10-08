const axios = require("axios").default;
import { SERVER_URL } from "../constants/Server";
import { RequestError } from "../constants/Error";

const axiosAgent = axios.create({
  baseURL: SERVER_URL,
});

export const getPlayers = () => {
  return axiosAgent.get("/players").then((response) => {
    if (response.status === 200) {
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(RequestError.UNSUCCESS);
    }
    throw new Error(RequestError.FAILED);
  });
};

export const getPlayersPositions = () => {
  return axiosAgent.get("/players/positions").then((response) => {
    if (response.status === 200) {
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(RequestError.UNSUCCESS);
    }
    throw new Error(RequestError.FAILED);
  });
};

export const getPlayersNationality = () => {
  return axiosAgent.get("/players/nationality").then((response) => {
    if (response.status === 200) {
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(RequestError.UNSUCCESS);
    }
    throw new Error(RequestError.FAILED);
  });
};
