export interface Package {
  id: number;
  name: string;
  price: number;
  duration: string;
  speed: string;
  status: "ACTIVE" | "DISABLED";
}