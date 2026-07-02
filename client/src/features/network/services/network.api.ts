import api from "../../../services/api";

export const getGeneralSettings = async () => {
  return await api.get("/network/general");
};

export const saveGeneralSettings = async (data: any) => {
  return await api.post("/network/general", data);
};