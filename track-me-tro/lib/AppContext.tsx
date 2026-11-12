"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  Seat,
  SeatStatus,
  initialSeats,
  busDetails,
  BusDetails,
  BookingRequest,
  BookingStatus,
  PassengerType,
  calculateFare,
} from "./mockData";

export type SimulatedTime = "9:00 AM" | "2:00 PM" | "4:00 PM";

export interface PassengerHail {
  id: string;
  busId: string;
  passengerName: string;
  location: string;
  timestamp: string;
  status: "hailed" | "acknowledged" | "boarded";
  tier: "free" | "premium";
  etaAtHail?: string;
}

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
  passengerType: PassengerType;
}

interface AppContextType {
  seats: Seat[];
  updateSeatStatus: (seatId: string, newStatus: SeatStatus) => void;
  busDetails: BusDetails;
  selectedSeatNumber: string;
  setSelectedSeatNumber: (seat: string) => void;
  passengerName: string;
  setPassengerName: (name: string) => void;
  userLocation: string;
  setUserLocation: (location: string) => void;
  simulatedTime: SimulatedTime;
  setSimulatedTime: (time: SimulatedTime) => void;
  boardingAlertMinutes: number;
  setBoardingAlertMinutes: (mins: number) => void;
  isAlertActive: boolean;
  setIsAlertActive: (active: boolean) => void;
  stopAlert: () => void;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  // Route Direction & Origin/Destination Management
  selectedDirection: "sogod-to-ormoc" | "ormoc-to-sogod";
  setSelectedDirection: (dir: "sogod-to-ormoc" | "ormoc-to-sogod") => void;
  origin: string;
  setOrigin: (origin: string) => void;
  destination: string;
  setDestination: (dest: string) => void;
  swapOriginDestination: () => void;
  activeTicket: TicketDetails;
  setActiveTicket: React.Dispatch<React.SetStateAction<TicketDetails>>;
  confirmBooking: (seatNum?: string, payment?: "GCash" | "Maya") => void;
  // Booking flow
  bookings: BookingRequest[];
  createBooking: (params: {
    tripId: string;
    busNumber: string;
    departureTime: string;
    direction: "sogod-ormoc" | "ormoc-sogod";
    passengerType: PassengerType;
    paymentMethod: "GCash" | "Maya";
  }) => BookingRequest;
  assignSeatToBooking: (bookingId: string, seatNumber: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  getActiveBooking: () => BookingRequest | undefined;
  // Advance Passenger Hail & Location Ping
  passengerHails: PassengerHail[];
  hailBus: (busId: string, location: string, etaAtHail?: string) => PassengerHail;
  cancelHail: (busId: string) => void;
  acknowledgeHail: (hailId: string) => void;
  getActiveHailForBus: (busId: string) => PassengerHail | undefined;
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
  baseFare: 275,
  convenienceFee: 15,
  totalFare: 290,
  paymentMethod: "GCash",
  passengerType: "regular",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function generatePNR(): string {
  return `ER${Math.floor(100000000 + Math.random() * 900000000)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [seats, setSeats] = useState<Seat[]>(() => {
    return initialSeats.map((s) => (s.id === "12" ? { ...s, status: "available" } : s));
  });
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>("12");
  const [passengerName, setPassengerName] = useState<string>("Juana de la Cruz");
  const [userLocation, setUserLocation] = useState<string>("VSU Main Campus");
  const [simulatedTime, setSimulatedTime] = useState<SimulatedTime>("9:00 AM");
  const [boardingAlertMinutes, setBoardingAlertMinutes] = useState<number>(10);
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDirection, setSelectedDirectionState] = useState<"sogod-to-ormoc" | "ormoc-to-sogod">("sogod-to-ormoc");
  const [origin, setOriginState] = useState<string>("Sogod, Southern Leyte");
  const [destination, setDestinationState] = useState<string>("Ormoc City, Leyte");
  const [activeTicket, setActiveTicket] = useState<TicketDetails>(DEFAULT_TICKET);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [passengerHails, setPassengerHails] = useState<PassengerHail[]>([]);

  const setSelectedDirection = useCallback((dir: "sogod-to-ormoc" | "ormoc-to-sogod") => {
    setSelectedDirectionState(dir);
    if (dir === "sogod-to-ormoc") {
      setOriginState("Sogod, Southern Leyte");
      setDestinationState("Ormoc City, Leyte");
    } else {
      setOriginState("Ormoc City, Leyte");
      setDestinationState("Sogod, Southern Leyte");
    }
  }, []);

  const setOrigin = useCallback((newOrigin: string) => {
    setOriginState(newOrigin);
    if (newOrigin.toLowerCase().includes("ormoc")) {
      setSelectedDirectionState("ormoc-to-sogod");
    } else if (newOrigin.toLowerCase().includes("sogod")) {
      setSelectedDirectionState("sogod-to-ormoc");
    }
  }, []);

  const setDestination = useCallback((newDest: string) => {
    setDestinationState(newDest);
    if (newDest.toLowerCase().includes("sogod")) {
      setSelectedDirectionState("ormoc-to-sogod");
    } else if (newDest.toLowerCase().includes("ormoc")) {
      setSelectedDirectionState("sogod-to-ormoc");
    }
  }, []);

  const swapOriginDestination = useCallback(() => {
    setOriginState((prevOrigin) => {
      setDestinationState(prevOrigin);
      const isOriginNowOrmoc = prevOrigin.toLowerCase().includes("sogod");
      setSelectedDirectionState(isOriginNowOrmoc ? "ormoc-to-sogod" : "sogod-to-ormoc");
      return destination;
    });
  }, [destination]);

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
      pnr: generatePNR(),
    }));
  };

  const createBooking = useCallback((params: {
    tripId: string;
    busNumber: string;
    departureTime: string;
    direction: "sogod-ormoc" | "ormoc-sogod";
    passengerType: PassengerType;
    paymentMethod: "GCash" | "Maya";
  }): BookingRequest => {
    const fare = calculateFare(busDetails.baseFare, busDetails.convenienceFee, params.passengerType);
    const newBooking: BookingRequest = {
      id: `BK-${Date.now()}`,
      tripId: params.tripId,
      busNumber: params.busNumber,
      departureTime: params.departureTime,
      direction: params.direction,
      passengerType: params.passengerType,
      paymentMethod: params.paymentMethod,
      status: "pending_seat",
      assignedSeat: null,
      passengerName,
      baseFare: fare.baseFare,
      discount: fare.discount,
      convenienceFee: fare.convenienceFee,
      totalFare: fare.totalFare,
      createdAt: new Date().toISOString(),
      pnr: generatePNR(),
    };
    setBookings((prev) => [...prev, newBooking]);
    return newBooking;
  }, [passengerName]);

  const assignSeatToBooking = useCallback((bookingId: string, seatNumber: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, assignedSeat: seatNumber, status: "confirmed" as const }
          : b
      )
    );
    updateSeatStatus(seatNumber, "app_reserved");
    // Also update active ticket for the ticket page
    setBookings((prev) => {
      const booking = prev.find((b) => b.id === bookingId);
      if (booking) {
        const routeTitle = booking.direction === "sogod-ormoc"
          ? "Sogod ➔ Ormoc City"
          : "Ormoc City ➔ Sogod";
        const origin = booking.direction === "sogod-ormoc"
          ? "Sogod, Southern Leyte"
          : "Ormoc City, Leyte";
        const destination = booking.direction === "sogod-ormoc"
          ? "Ormoc City, Leyte"
          : "Sogod, Southern Leyte";

        setActiveTicket({
          pnr: booking.pnr,
          busId: booking.busNumber,
          routeTitle,
          origin,
          destination,
          departureTime: booking.departureTime,
          arrivalTime: "—",
          date: "24 Nov 2026",
          duration: "2 h 45 min",
          seatNumber,
          passengerName: booking.passengerName,
          baseFare: booking.baseFare,
          convenienceFee: booking.convenienceFee,
          totalFare: booking.totalFare,
          paymentMethod: booking.paymentMethod,
          passengerType: booking.passengerType,
        });
      }
      return prev;
    });
  }, []);

  const updateBookingStatus = useCallback((bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  }, []);

  const getActiveBooking = useCallback((): BookingRequest | undefined => {
    return bookings.find((b) => b.status === "pending_seat" || b.status === "confirmed");
  }, [bookings]);

  // Passenger Advance Hail Operations
  const hailBus = useCallback((busId: string, location: string, etaAtHail?: string): PassengerHail => {
    const newHail: PassengerHail = {
      id: `HAIL-${Date.now()}`,
      busId,
      passengerName: passengerName || "Juana de la Cruz",
      location,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "hailed",
      tier: isPremium ? "premium" : "free",
      etaAtHail,
    };
    setPassengerHails((prev) => [newHail, ...prev.filter((h) => h.busId !== busId)]);
    return newHail;
  }, [passengerName, isPremium]);

  const cancelHail = useCallback((busId: string) => {
    setPassengerHails((prev) => prev.filter((h) => h.busId !== busId));
  }, []);

  const acknowledgeHail = useCallback((hailId: string) => {
    setPassengerHails((prev) =>
      prev.map((h) => (h.id === hailId ? { ...h, status: "acknowledged" as const } : h))
    );
  }, []);

  const getActiveHailForBus = useCallback((busId: string): PassengerHail | undefined => {
    return passengerHails.find((h) => h.busId === busId && h.status !== "boarded");
  }, [passengerHails]);

  const stopAlert = useCallback(() => {
    setIsAlertActive(false);
  }, []);

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
        userLocation,
        setUserLocation,
        simulatedTime,
        setSimulatedTime,
        boardingAlertMinutes,
        setBoardingAlertMinutes,
        isAlertActive,
        setIsAlertActive,
        stopAlert,
        isPremium,
        setIsPremium,
        isModalOpen,
        setIsModalOpen,
        selectedDirection,
        setSelectedDirection,
        origin,
        setOrigin,
        destination,
        setDestination,
        swapOriginDestination,
        activeTicket,
        setActiveTicket,
        confirmBooking,
        bookings,
        createBooking,
        assignSeatToBooking,
        updateBookingStatus,
        getActiveBooking,
        passengerHails,
        hailBus,
        cancelHail,
        acknowledgeHail,
        getActiveHailForBus,
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
