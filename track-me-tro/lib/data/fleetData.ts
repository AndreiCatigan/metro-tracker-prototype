import { SimulatedTime } from "../AppContext";

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
 * Returns dynamic departed buses telemetry matching active simulated time
 */
export function getDepartedBuses(time: SimulatedTime): DepartedBus[] {
  switch (time) {
    case "2:00 PM":
      return [
        {
          id: "en_route_bus",
          busNumber: "DMS-065",
          driverName: "Kuya Benjie M.",
          departureTime: "1:30 PM",
          terminal: "Sogod Terminal",
          gate: "Bay 2",
          isAircon: true,
          passengers: 44,
          capacity: 45,
          status: "en_route",
          currentStop: "Approaching Bato Junction",
          nextStop: "Bato Terminal (~2:15 PM)",
          speed: "54 km/h",
          progressPercent: 36,
        },
        {
          id: "arrived_bus",
          busNumber: "DMS-060",
          driverName: "Mang Mario R.",
          departureTime: "11:00 AM",
          terminal: "Sogod Terminal",
          gate: "Bay 1",
          isAircon: true,
          passengers: 45,
          capacity: 45,
          status: "arrived",
          currentStop: "Ormoc City Port Terminal",
          nextStop: "Arrived at Ormoc (1:45 PM)",
          speed: "0 km/h (Docked)",
          progressPercent: 100,
        },
      ];
    case "4:00 PM":
      return [
        {
          id: "en_route_bus",
          busNumber: "DMS-069",
          driverName: "Kuya Marlon D.",
          departureTime: "3:30 PM",
          terminal: "Sogod Terminal",
          gate: "Bay 1",
          isAircon: true,
          passengers: 45,
          capacity: 45,
          status: "en_route",
          currentStop: "Highway 1 • Bato North",
          nextStop: "Hilongos Terminal (~4:45 PM)",
          speed: "51 km/h",
          progressPercent: 42,
        },
        {
          id: "arrived_bus",
          busNumber: "DMS-064",
          driverName: "Mang Ruben F.",
          departureTime: "1:00 PM",
          terminal: "Sogod Terminal",
          gate: "Bay 2",
          isAircon: false,
          passengers: 45,
          capacity: 45,
          status: "arrived",
          currentStop: "Ormoc City Port Terminal",
          nextStop: "Arrived at Ormoc (3:45 PM)",
          speed: "0 km/h (Docked)",
          progressPercent: 100,
        },
      ];
    case "9:00 AM":
    default:
      return [
        {
          id: "en_route_bus",
          busNumber: "DMS-055",
          driverName: "Mang Danilo T.",
          departureTime: "8:30 AM",
          terminal: "Sogod Terminal",
          gate: "Bay 1",
          isAircon: false,
          passengers: 45,
          capacity: 45,
          status: "en_route",
          currentStop: "Approaching Bato Junction",
          nextStop: "Bato Terminal (~9:15 AM)",
          speed: "52 km/h",
          progressPercent: 35,
        },
        {
          id: "arrived_bus",
          busNumber: "DMS-050",
          driverName: "Kuya Edmar P.",
          departureTime: "6:00 AM",
          terminal: "Sogod Terminal",
          gate: "Bay 2",
          isAircon: true,
          passengers: 45,
          capacity: 45,
          status: "arrived",
          currentStop: "Ormoc City Port Terminal",
          nextStop: "Arrived at Ormoc (8:45 AM)",
          speed: "0 km/h (Docked)",
          progressPercent: 100,
        },
      ];
  }
}
