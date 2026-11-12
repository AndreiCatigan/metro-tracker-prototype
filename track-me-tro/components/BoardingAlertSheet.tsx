"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/lib/AppContext";

interface BoardingAlertSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (mins: number) => void;
  onStopAlert?: () => void;
  busId?: string;
  busName?: string;
  currentEtaMinutes?: number;
  userLocation?: string;
}

export default function BoardingAlertSheet({
  isOpen,
  onClose,
  onSave,
  onStopAlert,
  busId,
  busName,
  currentEtaMinutes = 30,
  userLocation,
}: BoardingAlertSheetProps) {
  const {
    boardingAlertMinutes,
    setBoardingAlertMinutes,
    isAlertActive,
    setIsAlertActive,
    busDetails,
    setIsModalOpen,
  } = useAppContext();

  useEffect(() => {
    if (isOpen) {
      setIsModalOpen(true);
      return () => {
        setIsModalOpen(false);
      };
    }
  }, [isOpen, setIsModalOpen]);

  const [selectedMins, setSelectedMins] = useState<number>(boardingAlertMinutes || 15);
  const [enabled, setEnabled] = useState<boolean>(isAlertActive);
  const [saveStatus, setSaveStatus] = useState<{
    show: boolean;
    isImmediate: boolean;
    message: string;
  }>({ show: false, isImmediate: false, message: "" });

  // Sync initial values when opening
  useEffect(() => {
    if (isOpen) {
      setEnabled(isAlertActive);
      if (boardingAlertMinutes) {
        setSelectedMins(Math.min(59, Math.max(1, boardingAlertMinutes)));
      }
    }
  }, [isOpen, isAlertActive, boardingAlertMinutes]);

  if (!isOpen) return null;

  // Check if the bus is already closer than the chosen alert time
  // e.g. actual ETA is 30 mins, but user selected 31 mins
  const isAlreadyCloser = currentEtaMinutes <= selectedMins;

  const handleStopAlert = () => {
    setIsAlertActive(false);
    setEnabled(false);
    if (onStopAlert) onStopAlert();

    setSaveStatus({
      show: true,
      isImmediate: false,
      message: "Boarding alert has been stopped.",
    });

    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, show: false }));
      onClose();
    }, 1000);
  };

  const handleSave = () => {
    if (!enabled) {
      handleStopAlert();
      return;
    }

    setBoardingAlertMinutes(selectedMins);
    setIsAlertActive(true);
    if (onSave) onSave(selectedMins);

    const message = isAlreadyCloser
      ? `The bus is actually ${currentEtaMinutes} mins away (closer than your ${selectedMins} mins alert). Please head to the boarding point now!`
      : `Boarding alert set! We will notify you when the bus is ${selectedMins} mins away.`;

    setSaveStatus({
      show: true,
      isImmediate: isAlreadyCloser,
      message,
    });

    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, show: false }));
      onClose();
    }, 1800);
  };

  const presetOptions = [10, 15, 30, 33, 45];

  const handleStep = (delta: number) => {
    setSelectedMins((prev) => Math.min(59, Math.max(1, prev + delta)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Sheet */}
      <div className="relative w-full max-w-[480px] bg-white rounded-t-[32px] p-5 shadow-2xl z-10 space-y-4 border-t border-[#ECEEF0] animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#D8DADC] rounded-full mx-auto -mt-1 mb-2" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFEAE0] text-[#A53700] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <div>
              <h3 className="font-extrabold text-[17px] text-[#191C1E]">
                Set Boarding Alert
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {busName || (busId ? `Bus ${busId}` : `Bus ${busDetails.id}`)} • Current ETA:{" "}
                <span className="font-bold text-[#A53700]">{currentEtaMinutes} mins away</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F4F6] text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm cursor-pointer transition active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Save Status Banner / Immediate Trigger Alert */}
        {saveStatus.show && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-semibold animate-fade-in flex items-start gap-2 ${
              saveStatus.isImmediate
                ? "bg-amber-100 border-amber-300 text-amber-900"
                : "bg-emerald-50 border-emerald-300 text-emerald-900"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] shrink-0 text-[#F95700]">
              {saveStatus.isImmediate ? "crisis_alert" : "check_circle"}
            </span>
            <p className="leading-snug">{saveStatus.message}</p>
          </div>
        )}

        {/* Enable Push Notification Toggle Card */}
        <div className="bg-[#F7F9FB] rounded-2xl p-3.5 border border-[#ECEEF0] flex items-center justify-between">
          <div>
            <p className="font-bold text-[13px] text-[#191C1E]">
              Enable Push Notification
            </p>
            <p className="text-[11px] text-slate-500">
              Receive ringtone &amp; vibration reminder
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              enabled ? "bg-[#F95700]" : "bg-slate-300"
            }`}
            aria-label="Toggle Push Notification"
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
                enabled ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* ── Custom Alert Time Section (1 to 59 minutes) ── */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <label className="font-bold text-[13px] text-[#191C1E]">
              Notify me before bus arrives:
            </label>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              1 – 59 MINS MAX
            </span>
          </div>

          {/* Stepper & Big Number Display */}
          <div className="flex items-center justify-between bg-[#F7F9FB] p-3 rounded-2xl border border-[#ECEEF0]">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              disabled={selectedMins <= 1}
              className="w-10 h-10 rounded-xl bg-white text-slate-800 shadow-2xs border border-slate-200 flex items-center justify-center font-black text-[18px] hover:bg-slate-100 transition active:scale-95 disabled:opacity-40 cursor-pointer"
              aria-label="Decrease alert minutes"
            >
              −
            </button>

            <div className="text-center">
              <span className="text-[34px] font-black text-[#F95700] leading-none tracking-tight">
                {selectedMins}
              </span>
              <span className="text-[13px] font-black text-slate-600 ml-1">mins away</span>
              <p className="text-[10px] text-slate-400 font-semibold">
                Alert trigger threshold
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleStep(1)}
              disabled={selectedMins >= 59}
              className="w-10 h-10 rounded-xl bg-white text-slate-800 shadow-2xs border border-slate-200 flex items-center justify-center font-black text-[18px] hover:bg-slate-100 transition active:scale-95 disabled:opacity-40 cursor-pointer"
              aria-label="Increase alert minutes"
            >
              +
            </button>
          </div>

          {/* Range Slider for Smooth Dragging (1 to 59) */}
          <div className="space-y-1 px-1">
            <input
              type="range"
              min={1}
              max={59}
              value={selectedMins}
              onChange={(e) => setSelectedMins(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#F95700]"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>1 min</span>
              <span>15m</span>
              <span>30m</span>
              <span>45m</span>
              <span>59 mins</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Presets:</span>
            {presetOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMins(m)}
                className={`py-1 px-2.5 rounded-xl text-xs font-black transition cursor-pointer border ${
                  selectedMins === m
                    ? "bg-[#FFE8D6] text-[#A53700] border-[#F95700] shadow-2xs ring-1 ring-[#F95700]/30"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>

          {/* Proximity Warning Notice (shows if actual ETA is <= selected alert time) */}
          {isAlreadyCloser && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 space-y-1 text-xs text-amber-900 animate-fade-in">
              <div className="flex items-center gap-1.5 font-black text-[#A53700] text-[12px]">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Immediate Boarding Notice</span>
              </div>
              <p className="font-medium text-[11px] leading-relaxed">
                The bus is actually <strong>{currentEtaMinutes} mins away</strong>, but you want to be notified when it is <strong>{selectedMins} mins away</strong>. Since the bus is already closer than your {selectedMins}-minute alert threshold, please prepare to board immediately!
              </p>
            </div>
          )}
        </div>

        {/* Tip Box */}
        <div className="bg-[#F7F9FB] rounded-2xl p-3 border border-[#ECEEF0] flex items-center gap-2.5 text-slate-600">
          <span className="material-symbols-outlined text-[18px] text-[#F95700] shrink-0">
            alarm
          </span>
          <p className="text-[11px] leading-tight">
            Alarm rings with real-time GPS tracking even when your screen is locked.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 rounded-full bg-[#F95700] hover:bg-[#E04E00] text-white font-extrabold text-[15px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">alarm_on</span>
            <span>Save Alert ({selectedMins} mins) ✓</span>
          </button>

          {isAlertActive && (
            <button
              type="button"
              onClick={handleStopAlert}
              className="w-full py-3 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-[14px] transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">notifications_off</span>
              <span>Stop / Turn Off Alert</span>
            </button>
          )}
        </div>

        <p className="text-[10px] text-center text-slate-400">
          You can adjust, silence, or stop your customized alert anytime.
        </p>
      </div>
    </div>
  );
}
