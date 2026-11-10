"use client";

import React from "react";
import Link from "next/link";
import { useAppContext } from "@/lib/AppContext";
import BottomNavigation from "@/components/BottomNavigation";

export default function ConductorPage() {
  const { seats, busDetails } = useAppContext();

  const reservedSeats = seats.filter((s) => s.status === "app_reserved");
  const occupiedSeats = seats.filter((s) => s.status === "occupied");
  const availableSeats = seats.filter((s) => s.status === "available");

  const onlineFees = reservedSeats.length * busDetails.convenienceFee;
  const baseFareRevenue = (reservedSeats.length + occupiedSeats.length) * busDetails.baseFare;
  const totalRevenue = baseFareRevenue + onlineFees;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-28">
      {/* Top Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 p-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🎫</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Conductor Terminal
              </span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-white mt-0.5">
              Bus {busDetails.id}
            </h1>
            <p className="text-xs text-slate-400">{busDetails.routeTitle}</p>
          </div>
          <Link
            href="/home"
            className="text-[11px] bg-slate-700 hover:bg-slate-600 px-2.5 py-1.5 rounded-lg text-slate-200 font-semibold border border-slate-600 transition"
          >
            Passenger App 👤
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Real-time Occupancy Telemetry */}
        <section className="bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Trip Capacity &bull; 40 Seats
            </h2>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
              {availableSeats.length} Vacant
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-indigo-900/40">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                App Reserved
              </p>
              <p className="text-2xl font-black text-indigo-400 mt-0.5 font-mono">
                {reservedSeats.length}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">Paid via App</p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Cash Walk-in
              </p>
              <p className="text-2xl font-black text-amber-400 mt-0.5 font-mono">
                {occupiedSeats.length}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">Logged Onboard</p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Available
              </p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5 font-mono">
                {availableSeats.length}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">Open Seats</p>
            </div>
          </div>
        </section>

        {/* Quick Action Navigation */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/conductor/matrix"
            className="p-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-md flex items-center justify-between text-white font-bold transition group"
          >
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wider">Tap to Assign</p>
              <p className="text-sm mt-0.5">Seat Matrix</p>
            </div>
            <span className="text-xl group-hover:scale-110 transition-transform">💺</span>
          </Link>

          <Link
            href="/conductor/scan"
            className="p-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl shadow-md flex items-center justify-between text-white font-bold transition group"
          >
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Validate</p>
              <p className="text-sm mt-0.5">Scan QR Ticket</p>
            </div>
            <span className="text-xl group-hover:scale-110 transition-transform">📷</span>
          </Link>
        </div>

        {/* Financial Breakdown (Pitch Impact) */}
        <section className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Trip Revenue Breakdown
          </h2>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-700/60">
              <span>Standard Bus Fares ({reservedSeats.length + occupiedSeats.length} × ₱{busDetails.baseFare})</span>
              <span className="font-mono font-bold text-white">₱{baseFareRevenue.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-700/60 text-indigo-300">
              <span className="flex items-center gap-1">
                <span>⚡ App Convenience Fees ({reservedSeats.length} × ₱{busDetails.convenienceFee})</span>
              </span>
              <span className="font-mono font-bold">₱{onlineFees.toLocaleString()}</span>
            </div>

            <div className="pt-1 flex justify-between text-sm font-extrabold text-white">
              <span>Total Trip Intake</span>
              <span className="font-mono text-emerald-400 text-base">₱{totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Passenger Manifest Snapshot */}
        <section className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Manifest Snapshot
            </h2>
            <span className="text-[10px] text-slate-400">
              {reservedSeats.length + occupiedSeats.length} Passengers
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {reservedSeats.map((seat) => (
              <div
                key={seat.id}
                className="p-2.5 bg-slate-900/70 border border-indigo-900/50 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-300 font-bold font-mono flex items-center justify-center border border-indigo-800 text-xs">
                    {seat.id}
                  </span>
                  <div>
                    <p className="font-semibold text-white">App Passenger</p>
                    <p className="text-[10px] text-slate-400">Digital QR Reserved</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800">
                  Confirmed
                </span>
              </div>
            ))}

            {occupiedSeats.slice(0, 4).map((seat) => (
              <div
                key={seat.id}
                className="p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-300 font-bold font-mono flex items-center justify-center border border-slate-700 text-xs">
                    {seat.id}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-300">Walk-in Passenger</p>
                    <p className="text-[10px] text-slate-500">Cash Collected Onboard</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/60">
                  Cash Paid
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
