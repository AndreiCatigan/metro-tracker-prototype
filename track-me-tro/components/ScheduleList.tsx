"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext, SimulatedTime } from "@/lib/AppContext";
import { TRAVEL_TIMES_FROM_SOGOD, TRAVEL_TIMES_FROM_ORMOC } from "@/lib/mockData";

export interface BusTrip {
  id: string;
  tripNum: number;
  terminalArrival: string; // e.g. "4:00 AM"
  departureTime: string;   // e.g. "4:30 AM"
  busNumber: string;       // e.g. "DMS-048"
  isAircon: boolean;       // true = Airconditioned (green), false = Non-Aircon (red)
  driverName: string;      // e.g. "Kuya Rolly B."
  passengersOnBoard: number;
  capacity: number;
  status: "arrived" | "departed" | "boarding" | "in_queue" | "scheduled";
  locationDesc: string;
  isDetailed: boolean;
  gate: string;
}

// Convert "4:30 AM" or "2:00 PM" into minutes from midnight
export function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hour = parseInt(match[1], 10);
  const min = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + min;
}

// Compute ETA given a departure time string ("1:00 PM") and travel minutes (e.g. 115)
export function calculateTripETA(depTimeStr: string, travelMinutes: number): string {
  const totalMin = parseTimeToMinutes(depTimeStr) + travelMinutes;
  const newHour24 = Math.floor(totalMin / 60) % 24;
  const newMin = totalMin % 60;

  const finalPeriod = newHour24 >= 12 ? "PM" : "AM";
  const finalHour = newHour24 % 12 || 12;
  const finalMinStr = newMin.toString().padStart(2, "0");

  return `${finalHour}:${finalMinStr} ${finalPeriod}`;
}

// Generate trips dynamically based on direction and the active simulated time (9 AM, 2 PM, 4 PM)
function generateTrips(
  direction: "sogod-ormoc" | "ormoc-sogod",
  simulatedTime: SimulatedTime
): BusTrip[] {
  const driverNames = [
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

  const intervals = [
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

  const currentMinutes = parseTimeToMinutes(simulatedTime);
  const destName = direction === "sogod-ormoc" ? "Ormoc" : "Sogod";

  return intervals.map((item, idx) => {
    const depMins = parseTimeToMinutes(item.dep);
    const arrMins = depMins + 165; // ~2h 45m travel time

    let status: BusTrip["status"];
    let locationDesc = "";
    let passengersOnBoard = 0;
    let isDetailed = false;

    if (currentMinutes >= arrMins) {
      // Has already arrived at the destination terminal
      status = "arrived";
      locationDesc = `Arrived at ${destName} Terminal`;
      passengersOnBoard = 45;
      isDetailed = false;
    } else if (currentMinutes > depMins) {
      // Currently on the road
      status = "departed";
      const elapsed = currentMinutes - depMins;
      if (elapsed < 45) {
        locationDesc = "En Route • Approaching Bato";
      } else if (elapsed < 75) {
        locationDesc = "En Route • Approaching Hilongos";
      } else if (elapsed < 115) {
        locationDesc = "En Route • Passing Baybay / VSU";
      } else if (elapsed < 145) {
        locationDesc = "En Route • Approaching Inopacan";
      } else {
        locationDesc = `En Route • Approaching ${destName}`;
      }
      passengersOnBoard = 42 + (idx % 4);
      // Give detail to the most recently departed bus
      isDetailed = currentMinutes - depMins <= 30;
    } else if (currentMinutes === depMins || (depMins - currentMinutes <= 30 && depMins >= currentMinutes)) {
      // Boarding at terminal right now!
      status = "boarding";
      locationDesc = "Terminal Bay 2 • Boarding Passengers";
      passengersOnBoard = 38;
      isDetailed = true;
    } else if (depMins - currentMinutes <= 60) {
      // In Queue for the next departure
      status = "in_queue";
      locationDesc = "Terminal Bay 3 • In Queue";
      passengersOnBoard = 12;
      isDetailed = true;
    } else {
      // Future scheduled trip
      status = "scheduled";
      locationDesc = "Scheduled Corridor Trip";
      passengersOnBoard = 0;
      isDetailed = false;
    }

    const gateIndex = (idx % 4) + 1;

    return {
      id: `${direction}-${idx + 1}`,
      tripNum: idx + 1,
      terminalArrival: item.arr,
      departureTime: item.dep,
      busNumber: `DMS-0${item.num}`,
      isAircon: item.aircon,
      driverName: driverNames[idx % driverNames.length],
      passengersOnBoard,
      capacity: 45,
      status,
      locationDesc,
      isDetailed,
      gate: `Bay ${gateIndex}`,
    };
  });
}

interface ScheduleListProps {
  initialDirection?: "sogod-ormoc" | "ormoc-sogod";
  onBookClick?: (trip: BusTrip) => void;
}

export default function ScheduleList({
  initialDirection = "sogod-ormoc",
  onBookClick,
}: ScheduleListProps) {
  const router = useRouter();
  const { userLocation, simulatedTime } = useAppContext();
  const [direction, setDirection] = useState<"sogod-ormoc" | "ormoc-sogod">(initialDirection);
  const [filterType, setFilterType] = useState<"all" | "aircon" | "non-aircon">("all");
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  const travelMinutes = direction === "sogod-ormoc"
    ? (TRAVEL_TIMES_FROM_SOGOD[userLocation] ?? 115)
    : (TRAVEL_TIMES_FROM_ORMOC[userLocation] ?? 50);

  const trips = generateTrips(direction, simulatedTime);

  const filteredTrips = trips.filter((t) => {
    if (filterType === "aircon") return t.isAircon;
    if (filterType === "non-aircon") return !t.isAircon;
    return true;
  });

  const handleBook = (trip: BusTrip) => {
    if (onBookClick) {
      onBookClick(trip);
    } else {
      router.push(`/booking?trip=${trip.id}&direction=${direction}`);
    }
  };

  const getStatusBadge = (trip: BusTrip) => {
    switch (trip.status) {
      case "arrived":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
            <span>Arrived ({trip.locationDesc.replace("Arrived at ", "")})</span>
          </span>
        );
      case "boarding":
        return (
          <span className="inline-flex items-center gap-1 bg-[#FFE8D6] text-[#A53700] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A53700]" />
            <span>Boarding</span>
          </span>
        );
      case "in_queue":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <span>In Queue</span>
          </span>
        );
      case "departed":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>En Route</span>
          </span>
        );
      case "scheduled":
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <span>Scheduled</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Direction Tab Switcher: "sogod <-> ormoc" & "ormoc <-> sogod" ── */}
      <div className="bg-[#ECEEF0] p-1.5 rounded-2xl flex items-center gap-1 shadow-2xs">
        <button
          type="button"
          onClick={() => setDirection("sogod-ormoc")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-[12px] tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            direction === "sogod-ormoc"
              ? "bg-[#181C24] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Sogod</span>
          <span className="text-[#F95700] font-black">⇄</span>
          <span>Ormoc</span>
        </button>

        <button
          type="button"
          onClick={() => setDirection("ormoc-sogod")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-[12px] tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            direction === "ormoc-sogod"
              ? "bg-[#181C24] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Ormoc</span>
          <span className="text-[#F95700] font-black">⇄</span>
          <span>Sogod</span>
        </button>
      </div>

      {/* ── Subtitle & Frequency Notice ── */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px] text-[#F95700]">schedule</span>
          <span>Departs every 30 mins • 30-45m terminal prep</span>
        </div>
        <span className="text-slate-400 font-bold">4:00 AM – 5:00 PM</span>
      </div>

      {/* ── Quick Filter Chips: All, Aircon (Green), Non-Aircon (Red) ── */}
      <div className="flex items-center gap-2 px-1">
        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`py-1 px-3 rounded-full text-[11px] font-bold transition cursor-pointer ${
            filterType === "all"
              ? "bg-[#181C24] text-white"
              : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          All Buses ({trips.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType("aircon")}
          className={`py-1 px-3 rounded-full text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
            filterType === "aircon"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Airconditioned</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType("non-aircon")}
          className={`py-1 px-3 rounded-full text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
            filterType === "non-aircon"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>Non-Aircon</span>
        </button>
      </div>

      {/* ── Trip Schedule Cards List ── */}
      <div className="space-y-3">
        {filteredTrips.map((trip) => {
          const isSelectedOrActive = trip.isDetailed || expandedTripId === trip.id;
          const tripETA = calculateTripETA(trip.departureTime, travelMinutes);

          // ── Detailed View (Active Assigned / Boarding Buses or User-Expanded) ──
          if (isSelectedOrActive) {
            return (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-4 shadow-sm border-2 border-[#FFE8D6] relative overflow-hidden transition-all space-y-3"
              >
                {/* Active Indicator Top Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#181C24] text-white font-black text-xs flex items-center justify-center">
                      {trip.tripNum}
                    </span>
                    <div>
                      <h4 className="text-[15px] font-black text-[#191C1E]">
                        {trip.busNumber}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        Driver: <span className="text-slate-700 font-bold">{trip.driverName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Airconditioned Label */}
                    {trip.isAircon ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/90 px-2 py-0.5 rounded-full text-[10px] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Aircon</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200/90 px-2 py-0.5 rounded-full text-[10px] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Non-Air</span>
                      </span>
                    )}

                    {getStatusBadge(trip)}
                  </div>
                </div>

                {/* Departure & Arrival Window with Calculated ETA */}
                <div className="bg-[#F7F9FB] rounded-2xl p-3 border border-[#ECEEF0] flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      TERMINAL ARRIVAL
                    </p>
                    <p className="text-[13px] font-bold text-slate-700">
                      {trip.terminalArrival}
                    </p>
                  </div>

                  <div className="flex flex-col items-center px-1">
                    <span className="text-[9px] font-bold text-[#A53700] uppercase">
                      30m Boarding
                    </span>
                    <div className="flex items-center gap-1 text-[#A53700]">
                      <span className="w-8 h-[1.5px] bg-[#A53700]" />
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      DEPARTURE
                    </p>
                    <p className="text-[16px] font-black text-[#191C1E]">
                      {trip.departureTime}
                    </p>
                  </div>
                </div>

                {/* ETA Badge Highlight or Arrived Status */}
                {trip.status === "arrived" ? (
                  <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">task_alt</span>
                      <span>Arrived at Ormoc City Port</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-700">Trip Completed</span>
                  </div>
                ) : (
                  <div className="bg-[#FFE8D6]/60 rounded-xl p-2.5 border border-[#F5DECD] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#F95700]">timer</span>
                      <span className="text-slate-700 font-bold">Estimated Arrival at {userLocation}:</span>
                    </div>
                    <span className="text-[14px] font-black text-[#A53700]">{tripETA}</span>
                  </div>
                )}

                {/* Passenger On-Board Telemetry & Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">group</span>
                      <span>Passengers On-Board:</span>
                    </span>
                    <span className="text-[#A53700] font-black">
                      {trip.passengersOnBoard} / {trip.capacity} Seats ({Math.round((trip.passengersOnBoard / trip.capacity) * 100)}%)
                    </span>
                  </div>

                  <div className="w-full h-2 bg-[#ECEEF0] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        trip.passengersOnBoard > 35
                          ? "bg-[#F95700]"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${(trip.passengersOnBoard / trip.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons: Book Ticket & Live Map */}
                <div className="flex items-center gap-2 pt-1">
                  {trip.status !== "arrived" && (
                    <button
                      type="button"
                      onClick={() => handleBook(trip)}
                      className="flex-1 py-2.5 px-3 rounded-full bg-[#F95700] hover:bg-[#E04E00] text-white font-black text-[12px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">confirmation_number</span>
                      <span>Book Ticket • ₱95</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => router.push("/map")}
                    className={`${trip.status === "arrived" ? "w-full" : "px-3.5"} py-2.5 rounded-full bg-[#181C24] hover:bg-black text-white font-bold text-[12px] shadow-xs transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer`}
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#F95700]">near_me</span>
                    <span>Live GPS Map</span>
                  </button>
                </div>
              </div>
            );
          }

          // ── Compact / Greyed-Out Schedule Card (Upcoming or Arrived trips) ──
          return (
            <div
              key={trip.id}
              onClick={() => setExpandedTripId(trip.id)}
              className={`rounded-2xl p-3 border shadow-2xs transition-all cursor-pointer space-y-1.5 ${
                trip.status === "arrived"
                  ? "bg-slate-50 border-slate-200/80 opacity-75 hover:opacity-100"
                  : "bg-white/70 hover:bg-white border-slate-200/60 opacity-65 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full font-bold text-[11px] flex items-center justify-center ${
                    trip.status === "arrived"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-500"
                  }`}>
                    {trip.tripNum}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-black text-slate-700">
                        {trip.departureTime}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        • {trip.busNumber}
                      </span>
                      {trip.isAircon ? (
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                          Aircon
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded-full">
                          Non-Air
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Driver: {trip.driverName} • {trip.locationDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(trip)}

                  <span className="material-symbols-outlined text-[16px] text-slate-400">
                    expand_more
                  </span>
                </div>
              </div>

              {/* ETA Display */}
              {trip.status !== "arrived" && (
                <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-100 text-[11px]">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#F95700]">schedule</span>
                    <span>ETA at {userLocation}:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#A53700]">{tripETA}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBook(trip);
                      }}
                      className="px-2.5 py-0.5 rounded-full bg-[#F95700] text-white font-extrabold text-[10px] hover:bg-[#E04E00] transition"
                    >
                      Book
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
