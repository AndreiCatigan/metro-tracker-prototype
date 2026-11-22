import { SimulatedTime } from "../AppContext";
import { SCHEDULE_INTERVALS, DRIVER_NAMES, parseTimeToMinutes } from "./scheduleData";
import { ActiveBus, getLocationForElapsed } from "./corridorData";

export interface DepartedBus {
  id: string;
  busNumber: string;
  driverName: string;
  departureTime: string;
  terminal: string;
  gate: string;
  isAircon: boolean;
  passengers: number;
  capacity: number;
  status: "en_route" | "arrived";
  currentStop: string;
  nextStop: string;
  speed: string;
  progressPercent: number;
}

/**
 * Formats a relative minutes-ago count into user-friendly Kinetic Transit copy:
 * - 0 mins -> "Last updated just now"
 * - 1 min  -> "Last updated 1 min ago"
 * - >1 mins -> "Last updated ${mins} mins ago"
 */
export function formatLastUpdated(minsAgo: number): string {
  if (minsAgo <= 0) return "Last updated just now";
  if (minsAgo === 1) return "Last updated 1 min ago";
  return `Last updated ${minsAgo} mins ago`;
}

/**
 * Determines signal telemetry state:
 * - <= 2 minutes: "live" (solid real-time GPS telemetry)
 * - > 2 minutes: "delayed" (simulating coastal/mountain highway low-signal stretches along Route 70)
 */
export function computeBusSignalStatus(minsAgo: number): "live" | "delayed" {
  return minsAgo <= 2 ? "live" : "delayed";
}

/**
 * Returns all active buses along both corridors (Sogod ➔ Ormoc and Ormoc ➔ Sogod)
 * for the given simulated time, plotting them accurately along the highway based on elapsed travel time.
 */
export function getActiveBuses(simulatedTime: SimulatedTime): ActiveBus[] {
  const currentMinutes = parseTimeToMinutes(simulatedTime);
  const buses: ActiveBus[] = [];

  const directions: Array<"sogod-to-ormoc" | "ormoc-to-sogod"> = [
    "sogod-to-ormoc",
    "ormoc-to-sogod",
  ];

  directions.forEach((dir) => {
    SCHEDULE_INTERVALS.forEach((item, idx) => {
      const depMins = parseTimeToMinutes(item.dep);
      const arrMins = depMins + 165;

      // Active buses are those that have departed or are boarding, and have not yet arrived
      if (currentMinutes >= depMins && currentMinutes < arrMins) {
        const elapsed = currentMinutes - depMins;
        const loc = getLocationForElapsed(dir, elapsed);
        const remainingToDest = 165 - elapsed;
        const eta =
          remainingToDest <= 0
            ? "Arriving now"
            : remainingToDest < 60
            ? `${remainingToDest} mins away`
            : `${Math.floor(remainingToDest / 60)}h ${remainingToDest % 60}m away`;

        // Assign realistic, varied freshness values across the fleet
        // Cycle pattern: bus 0 = 0 mins (live), bus 1 = 1 min (live), bus 2 = 2 mins (live), bus 3 = 4 mins (delayed), bus 4 = 5 mins (delayed)
        const freshnessPattern = [0, 1, 2, 4, 5, 1];
        const lastUpdatedMinsAgo = freshnessPattern[idx % freshnessPattern.length];
        const signalStatus = computeBusSignalStatus(lastUpdatedMinsAgo);

        buses.push({
          id: `DMS-0${item.num}`,
          direction: dir,
          currentLocation: loc.locationDesc,
          eta,
          seatsLeft: 10 + (idx % 12),
          lat: loc.lat,
          lng: loc.lng,
          departureTime: item.dep,
          driverName: DRIVER_NAMES[idx % DRIVER_NAMES.length],
          elapsedMinutes: elapsed,
          progressPercent: loc.progressPercent,
          currentStop: loc.currentStop,
          lastUpdatedMinsAgo,
          signalStatus,
        });
      }
    });
  });

  return buses;
}

/**
 * Returns dynamic departed buses telemetry matching active simulated time
 */
export function getDepartedBuses(
  time: SimulatedTime,
  direction: "sogod-ormoc" | "ormoc-sogod" | "sogod-to-ormoc" | "ormoc-to-sogod" = "sogod-ormoc"
): DepartedBus[] {
  const isOutbound = direction === "sogod-ormoc" || direction === "sogod-to-ormoc";
  const currentMinutes = parseTimeToMinutes(time);
  const result: DepartedBus[] = [];

  SCHEDULE_INTERVALS.forEach((item, idx) => {
    const depMins = parseTimeToMinutes(item.dep);
    const arrMins = depMins + 165;

    if (currentMinutes > depMins) {
      const isArrived = currentMinutes >= arrMins;
      const elapsed = currentMinutes - depMins;
      const loc = getLocationForElapsed(isOutbound ? "sogod-ormoc" : "ormoc-sogod", elapsed);

      result.push({
        id: isArrived ? `arrived-${item.num}` : `en_route-${item.num}`,
        busNumber: `DMS-0${item.num}`,
        driverName: DRIVER_NAMES[idx % DRIVER_NAMES.length],
        departureTime: item.dep,
        terminal: isOutbound ? "Sogod Terminal" : "Ormoc City Terminal",
        gate: `Bay ${(idx % 3) + 1}`,
        isAircon: item.aircon,
        passengers: 40 + (idx % 6),
        capacity: 45,
        status: isArrived ? "arrived" : "en_route",
        currentStop: loc.currentStop,
        nextStop: isArrived
          ? isOutbound
            ? "Arrived at Ormoc Terminal"
            : "Arrived at Sogod Terminal"
          : loc.locationDesc,
        speed: isArrived ? "0 km/h (Docked)" : "54 km/h",
        progressPercent: loc.progressPercent,
      });
    }
  });

  return result;
}
