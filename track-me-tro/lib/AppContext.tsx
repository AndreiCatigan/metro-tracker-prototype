"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import {
  Seat,
  SeatStatus,
  initialSeats,
  busDetails,
  BusDetails,
  BookingRequest,
  BookingStatus,
  PassengerType,
  CONVENIENCE_FEE,
  calculateSegmentFare,
  normalizeStopName,
  CORRIDOR_STOPS,
} from "./mockData";

export type SimulatedTime = "9:00 AM" | "2:00 PM" | "4:00 PM";
export type BusDispatchStatus = "in_queue" | "boarding" | "depart";

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

export interface WalkInSale {
  id: string;
  seatId: string;
  destination: string;
  baseFare: number;
  discountType: "regular" | "discount";
  finalFare: number;
  timestamp: string;
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
  isBoarded?: boolean;
  boardedAt?: string;
}

interface AppContextType {
  seats: Seat[];
  updateSeatStatus: (seatId: string, newStatus: SeatStatus) => void;
  busDetails: BusDetails;
  conductorName: string;
  setConductorName: (name: string) => void;
  busStatus: BusDispatchStatus;
  setBusStatus: (status: BusDispatchStatus) => void;
  busLastUpdatedAt: number;
  touchBusLastUpdated: () => void;
  registerConductorShift: (params: {
    name: string;
    busNumber: string;
    direction: "sogod-to-ormoc" | "ormoc-to-sogod";
    isAircon: boolean;
  }) => void;
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
  // Passenger Concession & Discount Verification
  verifiedDiscount: PassengerType;
  setVerifiedDiscount: (type: PassengerType) => void;
  discountIdNumber: string;
  setDiscountIdNumber: (id: string) => void;
  discountSchoolOrAgency: string;
  setDiscountSchoolOrAgency: (agency: string) => void;
  verifyDiscount: (type: PassengerType, idNumber?: string, schoolOrAgency?: string) => void;
  removeDiscount: () => void;
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
    tripId?: string;
    busNumber?: string;
    departureTime?: string;
    direction?: "sogod-ormoc" | "ormoc-sogod" | "sogod-to-ormoc" | "ormoc-to-sogod";
    passengerType?: PassengerType;
    paymentMethod: "GCash" | "Maya";
    origin?: string;
    destination?: string;
    paymentStatus?: "paid" | "unpaid";
    etaMinutes?: number;
    etaText?: string;
  }) => BookingRequest;
  assignSeatToBooking: (bookingId: string, seatNumber: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  getActiveBooking: () => BookingRequest | undefined;
  // Advance Passenger Hail & Location Ping
  passengerHails: PassengerHail[];
  hailBus: (busId: string, location: string, etaAtHail?: string) => PassengerHail;
  cancelHail: (busId: string) => void;
  acknowledgeHail: (hailId: string) => void;
  boardHail: (hailId: string) => void;
  pickupHail: (hailId: string) => void;
  removeHail: (hailId: string) => void;
  getActiveHailForBus: (busId: string) => PassengerHail | undefined;
  // Conductor Operations & Two-Way Sync
  passengersOnBoard: number;
  setPassengersOnBoard: React.Dispatch<React.SetStateAction<number>>;
  incrementPassengersOnBoard: (amount?: number) => void;
  decrementPassengersOnBoard: (amount?: number) => void;
  requestSeatReservation: (name?: string, direction?: "sogod-ormoc" | "ormoc-sogod") => BookingRequest;
  walkInSales: WalkInSale[];
  recordWalkInSale: (sale: Omit<WalkInSale, "id" | "timestamp">) => WalkInSale;
  validateTicketBoarding: (pnr: string) => boolean;
  markNoShow: (seatNumber: string) => void;
  removeBookingReservation: (seatNumber: string) => void;
  currentBusStop: string;
  setCurrentBusStop: (stop: string) => void;
  advanceToNextStop: () => void;
}

const DEFAULT_TICKET: TicketDetails = {
  pnr: "ER902624726",
  busId: "DMS-048",
  routeTitle: "Sogod ➔ Ormoc City",
  origin: "Sogod Terminal",
  destination: "Ormoc City",
  departureTime: "08:00",
  arrivalTime: "10:23",
  date: "24 Nov 2026",
  duration: "2 h 23 min",
  seatNumber: "12",
  passengerName: "Juana de la Cruz",
  baseFare: 275,
  convenienceFee: CONVENIENCE_FEE,
  totalFare: 295,
  paymentMethod: "GCash",
  passengerType: "regular",
};

const DEFAULT_INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: "BK-882104",
    tripId: "trip-sogod-1",
    busNumber: "DMS-048",
    departureTime: "08:00 AM",
    direction: "sogod-ormoc",
    passengerType: "regular",
    paymentMethod: "GCash",
    status: "pending_seat",
    assignedSeat: null,
    passengerName: "Juana de la Cruz",
    baseFare: 275,
    discount: 0,
    convenienceFee: CONVENIENCE_FEE,
    totalFare: 295,
    createdAt: "2026-11-24T08:00:00.000Z",
    pnr: "ER902624726",
  },
];

const DEFAULT_INITIAL_HAILS: PassengerHail[] = [
  {
    id: "HAIL-001",
    busId: "DMS-048",
    passengerName: "Patricia Gomez",
    location: "VSU Main Campus",
    timestamp: "8:42 AM",
    status: "hailed",
    tier: "premium",
    etaAtHail: "Approaching in 12 min",
  },
  {
    id: "HAIL-002",
    busId: "DMS-048",
    passengerName: "Joshua Reyes",
    location: "Inopacan",
    timestamp: "8:35 AM",
    status: "acknowledged",
    tier: "free",
    etaAtHail: "Approaching in 24 min",
  },
];

const INITIAL_PASSENGERS_ON_BOARD = 24;

const AppContext = createContext<AppContextType | undefined>(undefined);

function generatePNR(): string {
  return `ER${Math.floor(100000000 + Math.random() * 900000000)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [seats, setSeats] = useState<Seat[]>(() => {
    return initialSeats.map((s) => (s.id === "12" ? { ...s, status: "available" } : s));
  });
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>("12");
  const [passengerName, setPassengerName] = useLocalStorageState<string>("trackmetro_passenger_name", "Juana de la Cruz");
  const [userLocation, setUserLocation] = useLocalStorageState<string>("trackmetro_user_location", "VSU Main Campus");
  const [simulatedTime, setSimulatedTime] = useLocalStorageState<SimulatedTime>("trackmetro_simulated_time", "9:00 AM");
  const [boardingAlertMinutes, setBoardingAlertMinutes] = useLocalStorageState<number>("trackmetro_boarding_alert_minutes", 10);
  const [isAlertActive, setIsAlertActive] = useLocalStorageState<boolean>("trackmetro_is_alert_active", false);
  const [isPremium, setIsPremium] = useLocalStorageState<boolean>("trackmetro_is_premium", false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDirection, setSelectedDirectionState] = useLocalStorageState<"sogod-to-ormoc" | "ormoc-to-sogod">("trackmetro_selected_direction", "sogod-to-ormoc");
  const [origin, setOriginState] = useLocalStorageState<string>("trackmetro_origin", "Sogod Terminal");
  const [destination, setDestinationState] = useLocalStorageState<string>("trackmetro_destination", "Ormoc City");
  const [activeTicket, setActiveTicket] = useLocalStorageState<TicketDetails>("trackmetro_active_ticket", DEFAULT_TICKET);
  const [bookings, setBookings] = useLocalStorageState<BookingRequest[]>("trackmetro_bookings", DEFAULT_INITIAL_BOOKINGS);
  const [passengerHails, setPassengerHails] = useLocalStorageState<PassengerHail[]>("trackmetro_hails", DEFAULT_INITIAL_HAILS);
  const [walkInSales, setWalkInSales] = useLocalStorageState<WalkInSale[]>("trackmetro_walkin_sales", []);
  const [currentBusStop, setCurrentBusStop] = useLocalStorageState<string>("trackmetro_current_stop", "Baybay City Terminal");
  const [passengersOnBoard, setPassengersOnBoard] = useLocalStorageState<number>("trackmetro_passengers_on_board", INITIAL_PASSENGERS_ON_BOARD);
  const [conductorName, setConductorName] = useLocalStorageState<string>("trackmetro_conductor_name", "Kuya Rolly B.");
  const [busDetailsState, setBusDetailsState] = useLocalStorageState<BusDetails>("trackmetro_bus_details", busDetails);
  const [busStatus, setBusStatusState] = useLocalStorageState<BusDispatchStatus>("trackmetro_bus_status", "in_queue");
  const [busLastUpdatedAt, setBusLastUpdatedAtState] = useLocalStorageState<number>("trackmetro_bus_last_updated_at", 0);

  const touchBusLastUpdated = useCallback(() => {
    setBusLastUpdatedAtState(Date.now());
  }, [setBusLastUpdatedAtState]);

  const [verifiedDiscount, setVerifiedDiscount] = useLocalStorageState<PassengerType>("trackmetro_verified_discount", "regular");
  const [discountIdNumber, setDiscountIdNumber] = useLocalStorageState<string>("trackmetro_discount_id", "");
  const [discountSchoolOrAgency, setDiscountSchoolOrAgency] = useLocalStorageState<string>("trackmetro_discount_agency", "");

  const verifyDiscount = useCallback((type: PassengerType, idNumber?: string, schoolOrAgency?: string) => {
    setVerifiedDiscount(type);
    const id = idNumber || (type === "student" ? "2024-88421" : type === "senior" ? "OSCA-2024-0918" : type === "pwd" ? "PWD-0864-10492" : "");
    const agency = schoolOrAgency || (type === "student" ? "Southern Leyte State University (SLSU)" : type === "senior" ? "Sogod Municipal OSCA" : type === "pwd" ? "Baybay City PDAO" : "");
    setDiscountIdNumber(id);
    setDiscountSchoolOrAgency(agency);
  }, [setVerifiedDiscount, setDiscountIdNumber, setDiscountSchoolOrAgency]);

  const removeDiscount = useCallback(() => {
    setVerifiedDiscount("regular");
    setDiscountIdNumber("");
    setDiscountSchoolOrAgency("");
  }, [setVerifiedDiscount, setDiscountIdNumber, setDiscountSchoolOrAgency]);

  const setBusStatus = useCallback((status: BusDispatchStatus) => {
    setBusStatusState(status);
    touchBusLastUpdated();
  }, [setBusStatusState, touchBusLastUpdated]);

  const setSelectedDirection = useCallback((dir: "sogod-to-ormoc" | "ormoc-to-sogod") => {
    setSelectedDirectionState(dir);
    if (dir === "sogod-to-ormoc") {
      setOriginState("Sogod Terminal");
      setDestinationState("Ormoc City");
    } else {
      setOriginState("Ormoc City");
      setDestinationState("Sogod Terminal");
    }
  }, [setSelectedDirectionState, setOriginState, setDestinationState]);

  const registerConductorShift = useCallback((params: {
    name: string;
    busNumber: string;
    direction: "sogod-to-ormoc" | "ormoc-to-sogod";
    isAircon: boolean;
  }) => {
    if (params.name.trim()) {
      setConductorName(params.name.trim());
    }
    const cleanBusNum = params.busNumber.trim().toUpperCase() || "DMS-048";
    setBusDetailsState((prev) => ({
      ...prev,
      id: cleanBusNum,
      routeTitle: params.direction === "sogod-to-ormoc" ? "Sogod ➔ Ormoc" : "Ormoc ➔ Sogod",
      isAircon: params.isAircon,
    }));
    setActiveTicket((prev) => ({
      ...prev,
      busId: cleanBusNum,
    }));
    setSelectedDirection(params.direction);
    // Automatically set the bus status to in queue after registering
    setBusStatusState("in_queue");
    touchBusLastUpdated();
  }, [setConductorName, setBusDetailsState, setActiveTicket, setSelectedDirection, setBusStatusState, touchBusLastUpdated]);

  const setOrigin = useCallback((newOrigin: string) => {
    setOriginState(newOrigin);
    if (newOrigin.toLowerCase().includes("ormoc")) {
      setSelectedDirectionState("ormoc-to-sogod");
    } else if (newOrigin.toLowerCase().includes("sogod")) {
      setSelectedDirectionState("sogod-to-ormoc");
    }
  }, [setOriginState, setSelectedDirectionState]);

  const setDestination = useCallback((newDest: string) => {
    setDestinationState(newDest);
    if (newDest.toLowerCase().includes("sogod")) {
      setSelectedDirectionState("ormoc-to-sogod");
    } else if (newDest.toLowerCase().includes("ormoc")) {
      setSelectedDirectionState("sogod-to-ormoc");
    }
  }, [setDestinationState, setSelectedDirectionState]);

  const swapOriginDestination = useCallback(() => {
    setOriginState((prevOrigin) => {
      setDestinationState(prevOrigin);
      const isOriginNowOrmoc = prevOrigin.toLowerCase().includes("sogod");
      setSelectedDirectionState(isOriginNowOrmoc ? "ormoc-to-sogod" : "sogod-to-ormoc");
      return destination;
    });
  }, [destination, setOriginState, setDestinationState, setSelectedDirectionState]);

  const updateSeatStatus = useCallback((seatId: string, newStatus: SeatStatus) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId ? { ...seat, status: newStatus } : seat
      )
    );
  }, [setSeats]);

  const confirmBooking = (seatNum: string = selectedSeatNumber, payment: "GCash" | "Maya" = "GCash") => {
    updateSeatStatus(seatNum, "app_reserved");
    const fareBreakdown = calculateSegmentFare(origin, destination, verifiedDiscount, {
      isPremium,
      includeConvenienceFee: true,
    });
    setActiveTicket((prev) => ({
      ...prev,
      seatNumber: seatNum,
      paymentMethod: payment,
      passengerType: verifiedDiscount,
      passengerName,
      origin: normalizeStopName(origin),
      destination: normalizeStopName(destination),
      routeTitle: `${normalizeStopName(origin)} ➔ ${normalizeStopName(destination)}`,
      baseFare: fareBreakdown.baseFare,
      convenienceFee: fareBreakdown.convenienceFee,
      totalFare: fareBreakdown.totalFare,
      pnr: generatePNR(),
    }));
  };

  const createBooking = useCallback((params: {
    tripId?: string;
    busNumber?: string;
    departureTime?: string;
    direction?: "sogod-ormoc" | "ormoc-sogod" | "sogod-to-ormoc" | "ormoc-to-sogod";
    passengerType?: PassengerType;
    paymentMethod: "GCash" | "Maya";
    origin?: string;
    destination?: string;
    paymentStatus?: "paid" | "unpaid";
    etaMinutes?: number;
    etaText?: string;
  }): BookingRequest => {
    const bookingOrigin = params.origin || origin;
    const bookingDestination = params.destination || destination;
    const bookingPassengerType = params.passengerType || verifiedDiscount;
    const fare = calculateSegmentFare(bookingOrigin, bookingDestination, bookingPassengerType, {
      isPremium,
      includeConvenienceFee: true,
    });
    const normDir: "sogod-ormoc" | "ormoc-sogod" =
      params.direction === "ormoc-sogod" || params.direction === "ormoc-to-sogod"
        ? "ormoc-sogod"
        : "sogod-ormoc";

    const newBooking: BookingRequest = {
      id: `BK-${Date.now()}`,
      tripId: params.tripId || `TRIP-${Date.now()}`,
      busNumber: params.busNumber || busDetailsState.id,
      departureTime: params.departureTime || "08:00 AM",
      direction: normDir,
      passengerType: bookingPassengerType,
      paymentMethod: params.paymentMethod,
      status: "pending_seat",
      paymentStatus: params.paymentStatus || "paid",
      assignedSeat: null,
      passengerName: passengerName || "Juana de la Cruz",
      baseFare: fare.baseFare,
      discount: fare.discountAmount,
      convenienceFee: fare.convenienceFee,
      totalFare: fare.totalFare,
      createdAt: new Date().toISOString(),
      pnr: generatePNR(),
      origin: bookingOrigin,
      destination: bookingDestination,
      etaMinutes: params.etaMinutes ?? 12,
      etaText: params.etaText ?? "Arriving in ~12 mins",
    };
    setBookings((prev) => [...prev, newBooking]);
    return newBooking;
  }, [passengerName, origin, destination, isPremium, busDetailsState.id, verifiedDiscount, setBookings]);

  const assignSeatToBooking = useCallback((bookingId: string, seatNumber: string) => {
    setBookings((prev) => {
      const updated = prev.map((b) =>
        b.id === bookingId
          ? { ...b, assignedSeat: seatNumber, status: "confirmed" as const }
          : b
      );
      const booking = updated.find((b) => b.id === bookingId);
      if (booking) {
        const segOrigin = booking.origin || (booking.direction === "sogod-ormoc" ? "Sogod Terminal" : "Ormoc City");
        const segDest = booking.destination || (booking.direction === "sogod-ormoc" ? "Ormoc City" : "Sogod Terminal");
        const newTicket: TicketDetails = {
          pnr: booking.pnr,
          busId: booking.busNumber,
          routeTitle: `${segOrigin} ➔ ${segDest}`,
          origin: segOrigin,
          destination: segDest,
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
        };
        setActiveTicket(newTicket);
      }
      return updated;
    });
    updateSeatStatus(seatNumber, "app_reserved");
  }, [updateSeatStatus, setActiveTicket, setBookings]);

  const updateBookingStatus = useCallback((bookingId: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  }, [setBookings]);

  const getActiveBooking = useCallback((): BookingRequest | undefined => {
    return [...bookings].reverse().find((b) => b.status === "pending_seat" || b.status === "confirmed");
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
  }, [passengerName, isPremium, setPassengerHails]);

  const cancelHail = useCallback((busId: string) => {
    setPassengerHails((prev) => prev.filter((h) => h.busId !== busId));
  }, [setPassengerHails]);

  const acknowledgeHail = useCallback((hailId: string) => {
    setPassengerHails((prev) =>
      prev.map((h) => (h.id === hailId ? { ...h, status: "acknowledged" as const } : h))
    );
  }, [setPassengerHails]);

  const boardHail = useCallback((hailId: string) => {
    setPassengerHails((prev) =>
      prev.map((h) => (h.id === hailId ? { ...h, status: "boarded" as const } : h))
    );
    setPassengersOnBoard((prev) => Math.min(45, prev + 1));
  }, [setPassengerHails, setPassengersOnBoard]);

  // Pick up passenger in pinged area: removes hail, does NOT increment headcount
  const pickupHail = useCallback((hailId: string) => {
    setPassengerHails((prev) => prev.filter((h) => h.id !== hailId));
  }, [setPassengerHails]);

  // No passenger in pinged area: removes hail, does NOT increment headcount
  const removeHail = useCallback((hailId: string) => {
    setPassengerHails((prev) => prev.filter((h) => h.id !== hailId));
  }, [setPassengerHails]);

  const getActiveHailForBus = useCallback((busId: string): PassengerHail | undefined => {
    return passengerHails.find((h) => h.busId === busId && h.status !== "boarded");
  }, [passengerHails]);

  // Headcount controls for conductor
  const incrementPassengersOnBoard = useCallback((amount: number = 1) => {
    setPassengersOnBoard((prev) => Math.min(45, prev + amount));
  }, [setPassengersOnBoard]);

  const decrementPassengersOnBoard = useCallback((amount: number = 1) => {
    setPassengersOnBoard((prev) => Math.max(0, prev - amount));
  }, [setPassengersOnBoard]);

  // Simulate an incoming online seat reservation request
  const requestSeatReservation = useCallback((name: string = "Mark Villamor", direction: "sogod-ormoc" | "ormoc-sogod" = "sogod-ormoc"): BookingRequest => {
    const origin = direction === "sogod-ormoc" ? "Sogod Terminal" : "Ormoc City";
    const destination = direction === "sogod-ormoc" ? "Ormoc City" : "Sogod Terminal";
    const newBooking: BookingRequest = {
      id: `BK-${Date.now()}`,
      tripId: "trip-sogod-1",
      busNumber: "DMS-048",
      departureTime: "08:00 AM",
      direction,
      passengerType: "regular",
      paymentMethod: "GCash",
      status: "pending_seat",
      paymentStatus: "paid",
      assignedSeat: null,
      passengerName: name,
      baseFare: 275,
      discount: 0,
      convenienceFee: CONVENIENCE_FEE,
      totalFare: 275 + CONVENIENCE_FEE,
      createdAt: new Date().toISOString(),
      pnr: generatePNR(),
      origin,
      destination,
      etaMinutes: 12,
      etaText: "Arriving in ~12 mins",
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  }, [setBookings]);

  // Record a POS Walk-in cash ticket sale & automatically sync seat occupancy and headcount
  const recordWalkInSale = useCallback(
    (sale: Omit<WalkInSale, "id" | "timestamp">): WalkInSale => {
      const newSale: WalkInSale = {
        ...sale,
        id: `POS-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setWalkInSales((prev) => [newSale, ...prev]);
      // Mark seat as occupied
      updateSeatStatus(sale.seatId, "occupied");
      // Increment passenger headcount by 1
      setPassengersOnBoard((prev) => Math.min(45, prev + 1));
      return newSale;
    },
    [setWalkInSales, updateSeatStatus, setPassengersOnBoard]
  );

  // Validate passenger E-ticket during conductor QR scan & automatically increment headcount
  const validateTicketBoarding = useCallback((pnr: string): boolean => {
    let matched = false;
    const cleanInput = pnr.replace(/\D/g, "");

    setActiveTicket((prev) => {
      const cleanTicketPNR = prev.pnr.replace(/\D/g, "");
      if (cleanTicketPNR === cleanInput || prev.pnr === pnr || pnr.includes(cleanTicketPNR) || cleanTicketPNR.includes(pnr)) {
        matched = true;
        return {
          ...prev,
          isBoarded: true,
          boardedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      }
      return prev;
    });

    setBookings((prev) =>
      prev.map((b) => {
        const cleanBookingPNR = b.pnr.replace(/\D/g, "");
        if (cleanBookingPNR === cleanInput || b.pnr === pnr) {
          matched = true;
          return { ...b, status: "confirmed" as const };
        }
        return b;
      })
    );

    if (matched) {
      // Increment passenger on board counter for the successfully scanned passenger!
      setPassengersOnBoard((prev) => Math.min(45, prev + 1));
    }

    return matched;
  }, [setActiveTicket, setBookings, setPassengersOnBoard]);

  // Mark seat as no-show or drop-off and free it up
  const removeBookingReservation = useCallback((seatNumber: string) => {
    const raw = parseInt(seatNumber, 10).toString();
    const padded = seatNumber.padStart(2, "0");

    updateSeatStatus(seatNumber, "available");
    updateSeatStatus(padded, "available");
    updateSeatStatus(raw, "available");

    setBookings((prev) =>
      prev.map((b) => {
        if (
          b.status === "confirmed" &&
          (b.assignedSeat === seatNumber || b.assignedSeat === padded || b.assignedSeat === raw)
        ) {
          return { ...b, assignedSeat: null, status: "completed" as const };
        }
        return b;
      })
    );

    setActiveTicket((prev) =>
      prev.seatNumber === seatNumber || prev.seatNumber === padded || prev.seatNumber === raw
        ? { ...prev, isBoarded: false }
        : prev
    );
  }, [updateSeatStatus, setBookings, setActiveTicket]);

  const markNoShow = removeBookingReservation;

  // Conductor milestone progression along corridor
  const advanceToNextStop = useCallback(() => {
    const stopsList =
      selectedDirection === "sogod-to-ormoc"
        ? (CORRIDOR_STOPS as readonly string[])
        : ([...CORRIDOR_STOPS].reverse() as readonly string[]);

    setCurrentBusStop((prevStop) => {
      const currentIndex = stopsList.findIndex(
        (s) => s.toLowerCase() === prevStop.toLowerCase() || prevStop.toLowerCase().includes(s.toLowerCase())
      );
      if (currentIndex === -1 || currentIndex >= stopsList.length - 1) {
        return stopsList[0]; // Reset or keep at terminus
      }
      return stopsList[currentIndex + 1];
    });
    touchBusLastUpdated();
  }, [selectedDirection, touchBusLastUpdated, setCurrentBusStop]);

  const stopAlert = useCallback(() => {
    setIsAlertActive(false);
  }, [setIsAlertActive]);

  return (
    <AppContext.Provider
      value={{
        seats,
        updateSeatStatus,
        busDetails: busDetailsState,
        conductorName,
        setConductorName,
        busStatus,
        setBusStatus,
        busLastUpdatedAt,
        touchBusLastUpdated,
        registerConductorShift,
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
        boardHail,
        pickupHail,
        removeHail,
        getActiveHailForBus,
        passengersOnBoard,
        setPassengersOnBoard,
        incrementPassengersOnBoard,
        decrementPassengersOnBoard,
        requestSeatReservation,
        walkInSales,
        recordWalkInSale,
        validateTicketBoarding,
        markNoShow,
        removeBookingReservation,
        currentBusStop,
        setCurrentBusStop,
        advanceToNextStop,
        verifiedDiscount,
        setVerifiedDiscount,
        discountIdNumber,
        setDiscountIdNumber,
        discountSchoolOrAgency,
        setDiscountSchoolOrAgency,
        verifyDiscount,
        removeDiscount,
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
