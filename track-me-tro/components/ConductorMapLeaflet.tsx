"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { STOP_COORDINATES, CoordinatePair } from "@/lib/data";
import { PassengerHail } from "@/lib/AppContext";

// Safeguard Leaflet against accessing properties of torn-down elements during in-flight pan/zoom animations
if (typeof window !== "undefined" && L && L.DomUtil) {
  const originalGetPosition = L.DomUtil.getPosition;
  L.DomUtil.getPosition = function (el: HTMLElement) {
    if (!el) return new L.Point(0, 0);
    return originalGetPosition.call(this, el);
  };
}

export function getCoordinatesForLocation(loc: string): [number, number] {
  if (STOP_COORDINATES[loc]) {
    return [STOP_COORDINATES[loc].lat, STOP_COORDINATES[loc].lng];
  }
  const lower = loc.toLowerCase();
  for (const [key, val] of Object.entries(STOP_COORDINATES)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return [val.lat, val.lng];
    }
  }
  return [10.7450, 124.7920]; // Default fallback: VSU Main Campus
}

interface ConductorMapLeafletProps {
  hails: PassengerHail[];
  selectedHailId: string | null;
  onSelectHail: (hail: PassengerHail) => void;
  onMapClick?: () => void;
  currentBusStop: string;
  busNumber: string;
  conductorName: string;
  direction: "sogod-to-ormoc" | "ormoc-to-sogod";
  waypoints: CoordinatePair[];
  recenterTrigger: number;
  fitBoundsTrigger: number;
}

export default function ConductorMapLeaflet({
  hails,
  selectedHailId,
  onSelectHail,
  onMapClick,
  currentBusStop,
  busNumber,
  conductorName,
  direction,
  waypoints,
  recenterTrigger,
  fitBoundsTrigger,
}: ConductorMapLeafletProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const hailLayerRef = useRef<L.LayerGroup | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const onSelectHailRef = useRef(onSelectHail);
  useEffect(() => {
    onSelectHailRef.current = onSelectHail;
  }, [onSelectHail]);

  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Mount Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [10.68, 124.80],
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
    });

    // Clean OpenStreetMap tiles
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: "abc",
    }).addTo(map);

    // Highway Polyline Halo (White underlay)
    L.polyline(waypoints, {
      color: "#FFFFFF",
      weight: 8,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    // Highway Polyline (Primary Orange Line following Route 70)
    const polyline = L.polyline(waypoints, {
      color: "#F95700",
      weight: 4.5,
      dashArray: "7, 7",
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    polylineRef.current = polyline;

    // Corridor Towns Badges
    const towns = [
      { name: "Ormoc City Terminal", lat: 11.006, lng: 124.607 },
      { name: "Albuera", lat: 10.9168, lng: 124.6958 },
      { name: "VSU Main Campus", lat: 10.745, lng: 124.792 },
      { name: "Baybay City Terminal", lat: 10.678, lng: 124.800 },
      { name: "Inopacan", lat: 10.5015, lng: 124.7438 },
      { name: "Hindang", lat: 10.435, lng: 124.728 },
      { name: "Hilongos", lat: 10.375, lng: 124.745 },
      { name: "Bato", lat: 10.332, lng: 124.789 },
      { name: "Sogod Terminal", lat: 10.386, lng: 124.981 },
    ];

    towns.forEach((town) => {
      const townIcon = L.divIcon({
        className: "custom-town-label",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        html: `
          <div style="position: relative; transform: translate(-50%, -50%); pointer-events: none;">
            <div style="background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(4px); color: #334155; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); border: 1px solid rgba(203, 213, 225, 0.8); white-space: nowrap;">
              • ${town.name}
            </div>
          </div>
        `,
      });
      L.marker([town.lat, town.lng], { icon: townIcon, zIndexOffset: 5 }).addTo(map);
    });

    map.on("click", () => {
      onMapClickRef.current?.();
    });

    const hailLayer = L.layerGroup().addTo(map);
    hailLayerRef.current = hailLayer;
    mapInstanceRef.current = map;

    // Initial corridor fit
    map.fitBounds(polyline.getBounds(), {
      padding: [60, 60],
      maxZoom: 11,
    });

    return () => {
      try {
        map.stop();
        map.remove();
      } catch (err) {
        console.warn("Leaflet cleanup error:", err);
      }
      mapInstanceRef.current = null;
      hailLayerRef.current = null;
      busMarkerRef.current = null;
      polylineRef.current = null;
    };
  }, [waypoints]);

  // Update Bus Marker based on currentBusStop
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (busMarkerRef.current) {
      map.removeLayer(busMarkerRef.current);
    }

    const [busLat, busLng] = getCoordinatesForLocation(currentBusStop);

    const busDivIcon = L.divIcon({
      className: "conductor-bus-marker",
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
          <!-- Live Radar Pulse -->
          <span style="position: absolute; width: 56px; height: 56px; border-radius: 9999px; background: rgba(16, 26, 44, 0.2); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(16, 26, 44, 0.15); border: 1.5px solid rgba(16, 26, 44, 0.3);"></span>

          <!-- Bus Pin Container -->
          <div style="position: relative; width: 38px; height: 38px; border-radius: 9999px; background: #101A2C; color: #ffffff; box-shadow: 0 4px 14px rgba(16, 26, 44, 0.45); border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center;">
            <svg style="width: 20px; height: 20px; fill: #FFD180;" viewBox="0 0 24 24">
              <path d="M12 2c-4.42 0-8 .5-8 4v10c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4zm5.5 13H6.5v-2h11v2zm0-4H6.5V7h11v4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>

          <!-- Conductor Bus Label Badge -->
          <div style="position: absolute; top: 40px; white-space: nowrap; background: #101A2C; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 9999px; box-shadow: 0 3px 8px rgba(0,0,0,0.25); border: 1.5px solid rgba(255,255,255,0.2); display: flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 9999px; background: #00E676; animation: pulse 1.5s infinite;"></span>
            <span>BUS ${busNumber} (YOU)</span>
            <span style="color: #94A3B8; font-weight: 600;">• ${currentBusStop}</span>
          </div>
        </div>
      `,
    });

    const busMarker = L.marker([busLat, busLng], {
      icon: busDivIcon,
      zIndexOffset: 100,
    }).addTo(map);

    busMarkerRef.current = busMarker;
  }, [currentBusStop, busNumber, conductorName]);

  // Update Passenger Hail Markers (Pinged Locations)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const hailLayer = hailLayerRef.current;
    if (!map || !hailLayer) return;

    hailLayer.clearLayers();

    // Render active hails
    const activeHails = hails.filter((h) => h.status !== "boarded");

    activeHails.forEach((hail) => {
      const [hailLat, hailLng] = getCoordinatesForLocation(hail.location);
      const isSelected = hail.id === selectedHailId;
      const isAcknowledged = hail.status === "acknowledged";
      const isPremium = hail.tier === "premium";

      const pinColor = isAcknowledged ? "#1D6AE5" : "#F95700";
      const ringBg = isAcknowledged ? "rgba(29, 106, 229, 0.25)" : "rgba(249, 87, 0, 0.3)";

      const hailDivIcon = L.divIcon({
        className: `hail-marker-${hail.id}`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; transform: translate(-50%, -50%);">
            <!-- Pulsing Hail Ring -->
            <span style="position: absolute; width: 50px; height: 50px; border-radius: 9999px; background: ${ringBg}; animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
            <span style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background: ${ringBg}; border: 2px solid ${pinColor};"></span>

            <!-- Main Hail Pin -->
            <div style="position: relative; width: 34px; height: 34px; border-radius: 9999px; background: ${pinColor}; color: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: ${isSelected ? "3px solid #10B981" : "2.5px solid #ffffff"}; transition: transform 0.2s; transform: ${isSelected ? "scale(1.15)" : "scale(1)"};">
              <!-- Hand Wave / Person SVG -->
              <svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24">
                <path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-1 6v5.5a1.5 1.5 0 0 0 3 0V8h2.5a.5.5 0 0 1 .5.5v7.25c0 .69-.28 1.35-.78 1.83L14.7 19.1a1 1 0 0 1-1.4 0l-3.5-3.35c-.5-.48-.8-1.14-.8-1.83V8.5a.5.5 0 0 1 .5-.5H11z"/>
              </svg>
            </div>

            <!-- Floating Passenger Hail Label Badge -->
            <div style="position: absolute; top: -32px; white-space: nowrap; background: ${isSelected ? "#101A2C" : "#ffffff"}; color: ${isSelected ? "#ffffff" : "#191C1E"}; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 9999px; box-shadow: 0 3px 10px rgba(0,0,0,0.18); border: 1.5px solid ${isSelected ? "#10B981" : "rgba(226, 232, 240, 0.9)"}; display: flex; align-items: center; gap: 4px; pointer-events: none;">
              <span>${
                isPremium
                  ? '<svg style="width:11px;height:11px;display:inline-block;fill:#F59E0B;vertical-align:middle;" viewBox="0 0 24 24"><path d="M5 19h14v2H5v-2zm14-14l-3.5 5.5L12 4 8.5 10.5 5 5l1.5 12h11L19 5z"/></svg>'
                  : '<svg style="width:11px;height:11px;display:inline-block;fill:#F95700;vertical-align:middle;" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>'
              }</span>
              <span>${hail.passengerName}</span>
              <span style="font-size: 9px; padding: 1px 5px; border-radius: 9999px; background: ${isAcknowledged ? "#DBEAFE" : "#FFE8D6"}; color: ${isAcknowledged ? "#1D4ED8" : "#A53700"}; font-weight: 900;">
                ${isAcknowledged ? "Crew Confirmed" : "Pinged 📡"}
              </span>
            </div>
          </div>
        `,
      });

      const marker = L.marker([hailLat, hailLng], {
        icon: hailDivIcon,
        zIndexOffset: isSelected ? 120 : 90,
      });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectHailRef.current?.(hail);
      });

      marker.addTo(hailLayer);
    });
  }, [hails, selectedHailId]);

  // Recenter trigger
  useEffect(() => {
    if (recenterTrigger === 0) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedHailId) {
      const selected = hails.find((h) => h.id === selectedHailId);
      if (selected) {
        const [lat, lng] = getCoordinatesForLocation(selected.location);
        map.flyTo([lat, lng], 13, { duration: 1 });
        return;
      }
    }

    const [busLat, busLng] = getCoordinatesForLocation(currentBusStop);
    map.flyTo([busLat, busLng], 12, { duration: 1 });
  }, [recenterTrigger, selectedHailId, hails, currentBusStop]);

  // Fit bounds trigger
  useEffect(() => {
    if (fitBoundsTrigger === 0) return;
    const map = mapInstanceRef.current;
    const polyline = polylineRef.current;
    if (!map || !polyline) return;

    map.fitBounds(polyline.getBounds(), {
      padding: [60, 60],
      maxZoom: 11,
    });
  }, [fitBoundsTrigger]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />;
}
