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
