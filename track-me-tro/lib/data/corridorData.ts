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
  isAircon?: boolean;
}

export type PassengerType = "regular" | "student" | "pwd" | "senior";
export type BookingStatus = "pending_seat" | "confirmed" | "cancelled" | "completed";

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
  origin?: string;
  destination?: string;
  paymentStatus?: "paid" | "unpaid";
  etaMinutes?: number;
  etaText?: string;
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
  "Bato": 40,
  "Hilongos": 60,
  "Hindang": 75,
  "Inopacan": 90,
  "Baybay City Terminal": 110,
  "VSU Main Campus": 120,
  "Albuera": 145,
  "Ormoc City Terminal": 165,
};

// Reverse direction (Ormoc → Sogod)
export const TRAVEL_TIMES_FROM_ORMOC: Record<string, number> = {
  "Ormoc City Terminal": 0,
  "Albuera": 20,
  "VSU Main Campus": 45,
  "Baybay City Terminal": 55,
  "Inopacan": 75,
  "Hindang": 90,
  "Hilongos": 105,
  "Bato": 125,
  "Sogod Terminal": 165,
};

// Central ticketing & booking convenience fee across all web & app touchpoints
export const CONVENIENCE_FEE = 20;

// Single source of truth for the 9 Route 70 stops with their exact km distance from Sogod Terminal
export const ROUTE_70_STOPS_KM: Record<string, number> = {
  "Sogod Terminal": 0.0,
  "Bato": 39.4,
  "Hilongos": 52.0,
  "Hindang": 64.5,
  "Inopacan": 78.2,
  "Baybay City": 96.8,
  "VSU Main Campus": 105.0,
  "Albuera": 135.7,
  "Ormoc City": 155.0,
};

export const ROUTE_70_STOPS_SOGOD_TO_ORMOC = [
  "Sogod Terminal",
  "Bato",
  "Hilongos",
  "Hindang",
  "Inopacan",
  "Baybay City",
  "VSU Main Campus",
  "Albuera",
  "Ormoc City",
] as const;

export const ROUTE_70_STOPS_ORMOC_TO_SOGOD = [
  "Ormoc City",
  "Albuera",
  "VSU Main Campus",
  "Baybay City",
  "Inopacan",
  "Hindang",
  "Hilongos",
  "Bato",
  "Sogod Terminal",
] as const;

// Exact base fare schedules originating from Sogod Terminal (Outbound)
export const SOGOD_TO_ORMOC_BASE_FARES: Record<string, number> = {
  "Bato": 65,
  "Hilongos": 90,
  "Hindang": 110,
  "Inopacan": 140,
  "Baybay City": 180,
  "VSU Main Campus": 215,
  "Albuera": 245,
  "Ormoc City": 275,
};

// Exact base fare schedules originating from Ormoc City (Inbound)
export const ORMOC_TO_SOGOD_BASE_FARES: Record<string, number> = {
  "Albuera": 35,
  "VSU Main Campus": 90,
  "Baybay City": 105,
  "Inopacan": 140,
  "Hindang": 160,
  "Hilongos": 185,
  "Bato": 205,
  "Sogod Terminal": 275,
};

/**
 * Normalizes stop name aliases (e.g., "Baybay City Terminal", "Sogod, Southern Leyte", "VSU Campus")
 * to the exact canonical stop keys in ROUTE_70_STOPS_KM.
 */
export function normalizeStopName(name: string): string {
  if (!name) return "Sogod Terminal";
  const lower = name.toLowerCase().trim();
  if (lower.includes("sogod")) return "Sogod Terminal";
  if (lower.includes("bato")) return "Bato";
  if (lower.includes("hilongos")) return "Hilongos";
  if (lower.includes("hindang")) return "Hindang";
  if (lower.includes("inopacan")) return "Inopacan";
  if (lower.includes("vsu") || lower.includes("visca")) return "VSU Main Campus";
  if (lower.includes("baybay")) return "Baybay City";
  if (lower.includes("albuera")) return "Albuera";
  if (lower.includes("ormoc")) return "Ormoc City";
  return name;
}

export function getDiscountRate(passengerType: PassengerType): number {
  switch (passengerType) {
    case "student":
    case "pwd":
    case "senior":
      return 0.2; // 20% statutory discount
    case "regular":
    default:
      return 0;
  }
}

export interface SegmentFareBreakdown {
  baseFare: number;
  discountRate: number;
  discountAmount: number;
  discountedBaseFare: number;
  convenienceFee: number;
  totalFare: number;
  distanceKm: number;
}

/**
 * Centralized segment fare engine for Route 70.
 * Calculates exact terminal-to-stop fares and proportional intermediate segment fares
 * with 20% concession discounts and a standardized convenience fee.
 */
export function calculateSegmentFare(
  origin: string,
  destination: string,
  passengerType: PassengerType,
  options?: { isPremium?: boolean; includeConvenienceFee?: boolean }
): SegmentFareBreakdown {
  const normOrigin = normalizeStopName(origin);
  const normDest = normalizeStopName(destination);

  const originKm = ROUTE_70_STOPS_KM[normOrigin] ?? 0.0;
  const destKm = ROUTE_70_STOPS_KM[normDest] ?? 155.0;
  const distanceKm = Math.abs(destKm - originKm);

  let baseFare = 275;

  // 1. Fixed LTFRB baseline if originating from Sogod Terminal
  if (normOrigin === "Sogod Terminal" && SOGOD_TO_ORMOC_BASE_FARES[normDest] !== undefined) {
    baseFare = SOGOD_TO_ORMOC_BASE_FARES[normDest];
  }
  // 2. Fixed LTFRB baseline if originating from Ormoc City
  else if (normOrigin === "Ormoc City" && ORMOC_TO_SOGOD_BASE_FARES[normDest] !== undefined) {
    baseFare = ORMOC_TO_SOGOD_BASE_FARES[normDest];
  }
  // 3. Intermediate stop-to-stop segment (e.g., VSU Main Campus ➔ Ormoc City, Baybay City ➔ Hilongos)
  else {
    const computed = distanceKm * (275 / 155);
    baseFare = Math.max(25, Math.round(computed / 5) * 5);
  }

  // 20% Concession Discount
  const discountRate = getDiscountRate(passengerType);
  const discountAmount = Math.round(baseFare * discountRate);
  const discountedBaseFare = baseFare - discountAmount;

  // Convenience Fee (₱20 standard)
  const includeFee = options?.includeConvenienceFee ?? true;
  const convenienceFee = includeFee ? CONVENIENCE_FEE : 0;
  const totalFare = discountedBaseFare + convenienceFee;

  return {
    baseFare,
    discountRate,
    discountAmount,
    discountedBaseFare,
    convenienceFee,
    totalFare,
    distanceKm: Number(distanceKm.toFixed(1)),
  };
}

export function calculateFare(
  baseFare: number,
  convenienceFee: number = CONVENIENCE_FEE,
  passengerType: PassengerType = "regular"
) {
  const discountRate = getDiscountRate(passengerType);
  const discountAmount = Math.round(baseFare * discountRate);
  const discountedBase = baseFare - discountAmount;
  const total = discountedBase + convenienceFee;
  return {
    baseFare,
    discountRate,
    discount: discountAmount,
    discountAmount,
    discountedBaseFare: discountedBase,
    convenienceFee,
    totalFare: total,
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
  baseFare: 275, // Regular full trip fare (₱220 with 20% student discount)
  convenienceFee: CONVENIENCE_FEE,
  isAircon: true,
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
  departureTime?: string;
  driverName?: string;
  elapsedMinutes?: number;
  progressPercent?: number;
  currentStop?: string;
  lastUpdatedMinsAgo?: number;
  lastUpdatedAt?: number;
  signalStatus?: "live" | "delayed";
  isDesignatedDelayed?: boolean;
}

export type CoordinatePair = [number, number];

/**
 * Turn-by-turn road coordinates extracted from OpenStreetMap road geometry
 * following the exact curves and turns of Route 70 / Western Leyte Coastal Highway
 * connecting Sogod Terminal, Bato, Hilongos, Hindang, Inopacan, Baybay City, VSU, Albuera, and Ormoc City.
 */
export const highwayWaypoints: CoordinatePair[] = leyteHighwayCoords as CoordinatePair[];

// Alias for flexibility
export const routeWaypoints: CoordinatePair[] = highwayWaypoints;

export const STOP_WAYPOINT_INDICES = [
  { name: "Sogod Terminal", mins: 0, idx: 0 },
  { name: "Bato", mins: 40, idx: 330 },
  { name: "Hilongos", mins: 60, idx: 397 },
  { name: "Hindang", mins: 75, idx: 448 },
  { name: "Inopacan", mins: 90, idx: 513 },
  { name: "Baybay City Terminal", mins: 110, idx: 726 },
  { name: "VSU Main Campus", mins: 120, idx: 808 },
  { name: "Albuera", mins: 145, idx: 938 },
  { name: "Ormoc City Terminal", mins: 165, idx: 1067 },
];

export interface CorridorLocation {
  currentStop: string;
  locationDesc: string;
  lat: number;
  lng: number;
  progressPercent: number;
}

/**
 * Computes exact highway coordinates, stop name, and progress for any elapsed minutes
 */
export function getLocationForElapsed(
  direction: "sogod-ormoc" | "ormoc-sogod" | "sogod-to-ormoc" | "ormoc-to-sogod",
  elapsedMinutes: number
): CorridorLocation {
  const isOutbound = direction === "sogod-ormoc" || direction === "sogod-to-ormoc";
  const clampedElapsed = Math.min(165, Math.max(0, elapsedMinutes));
  const progressPercent = Math.round((clampedElapsed / 165) * 100);

  // Compute waypoint index along highwayWaypoints
  let waypointIdx = 0;
  if (isOutbound) {
    let segIdx = 0;
    while (
      segIdx < STOP_WAYPOINT_INDICES.length - 1 &&
      STOP_WAYPOINT_INDICES[segIdx + 1].mins <= clampedElapsed
    ) {
      segIdx++;
    }
    const currentSeg = STOP_WAYPOINT_INDICES[segIdx];
    const nextSeg = STOP_WAYPOINT_INDICES[Math.min(segIdx + 1, STOP_WAYPOINT_INDICES.length - 1)];
    const segRange = nextSeg.mins - currentSeg.mins;
    const segProgress = segRange > 0 ? (clampedElapsed - currentSeg.mins) / segRange : 0;
    waypointIdx = Math.round(currentSeg.idx + segProgress * (nextSeg.idx - currentSeg.idx));
  } else {
    // Inbound: Ormoc -> Sogod (0 mins at Ormoc, 165 mins at Sogod)
    const effectiveSogodMins = 165 - clampedElapsed;
    let segIdx = 0;
    while (
      segIdx < STOP_WAYPOINT_INDICES.length - 1 &&
      STOP_WAYPOINT_INDICES[segIdx + 1].mins <= effectiveSogodMins
    ) {
      segIdx++;
    }
    const currentSeg = STOP_WAYPOINT_INDICES[segIdx];
    const nextSeg = STOP_WAYPOINT_INDICES[Math.min(segIdx + 1, STOP_WAYPOINT_INDICES.length - 1)];
    const segRange = nextSeg.mins - currentSeg.mins;
    const segProgress = segRange > 0 ? (effectiveSogodMins - currentSeg.mins) / segRange : 0;
    waypointIdx = Math.round(currentSeg.idx + segProgress * (nextSeg.idx - currentSeg.idx));
  }

  const [lat, lng] = highwayWaypoints[waypointIdx] || [10.50168, 124.74389];

  if (isOutbound) {
    if (elapsedMinutes >= 165) {
      return { currentStop: "Ormoc City Terminal", locationDesc: "Arrived at Ormoc City Terminal", lat, lng, progressPercent: 100 };
    } else if (elapsedMinutes >= 145) {
      return { currentStop: "Albuera", locationDesc: "Approaching Albuera • Bound for Ormoc", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 120) {
      return { currentStop: "VSU Main Campus", locationDesc: "Passing VSU Main Campus", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 110) {
      return { currentStop: "Baybay City Terminal", locationDesc: "At Baybay City Terminal", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 90) {
      return { currentStop: "Inopacan", locationDesc: elapsedMinutes === 90 ? "At Inopacan Terminal" : "Passing Inopacan • Bound for Baybay", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 75) {
      return { currentStop: "Hindang", locationDesc: "Passing Hindang", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 60) {
      return { currentStop: "Hilongos", locationDesc: "At Hilongos Terminal", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 40) {
      return { currentStop: "Bato", locationDesc: "Passing Bato Junction", lat, lng, progressPercent };
    } else if (elapsedMinutes > 0) {
      return { currentStop: "Sogod North Highway", locationDesc: "Departed Sogod • Approaching Bato", lat, lng, progressPercent };
    } else {
      return { currentStop: "Sogod Terminal", locationDesc: "At Sogod Terminal • Boarding", lat, lng, progressPercent: 0 };
    }
  } else {
    if (elapsedMinutes >= 165) {
      return { currentStop: "Sogod Terminal", locationDesc: "Arrived at Sogod Terminal", lat, lng, progressPercent: 100 };
    } else if (elapsedMinutes >= 125) {
      return { currentStop: "Bato", locationDesc: "Approaching Bato • Bound for Sogod", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 105) {
      return { currentStop: "Hilongos", locationDesc: "At Hilongos Terminal", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 90) {
      return { currentStop: "Hindang", locationDesc: "Passing Hindang", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 75) {
      return { currentStop: "Inopacan", locationDesc: elapsedMinutes === 75 ? "At Inopacan Terminal" : "Passing Inopacan • Bound for Hindang", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 55) {
      return { currentStop: "Baybay City Terminal", locationDesc: "At Baybay City Terminal", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 45) {
      return { currentStop: "VSU Main Campus", locationDesc: "Passing VSU Campus", lat, lng, progressPercent };
    } else if (elapsedMinutes >= 20) {
      return { currentStop: "Albuera", locationDesc: "Passing Albuera", lat, lng, progressPercent };
    } else if (elapsedMinutes > 0) {
      return { currentStop: "Ormoc South Highway", locationDesc: "Departed Ormoc • Approaching Albuera", lat, lng, progressPercent };
    } else {
      return { currentStop: "Ormoc City Terminal", locationDesc: "At Ormoc Terminal • Boarding", lat, lng, progressPercent: 0 };
    }
  }
}

/**
 * 4 default mock buses (kept for fallback / backward compatibility)
 */
export const activeBuses: ActiveBus[] = [
  // ── Sogod to Ormoc (Outbound) ──
  {
    id: "DMS-054",
    direction: "sogod-to-ormoc",
    currentLocation: "At Inopacan Terminal",
    eta: "75 mins away",
    seatsLeft: 14,
    lat: 10.50168,
    lng: 124.74389,
    departureTime: "7:30 AM",
    elapsedMinutes: 90,
    progressPercent: 55,
    currentStop: "Inopacan",
    lastUpdatedMinsAgo: 0,
    signalStatus: "live",
    isDesignatedDelayed: false,
  },
  {
    id: "DMS-055",
    direction: "sogod-to-ormoc",
    currentLocation: "At Hilongos Terminal",
    eta: "105 mins away",
    seatsLeft: 8,
    lat: 10.3750,
    lng: 124.7450,
    departureTime: "8:00 AM",
    elapsedMinutes: 60,
    progressPercent: 36,
    currentStop: "Hilongos",
    lastUpdatedMinsAgo: 4,
    signalStatus: "delayed",
    isDesignatedDelayed: true,
  },
  {
    id: "DMS-057",
    direction: "sogod-to-ormoc",
    currentLocation: "Departed Sogod • Approaching Bato",
    eta: "150 mins away",
    seatsLeft: 19,
    lat: 10.3833,
    lng: 124.8000,
    departureTime: "9:00 AM",
    elapsedMinutes: 20,
    progressPercent: 12,
    currentStop: "Bato",
    lastUpdatedMinsAgo: 1,
    signalStatus: "live",
    isDesignatedDelayed: false,
  },
  {
    id: "DMS-059",
    direction: "sogod-to-ormoc",
    currentLocation: "Passing Baybay City Terminal",
    eta: "45 mins away",
    seatsLeft: 5,
    lat: 10.6765,
    lng: 124.7986,
    departureTime: "7:00 AM",
    elapsedMinutes: 120,
    progressPercent: 73,
    currentStop: "Baybay City Terminal",
    lastUpdatedMinsAgo: 7,
    signalStatus: "delayed",
    isDesignatedDelayed: true,
  },

  // ── Ormoc to Sogod (Inbound) ──
  {
    id: "DMS-053",
    direction: "ormoc-to-sogod",
    currentLocation: "At Inopacan Terminal",
    eta: "90 mins away",
    seatsLeft: 22,
    lat: 10.50168,
    lng: 124.74389,
    departureTime: "7:30 AM",
    elapsedMinutes: 90,
    progressPercent: 55,
    currentStop: "Inopacan",
    lastUpdatedMinsAgo: 0,
    signalStatus: "live",
    isDesignatedDelayed: false,
  },
  {
    id: "DMS-056",
    direction: "ormoc-to-sogod",
    currentLocation: "Passing Albuera",
    eta: "135 mins away",
    seatsLeft: 11,
    lat: 10.9168,
    lng: 124.6958,
    departureTime: "8:30 AM",
    elapsedMinutes: 30,
    progressPercent: 18,
    currentStop: "Albuera",
    lastUpdatedMinsAgo: 5,
    signalStatus: "delayed",
    isDesignatedDelayed: true,
  },
  {
    id: "DMS-058",
    direction: "ormoc-to-sogod",
    currentLocation: "Approaching Hindang",
    eta: "65 mins away",
    seatsLeft: 16,
    lat: 10.4350,
    lng: 124.7280,
    departureTime: "8:00 AM",
    elapsedMinutes: 100,
    progressPercent: 61,
    currentStop: "Hindang",
    lastUpdatedMinsAgo: 1,
    signalStatus: "live",
    isDesignatedDelayed: false,
  },
  {
    id: "DMS-060",
    direction: "ormoc-to-sogod",
    currentLocation: "Passing VSU Main Campus",
    eta: "115 mins away",
    seatsLeft: 7,
    lat: 10.7450,
    lng: 124.7920,
    departureTime: "8:45 AM",
    elapsedMinutes: 50,
    progressPercent: 30,
    currentStop: "VSU Main Campus",
    lastUpdatedMinsAgo: 8,
    signalStatus: "delayed",
    isDesignatedDelayed: true,
  },
];

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
    ? (TRAVEL_TIMES_FROM_SOGOD[userLocation] ?? 110)
    : (TRAVEL_TIMES_FROM_ORMOC[userLocation] ?? 55);

  const busElapsedMinutes = bus.elapsedMinutes ?? 90;
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
