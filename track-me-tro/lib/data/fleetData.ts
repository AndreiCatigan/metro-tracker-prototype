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
 * - <=0 mins -> "Last updated just now"
 * - 1 min    -> "Last updated 1 min ago"
 * - >1 mins  -> "Last updated ${mins} mins ago"
 */
export function formatLastUpdated(minsAgo: number): string {
  const rounded = Math.round(minsAgo);
  if (rounded <= 0) return "Last updated just now";
  if (rounded === 1) return "Last updated 1 min ago";
  return `Last updated ${rounded} mins ago`;
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
 * Guarantees exactly 2 not-live (delayed) buses per direction regardless of time of day for presentation demos.
 */
export function getActiveBuses(simulatedTime: SimulatedTime): ActiveBus[] {
  const currentMinutes = parseTimeToMinutes(simulatedTime);
  const buses: ActiveBus[] = [];

  const directions: Array<"sogod-to-ormoc" | "ormoc-to-sogod"> = [
    "sogod-to-ormoc",
    "ormoc-to-sogod",
  ];

  directions.forEach((dir) => {
    const dirBuses: ActiveBus[] = [];

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

        dirBuses.push({
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
          lastUpdatedMinsAgo: 0,
          signalStatus: "live",
          isDesignatedDelayed: false,
        });
      }
    });

    // Presentation Safeguard: If current clock time produces fewer than 4 buses (e.g. night or early hours),
    // supply representative simulated active buses so the map is never empty during presentation demos.
    if (dirBuses.length < 4) {
      const demoIntervals = [
        { num: dir === "sogod-to-ormoc" ? 54 : 53, elapsed: 45, dep: "7:00 AM" },
        { num: dir === "sogod-to-ormoc" ? 55 : 56, elapsed: 75, dep: "7:30 AM" },
        { num: dir === "sogod-to-ormoc" ? 57 : 58, elapsed: 105, dep: "8:00 AM" },
        { num: dir === "sogod-to-ormoc" ? 59 : 60, elapsed: 135, dep: "8:30 AM" },
      ];

      demoIntervals.forEach((demo, dIdx) => {
        if (!dirBuses.some((b) => b.id === `DMS-0${demo.num}`)) {
          const loc = getLocationForElapsed(dir, demo.elapsed);
          const remainingToDest = 165 - demo.elapsed;
          const eta =
            remainingToDest <= 0
              ? "Arriving now"
              : remainingToDest < 60
              ? `${remainingToDest} mins away`
              : `${Math.floor(remainingToDest / 60)}h ${remainingToDest % 60}m away`;

          dirBuses.push({
            id: `DMS-0${demo.num}`,
            direction: dir,
            currentLocation: loc.locationDesc,
            eta,
            seatsLeft: 8 + dIdx * 3,
            lat: loc.lat,
            lng: loc.lng,
            departureTime: demo.dep,
            driverName: DRIVER_NAMES[dIdx % DRIVER_NAMES.length],
            elapsedMinutes: demo.elapsed,
            progressPercent: loc.progressPercent,
            currentStop: loc.currentStop,
            lastUpdatedMinsAgo: 0,
            signalStatus: "live",
            isDesignatedDelayed: false,
          });
        }
      });
    }

    // Guarantee EXACTLY 2 not-live (delayed) buses per direction for presentation demos:
    // - sogod-to-ormoc: 2 delayed buses (4 mins ago & 7 mins ago)
    // - ormoc-to-sogod: 2 delayed buses (5 mins ago & 8 mins ago)
    // All other buses in the direction remain live (0 or 1 min ago)
    const delayedIndex1 = 1; // 2nd bus
    const delayedIndex2 = dirBuses.length > 3 ? 3 : dirBuses.length - 1; // 4th bus

    dirBuses.forEach((bus, index) => {
      if (index === delayedIndex1) {
        bus.isDesignatedDelayed = true;
        bus.signalStatus = "delayed";
        bus.lastUpdatedMinsAgo = dir === "sogod-to-ormoc" ? 4 : 5;
      } else if (index === delayedIndex2 && delayedIndex2 !== delayedIndex1) {
        bus.isDesignatedDelayed = true;
        bus.signalStatus = "delayed";
        bus.lastUpdatedMinsAgo = dir === "sogod-to-ormoc" ? 7 : 8;
      } else {
        bus.isDesignatedDelayed = false;
        bus.signalStatus = "live";
        bus.lastUpdatedMinsAgo = index % 2 === 0 ? 0 : 1;
      }
      buses.push(bus);
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
