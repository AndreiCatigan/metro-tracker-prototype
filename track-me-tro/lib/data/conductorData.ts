export type ConductorSeatType = "available" | "app_reserved" | "on_board" | "selected";

export interface ConductorSeatData {
  id: string;
  type: ConductorSeatType;
  label: string;
  col?: "A" | "B" | "C" | "D";
  row?: string;
  isWindow?: boolean;
}

export const BASE_CABIN_SEATS: ConductorSeatData[] = [
  // Row 1
  { id: "01", type: "on_board", label: "J.D.", col: "A", row: "R1", isWindow: true },
  { id: "02", type: "on_board", label: "M.A.", col: "B", row: "R1" },
  { id: "03", type: "app_reserved", label: "#APP02", col: "C", row: "R1" },
  { id: "04", type: "app_reserved", label: "#APP03", col: "D", row: "R1", isWindow: true },

  // Row 2
  { id: "05", type: "on_board", label: "R.P.", col: "A", row: "R2", isWindow: true },
  { id: "06", type: "on_board", label: "L.V.", col: "B", row: "R2" },
  { id: "07", type: "available", label: "VACANT", col: "C", row: "R2" },
  { id: "08", type: "app_reserved", label: "#APP14", col: "D", row: "R2", isWindow: true },

  // Row 3
  { id: "09", type: "available", label: "VACANT", col: "A", row: "R3", isWindow: true },
  { id: "10", type: "available", label: "VACANT", col: "B", row: "R3" },
  { id: "11", type: "on_board", label: "C.O.", col: "C", row: "R3" },
  { id: "12", type: "on_board", label: "S.T.", col: "D", row: "R3", isWindow: true },

  // Row 4
  { id: "13", type: "app_reserved", label: "#APP90", col: "A", row: "R4", isWindow: true },
  { id: "14", type: "app_reserved", label: "#APP91", col: "B", row: "R4" },
  { id: "15", type: "available", label: "WIN", col: "C", row: "R4" },
  { id: "16", type: "available", label: "VACANT", col: "D", row: "R4", isWindow: true },

  // Row 5
  { id: "17", type: "on_board", label: "G.L.", col: "A", row: "R5", isWindow: true },
  { id: "18", type: "on_board", label: "A.N.", col: "B", row: "R5" },
  { id: "19", type: "app_reserved", label: "#APP45", col: "C", row: "R5" },
  { id: "20", type: "available", label: "VACANT", col: "D", row: "R5", isWindow: true },

  // Row 6
  { id: "21", type: "available", label: "VACANT", col: "A", row: "R6", isWindow: true },
  { id: "22", type: "available", label: "VACANT", col: "B", row: "R6" },
  { id: "23", type: "on_board", label: "W.E.", col: "C", row: "R6" },
  { id: "24", type: "on_board", label: "K.L.", col: "D", row: "R6", isWindow: true },

  // Row 7
  { id: "25", type: "app_reserved", label: "#APP02", col: "A", row: "R7", isWindow: true },
  { id: "26", type: "app_reserved", label: "#APP03", col: "B", row: "R7" },
  { id: "27", type: "available", label: "VACANT", col: "C", row: "R7" },
  { id: "28", type: "available", label: "VACANT", col: "D", row: "R7", isWindow: true },
];

export const BASE_REAR_BENCH_SEATS: ConductorSeatData[] = [
  { id: "41", type: "on_board", label: "P.M.", col: "A", row: "REAR" },
  { id: "42", type: "on_board", label: "T.Y.", col: "B", row: "REAR" },
  { id: "43", type: "app_reserved", label: "#APP", col: "C", row: "REAR" },
  { id: "44", type: "app_reserved", label: "#APP", col: "D", row: "REAR" },
  { id: "45", type: "available", label: "VAC", col: "D", row: "REAR" },
];

export const CONDUCTOR_PROFILE = {
  name: "Kuya Rolly B.",
  employeeId: "EMP-8842",
  busNumber: "DMS-048",
  routeTitle: "Sogod ➔ Ormoc",
  routeNumber: "ROUTE 04",
  fareClass: "Aircon Express",
  totalSeats: 45,
};

export interface PosRouteStop {
  id: string;
  name: string;
  distance: string;
  tag?: string;
  baseFare: number;
}

export const POS_ROUTE_STOPS: PosRouteStop[] = [
  { id: "bato", name: "Bato", distance: "39.4 km", baseFare: 65 },
  { id: "hilongos", name: "Hilongos", distance: "52.0 km", baseFare: 90 },
  { id: "hindang", name: "Hindang", distance: "64.5 km", baseFare: 110 },
  { id: "inopacan", name: "Inopacan", distance: "78.2 km", baseFare: 140 },
  { id: "baybay", name: "Baybay City", distance: "96.8 km", tag: "Major Hub", baseFare: 180 },
  { id: "vsu", name: "VSU Main Campus", distance: "105.0 km", tag: "Campus Stop", baseFare: 215 },
  { id: "albuera", name: "Albuera", distance: "135.7 km", baseFare: 245 },
  { id: "ormoc", name: "Ormoc City", distance: "155.0 km", tag: "Terminus", baseFare: 275 },
  { id: "sogod", name: "Sogod Terminal", distance: "155.0 km", tag: "Terminus", baseFare: 275 },
];

export interface PassengerSeatRow {
  rowNum: number;
  seats: string[];
  arrow: string;
}

export const PASSENGER_SEAT_ROWS: PassengerSeatRow[] = [
  { rowNum: 1, seats: ["1", "2", "3", "4"], arrow: "↓" },
  { rowNum: 2, seats: ["5", "6", "7", "8"], arrow: "↕" },
  { rowNum: 3, seats: ["9", "10", "11", "12"], arrow: "↕" },
  { rowNum: 4, seats: ["13", "14", "15", "16"], arrow: "↕" },
  { rowNum: 5, seats: ["17", "18", "19", "20"], arrow: "↕" },
  { rowNum: 6, seats: ["21", "22", "23", "24"], arrow: "↕" },
];

export const DEFAULT_OCCUPIED_SEAT_IDS: readonly string[] = [
  "1",
  "2",
  "8",
  "9",
  "15",
  "17",
  "23",
  "24",
];
