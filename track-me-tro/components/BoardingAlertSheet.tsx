"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/lib/AppContext";

interface BoardingAlertSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (mins: number) => void;
}

export default function BoardingAlertSheet({
  isOpen,
  onClose,
  onSave,
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

  const [selectedMins, setSelectedMins] = useState<number>(boardingAlertMinutes || 10);
  const [enabled, setEnabled] = useState<boolean>(isAlertActive);
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setBoardingAlertMinutes(selectedMins);
    setIsAlertActive(enabled);
    if (onSave) onSave(selectedMins);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 800);
  };

  const alertOptions = [
    { mins: 5, label: "5 mins", desc: "Quick rush" },
    { mins: 10, label: "10 mins", desc: "Optimal time", recommended: true },
    { mins: 15, label: "15 mins", desc: "Early prep" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Sheet */}
      <div className="relative w-full max-w-[480px] bg-white rounded-t-[32px] p-5 shadow-2xl z-10 space-y-4 border-t border-[#ECEEF0] animate-in slide-in-from-bottom duration-300">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#D8DADC] rounded-full mx-auto -mt-1 mb-2" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFEAE0] text-[#A53700] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </div>
            <div>
              <h3 className="font-extrabold text-[17px] text-[#191C1E]">
                Set Boarding Alert
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Bus {busDetails.id} • Baybay to Ormoc
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F4F6] text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

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
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
                enabled ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Radio Options */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="font-bold text-[13px] text-[#191C1E]">
              Notify me when the bus is:
            </label>
            <span className="text-[10px] font-bold text-[#F95700] bg-[#FFE8D6] px-2 py-0.5 rounded-full">
              Recommended: 10m
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {alertOptions.map((opt) => {
              const isSelected = selectedMins === opt.mins;
              return (
                <button
                  key={opt.mins}
                  type="button"
                  onClick={() => setSelectedMins(opt.mins)}
                  className={`p-3 rounded-2xl border text-center transition-all relative cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? "border-[#F95700] bg-white ring-1 ring-[#F95700] shadow-sm"
                      : "border-[#ECEEF0] bg-white hover:border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#F95700] text-white text-[10px] font-bold flex items-center justify-center absolute -top-1.5 -right-1.5 shadow-2xs">
                      ✓
                    </span>
                  )}
                  <span
                    className={`font-black text-[15px] ${
                      isSelected ? "text-[#F95700]" : "text-[#191C1E]"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip Box */}
        <div className="bg-[#F7F9FB] rounded-2xl p-3 border border-[#ECEEF0] flex items-center gap-2.5 text-slate-600">
          <span className="material-symbols-outlined text-[18px] text-[#F95700] shrink-0">
            alarm
          </span>
          <p className="text-[11px] leading-tight">
            Alarm triggers with real-time GPS tracking even when your screen is locked.
          </p>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3.5 rounded-full bg-[#F95700] hover:bg-[#E04E00] text-white font-extrabold text-[15px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{showSavedToast ? "Alert Saved!" : "Save Alert ✓"}</span>
        </button>

        <p className="text-[10px] text-center text-slate-400">
          You can manage or silence active alarms anytime in Settings.
        </p>
      </div>
    </div>
  );
}
