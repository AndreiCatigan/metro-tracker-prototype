"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import {
  BASE_CABIN_SEATS,
  BASE_REAR_BENCH_SEATS,
  type ConductorSeatData,
} from "@/lib/data";

export default function ConductorMatrixPage() {
  const router = useRouter();
  const {
    busDetails,
    activeTicket,
    bookings,
    assignSeatToBooking,
    passengerHails,
    acknowledgeHail,
    boardHail,
    walkInSales,
    currentBusStop,
    advanceToNextStop,
    selectedDirection,
  } = useAppContext();

  // Seat state representation
  const [selectedSeatId, setSelectedSeatId] = useState<string>("15");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showManifestModal, setShowManifestModal] = useState<boolean>(false);
  const [manifestFilter, setManifestFilter] = useState<"all" | "app" | "walkin" | "hail">("all");

  // Check for any pending bookings from passengers
  const pendingBooking = bookings.find((b) => b.status === "pending_seat");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cabin layout with live sync to activeTicket, confirmed bookings, and POS walk-in sales
  const seatsState = useMemo<ConductorSeatData[]>(() => {
    let updated = [...BASE_CABIN_SEATS];

    // Overlay active ticket seat
    if (activeTicket?.seatNumber) {
      const padded = activeTicket.seatNumber.padStart(2, "0");
      updated = updated.map((s) =>
        s.id === padded
          ? {
              ...s,
              type: activeTicket.isBoarded ? ("on_board" as const) : ("app_reserved" as const),
              label: activeTicket.isBoarded ? "JUANA" : "#APP",
            }
          : s
      );
    }

    // Overlay confirmed app bookings
    bookings.forEach((b) => {
      if (b.status === "confirmed" && b.assignedSeat) {
        const padded = b.assignedSeat.padStart(2, "0");
        updated = updated.map((s) =>
          s.id === padded ? { ...s, type: "app_reserved" as const, label: `#APP${b.assignedSeat}` } : s
        );
      }
    });

    // Overlay POS Walk-in sales
    walkInSales.forEach((sale) => {
      const padded = sale.seatId.padStart(2, "0");
      updated = updated.map((s) =>
        s.id === padded ? { ...s, type: "on_board" as const, label: "POS" } : s
      );
    });

    return updated;
  }, [activeTicket, bookings, walkInSales]);

  // Rear 5 bench seats
  const rearBench = BASE_REAR_BENCH_SEATS;

  // Real-time capacity computation
  const occupiedCount = useMemo(() => {
    return (
      seatsState.filter((s) => s.type === "on_board" || s.type === "app_reserved").length +
      rearBench.filter((s) => s.type === "on_board" || s.type === "app_reserved").length
    );
  }, [seatsState, rearBench]);

  const availableCount = Math.max(0, 45 - occupiedCount);
  const occupancyPercent = Math.round((occupiedCount / 45) * 100);

  const rows = ["R1", "R2", "R3", "R4", "R5", "R6", "R7"];

  const selectedSeat =
    seatsState.find((s) => s.id === selectedSeatId) ||
    rearBench.find((s) => s.id === selectedSeatId);

  const handleSeatClick = (seat: ConductorSeatData) => {
    setSelectedSeatId(seat.id);
  };

  const handleSellWalkIn = () => {
    router.push(`/conductor/pos?seat=${selectedSeatId}`);
  };

  const handleAssignToPassenger = () => {
    if (!pendingBooking || !selectedSeat) return;
    if (selectedSeat.type !== "available") {
      showToast(`Seat ${selectedSeat.id} is not available. Please choose a vacant seat.`);
      return;
    }
    assignSeatToBooking(pendingBooking.id, selectedSeat.id);
    showToast(`Seat ${selectedSeat.id} assigned to ${pendingBooking.passengerName}! Ticket sent.`);
  };

  return (
    <div className="min-h-screen bg-[#F0F3F7] text-[#191C1E] flex flex-col font-sans pb-36">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Dark Navy Telemetry Header ── */}
      <header className="bg-[#101A2C] text-white p-4 pb-5 rounded-b-3xl shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F95700]" />
              BUS {busDetails.id}
            </span>
            <span className="text-[11px] text-slate-300 font-semibold">
              Express • Aircon
            </span>
          </div>

          <div className="flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>GPS Live</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              ASSIGNED ROUTE
            </p>
            <h1 className="text-[18px] font-black tracking-tight text-white mt-0.5">
              {selectedDirection === "sogod-to-ormoc" ? (
                <>Sogod <span className="text-slate-400">➔</span> Ormoc</>
              ) : (
                <>Ormoc <span className="text-slate-400">➔</span> Sogod</>
              )}
            </h1>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              CORRIDOR STOP (TAP TO ADVANCE)
            </p>
            <button
              type="button"
              onClick={() => {
                advanceToNextStop();
                showToast(`Bus location updated: Bus approaching ${currentBusStop}`);
              }}
              className="inline-flex items-center gap-1 bg-[#FFCC00]/25 hover:bg-[#FFCC00]/35 text-[#FFD633] px-2.5 py-1 rounded-full text-[11px] font-extrabold mt-0.5 border border-[#FFCC00]/40 transition active:scale-95 cursor-pointer shadow-2xs"
              title="Tap to advance bus location to next stop"
            >
              <span className="material-symbols-outlined text-[13px]">location_on</span>
              <span className="max-w-[130px] truncate">{currentBusStop}</span>
              <span className="material-symbols-outlined text-[12px] opacity-80">fast_forward</span>
            </button>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-black text-white">{occupiedCount}</span>
              <span className="text-slate-400 font-semibold text-[11px]">/ 45 Seats Filled</span>
              <span className="text-[#FF8C00] font-black text-[11px] ml-1">({occupancyPercent}%)</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {availableCount} Available
            </span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            {/* On-board segment */}
            <div
              className="h-full bg-gradient-to-r from-[#1D6AE5] to-[#F95700] transition-all duration-300"
              style={{ width: `${Math.min(100, occupancyPercent)}%` }}
            />
            {/* Vacant segment */}
            <div className="h-full bg-slate-700 flex-1" />
          </div>
        </div>
      </header>

      <main className="max-w-[420px] w-full mx-auto px-4 -mt-2 space-y-3.5">
        {/* ── Advance Passenger Hail Notifications (Pinged by Commuters in Advance) ── */}
        {passengerHails && passengerHails.length > 0 && (
          <div className="bg-[#FFE8D6] border-2 border-[#F95700] rounded-2xl p-3.5 shadow-md space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F95700] animate-ping" />
                <span className="text-[12px] font-black text-[#A53700] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">signpost</span>
                  <span>Advance Passenger Hails ({passengerHails.length})</span>
                </span>
              </div>
              <span className="text-[10px] font-black bg-[#F95700] text-white px-2 py-0.5 rounded-full uppercase shadow-2xs">
                Upcoming Stop
              </span>
            </div>

            <div className="space-y-2">
              {passengerHails.map((hail) => (
                <div
                  key={hail.id}
                  className="bg-white rounded-xl p-3 border border-orange-200 shadow-2xs space-y-2 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-[13px] text-[#191C1E]">
                          {hail.passengerName}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                            hail.tier === "premium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {hail.tier === "premium" ? "👑 MEtro+" : "👤 Free Tier"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-800 font-bold mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#F95700]">
                          location_on
                        </span>
                        <span>
                          Waiting at: <span className="underline decoration-[#F95700]">{hail.location}</span>
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Target: <strong>{hail.busId}</strong> • Pinged at {hail.timestamp}{" "}
                        {hail.etaAtHail ? `(${hail.etaAtHail})` : ""}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      {hail.status === "boarded" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-300">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          <span>Boarded ✓</span>
                        </span>
                      ) : hail.status === "acknowledged" ? (
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            <span>Confirmed</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              boardHail(hail.id);
                              showToast(`✓ ${hail.passengerName} boarded Bus ${busDetails.id}!`);
                            }}
                            className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] shadow-2xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[12px]">how_to_reg</span>
                            <span>Board Passenger</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            acknowledgeHail(hail.id);
                            showToast(
                              `✓ Driver alerted to stop for ${hail.passengerName} at ${hail.location}!`
                            );
                          }}
                          className="py-1.5 px-3 rounded-xl bg-[#F95700] hover:bg-[#E04E00] text-white font-black text-[11px] shadow-sm transition active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">check</span>
                          <span>Acknowledge Stop</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Manifest Modal Button & Commuter App Link ── */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowManifestModal(true)}
            className="bg-white border border-[#ECEEF0] text-slate-800 rounded-2xl p-2.5 shadow-2xs flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FFE8D6] text-[#A53700] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
            <div className="min-w-0">
              <p className="font-black text-[11px] text-[#191C1E] truncate">Passenger Manifest</p>
              <p className="text-[9px] text-[#A53700] font-bold truncate">
                {occupiedCount} On Board • View All
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/home")}
            className="bg-white border border-[#ECEEF0] text-slate-800 rounded-2xl p-2.5 shadow-2xs flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-[#E0E8F0] text-slate-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
            </div>
            <div className="min-w-0">
              <p className="font-black text-[11px] text-[#191C1E] truncate">Commuter App</p>
              <p className="text-[9px] text-slate-500 font-bold truncate">Switch to Passenger UI</p>
            </div>
          </button>
        </div>
        {/* ── Pending App Reservation Banner (Conductor Assigns Seat) ── */}
        {pendingBooking && (
          <div className="bg-[#FFE8D6] border-2 border-[#F95700] rounded-2xl p-3.5 shadow-md space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F95700] animate-ping" />
                <span className="text-[12px] font-black text-[#A53700] uppercase tracking-wider">
                  Pending Seat Request
                </span>
              </div>
              <span className="text-[11px] font-bold bg-[#A53700] text-white px-2 py-0.5 rounded-full capitalize">
                {pendingBooking.passengerType}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-extrabold text-[#191C1E]">{pendingBooking.passengerName}</p>
                <p className="text-[11px] text-slate-600">
                  {pendingBooking.busNumber} • {pendingBooking.direction === "sogod-ormoc" ? "Sogod ➔ Ormoc" : "Ormoc ➔ Sogod"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-emerald-700">Paid ₱{pendingBooking.totalFare.toFixed(2)}</p>
                <p className="text-[10px] text-slate-500">via {pendingBooking.paymentMethod}</p>
              </div>
            </div>

            <p className="text-[10px] font-bold text-[#A53700] bg-white/70 rounded-lg p-1.5 text-center">
              👉 Tap a VACANT seat below to assign to {pendingBooking.passengerName.split(" ")[0]}
            </p>
          </div>
        )}

        {/* ── Big Scan Passenger CTA Banner ── */}
        <button
          type="button"
          onClick={() => router.push("/conductor/scan")}
          className="w-full bg-gradient-to-r from-[#F95700] to-[#E04E00] text-white rounded-2xl p-4 shadow-md flex items-center justify-between transition-transform active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[16px] font-black tracking-tight">
                  Scan Passenger E-Ticket
                </span>
                <span className="text-[14px]">🌟</span>
              </div>
              <p className="text-[11px] text-white/80 font-medium">
                Tap to validate QR or transit card
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] bg-black/20 rounded-full p-1.5">
            arrow_forward
          </span>
        </button>

        {/* ── Legend Row ── */}
        <div className="flex items-center justify-around py-1.5 px-3 bg-white rounded-2xl shadow-2xs border border-[#ECEEF0] text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-emerald-50" />
            <span className="text-slate-600">Available</span>
            <span className="text-slate-400 font-medium">13</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F95700]" />
            <span className="text-slate-600">App</span>
            <span className="text-[#F95700] font-black">18</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1F2937]" />
            <span className="text-slate-600">On-Board</span>
            <span className="text-slate-900 font-black">14</span>
          </div>
        </div>

        {/* ── Bus Cabin Matrix Card ── */}
        <section className="bg-white rounded-3xl p-4 shadow-sm border border-[#ECEEF0] space-y-3.5">
          {/* Cabin Header */}
          <div className="bg-[#101A2C] text-white rounded-2xl p-2.5 px-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px]">airline_seat_recline_extra</span>
              </div>
              <div>
                <p className="text-[11px] font-black">CONDUCTOR UNIT</p>
                <p className="text-[9px] text-slate-300">Kuya Rolly B. • FRONT CABIN DMS-048</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-emerald-400 font-black text-[10px] uppercase tracking-wider bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-lg">
              <span>PASSENGER DOOR</span>
              <span className="material-symbols-outlined text-[14px]">door_front</span>
            </div>
          </div>

          {/* Rows R1 through R7 */}
          <div className="space-y-2.5">
            {rows.map((rowId) => {
              const rowSeats = seatsState.filter((s) => s.row === rowId);
              const seatA = rowSeats.find((s) => s.col === "A");
              const seatB = rowSeats.find((s) => s.col === "B");
              const seatC = rowSeats.find((s) => s.col === "C");
              const seatD = rowSeats.find((s) => s.col === "D");

              const renderSeat = (seat?: ConductorSeatData) => {
                if (!seat) return <div className="w-12 h-10" />;

                const isSelected = selectedSeatId === seat.id;

                if (isSelected) {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="w-full py-2 px-1 rounded-xl bg-[#1D6AE5] text-white flex flex-col items-center justify-center shadow-md ring-2 ring-emerald-400 transition transform scale-105 cursor-pointer"
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="text-[12px] font-black">{seat.id}</span>
                        <span className="text-[9px] bg-white/20 px-1 rounded">WIN</span>
                      </div>
                      <span className="text-[9px] font-black text-emerald-300">
                        SELECTED ✓
                      </span>
                    </button>
                  );
                }

                if (seat.type === "on_board") {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="w-full py-2 px-1 rounded-xl bg-[#283548] text-white flex flex-col items-center justify-center hover:bg-[#33445C] transition cursor-pointer"
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="text-[11px] font-bold">{seat.id}</span>
                        <span className="material-symbols-outlined text-[11px] text-slate-400">person</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-300">
                        {seat.label}
                      </span>
                    </button>
                  );
                }

                if (seat.type === "app_reserved") {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="w-full py-2 px-1 rounded-xl bg-[#F95700] text-white flex flex-col items-center justify-center shadow-2xs hover:bg-[#E04E00] transition cursor-pointer"
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="text-[11px] font-black">{seat.id}</span>
                        <span className="material-symbols-outlined text-[10px]">confirmation_number</span>
                      </div>
                      <span className="text-[8.5px] font-black uppercase tracking-tight opacity-95">
                        {seat.label}
                      </span>
                    </button>
                  );
                }

                // Available / Vacant
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    className="w-full py-2 px-1 rounded-xl bg-white border border-slate-200 text-slate-700 flex flex-col items-center justify-center hover:border-[#1D6AE5] hover:bg-blue-50/50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold">{seat.id}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[8.5px] font-semibold text-slate-400 uppercase tracking-tight">
                      VACANT
                    </span>
                  </button>
                );
              };

              return (
                <div key={rowId} className="grid grid-cols-5 items-center gap-2">
                  <div className="col-span-1">{renderSeat(seatA)}</div>
                  <div className="col-span-1">{renderSeat(seatB)}</div>

                  {/* Aisle Row Tag */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="w-7 h-5 rounded bg-[#F2F4F6] text-slate-400 font-bold text-[10px] flex items-center justify-center select-none">
                      {rowId}
                    </span>
                  </div>

                  <div className="col-span-1">{renderSeat(seatC)}</div>
                  <div className="col-span-1">{renderSeat(seatD)}</div>
                </div>
              );
            })}
          </div>

          {/* Rear 5-Seat Bench */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-12 h-[1px] bg-slate-200" />
              <span>REAR 5-SEAT BENCH</span>
              <span className="w-12 h-[1px] bg-slate-200" />
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {rearBench.map((seat) => {
                const isSelected = selectedSeatId === seat.id;

                if (isSelected) {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="py-2 px-1 rounded-xl bg-[#1D6AE5] text-white flex flex-col items-center justify-center ring-2 ring-emerald-400 text-center"
                    >
                      <span className="text-[10px] font-black">{seat.id}</span>
                      <span className="text-[8px] font-black">SEL</span>
                    </button>
                  );
                }

                if (seat.type === "on_board") {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="py-2 px-1 rounded-xl bg-[#283548] text-white flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-[10px] font-bold">{seat.id}</span>
                      <span className="text-[8px] font-semibold text-slate-300">{seat.label}</span>
                    </button>
                  );
                }

                if (seat.type === "app_reserved") {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="py-2 px-1 rounded-xl bg-[#F95700] text-white flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-[10px] font-black">{seat.id}</span>
                      <span className="text-[8px] font-black uppercase">{seat.label}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    className="py-2 px-1 rounded-xl bg-white border border-slate-200 text-slate-700 flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-[10px] font-bold">{seat.id}</span>
                    <span className="text-[8px] font-semibold text-slate-400">{seat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matrix Card Footer */}
          <div className="pt-2 border-t border-[#ECEEF0] flex items-center justify-between text-[10px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>LTFRB Tariff Compliant</span>
            </span>
            <span className="flex items-center gap-1 text-[#F95700]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F95700] animate-pulse" />
              <span>Live matrix sync</span>
            </span>
          </div>
        </section>
      </main>

      {/* ── Fixed Bottom Floating Action Card (for Selected Seat) ── */}
      {selectedSeat && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEEF0] shadow-[0_-6px_24px_rgba(0,0,0,0.08)] px-4 py-3">
          <div className="max-w-[420px] mx-auto space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1D6AE5] text-white font-black text-[14px] flex items-center justify-center shadow-xs">
                  {selectedSeat.id}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-black text-[#191C1E]">
                      Seat {selectedSeat.id}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full text-[10px] font-black uppercase">
                      {selectedSeat.type === "available" ? "AVAILABLE" : selectedSeat.type === "app_reserved" ? "APP RESERVED" : "ON BOARD"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Right Window • Standard Fare{" "}
                    <span className="font-extrabold text-[#191C1E]">₱95.00</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSeatId("")}
                className="w-7 h-7 rounded-full bg-[#F2F4F6] text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              {pendingBooking && selectedSeat.type === "available" ? (
                <button
                  type="button"
                  onClick={handleAssignToPassenger}
                  className="w-full py-3 px-4 rounded-2xl bg-[#A53700] hover:bg-[#812900] active:scale-[0.98] text-white font-black text-[13px] shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">event_seat</span>
                  <span>Assign Seat {selectedSeat.id} to {pendingBooking.passengerName.split(" ")[0]}</span>
                </button>
              ) : (
                <>
                  <div className="bg-[#F2F4F6] rounded-xl px-3 py-2 text-[10px] font-bold text-slate-600">
                    <p className="text-[9px] text-slate-400 uppercase">FARE CLASS</p>
                    <p className="text-[#191C1E] font-black text-[11px]">
                      Regular (₱95) <span className="text-emerald-600 font-medium">↗ 20% Disc</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSellWalkIn}
                    className="flex-1 py-3 px-4 rounded-2xl bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[13px] shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                    <span>Sell Walk-In Ticket</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ── Live Passenger Manifest Modal ── */}
      {showManifestModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowManifestModal(false)}
          />
          <div className="relative w-full max-w-[480px] bg-white rounded-t-[32px] p-5 shadow-2xl z-10 space-y-4 border-t border-[#ECEEF0] animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-[#D8DADC] rounded-full mx-auto -mt-1 mb-1" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#101A2C] text-white flex items-center justify-center font-black">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[17px] text-[#191C1E]">
                    Bus {busDetails.id} Passenger Manifest
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {occupiedCount} Passengers On Board • {availableCount} Vacant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManifestModal(false)}
                className="w-8 h-8 rounded-full bg-[#F2F4F6] text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Summary Strip */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#F7F9FB] border border-[#ECEEF0] rounded-xl p-2.5">
                <p className="text-[9px] font-bold text-slate-400 uppercase">APP RESERVED</p>
                <p className="text-[15px] font-black text-[#F95700] mt-0.5">
                  {bookings.filter((b) => b.status === "confirmed").length + (activeTicket ? 1 : 0)}
                </p>
                <p className="text-[9px] text-slate-500">E-Wallet</p>
              </div>

              <div className="bg-[#F7F9FB] border border-[#ECEEF0] rounded-xl p-2.5">
                <p className="text-[9px] font-bold text-slate-400 uppercase">POS CASH</p>
                <p className="text-[15px] font-black text-slate-800 mt-0.5">
                  {walkInSales.length}
                </p>
                <p className="text-[9px] text-slate-500">Walk-In</p>
              </div>

              <div className="bg-[#F7F9FB] border border-[#ECEEF0] rounded-xl p-2.5">
                <p className="text-[9px] font-bold text-slate-400 uppercase">ADVANCE HAILS</p>
                <p className="text-[15px] font-black text-emerald-600 mt-0.5">
                  {passengerHails.length}
                </p>
                <p className="text-[9px] text-slate-500">Pings</p>
              </div>
            </div>

            {/* Manifest Passenger List */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                PASSENGER ROSTER
              </p>

              {/* 1. App Passenger: Juana de la Cruz */}
              <div className="bg-[#F7F9FB] rounded-2xl p-3 border border-[#ECEEF0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#F95700] text-white flex items-center justify-center font-black text-[13px]">
                    {activeTicket.seatNumber || "12"}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-[13px] text-[#191C1E]">
                        {activeTicket.passengerName}
                      </span>
                      <span className="text-[9px] font-extrabold bg-[#FFE8D6] text-[#A53700] px-1.5 py-0.2 rounded">
                        👑 MEtro+
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      PNR #{activeTicket.pnr} • {activeTicket.origin.split(",")[0]} ➔ {activeTicket.destination.split(",")[0]}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      activeTicket.isBoarded
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {activeTicket.isBoarded ? "Boarded ✓" : "Paid • Awaiting Scan"}
                  </span>
                  <p className="text-[10px] font-bold text-slate-700 mt-0.5">
                    ₱{activeTicket.totalFare.toFixed(2)} ({activeTicket.paymentMethod})
                  </p>
                </div>
              </div>

              {/* 2. Walk-in POS Ticket Sales */}
              {walkInSales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-white rounded-2xl p-3 border border-[#ECEEF0] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#101A2C] text-white flex items-center justify-center font-black text-[13px]">
                      {sale.seatId}
                    </div>
                    <div>
                      <p className="font-black text-[13px] text-[#191C1E]">Walk-in Passenger</p>
                      <p className="text-[10px] text-slate-500">
                        Dest: {sale.destination} • Issued {sale.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      Cash Walk-in
                    </span>
                    <p className="text-[10px] font-bold text-emerald-700 mt-0.5">
                      ₱{sale.finalFare.toFixed(2)} Paid
                    </p>
                  </div>
                </div>
              ))}

              {/* 3. Advance Hails waiting or boarded */}
              {passengerHails.map((hail) => (
                <div
                  key={hail.id}
                  className="bg-white rounded-2xl p-3 border border-orange-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">hail</span>
                    </div>
                    <div>
                      <p className="font-black text-[13px] text-[#191C1E]">
                        {hail.passengerName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Waiting: {hail.location} • {hail.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        hail.status === "boarded"
                          ? "bg-emerald-100 text-emerald-800"
                          : hail.status === "acknowledged"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {hail.status === "boarded"
                        ? "Boarded ✓"
                        : hail.status === "acknowledged"
                        ? "Acknowledged"
                        : "Pinged"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowManifestModal(false);
                router.push("/conductor/scan");
              }}
              className="w-full py-3 rounded-full bg-[#101A2C] text-white font-extrabold text-[13px] shadow-md flex items-center justify-center gap-2 cursor-pointer hover:bg-black transition"
            >
              <span className="material-symbols-outlined text-[17px]">qr_code_scanner</span>
              <span>Open Scanner to Verify Passenger</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
