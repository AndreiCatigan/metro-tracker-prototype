"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Seat, SeatStatus, initialSeats, busDetails, BusDetails } from "./mockData";

export interface TicketDetails {
  pnr: string;
  busId: string;
  routeTitle: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  seatNumber: string;
  passengerName: string;
  baseFare: number;
  convenienceFee: number;
  totalFare: number;
  paymentMethod: "GCash" | "Maya";
}

interface AppContextType {
  seats: Seat[];
  updateSeatStatus: (seatId: string, newStatus: SeatStatus) => void;
  busDetails: BusDetails;
  selectedSeatNumber: string;
  setSelectedSeatNumber: (seat: string) => void;
  passengerName: string;
  setPassengerName: (name: string) => void;
  boardingAlertMinutes: number;
  setBoardingAlertMinutes: (mins: number) => void;
  isAlertActive: boolean;
  setIsAlertActive: (active: boolean) => void;
  activeTicket: TicketDetails;
  setActiveTicket: React.Dispatch<React.SetStateAction<TicketDetails>>;
  confirmBooking: (seatNum?: string, payment?: "GCash" | "Maya") => void;
}

const DEFAULT_TICKET: TicketDetails = {
  pnr: "ER902624726",
  busId: "DMS-048",
  routeTitle: "Sogod ➔ Ormoc City",
  origin: "Sogod, Southern Leyte",
  destination: "Ormoc City, Leyte",
  departureTime: "08:00",
  arrivalTime: "10:23",
  date: "24 Nov 2026",
  duration: "2 h 23 min",
  seatNumber: "12",
  passengerName: "Juana de la Cruz",
  baseFare: 80,
  convenienceFee: 15,
  totalFare: 95,
  paymentMethod: "GCash",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [seats, setSeats] = useState<Seat[]>(() => {
    // Ensure seat 12 is selected or available as in the mockup
    return initialSeats.map((s) => (s.id === "12" ? { ...s, status: "available" } : s));
  });
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>("12");
  const [passengerName, setPassengerName] = useState<string>("Juana de la Cruz");
  const [boardingAlertMinutes, setBoardingAlertMinutes] = useState<number>(10);
  const [isAlertActive, setIsAlertActive] = useState<boolean>(true);
  const [activeTicket, setActiveTicket] = useState<TicketDetails>(DEFAULT_TICKET);

  const updateSeatStatus = (seatId: string, newStatus: SeatStatus) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId ? { ...seat, status: newStatus } : seat
      )
    );
  };

  const confirmBooking = (seatNum: string = selectedSeatNumber, payment: "GCash" | "Maya" = "GCash") => {
    updateSeatStatus(seatNum, "app_reserved");
    setActiveTicket((prev) => ({
      ...prev,
      seatNumber: seatNum,
      paymentMethod: payment,
      pnr: `ER${Math.floor(100000000 + Math.random() * 900000000)}`,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        seats,
        updateSeatStatus,
        busDetails,
        selectedSeatNumber,
        setSelectedSeatNumber,
        passengerName,
        setPassengerName,
        boardingAlertMinutes,
        setBoardingAlertMinutes,
        isAlertActive,
        setIsAlertActive,
        activeTicket,
        setActiveTicket,
        confirmBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Backward-compatible alias
export const useApp = useAppContext;
