"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
  status: "departed" | "boarding" | "in_queue" | "scheduled";
  isDetailed: boolean;     // 3 active buses have full details, others greyed out
  gate: string;
}

// Generate the 30-minute interval trips from 4:00 AM to 5:00 PM
function generateTrips(direction: "sogod-ormoc" | "ormoc-sogod"): BusTrip[] {
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
    { arr: "4:00 AM", dep: "4:30 AM", num: 47, aircon: true, status: "departed" as const, onBoard: 45 },
    { arr: "4:30 AM", dep: "5:00 AM", num: 48, aircon: true, status: "boarding" as const, onBoard: 38 },
    { arr: "5:00 AM", dep: "5:30 AM", num: 49, aircon: false, status: "in_queue" as const, onBoard: 24 },
    { arr: "5:30 AM", dep: "6:00 AM", num: 50, aircon: true, status: "in_queue" as const, onBoard: 11 },
    { arr: "6:00 AM", dep: "6:30 AM", num: 51, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "6:30 AM", dep: "7:00 AM", num: 52, aircon: false, status: "scheduled" as const, onBoard: 0 },
    { arr: "7:00 AM", dep: "7:30 AM", num: 53, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "7:30 AM", dep: "8:00 AM", num: 54, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "8:00 AM", dep: "8:30 AM", num: 55, aircon: false, status: "scheduled" as const, onBoard: 0 },
    { arr: "8:30 AM", dep: "9:00 AM", num: 56, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "9:00 AM", dep: "9:30 AM", num: 57, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "9:30 AM", dep: "10:00 AM", num: 58, aircon: false, status: "scheduled" as const, onBoard: 0 },
    { arr: "10:00 AM", dep: "10:30 AM", num: 59, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "10:30 AM", dep: "11:00 AM", num: 60, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "11:00 AM", dep: "11:30 AM", num: 61, aircon: false, status: "scheduled" as const, onBoard: 0 },
    { arr: "11:30 AM", dep: "12:00 PM", num: 62, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "12:00 PM", dep: "12:30 PM", num: 63, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "12:30 PM", dep: "1:00 PM", num: 64, aircon: false, status: "scheduled" as const, onBoard: 0 },
    { arr: "1:00 PM", dep: "1:30 PM", num: 65, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "1:30 PM", dep: "2:00 PM", num: 66, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "2:00 PM", dep: "2:30 PM", num: 67, aircon: false, status: "scheduled" as const, onBoard: 0 },
    { arr: "2:30 PM", dep: "3:00 PM", num: 68, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "3:00 PM", dep: "3:30 PM", num: 69, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "3:30 PM", dep: "4:00 PM", num: 70, aircon: false, status: "scheduled" as const, onBoard: 0 },
    { arr: "4:00 PM", dep: "4:30 PM", num: 71, aircon: true, status: "scheduled" as const, onBoard: 0 },
    { arr: "4:30 PM", dep: "5:00 PM", num: 72, aircon: false, status: "scheduled" as const, onBoard: 0 },
  ];

  return intervals.map((item, idx) => {
    // 3 active assigned buses have the full details:
    // e.g. Trip index 1 (DMS-048), index 2 (DMS-049), index 3 (DMS-050)
    const isDetailed = idx >= 1 && idx <= 3;
    const gateIndex = (idx % 4) + 1;

    return {
      id: `${direction}-${idx + 1}`,
      tripNum: idx + 1,
      terminalArrival: item.arr,
      departureTime: item.dep,
      busNumber: `DMS-0${item.num}`,
      isAircon: item.aircon,
      driverName: driverNames[idx % driverNames.length],
      passengersOnBoard: item.onBoard,
      capacity: 45,
      status: item.status,
      isDetailed,
      gate: `Bay ${gateIndex}`,
    };
  });
}

interface ScheduleListProps {
  initialDirection?: "sogod-ormoc" | "ormoc-sogod";
}

export default function ScheduleList({
  initialDirection = "sogod-ormoc",
}: ScheduleListProps) {
  const router = useRouter();
  const [direction, setDirection] = useState<"sogod-ormoc" | "ormoc-sogod">(initialDirection);
  const [filterType, setFilterType] = useState<"all" | "aircon" | "non-aircon">("all");
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  const trips = generateTrips(direction);

  const filteredTrips = trips.filter((t) => {
    if (filterType === "aircon") return t.isAircon;
    if (filterType === "non-aircon") return !t.isAircon;
    return true;
  });

  const getStatusBadge = (status: BusTrip["status"]) => {
    switch (status) {
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
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <span>Departed</span>
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

          // ── Detailed View (3 Active Assigned Buses) ──
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
                    {/* Airconditioned Label: Green if Aircon, Red if Non-Aircon */}
                    {trip.isAircon ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/90 px-2 py-0.5 rounded-full text-[10px] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Airconditioned</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200/90 px-2 py-0.5 rounded-full text-[10px] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Non-Aircon</span>
                      </span>
                    )}

                    {getStatusBadge(trip.status)}
                  </div>
                </div>

                {/* Departure & Arrival Window */}
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

                {/* Passenger On-Board Telemetry & Gate */}
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

                  {/* Progress fill bar */}
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

                {/* Action Buttons for Assigned Buses */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => router.push("/seats")}
                    className="flex-1 py-2.5 px-3 rounded-full bg-[#F95700] hover:bg-[#E04E00] text-white font-black text-[12px] shadow-sm transition active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">event_seat</span>
                    <span>Book Seat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/map")}
                    className="py-2.5 px-3.5 rounded-full bg-[#181C24] hover:bg-black text-white font-bold text-[12px] shadow-xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#F95700]">near_me</span>
                    <span>Live GPS</span>
                  </button>
                </div>
              </div>
            );
          }

          // ── Greyed-Out Schedule Card (Upcoming or Departed trips) ──
          return (
            <div
              key={trip.id}
              onClick={() => setExpandedTripId(trip.id)}
              className="bg-white/70 hover:bg-white rounded-2xl p-3 border border-slate-200/60 shadow-2xs opacity-55 hover:opacity-100 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 font-bold text-[11px] flex items-center justify-center">
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
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Terminal prep: {trip.terminalArrival} • Driver: {trip.driverName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Aircon Indicator Pill */}
                {trip.isAircon ? (
                  <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Aircon
                  </span>
                ) : (
                  <span className="text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                    Non-Air
                  </span>
                )}

                {getStatusBadge(trip.status)}

                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  expand_more
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
