import api from "../../../services/api";

export const getInterfaces = async () => {
  return await api.get("/network/interfaces");
};

export const getInterface = async (id: string) => {
  return await api.get(`/network/interfaces/${id}`);
};

export const createInterface = async (data: any) => {
  return await api.post("/network/interfaces", data);
};

export const updateInterface = async (
  id: string,
  data: any
) => {
  return await api.put(
    `/network/interfaces/${id}`,
    data
  );
};

export const deleteInterface = async (
  id: string
) => {
  return await api.delete(
    `/network/interfaces/${id}`
  );
};