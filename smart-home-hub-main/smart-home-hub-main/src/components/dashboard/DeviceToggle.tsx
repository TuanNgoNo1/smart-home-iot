import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DeviceState = "off" | "loading" | "on" | "failed";

interface DeviceToggleProps {
  state: DeviceState;
  onToggle: () => void;
  disabled?: boolean;
}

export const DeviceToggle = ({ state, onToggle, disabled }: DeviceToggleProps) => {
  const isOn = state === "on";
  const isLoading = state === "loading";
  const isFailed = state === "failed";
  const isDisabled = disabled || isLoading;

  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={cn(
        "relative w-20 h-10 rounded-full transition-all duration-300 ease-in-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-70",
        // Background colors
        isOn && "bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]",
        !isOn && !isFailed && "bg-gradient-to-r from-gray-200 to-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]",
        isFailed && "bg-gradient-to-r from-red-400 to-red-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]",
        // Hover effects
        !isDisabled && isOn && "hover:from-emerald-500 hover:to-emerald-600",
        !isDisabled && !isOn && !isFailed && "hover:from-gray-300 hover:to-gray-400",
        !isDisabled && isFailed && "hover:from-red-500 hover:to-red-600"
      )}
      aria-checked={isOn}
      role="switch"
    >
      {/* ON/OFF Text */}
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wide transition-all duration-300",
          isOn ? "left-3 text-white/80" : "right-3 text-gray-400"
        )}
      >
        {isOn ? "ON" : "OFF"}
      </span>

      {/* Toggle Thumb */}
      <span
        className={cn(
          "absolute top-1 h-8 w-8 rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
          "shadow-[0_2px_8px_rgba(0,0,0,0.2),0_1px_3px_rgba(0,0,0,0.1)]",
          "flex items-center justify-center",
          // Position based on state
          isOn ? "left-[calc(100%-2.25rem)]" : "left-1",
          // Loading animation
          isLoading && "animate-pulse"
        )}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
        )}
      </span>
    </button>
  );
};
