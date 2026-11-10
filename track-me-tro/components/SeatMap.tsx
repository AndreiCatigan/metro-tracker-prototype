"use client";

import React from "react";
import { Seat, SeatStatus } from "@/lib/mockData";

interface SeatMapProps {
  seats: Seat[];
  selectedSeatId?: string | null;
  onSelectSeat?: (seatId: string) => void;
  interactive?: boolean;
}

export default function SeatMap({
  seats,
  selectedSeatId,
  onSelectSeat,
  interactive = true,
}: SeatMapProps) {
  // Determine display status for each seat (incorporating selectedSeatId)
  const getStatus = (seat: Seat): SeatStatus => {
    if (selectedSeatId === seat.id) return "selected";
    return seat.status;
  };

  const getSeatStyles = (status: SeatStatus) => {
    switch (status) {
      case "available":
        return "bg-white text-slate-700 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 shadow-xs cursor-pointer";
      case "selected":
        return "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300 scale-105 font-bold";
      case "app_reserved":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 cursor-not-allowed opacity-90";
      case "occupied":
        return "bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed opacity-75";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const getStatusLabel = (status: SeatStatus) => {
    switch (status) {
      case "available":
        return "Free";
      case "selected":
        return "Selected";
      case "app_reserved":
        return "App Res";
      case "occupied":
        return "Occupied";
      default:
        return "";
    }
  };

  // Group 40 seats into 10 rows of 4 seats: [seat0, seat1] [aisle] [seat2, seat3]
  const rows: Seat[][] = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-4 max-w-sm mx-auto shadow-xs">
      {/* Bus Front Indicator */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Driver &amp; Entry (Front)
        </span>
        <span className="text-[11px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
          40-Seat Layout
        </span>
      </div>

      {/* Seat Rows with Aisle */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {rows.map((rowSeats, rowIndex) => {
          const leftPair = rowSeats.slice(0, 2);
          const rightPair = rowSeats.slice(2, 4);

          return (
            <div key={rowIndex} className="flex items-center justify-between gap-2">
              {/* Left Pair (A & B) */}
              <div className="flex gap-2 flex-1">
                {leftPair.map((seat) => {
                  const status = getStatus(seat);
                  const isClickable = interactive && (status === "available" || status === "selected");
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={!isClickable}
                      onClick={() => onSelectSeat && onSelectSeat(seat.id)}
                      className={`flex-1 py-2 px-1 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${getSeatStyles(
                        status
                      )}`}
                    >
                      <span className="text-xs">{seat.id}</span>
                      <span className="text-[9px] font-normal leading-tight">
                        {getStatusLabel(status)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Aisle */}
              <div className="w-6 text-center text-[10px] text-slate-300 font-mono select-none">
                |
              </div>

              {/* Right Pair (C & D) */}
              <div className="flex gap-2 flex-1">
                {rightPair.map((seat) => {
                  const status = getStatus(seat);
                  const isClickable = interactive && (status === "available" || status === "selected");
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={!isClickable}
                      onClick={() => onSelectSeat && onSelectSeat(seat.id)}
                      className={`flex-1 py-2 px-1 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${getSeatStyles(
                        status
                      )}`}
                    >
                      <span className="text-xs">{seat.id}</span>
                      <span className="text-[9px] font-normal leading-tight">
                        {getStatusLabel(status)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-4 gap-1 text-[11px] text-slate-600 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="w-4 h-4 rounded-md bg-white border border-slate-300 shadow-2xs inline-block" />
          <span>Available</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="w-4 h-4 rounded-md bg-emerald-600 shadow-2xs inline-block" />
          <span>Selected</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="w-4 h-4 rounded-md bg-indigo-100 border border-indigo-200 inline-block" />
          <span>App Res</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="w-4 h-4 rounded-md bg-slate-200 inline-block" />
          <span>Occupied</span>
        </div>
      </div>
    </div>
  );
}
