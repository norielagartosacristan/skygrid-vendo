import api from "./api";

export async function getInterfaces() {
  const { data } = await api.get("/network/interfaces");
  return data;
}