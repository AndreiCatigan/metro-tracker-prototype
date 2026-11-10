export type SeatStatus = "available" | "occupied" | "app_reserved" | "selected";

export interface Seat {
  id: string;
  status: SeatStatus;
}

export interface BusDetails {
  id: string;
  routeTitle: string;
  capacity: number;
  baseFare: number;
  convenienceFee: number;
}

export const initialSeats: Seat[] = Array.from({ length: 40 }, (_, index) => ({
  id: (index + 1).toString(),
  status: Math.random() < 0.3 ? "occupied" : "available",
}));

export const busDetails: BusDetails = {
  id: "DMS-048",
  routeTitle: "Sogod ➔ Ormoc",
  capacity: 40,
  baseFare: 80,
  convenienceFee: 15,
};
