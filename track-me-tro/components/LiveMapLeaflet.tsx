"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { ActiveBus, CoordinatePair, STOP_COORDINATES, calculateBusETA } from "@/lib/mockData";
import { useAppContext } from "@/lib/AppContext";

// Safeguard Leaflet against accessing properties of torn-down elements during in-flight pan/zoom animations
if (typeof window !== "undefined" && L && L.DomUtil) {
  const originalGetPosition = L.DomUtil.getPosition;
  L.DomUtil.getPosition = function (el: HTMLElement) {
    if (!el) return new L.Point(0, 0);
    return originalGetPosition.call(this, el);
  };
}

interface LiveMapLeafletProps {
  buses: ActiveBus[];
  selectedBusId: string | null;
  onSelectBus: (bus: ActiveBus) => void;
  onMapClick: () => void;
  waypoints: CoordinatePair[];
  recenterTrigger: number;
  fitBoundsTrigger: number;
  userLocation: string;
  isPremium?: boolean;
}

export default function LiveMapLeaflet({
  buses,
  selectedBusId,
  onSelectBus,
  onMapClick,
  waypoints,
  recenterTrigger,
  fitBoundsTrigger,
  userLocation,
  isPremium: propIsPremium,
}: LiveMapLeafletProps) {
  const { isPremium: contextIsPremium, passengerHails } = useAppContext();
  const isPremium = propIsPremium !== undefined ? propIsPremium : contextIsPremium;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Keep callback refs stable across re-renders to prevent map teardowns
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  const onSelectBusRef = useRef(onSelectBus);
  useEffect(() => {
    onSelectBusRef.current = onSelectBus;
  }, [onSelectBus]);

  // Initialize Map (Mounts once)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center Leyte corridor between Sogod, Baybay, and Ormoc (near Baybay: 10.68, 124.80)
    const map = L.map(mapContainerRef.current, {
      center: [10.68, 124.80],
      zoom: 10,
      zoomControl: false,
      attributionControl: false, // Clean presentation layout
    });

    // 100% Free, Open, Watermark-Free OpenStreetMap Standard Tiles
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: "abc",
    }).addTo(map);

    // Highway Polyline Halo (White underlay for high contrast against terrain & roads)
    L.polyline(waypoints, {
      color: "#FFFFFF",
      weight: 8,
      opacity: 0.9,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    // Highway Polyline (Primary Orange Line following exact highway curves)
    const polyline = L.polyline(waypoints, {
      color: "#F95700",
      weight: 4.5,
      dashArray: "7, 7",
      opacity: 0.95,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    polylineRef.current = polyline;

    // Key Corridor Town Labels
    const towns = [
      { name: "Ormoc City", lat: 11.006, lng: 124.607 },
      { name: "Baybay City", lat: 10.678, lng: 124.800 },
      { name: "Hilongos", lat: 10.375, lng: 124.745 },
      { name: "Sogod", lat: 10.386, lng: 124.981 },
    ];

    towns.forEach((town) => {
      const townIcon = L.divIcon({
        className: "custom-town-label",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        html: `
          <div style="position: relative; transform: translate(-50%, -50%);">
            <div style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); color: #1e293b; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.12); border: 1px solid rgba(203, 213, 225, 0.9); white-space: nowrap;">
              ${town.name}
            </div>
          </div>
        `,
      });
      L.marker([town.lat, town.lng], { icon: townIcon, zIndexOffset: 10 }).addTo(map);
    });

    // Handle map click to deselect / hide active bus details
    map.on("click", () => {
      onMapClickRef.current?.();
    });

    // Bus Markers Layer Group
    const busLayer = L.layerGroup().addTo(map);
    busLayerRef.current = busLayer;
    mapInstanceRef.current = map;

    // Initial corridor fit with padding
    map.fitBounds(polyline.getBounds(), {
      padding: [80, 80],
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
      busLayerRef.current = null;
      userMarkerRef.current = null;
      polylineRef.current = null;
    };
  }, [waypoints]);

  // Dynamic Commuter User Location Marker based on simulated userLocation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }

    const stopData = STOP_COORDINATES[userLocation] || STOP_COORDINATES["VSU Main Campus"];
    const userLat = stopData.lat;
    const userLng = stopData.lng;
    const displayName = stopData.displayName;

    const isHailing = passengerHails?.some((h) => h.status !== "boarded");

    const userDivIcon = L.divIcon({
      className: "custom-user-marker",
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
          <span style="position: absolute; width: 48px; height: 48px; border-radius: 9999px; background: ${
            isHailing ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 232, 214, 0.7)"
          }; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: ${
            isHailing ? "rgba(209, 250, 229, 0.9)" : "rgba(255, 232, 214, 0.85)"
          }; border: 1.5px solid ${isHailing ? "#10B981" : "#F5DECD"};"></span>
          <div style="position: relative; width: 30px; height: 30px; border-radius: 9999px; background: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.15); border: 2px solid ${
            isHailing ? "#059669" : "#181C24"
          }; display: flex; align-items: center; justify-content: center; color: ${
            isHailing ? "#059669" : "#181C24"
          };">
            <svg style="width: 17px; height: 17px; fill: currentColor;" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div style="position: absolute; bottom: -20px; white-space: nowrap; background: ${
            isHailing ? "#065F46" : "#181C24"
          }; color: #ffffff; font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 9999px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
            You (${displayName})${isHailing ? " • 📡 Notified" : ""}
          </div>
        </div>
      `,
    });

    const userMarker = L.marker([userLat, userLng], {
      icon: userDivIcon,
      zIndexOffset: 80,
    }).addTo(map);

    userMarkerRef.current = userMarker;
  }, [userLocation, passengerHails]);

  // Update Bus Markers whenever buses or selectedBusId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const busLayer = busLayerRef.current;
    if (!map || !busLayer) return;

    busLayer.clearLayers();

    buses.forEach((bus) => {
      const isSelected = bus.id === selectedBusId;

      // Calculate dynamic ETA from this bus to the user's location
      const etaResult = calculateBusETA(bus, userLocation);
      const etaLabel = etaResult.etaText;
      const isHailedByMe = passengerHails?.some((h) => h.busId === bus.id && h.status !== "boarded");
      // Free Tier: only ETA. Premium Tier: Bus ID and ETA
      const baseTag = isPremium ? `${bus.id} • ${etaLabel}` : etaLabel;
      const tagText = isHailedByMe ? `${baseTag} • 📡 Notified` : baseTag;

      const busDivIcon = L.divIcon({
        className: `bus-marker-${bus.id}`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; transform: translate(-50%, -50%);">
            <!-- Pulsing Ring -->
            <span style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(249, 87, 0, 0.28); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
            <span style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: ${
              isSelected ? "rgba(249, 87, 0, 0.4)" : "rgba(249, 87, 0, 0.2)"
            };"></span>

            <!-- Main Bus Button -->
            <div style="position: relative; width: 34px; height: 34px; border-radius: 9999px; background: #F95700; color: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(249, 87, 0, 0.55); border: 2.5px solid #ffffff; transition: transform 0.2s; ${
              isSelected ? "transform: scale(1.18); box-shadow: 0 0 0 3px #181C24, 0 6px 18px rgba(0,0,0,0.35);" : ""
            }">
              <svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>

            <!-- Bus Tag: Free Tier is only ETA, Premium is Bus number and ETA -->
            <div style="position: absolute; bottom: -20px; white-space: nowrap; background: #ffffff; color: #181C24; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); border: 1px solid #CBD5E1; pointer-events: none;">
              ${tagText}
            </div>
          </div>
        `,
      });

      const marker = L.marker([bus.lat, bus.lng], {
        icon: busDivIcon,
        zIndexOffset: isSelected ? 100 : 20,
      });

      marker.on("click", (e) => {
        // Prevent map click deselect from firing
        L.DomEvent.stopPropagation(e);
        onSelectBusRef.current?.(bus);
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.panTo([bus.lat, bus.lng], { animate: true, duration: 0.6 });
          } catch (err) {
            console.warn("Marker panTo error:", err);
          }
        }
      });

      busLayer.addLayer(marker);
    });
  }, [buses, selectedBusId, userLocation, isPremium, passengerHails]);

  // Recenter trigger
  useEffect(() => {
    if (recenterTrigger === 0 || !mapInstanceRef.current) return;
    try {
      const selectedBus = buses.find((b) => b.id === selectedBusId);
      if (selectedBus) {
        mapInstanceRef.current.panTo([selectedBus.lat, selectedBus.lng], {
          animate: true,
          duration: 0.7,
        });
      } else {
        // Recenter on user's location if no bus selected
        const stopData = STOP_COORDINATES[userLocation] || STOP_COORDINATES["VSU Main Campus"];
        mapInstanceRef.current.panTo([stopData.lat, stopData.lng], {
          animate: true,
          duration: 0.7,
        });
      }
    } catch (err) {
      console.warn("Recenter error:", err);
    }
  }, [recenterTrigger, buses, selectedBusId, userLocation]);

  // Fit bounds trigger (corridor overview)
  useEffect(() => {
    if (fitBoundsTrigger === 0 || !mapInstanceRef.current || !polylineRef.current) return;
    try {
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), {
        padding: [70, 70],
        maxZoom: 11,
        animate: true,
      });
    } catch (err) {
      console.warn("Fit bounds error:", err);
    }
  }, [fitBoundsTrigger]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full min-h-[620px] outline-none"
      style={{ zIndex: 0 }}
    />
  );
}
