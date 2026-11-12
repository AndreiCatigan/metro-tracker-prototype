import { SimulatedTime } from "../AppContext";
import {
  TRAVEL_TIMES_FROM_SOGOD,
  TRAVEL_TIMES_FROM_ORMOC,
  getLocationForElapsed,
} from "./corridorData";

export interface BusTrip {
  id: string;
  tripNum: number;
  terminalArrival: string;
  departureTime: string;
  busNumber: string;
  isAircon: boolean;
  driverName: string;
  passengersOnBoard: number;
  capacity: number;
  status: "boarding" | "in_queue" | "departed" | "scheduled" | "arrived";
  locationDesc: string;
  isDetailed: boolean;
  gate: string;
  etaAtCommuterStop?: string;
  origin?: string;
  destination?: string;
}

export interface AvailableBookingTrip {
  id: string;
  busNumber: string;
  departureTime: string;
  terminalArrival: string;
  isAircon: boolean;
  driverName: string;
  availableSeats: number;
  capacity: number;
  status: "boarding" | "in_queue" | "scheduled";
  etaAtDestination: string;
  direction: "sogod-ormoc" | "ormoc-sogod";
}

export interface ScheduleInterval {
  arr: string;
  dep: string;
  num: number;
  aircon: boolean;
}

export const DRIVER_NAMES: string[] = [
  "Kuya Rolly B.",
  "Mang Danilo T.",
  "Kuya Edmar P.",
  "Kuya Nestor V.",
  "Mang Crisanto L.",
  "Kuya Benjie M.",
  "Kuya Arnel S.",
  "Kuya Marlon D.",
  "Mang Ruben F.",
  "Kuya Noel G.",
  "Kuya Gerald T.",
  "Mang Mario R.",
];

export const SCHEDULE_INTERVALS: ScheduleInterval[] = [
  { arr: "4:00 AM", dep: "4:30 AM", num: 47, aircon: true },
  { arr: "4:30 AM", dep: "5:00 AM", num: 48, aircon: true },
  { arr: "5:00 AM", dep: "5:30 AM", num: 49, aircon: false },
  { arr: "5:30 AM", dep: "6:00 AM", num: 50, aircon: true },
  { arr: "6:00 AM", dep: "6:30 AM", num: 51, aircon: true },
  { arr: "6:30 AM", dep: "7:00 AM", num: 52, aircon: false },
  { arr: "7:00 AM", dep: "7:30 AM", num: 53, aircon: true },
  { arr: "7:30 AM", dep: "8:00 AM", num: 54, aircon: true },
  { arr: "8:00 AM", dep: "8:30 AM", num: 55, aircon: false },
  { arr: "8:30 AM", dep: "9:00 AM", num: 56, aircon: true },
  { arr: "9:00 AM", dep: "9:30 AM", num: 57, aircon: true },
  { arr: "9:30 AM", dep: "10:00 AM", num: 58, aircon: false },
  { arr: "10:00 AM", dep: "10:30 AM", num: 59, aircon: true },
  { arr: "10:30 AM", dep: "11:00 AM", num: 60, aircon: true },
  { arr: "11:00 AM", dep: "11:30 AM", num: 61, aircon: false },
  { arr: "11:30 AM", dep: "12:00 PM", num: 62, aircon: true },
  { arr: "12:00 PM", dep: "12:30 PM", num: 63, aircon: true },
  { arr: "12:30 PM", dep: "1:00 PM", num: 64, aircon: false },
  { arr: "1:00 PM", dep: "1:30 PM", num: 65, aircon: true },
  { arr: "1:30 PM", dep: "2:00 PM", num: 66, aircon: true },
  { arr: "2:00 PM", dep: "2:30 PM", num: 67, aircon: false },
  { arr: "2:30 PM", dep: "3:00 PM", num: 68, aircon: true },
  { arr: "3:00 PM", dep: "3:30 PM", num: 69, aircon: true },
  { arr: "3:30 PM", dep: "4:00 PM", num: 70, aircon: false },
  { arr: "4:00 PM", dep: "4:30 PM", num: 71, aircon: true },
  { arr: "4:30 PM", dep: "5:00 PM", num: 72, aircon: false },
];

/**
 * Parses time strings like "8:30 AM" or "2:00 PM" into minutes past midnight
 */
export function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Formats minutes past midnight into standard "H:MM AM/PM" format
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  let hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hours >= 12 ? "PM" : "AM";

  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;

  const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minStr} ${period}`;
}

/**
 * Calculates arrival ETA at a specific stop given departure time and travel minutes
 */
export function calculateTripETA(departureTime: string, travelMinutes: number): string {
  const depMins = parseTimeToMinutes(departureTime);
  const arrivalMins = depMins + travelMinutes;
  return formatMinutesToTime(arrivalMins);
}

/**
 * Generates the full day's bus schedule dynamically based on active simulated time
 */
export function generateScheduleTrips(
  direction: "sogod-ormoc" | "ormoc-sogod",
  simulatedTime: SimulatedTime
): BusTrip[] {
  const currentMinutes = parseTimeToMinutes(simulatedTime);
  const destName = direction === "sogod-ormoc" ? "Ormoc" : "Sogod";
  const originName = direction === "sogod-ormoc" ? "Sogod" : "Ormoc";

  return SCHEDULE_INTERVALS.map((item, idx) => {
    const depMins = parseTimeToMinutes(item.dep);
    const arrMins = depMins + 165; // ~2h 45m travel time

    let status: BusTrip["status"];
    let locationDesc = "";
    let passengersOnBoard = 0;
    let isDetailed = false;

    if (currentMinutes >= arrMins) {
      status = "arrived";
      locationDesc = `Arrived at ${destName} Terminal`;
      passengersOnBoard = 45;
      isDetailed = false;
    } else if (currentMinutes > depMins) {
      status = "departed";
      const elapsed = currentMinutes - depMins;
      const loc = getLocationForElapsed(direction, elapsed);
      locationDesc = `En Route • ${loc.locationDesc}`;
      passengersOnBoard = 42 + (idx % 4);
      isDetailed = currentMinutes - depMins <= 30;
    } else if (currentMinutes === depMins || (depMins - currentMinutes <= 30 && depMins >= currentMinutes)) {
      status = "boarding";
      locationDesc = "Terminal Bay 2 • Boarding Passengers";
      passengersOnBoard = 38;
      isDetailed = true;
    } else if (depMins - currentMinutes <= 60) {
      status = "in_queue";
      locationDesc = "Terminal Bay 3 • In Queue";
      passengersOnBoard = 12;
      isDetailed = true;
    } else {
      status = "scheduled";
      locationDesc = `Scheduled Departure • ${item.dep}`;
      passengersOnBoard = 0;
      isDetailed = false;
    }

    const gateIndex = (idx % 4) + 1;

    return {
      id: `${direction}-${idx + 1}`,
      tripNum: idx + 1,
      busNumber: `DMS-0${item.num}`,
      driverName: DRIVER_NAMES[idx % DRIVER_NAMES.length],
      terminalArrival: item.arr,
      departureTime: item.dep,
      isAircon: item.aircon,
      passengersOnBoard,
      capacity: 45,
      status,
      locationDesc,
      isDetailed,
      gate: `Bay ${gateIndex}`,
      origin: `${originName} Terminal`,
      destination: `${destName} Terminal`,
    };
  });
}

/**
 * Generates available trips for booking filtered from simulated time forward
 */
export function generateAvailableBookingTrips(
  direction: "sogod-ormoc" | "ormoc-sogod",
  simulatedTime: SimulatedTime
): AvailableBookingTrip[] {
  const currentMinutes = parseTimeToMinutes(simulatedTime);
  const travelMinutes =
    direction === "sogod-ormoc"
      ? (TRAVEL_TIMES_FROM_SOGOD["Ormoc City Terminal"] ?? 165)
      : (TRAVEL_TIMES_FROM_ORMOC["Sogod Terminal"] ?? 165);

  const validIntervals = SCHEDULE_INTERVALS.filter((item) => {
    return parseTimeToMinutes(item.dep) >= currentMinutes;
  });

  return validIntervals.map((t, idx) => {
    const depM = parseTimeToMinutes(t.dep);
    let status: "boarding" | "in_queue" | "scheduled";
    let availSeats = 45;

    if (depM === currentMinutes) {
      status = "boarding";
      availSeats = 7 + (idx % 5);
    } else if (depM - currentMinutes <= 30) {
      status = "in_queue";
      availSeats = 18 + (idx % 8);
    } else {
      status = "scheduled";
      availSeats = 45;
    }

    const etaStr = calculateTripETA(t.dep, travelMinutes);

    return {
      id: `${direction}-trip-${idx + 1}`,
      busNumber: `DMS-0${t.num}`,
      departureTime: t.dep,
      terminalArrival: t.arr,
      isAircon: t.aircon,
      driverName: DRIVER_NAMES[idx % DRIVER_NAMES.length],
      availableSeats: availSeats,
      capacity: 45,
      status,
      etaAtDestination: etaStr,
      direction,
    };
  });
}

/**
 * Quick book preview trips for the Home dashboard
 */
export function getQuickBookTrips(
  simulatedTime: SimulatedTime,
  direction: "sogod-ormoc" | "ormoc-sogod",
  travelMinutes: number
): {
  id: string;
  busNumber: string;
  departure: string;
  eta: string;
  isAircon: boolean;
  seatsAvailable: number;
  gate: string;
}[] {
  const allTrips = generateAvailableBookingTrips(direction, simulatedTime);
  const sliced = allTrips.slice(0, 3);

  return sliced.map((trip, idx) => ({
    id: trip.id,
    busNumber: trip.busNumber,
    departure: trip.departureTime,
    eta: calculateTripETA(trip.departureTime, travelMinutes),
    isAircon: trip.isAircon,
    seatsAvailable: trip.availableSeats,
    gate: `Bay ${idx + 1}`,
  }));
}
