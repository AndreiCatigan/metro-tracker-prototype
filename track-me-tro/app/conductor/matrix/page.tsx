"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import {
  BASE_CABIN_SEATS,
  BASE_REAR_BENCH_SEATS,
  type ConductorSeatData,
} from "@/lib/data";

function ConductorMatrixContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignBookingId = searchParams.get("assignBookingId");

  const {
    busDetails,
    activeTicket,
    bookings,
    assignSeatToBooking,
    passengerHails,
    walkInSales,
    selectedDirection,
    removeBookingReservation,
  } = useAppContext();

  // Target booking to assign a seat to (either from query param or pending booking)
  const pendingBooking = bookings.find((b) => b.status === "pending_seat");
  const targetBooking = assignBookingId
    ? bookings.find((b) => b.id === assignBookingId) || pendingBooking
    : pendingBooking;

  // Seat state representation: pre-select seat 15 only when in assignment mode
  const [selectedSeatId, setSelectedSeatId] = useState<string>(assignBookingId ? "15" : "");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showManifestModal, setShowManifestModal] = useState<boolean>(false);
  const [manifestFilter, setManifestFilter] = useState<"all" | "app" | "walkin" | "hail">("all");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Base vacant templates for cabin and rear bench
  const baseCabinSeats = useMemo<ConductorSeatData[]>(() => {
    return BASE_CABIN_SEATS.map((s) => ({
      ...s,
      type: "available" as const,
      label: s.isWindow ? "WIN" : "VAC",
    }));
  }, []);

  const baseRearSeats = useMemo<ConductorSeatData[]>(() => {
    return BASE_REAR_BENCH_SEATS.map((s) => ({
      ...s,
      type: "available" as const,
      label: "VAC",
    }));
  }, []);

  // Cabin layout: ONLY tracks seats that the conductor has marked as reserved!
  const seatsState = useMemo<ConductorSeatData[]>(() => {
    let updated = [...baseCabinSeats];

    // Track confirmed bookings marked reserved by the conductor
    bookings.forEach((b) => {
      if (b.status === "confirmed" && b.assignedSeat) {
        const padded = b.assignedSeat.padStart(2, "0");
        const passengerFirst = b.passengerName ? b.passengerName.split(" ")[0].toUpperCase() : "RES";
        updated = updated.map((s) =>
          s.id === padded
            ? { ...s, type: "app_reserved" as const, label: passengerFirst }
            : s
        );
      }
    });

    return updated;
  }, [baseCabinSeats, bookings]);

  // Rear 5 bench seats: ONLY tracks seats that the conductor has marked as reserved!
  const rearBench = useMemo<ConductorSeatData[]>(() => {
    let updated = [...baseRearSeats];

    bookings.forEach((b) => {
      if (b.status === "confirmed" && b.assignedSeat) {
        const padded = b.assignedSeat.padStart(2, "0");
        const passengerFirst = b.passengerName ? b.passengerName.split(" ")[0].toUpperCase() : "RES";
        updated = updated.map((s) =>
          s.id === padded
            ? { ...s, type: "app_reserved" as const, label: passengerFirst }
            : s
        );
      }
    });

    return updated;
  }, [baseRearSeats, bookings]);

  // Real-time capacity computation: count ONLY marked reserved seats
  const reservedCount = useMemo(() => {
    return (
      seatsState.filter((s) => s.type === "app_reserved").length +
      rearBench.filter((s) => s.type === "app_reserved").length
    );
  }, [seatsState, rearBench]);

  const rows = ["R1", "R2", "R3", "R4", "R5", "R6", "R7"];

  const selectedSeat =
    seatsState.find((s) => s.id === selectedSeatId) ||
    rearBench.find((s) => s.id === selectedSeatId);

  const reservedBooking = useMemo(() => {
    if (!selectedSeat || selectedSeat.type !== "app_reserved") return null;
    const raw = parseInt(selectedSeat.id, 10).toString();
    const padded = selectedSeat.id.padStart(2, "0");
    return (
      bookings.find(
        (b) =>
          b.status === "confirmed" &&
          (b.assignedSeat === selectedSeat.id ||
            b.assignedSeat === padded ||
            b.assignedSeat === raw)
      ) ||
      (activeTicket &&
      (activeTicket.seatNumber === selectedSeat.id ||
        activeTicket.seatNumber === raw ||
        activeTicket.seatNumber === padded)
        ? {
            id: "ticket-active",
            pnr: activeTicket.pnr,
            busNumber: activeTicket.busId,
            routeTitle: activeTicket.routeTitle,
            direction: "sogod-ormoc" as const,
            origin: activeTicket.origin,
            destination: activeTicket.destination,
            departureTime: activeTicket.departureTime,
            passengerType: activeTicket.passengerType,
            paymentMethod: activeTicket.paymentMethod,
            status: "confirmed" as const,
            assignedSeat: selectedSeat.id,
            passengerName: activeTicket.passengerName,
            baseFare: activeTicket.baseFare,
            convenienceFee: activeTicket.convenienceFee,
            totalFare: activeTicket.totalFare,
            timestamp: "08:00 AM",
          }
        : null)
    );
  }, [selectedSeat, bookings, activeTicket]);

  const handleRemoveReservation = () => {
    if (!selectedSeat) return;
    removeBookingReservation(selectedSeat.id);
    showToast(`✓ Removed reservation for Seat ${selectedSeat.id}. Seat is now open.`);
    setSelectedSeatId("");
  };

  const handleSeatClick = (seat: ConductorSeatData) => {
    setSelectedSeatId(seat.id);
  };

  const handleSellWalkIn = () => {
    router.push(`/conductor/pos?seat=${selectedSeatId}`);
  };

  const handleAssignToPassenger = () => {
    if (!targetBooking || !selectedSeat) return;
    if (selectedSeat.type !== "available") {
      showToast(`Seat ${selectedSeat.id} is not available. Please choose a vacant seat.`);
      return;
    }
    assignSeatToBooking(targetBooking.id, selectedSeat.id);
    showToast(`✓ Seat ${selectedSeat.id} assigned to ${targetBooking.passengerName}! Commuter notified.`);
    setTimeout(() => {
      router.push("/conductor");
    }, 1200);
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
            <button
              type="button"
              onClick={() => router.push("/conductor")}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition flex items-center justify-center text-white cursor-pointer mr-0.5"
              title="Back to Conductor Dashboard"
              aria-label="Back to Conductor Dashboard"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
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

          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F95700]" />
            <span className="text-slate-300 font-bold text-[11px]">Marked Reserved:</span>
            <span className="text-[15px] font-black text-white">{reservedCount}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[420px] w-full mx-auto px-4 -mt-2 space-y-3.5">
        {/* ── Pending App Reservation Banner (Conductor Assigns Seat) ── */}
        {targetBooking && (
          <div className="bg-[#FFE8D6] border-2 border-[#F95700] rounded-2xl p-3.5 shadow-md space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F95700] animate-ping" />
                <span className="text-[12px] font-black text-[#A53700] uppercase tracking-wider">
                  Select Seat for Online Reservation
                </span>
              </div>
              <span className="text-[11px] font-bold bg-[#A53700] text-white px-2 py-0.5 rounded-full capitalize">
                {targetBooking.passengerType}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-extrabold text-[#191C1E]">{targetBooking.passengerName}</p>
                <p className="text-[11px] text-slate-600">
                  {targetBooking.busNumber} • {targetBooking.direction === "sogod-ormoc" ? "Sogod ➔ Ormoc" : "Ormoc ➔ Sogod"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-emerald-700">Paid ₱{targetBooking.totalFare.toFixed(2)}</p>
                <p className="text-[10px] text-slate-500">via {targetBooking.paymentMethod}</p>
              </div>
            </div>

            <p className="text-[10px] font-bold text-[#A53700] bg-white/70 rounded-lg p-1.5 text-center">
              👉 Tap a seat below to assign to {targetBooking.passengerName.split(" ")[0]}
            </p>
          </div>
        )}

        {/* ── Legend Row ── */}
        <div className="flex items-center justify-center gap-6 py-2 px-3 bg-white rounded-2xl shadow-2xs border border-[#ECEEF0] text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F95700]" />
            <span className="text-slate-600">Marked Reserved</span>
            <span className="text-[#F95700] font-black">({reservedCount})</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1D6AE5]" />
            <span className="text-slate-600">Selected</span>
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

                // Unreserved Seat
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    className="w-full py-2.5 px-1 rounded-xl bg-white border border-slate-200 text-slate-700 flex flex-col items-center justify-center hover:border-[#1D6AE5] hover:bg-blue-50/50 transition cursor-pointer"
                  >
                    <span className="text-[12px] font-bold text-slate-700">{seat.id}</span>
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
                    className="py-2.5 px-1 rounded-xl bg-white border border-slate-200 text-slate-700 flex flex-col items-center justify-center text-center hover:border-[#1D6AE5] hover:bg-blue-50/50 transition cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-slate-700">{seat.id}</span>
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
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEEF0] shadow-[0_-6px_24px_rgba(0,0,0,0.08)] px-4 py-3 animate-slide-up">
          <div className="max-w-[420px] mx-auto space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl font-black text-[14px] flex items-center justify-center shadow-xs text-white ${
                    selectedSeat.type === "app_reserved" ? "bg-[#F95700]" : "bg-[#1D6AE5]"
                  }`}
                >
                  {selectedSeat.id}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-black text-[#191C1E]">
                      Seat {selectedSeat.id}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-black uppercase ${
                        selectedSeat.type === "app_reserved"
                          ? "bg-orange-100 text-[#F95700] border border-orange-300"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {selectedSeat.type === "app_reserved" ? "MARKED RESERVED" : "UNRESERVED"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {selectedSeat.type === "app_reserved"
                      ? reservedBooking
                        ? `PNR #${reservedBooking.pnr} • ${reservedBooking.direction === "sogod-ormoc" ? "Sogod ➔ Ormoc" : "Ormoc ➔ Sogod"}`
                        : "Passenger Online Reservation"
                      : "Window • Standard Fare ₱95.00"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSeatId("")}
                className="w-7 h-7 rounded-full bg-[#F2F4F6] text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* If reserved: show Passenger Details & Remove button */}
            {selectedSeat.type === "app_reserved" ? (
              <div className="space-y-2.5 pt-0.5">
                <div className="bg-[#F8F9FA] border border-[#ECEEF0] rounded-2xl p-3 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-[13px] text-[#191C1E]">
                          {reservedBooking?.passengerName || "Juana de la Cruz"}
                        </span>
                        <span className="text-[9px] font-extrabold bg-[#FFE8D6] text-[#A53700] px-1.5 py-0.2 rounded">
                          👑 MEtro+
                        </span>
                        {reservedBooking?.passengerType && (
                          <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded capitalize">
                            {reservedBooking.passengerType}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        {reservedBooking?.direction === "sogod-ormoc"
                          ? "Sogod ➔ Ormoc City"
                          : "Ormoc City ➔ Sogod"}{" "}
                        • Dep: {reservedBooking?.departureTime || "08:00 AM"}
                      </p>
                      <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                        Paid ₱{reservedBooking?.totalFare?.toFixed(2) || "290.00"} (
                        {reservedBooking?.paymentMethod || "GCash"})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">
                        RESERVATION
                      </span>
                      <span className="text-[11px] font-black text-[#F95700]">
                        Assigned Seat #{selectedSeat.id}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveReservation}
                  className="w-full py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-black text-[13px] shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Remove passenger reservation (passenger dropped off or didn't show)"
                >
                  <span className="material-symbols-outlined text-[17px]">person_remove</span>
                  <span>Remove</span>
                </button>
              </div>
            ) : targetBooking ? (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleAssignToPassenger}
                  className="w-full py-3 px-4 rounded-2xl bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[13px] shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">event_seat</span>
                  <span>
                    Confirm Seat {selectedSeat.id} for {targetBooking.passengerName.split(" ")[0]}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 pt-1">
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
              </div>
            )}
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
                    {reservedCount} Marked Reserved
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

export default function ConductorMatrixPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F0F3F7] p-8 text-center text-slate-500 font-bold">Loading Seat Matrix...</div>}>
      <ConductorMatrixContent />
    </Suspense>
  );
}
