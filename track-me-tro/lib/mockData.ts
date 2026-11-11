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

export type PassengerType = "regular" | "student" | "pwd" | "senior";
export type BookingStatus = "pending_seat" | "confirmed" | "cancelled";

export interface BookingRequest {
  id: string;
  tripId: string;
  busNumber: string;
  departureTime: string;
  direction: "sogod-ormoc" | "ormoc-sogod";
  passengerType: PassengerType;
  paymentMethod: "GCash" | "Maya";
  status: BookingStatus;
  assignedSeat: string | null;
  passengerName: string;
  baseFare: number;
  discount: number;
  convenienceFee: number;
  totalFare: number;
  createdAt: string;
  pnr: string;
}

// Available transit corridor stops
export const CORRIDOR_STOPS = [
  "Sogod Terminal",
  "Bato",
  "Hilongos",
  "Hindang",
  "VSU Main Campus",
  "Baybay City Terminal",
  "Inopacan",
  "Albuera",
  "Ormoc City Terminal",
] as const;

export type CorridorStop = typeof CORRIDOR_STOPS[number];

// Travel time estimates in minutes from Sogod Terminal to each stop
export const TRAVEL_TIMES_FROM_SOGOD: Record<string, number> = {
  "Sogod Terminal": 0,
  "Bato": 45,
  "Hilongos": 75,
  "Hindang": 90,
  "VSU Main Campus": 115,
  "Baybay City Terminal": 120,
  "Inopacan": 135,
  "Albuera": 150,
  "Ormoc City Terminal": 165,
};

// Reverse direction (Ormoc → Sogod)
export const TRAVEL_TIMES_FROM_ORMOC: Record<string, number> = {
  "Ormoc City Terminal": 0,
  "Albuera": 15,
  "Inopacan": 30,
  "Baybay City Terminal": 45,
  "VSU Main Campus": 50,
  "Hindang": 75,
  "Hilongos": 90,
  "Bato": 120,
  "Sogod Terminal": 165,
};

export function getDiscountRate(passengerType: PassengerType): number {
  switch (passengerType) {
    case "student":
    case "pwd":
    case "senior":
      return 0.2; // 20% discount
    case "regular":
    default:
      return 0;
  }
}

export function calculateFare(baseFare: number, convenienceFee: number, passengerType: PassengerType) {
  const discount = getDiscountRate(passengerType);
  const discountedBase = baseFare * (1 - discount);
  const total = discountedBase + convenienceFee;
  return {
    baseFare,
    discount: baseFare * discount,
    convenienceFee,
    totalFare: Math.round(total * 100) / 100,
  };
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
