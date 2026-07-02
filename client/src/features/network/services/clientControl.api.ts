import api from "../../../services/api";

export const getClientControl = async () => {
  return await api.get("/network/client-control");
};

export const saveClientControl = async (data: any) => {
  return await api.post("/network/client-control", data);
};