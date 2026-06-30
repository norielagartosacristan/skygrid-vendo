export interface Machine {
  id: number;
  name: string;
  ip: string;
  mac: string;
  vendor: string;
  location: string;
  status: "ONLINE" | "OFFLINE";
}