import api from "../../../services/api";

export function registerDevice(data: any) {
  return api.post("/sub-vendo/register", data);
}

export function getPendingDevices() {
  return api.get("/sub-vendo/pending");
}

export function configureDevice(id: string, data: any) {
  return api.put(`/sub-vendo/${id}`, data);
}

export function getRegisteredDevices() {
  return api.get("/sub-vendo/registered");
}