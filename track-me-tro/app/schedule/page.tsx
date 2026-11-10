"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";

interface BusScheduleItem {
  id: string;
  busNumber: string;
  type: "Aircon Express" | "Standard";
  gateOrBay: string;
  departureTime: string;
  statusText: string;
  statusHighlight?: boolean;
}

const SOUTHBOUND_BUSES: BusScheduleItem[] = [
  {
    id: "sb-1",
    busNumber: "DMS-048",
    type: "Aircon Express",
    gateOrBay: "Gate B2",
    departureTime: "4:00 AM",
    statusText: "On Schedule",
    statusHighlight: true,
  },
  {
    id: "sb-2",
    busNumber: "DMS-049",
    type: "Standard",
    gateOrBay: "Gate B1",
    departureTime: "4:30 AM",
    statusText: "Boarding in 12m",
  },
  {
    id: "sb-3",
    busNumber: "DMS-050",
    type: "Aircon Express",
    gateOrBay: "Gate B4",
    departureTime: "5:00 AM",
    statusText: "Departs on time",
  },
];

const NORTHBOUND_BUSES: BusScheduleItem[] = [
  {
    id: "nb-1",
    busNumber: "DMS-048",
    type: "Aircon Express",
    gateOrBay: "Bay 3",
    departureTime: "4:00 AM",
    statusText: "Scheduled",
  },
  {
    id: "nb-2",
    busNumber: "DMS-049",
    type: "Standard",
    gateOrBay: "Bay 2",
    departureTime: "4:30 AM",
    statusText: "Scheduled",
  },
  {
    id: "nb-3",
    busNumber: "DMS-050",
    type: "Aircon Express",
    gateOrBay: "Bay 3",
    departureTime: "5:00 AM",
    statusText: "Scheduled",
  },
];

export default function SchedulePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans selection:bg-[#FFDBCF] selection:text-[#380D00]">
      {/* ── Fixed Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ECEEF0]">
        <div className="max-w-[480px] mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#A53700] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">
                directions_bus
              </span>
            </div>
            <span className="font-extrabold text-[18px] text-[#191C1E] tracking-tight">
              Home
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-[#ECEEF0] flex items-center justify-center text-[#191C1E] cursor-pointer"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
            </button>
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-[#A53700] text-white flex items-center justify-center shadow-xs"
              title="Profile"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Canvas ── */}
      <main className="flex-1 w-full max-w-[480px] mx-auto px-4 pt-3 pb-28 space-y-3.5">
        {/* Title Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-white shadow-xs border border-[#ECEEF0] flex items-center justify-center text-slate-700 cursor-pointer hover:bg-slate-50 transition"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <h1 className="font-extrabold text-[22px] text-[#191C1E] tracking-tight">
              Bus Schedule
            </h1>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FFEAE0] text-[#A53700] px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#A53700] animate-pulse" />
            <span>LIVE SYNC</span>
          </div>
        </div>

        <p className="text-[12px] text-slate-500 font-medium -mt-1 pl-1">
          Today • Ormoc ↔ Sogod Corridor
        </p>

        {/* Real-time Dispatch Banner Notice */}
        <div className="bg-[#F2F6F9] rounded-2xl p-3.5 border border-[#E2E8F0] flex items-start gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-full bg-[#FFE8D6] text-[#A53700] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">cell_tower</span>
          </div>
          <div>
            <h4 className="font-extrabold text-[13px] text-[#191C1E]">
              Real-Time Dispatch Active
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              All scheduled coaches are GPS monitored. Actual platform arrivals may vary ±3 mins.
            </p>
          </div>
        </div>

        {/* ── Section 1: Southbound ── */}
        <div className="bg-white rounded-3xl p-4 border border-[#ECEEF0] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#ECEEF0]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FFE8D6] text-[#A53700] flex items-center justify-center font-bold text-xs">
                ↓
              </div>
              <div>
                <h3 className="font-extrabold text-[15px] text-[#191C1E]">
                  Southbound
                </h3>
                <p className="text-[11px] text-slate-500">Ormoc City ➔ Sogod</p>
              </div>
            </div>

            <span className="text-[9px] font-extrabold tracking-widest uppercase bg-[#ECEEF0] text-slate-600 px-2 py-0.5 rounded">
              TERMINAL 1
            </span>
          </div>

          <div className="space-y-2">
            {SOUTHBOUND_BUSES.map((bus) => (
              <div
                key={bus.id}
                onClick={() => router.push("/seats")}
                className="p-3 rounded-2xl bg-[#F7F9FB] hover:bg-[#F2F4F6] border border-[#ECEEF0] flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ECEEF0] text-slate-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[14px] text-[#191C1E]">
                        {bus.busNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          bus.type === "Aircon Express"
                            ? "bg-[#FFE8D6] text-[#A53700]"
                            : "bg-[#DFE2ED] text-slate-700"
                        }`}
                      >
                        {bus.type}
                      </span>
                      <span className="text-[10px] text-slate-400">{bus.gateOrBay}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-black text-[15px] text-[#191C1E]">
                    {bus.departureTime}
                  </span>
                  <span
                    className={`block text-[10px] font-bold mt-0.5 ${
                      bus.statusHighlight ? "text-[#A53700]" : "text-slate-500"
                    }`}
                  >
                    {bus.statusText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 2: Northbound ── */}
        <div className="bg-white rounded-3xl p-4 border border-[#ECEEF0] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#ECEEF0]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#DFE2ED] text-slate-700 flex items-center justify-center font-bold text-xs">
                ↑
              </div>
              <div>
                <h3 className="font-extrabold text-[15px] text-[#191C1E]">
                  Northbound
                </h3>
                <p className="text-[11px] text-slate-500">Sogod ➔ Ormoc City</p>
              </div>
            </div>

            <span className="text-[9px] font-extrabold tracking-widest uppercase bg-[#ECEEF0] text-slate-600 px-2 py-0.5 rounded">
              BAY 3 DOCK
            </span>
          </div>

          <div className="space-y-2">
            {NORTHBOUND_BUSES.map((bus) => (
              <div
                key={bus.id}
                onClick={() => router.push("/seats")}
                className="p-3 rounded-2xl bg-[#F7F9FB] hover:bg-[#F2F4F6] border border-[#ECEEF0] flex items-center justify-between cursor-pointer transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ECEEF0] text-slate-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">directions_bus</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[14px] text-[#191C1E]">
                        {bus.busNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          bus.type === "Aircon Express"
                            ? "bg-[#FFE8D6] text-[#A53700]"
                            : "bg-[#DFE2ED] text-slate-700"
                        }`}
                      >
                        {bus.type}
                      </span>
                      <span className="text-[10px] text-slate-400">{bus.gateOrBay}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-black text-[15px] text-[#191C1E]">
                    {bus.departureTime}
                  </span>
                  <span className="block text-[10px] font-bold text-slate-500 mt-0.5">
                    {bus.statusText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Track Buses on Live Map CTA ── */}
        <div
          onClick={() => router.push("/map")}
          className="bg-white rounded-2xl p-3.5 border border-[#ECEEF0] shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A53700] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">map</span>
            </div>
            <div>
              <p className="font-extrabold text-[14px] text-[#191C1E] group-hover:text-[#A53700] transition-colors">
                Track Buses on Live Map
              </p>
              <p className="text-[11px] text-slate-500">
                See pinpoint speed &amp; distance away
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#F2F4F6] text-slate-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </div>
        </div>
      </main>

      {/* ── Bottom Navigation ── */}
      <BottomNavigation />
    </div>
  );
}
