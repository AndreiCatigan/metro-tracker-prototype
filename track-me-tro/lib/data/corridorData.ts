import leyteHighwayCoords from "../leyteHighwayCoords.json";

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

// Available transit corridor stops (Geographical Order South to North)
export const CORRIDOR_STOPS = [
  "Sogod Terminal",
  "Bato",
  "Hilongos",
  "Hindang",
  "Inopacan",
  "Baybay City Terminal",
  "VSU Main Campus",
  "Albuera",
  "Ormoc City Terminal",
] as const;

export type CorridorStop = typeof CORRIDOR_STOPS[number];

// Real GPS Stop Coordinates along Route 70 / Leyte Coastal Highway
export const STOP_COORDINATES: Record<string, { lat: number; lng: number; displayName: string }> = {
  "Sogod Terminal": { lat: 10.3860, lng: 124.9810, displayName: "Sogod" },
  "Bato": { lat: 10.3320, lng: 124.7890, displayName: "Bato" },
  "Hilongos": { lat: 10.3750, lng: 124.7450, displayName: "Hilongos" },
  "Hindang": { lat: 10.4350, lng: 124.7280, displayName: "Hindang" },
  "Inopacan": { lat: 10.5015, lng: 124.7438, displayName: "Inopacan" },
  "Baybay City Terminal": { lat: 10.6780, lng: 124.8000, displayName: "Baybay City" },
  "VSU Main Campus": { lat: 10.7450, lng: 124.7920, displayName: "VSU Campus" },
  "Albuera": { lat: 10.9168, lng: 124.6958, displayName: "Albuera" },
  "Ormoc City Terminal": { lat: 11.0060, lng: 124.6070, displayName: "Ormoc City" },
};

// Travel time estimates in minutes from Sogod Terminal to each stop
export const TRAVEL_TIMES_FROM_SOGOD: Record<string, number> = {
  "Sogod Terminal": 0,
  "Bato": 45,
  "Hilongos": 75,
  "Hindang": 90,
  "Inopacan": 105,
  "Baybay City Terminal": 120,
  "VSU Main Campus": 128,
  "Albuera": 148,
  "Ormoc City Terminal": 165,
};

// Reverse direction (Ormoc → Sogod)
export const TRAVEL_TIMES_FROM_ORMOC: Record<string, number> = {
  "Ormoc City Terminal": 0,
  "Albuera": 17,
  "VSU Main Campus": 37,
  "Baybay City Terminal": 45,
  "Inopacan": 60,
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

// ── Live Map Fleet Data ──
export interface ActiveBus {
  id: string;
  direction: "sogod-to-ormoc" | "ormoc-to-sogod";
  currentLocation: string;
  eta: string;
  seatsLeft: number;
  lat: number;
  lng: number;
}

export type CoordinatePair = [number, number];

/**
 * 4 mock buses actively tracking along the Sogod ↔ Ormoc corridor
 * (2 traveling Sogod ➔ Ormoc, 2 traveling Ormoc ➔ Sogod)
 */
export const activeBuses: ActiveBus[] = [
  {
    id: "DMS-048",
    direction: "sogod-to-ormoc",
    currentLocation: "Passing Hilongos",
    eta: "8 mins away",
    seatsLeft: 14,
    lat: 10.3753,
    lng: 124.7486,
  },
  {
    id: "ULTR-102",
    direction: "sogod-to-ormoc",
    currentLocation: "Approaching Baybay Terminal",
    eta: "12 mins away",
    seatsLeft: 8,
    lat: 10.6620,
    lng: 124.7935,
  },
  {
    id: "SLB-209",
    direction: "ormoc-to-sogod",
    currentLocation: "Departing Inopacan",
    eta: "5 mins away",
    seatsLeft: 22,
    lat: 10.5015,
    lng: 124.7438,
  },
  {
    id: "DMS-091",
    direction: "ormoc-to-sogod",
    currentLocation: "Passing Albuera",
    eta: "18 mins away",
    seatsLeft: 11,
    lat: 10.9168,
    lng: 124.6958,
  },
];

/**
 * Turn-by-turn road coordinates extracted from OpenStreetMap road geometry
 * following the exact curves and turns of Route 70 / Western Leyte Coastal Highway
 * connecting Sogod Terminal, Bato, Hilongos, Hindang, Inopacan, Baybay City, VSU, Albuera, and Ormoc City.
 */
export const highwayWaypoints: CoordinatePair[] = leyteHighwayCoords as CoordinatePair[];

// Alias for flexibility
export const routeWaypoints: CoordinatePair[] = highwayWaypoints;

export interface BusETAResult {
  etaMinutes: number;
  etaText: string;
  statusText: string;
  hasPassed: boolean;
}

/**
 * Calculates real-time ETA from the bus's active position to the commuter's simulated location
 */
export function calculateBusETA(bus: ActiveBus, userLocation: string): BusETAResult {
  const isOutbound = bus.direction === "sogod-to-ormoc";
  const userMinutes = isOutbound
    ? (TRAVEL_TIMES_FROM_SOGOD[userLocation] ?? 128)
    : (TRAVEL_TIMES_FROM_ORMOC[userLocation] ?? 37);

  // Bus current elapsed minutes from trip origin
  let busElapsedMinutes = 0;
  if (isOutbound) {
    if (bus.id === "DMS-048") busElapsedMinutes = 75; // Hilongos
    else if (bus.id === "ULTR-102") busElapsedMinutes = 115; // Approaching Baybay
    else busElapsedMinutes = 75;
  } else {
    if (bus.id === "DMS-091") busElapsedMinutes = 17; // Albuera
    else if (bus.id === "SLB-209") busElapsedMinutes = 60; // Inopacan
    else busElapsedMinutes = 30;
  }

  const diff = userMinutes - busElapsedMinutes;

  if (diff > 0) {
    // Bus is heading towards user
    const etaText =
      diff < 60
        ? `${diff} mins away`
        : `${Math.floor(diff / 60)}h ${diff % 60 > 0 ? `${diff % 60}m ` : ""}away`;
    return {
      etaMinutes: diff,
      etaText,
      statusText: `Away from ${userLocation} • Currently ${bus.currentLocation}`,
      hasPassed: false,
    };
  } else if (diff === 0) {
    return {
      etaMinutes: 0,
      etaText: "Arriving now",
      statusText: `Arrived at ${userLocation} • Boarding`,
      hasPassed: false,
    };
  } else {
    // Bus has already passed user's stop
    const pastMins = Math.abs(diff);
    return {
      etaMinutes: diff,
      etaText: `${pastMins} mins past stop`,
      statusText: `Already passed ${userLocation} • Bound for ${isOutbound ? "Ormoc" : "Sogod"}`,
      hasPassed: true,
    };
  }
}
