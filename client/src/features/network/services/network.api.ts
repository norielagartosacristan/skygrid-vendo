import api from "../../../services/api";

export const getGeneralSettings = () =>
  api.get("/network/general");

export const saveGeneralSettings = (data: any) =>
  api.post("/network/general", data);