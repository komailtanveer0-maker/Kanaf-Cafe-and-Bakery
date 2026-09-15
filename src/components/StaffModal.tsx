import React, { useState } from "react";
import { Lock, X, KeyRound, AlertCircle, ArrowRight } from "lucide-react";
import { dataStore } from "../utils/dataStore";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("Please enter the staff access PIN");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await dataStore.loginStaff(pin);
      if (result.success && result.token) {
        setPin("");
        onLoginSuccess(result.token);
      } else {
        setError(result.error || "Incorrect Staff Access Code. Please try again.");
      }
    } catch (err: any) {
      setError("Unable to verify PIN. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
      setError(null);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#5C0D20]/20 overflow-hidden text-[#2D2522]">
        {/* Header */}
        <div className="bg-[#4A0817] text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/15">
            <KeyRound className="w-6 h-6 text-[#D7E7F2]" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#D7E7F2] block mb-0.5">
            Staff Portal
          </span>
          <h3 className="font-serif font-bold text-xl text-white">
            Enter Staff PIN
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PIN Display Dots / Input */}
            <div className="relative">
              <input
                type="password"
                id="staff-pin-input"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/[^0-9]/g, ""));
                  setError(null);
                }}
                placeholder="••••"
                className="w-full text-center tracking-[0.6em] text-2xl font-mono py-3 rounded-2xl bg-white border border-[#5C0D20]/20 text-[#4A0817] focus:outline-none focus:ring-2 focus:ring-[#5C0D20]/30 focus:border-[#5C0D20]"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="py-3 rounded-xl bg-white hover:bg-[#F5EFE6] text-base font-bold text-[#4A0817] border border-[#5C0D20]/10 shadow-2xs active:scale-95 transition-all"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin("")}
                className="py-3 rounded-xl bg-white hover:bg-gray-100 text-xs font-semibold text-gray-500 border border-gray-200 active:scale-95 transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress("0")}
                className="py-3 rounded-xl bg-white hover:bg-[#F5EFE6] text-base font-bold text-[#4A0817] border border-[#5C0D20]/10 shadow-2xs active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 rounded-xl bg-white hover:bg-gray-100 text-xs font-semibold text-gray-500 border border-gray-200 active:scale-95 transition-all"
              >
                ⌫
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || pin.length < 4}
              className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 ${
                pin.length >= 4 && !loading
                  ? "bg-[#5C0D20] text-white hover:bg-[#460816]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Unlock Staff Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-gray-500 mt-4">
            Authorized Kanaf Cafe & Bakery staff only.
          </p>
        </div>
      </div>
    </div>
  );
};
