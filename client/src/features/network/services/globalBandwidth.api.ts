import api from "../../../services/api";

export const getGlobalBandwidth = async () => {
  return await api.get("/network/bandwidth");
};

export const saveGlobalBandwidth = async (data: any) => {
  return await api.post("/network/bandwidth", data);
};