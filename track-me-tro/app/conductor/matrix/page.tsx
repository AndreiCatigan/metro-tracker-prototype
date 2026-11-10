"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/lib/AppContext";
import BottomSheet from "@/components/BottomSheet";
import BottomNavigation from "@/components/BottomNavigation";

export default function ConductorMatrixPage() {
  const { seats, updateSeatStatus, busDetails } = useAppContext();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cashCollectedToast, setCashCollectedToast] = useState<string | null>(null);

  const activeSeatObj = seats.find((s) => s.id === selectedSeat);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
    setSheetOpen(true);
  };

  const handleLogWalkIn = () => {
    if (!selectedSeat) return;
    updateSeatStatus(selectedSeat, "occupied");
    setSheetOpen(false);
    setCashCollectedToast(`Seat ${selectedSeat} logged! ₱${busDetails.baseFare} cash collected.`);
    setTimeout(() => setCashCollectedToast(null), 3000);
  };

  const handleFreeUpSeat = () => {
    if (!selectedSeat) return;
    updateSeatStatus(selectedSeat, "available");
    setSheetOpen(false);
  };

  // Group 40 seats into 10 rows of 4 seats
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-28">
      {/* Header */}
      <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700 p-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">💺</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Seat Occupancy Matrix
              </span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-white mt-0.5">
              Bus {busDetails.id}
            </h1>
            <p className="text-xs text-slate-400">Tap open seats to log cash walk-ins</p>
          </div>
          <Link
            href="/conductor"
            className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-slate-200 font-semibold border border-slate-600 transition"
          >
            &larr; Back
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Toast Alert */}
        {cashCollectedToast && (
          <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg text-xs font-bold text-center animate-bounce">
            {cashCollectedToast}
          </div>
        )}

        {/* Matrix Card */}
        <div className="bg-slate-800 rounded-3xl p-4 border border-slate-700 shadow-xl space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-700 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Front of Bus (Driver)
            </span>
            <span className="font-mono text-indigo-300 font-bold">40 Seats Total</span>
          </div>

          {/* Seat Grid */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {rows.map((rowSeats, rowIndex) => {
              const leftPair = rowSeats.slice(0, 2);
              const rightPair = rowSeats.slice(2, 4);

              return (
                <div key={rowIndex} className="flex items-center justify-between gap-2">
                  {/* Left Pair */}
                  <div className="flex gap-2 flex-1">
                    {leftPair.map((seat) => (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => handleSeatClick(seat.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                          seat.status === "available"
                            ? "bg-slate-700 hover:bg-slate-600 text-emerald-400 border border-slate-600"
                            : seat.status === "app_reserved"
                            ? "bg-indigo-950/80 text-indigo-300 border border-indigo-700 ring-1 ring-indigo-500/50"
                            : "bg-slate-900/90 text-amber-300 border border-amber-900/40 opacity-80"
                        }`}
                      >
                        <span className="font-mono">{seat.id}</span>
                        <span className="text-[8px] font-normal tracking-tight uppercase">
                          {seat.status === "available"
                            ? "Empty"
                            : seat.status === "app_reserved"
                            ? "App Res"
                            : "Walk-in"}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Aisle */}
                  <div className="w-4 text-center text-[10px] text-slate-600 select-none">
                    |
                  </div>

                  {/* Right Pair */}
                  <div className="flex gap-2 flex-1">
                    {rightPair.map((seat) => (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => handleSeatClick(seat.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all ${
                          seat.status === "available"
                            ? "bg-slate-700 hover:bg-slate-600 text-emerald-400 border border-slate-600"
                            : seat.status === "app_reserved"
                            ? "bg-indigo-950/80 text-indigo-300 border border-indigo-700 ring-1 ring-indigo-500/50"
                            : "bg-slate-900/90 text-amber-300 border border-amber-900/40 opacity-80"
                        }`}
                      >
                        <span className="font-mono">{seat.id}</span>
                        <span className="text-[8px] font-normal tracking-tight uppercase">
                          {seat.status === "available"
                            ? "Empty"
                            : seat.status === "app_reserved"
                            ? "App Res"
                            : "Walk-in"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-700 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-700 border border-slate-600 inline-block"></span>
              <span>Available (Tap to log)</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-950 border border-indigo-700 inline-block"></span>
              <span>App Reserved</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-900 border border-amber-900/40 inline-block"></span>
              <span>Cash Walk-in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Detail / Walk-in Logging Bottom Sheet */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={`Seat ${selectedSeat} Management`}
      >
        {activeSeatObj && (
          <div className="space-y-4 text-slate-800">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold uppercase tracking-wider text-slate-800">
                  {activeSeatObj.status.replace("_", " ")}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-slate-500">Route Fare:</span>
                <span className="font-semibold text-slate-800">₱{busDetails.baseFare}</span>
              </p>
            </div>

            {activeSeatObj.status === "available" && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600">
                  Passenger boarding with cash? Log them into the manifest to synchronize seat availability with the passenger app.
                </p>
                <button
                  onClick={handleLogWalkIn}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
                >
                  Collect ₱{busDetails.baseFare} Cash &amp; Mark Occupied
                </button>
              </div>
            )}

            {activeSeatObj.status === "app_reserved" && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                  <p className="font-bold text-indigo-900 flex items-center gap-1">
                    <span>⚡ Reserved via Passenger App</span>
                  </p>
                  <p className="text-indigo-700 text-[11px]">
                    Includes ₱{busDetails.convenienceFee} convenience fee. Passenger paid online.
                  </p>
                </div>
                <button
                  onClick={handleFreeUpSeat}
                  className="w-full py-2.5 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold rounded-xl text-xs transition"
                >
                  Cancel / Release Reservation
                </button>
              </div>
            )}

            {activeSeatObj.status === "occupied" && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">
                  Logged as a walk-in passenger. Passenger alighting early?
                </p>
                <button
                  onClick={handleFreeUpSeat}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition border"
                >
                  Mark as Vacant / Available
                </button>
              </div>
            )}
          </div>
        )}
      </BottomSheet>

      <BottomNavigation />
    </main>
  );
}
