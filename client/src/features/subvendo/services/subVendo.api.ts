import api from "../../../services/api";

export function registerDevice(data: any) {
  return api.post("/subvendo/register", data);
}

export function getPendingDevices() {
  return api.get("/subvendo/pending");
}

export function configureDevice(id: string, data: any) {
    return api.put(`/subvendo/${id}`, data);
}

export function getRegisteredDevices() {
  return api.get("/subvendo/registered");
}