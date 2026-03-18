import { Lightbulb, Fan, Snowflake, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeviceToggle } from "./DeviceToggle";

type DeviceType = "light" | "fan" | "ac";
type DeviceState = "off" | "loading" | "on" | "failed";

interface DeviceCardProps {
  type: DeviceType;
  state: DeviceState;
  onToggle: () => void;
}

const deviceConfig: Record<DeviceType, {
  label: string;
  labelVi: string;
  iconBgOn: string;
  iconColorOn: string;
}> = {
  light: {
    label: "Light",
    labelVi: "Đèn",
    iconBgOn: "bg-yellow-100",
    iconColorOn: "text-yellow-500",
  },
  fan: {
    label: "Fan",
    labelVi: "Quạt",
    iconBgOn: "bg-blue-100",
    iconColorOn: "text-blue-500",
  },
  ac: {
    label: "Air Conditioner",
    labelVi: "Điều hòa",
    iconBgOn: "bg-cyan-100",
    iconColorOn: "text-cyan-500",
  },
};

export const DeviceCard = ({ type, state, onToggle }: DeviceCardProps) => {
  const config = deviceConfig[type];
  const isOn = state === "on";
  const isLoading = state === "loading";
  const isFailed = state === "failed";
  const isDisabled = isLoading;

  const renderIcon = () => {
    const baseClasses = "w-12 h-12 transition-all duration-300";
    
    if (isFailed) {
      return <AlertCircle className={cn(baseClasses, "text-device-failed")} />;
    }

    switch (type) {
      case "light":
        return (
          <Lightbulb 
            className={cn(
              baseClasses,
              isOn 
                ? "text-yellow-500" 
                : "text-gray-400"
            )} 
          />
        );
      case "fan":
        return (
          <Fan 
            className={cn(
              baseClasses,
              isOn 
                ? "text-blue-500 animate-spin-slow" 
                : "text-gray-400"
            )} 
          />
        );
      case "ac":
        return (
          <Snowflake 
            className={cn(
              baseClasses,
              isOn 
                ? "text-cyan-500 animate-wave" 
                : "text-gray-400"
            )} 
          />
        );
    }
  };

  const getStateLabel = () => {
    switch (state) {
      case "off": return "Tắt";
      case "loading": return "Đang xử lý...";
      case "on": return "Bật";
      case "failed": return "Lỗi kết nối";
    }
  };

  return (
    <div className={cn(
      "device-card flex flex-col items-center text-center transition-all duration-500",
      isOn && type === "light" && "ring-2 ring-yellow-400/50 border-yellow-400/60 shadow-[0_0_30px_hsl(48,100%,50%,0.4)]",
      isOn && type === "fan" && "ring-2 ring-blue-400/50 border-blue-400/60 shadow-[0_0_30px_hsl(210,95%,55%,0.4)]",
      isOn && type === "ac" && "ring-2 ring-cyan-400/50 border-cyan-400/60 shadow-[0_0_30px_hsl(185,95%,55%,0.4)]",
      isFailed && "ring-2 ring-device-failed/30"
    )}>
      {/* Status indicator */}
      <div className={cn(
        "absolute top-4 right-4 w-2.5 h-2.5 rounded-full transition-all duration-300",
        state === "off" && "bg-gray-300",
        state === "loading" && "bg-amber-400 animate-pulse",
        state === "on" && "bg-emerald-500 shadow-[0_0_8px_hsl(150,70%,45%)]",
        state === "failed" && "bg-red-500 animate-pulse"
      )} />

      {/* Icon Container */}
      <div className={cn(
        "relative w-24 h-24 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
        isOn && type === "light" && "bg-yellow-50",
        isOn && type === "fan" && "bg-blue-50",
        isOn && type === "ac" && "bg-cyan-50",
        !isOn && !isFailed && "bg-gray-100",
        isFailed && "bg-red-50"
      )}>
        {isLoading ? (
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        ) : (
          renderIcon()
        )}
      </div>

      {/* Labels */}
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {config.labelVi}
      </h3>
      <p className={cn(
        "text-sm font-medium mb-4",
        state === "off" && "text-muted-foreground",
        state === "loading" && "text-amber-500",
        state === "on" && "text-emerald-600",
        state === "failed" && "text-red-500"
      )}>
        {getStateLabel()}
      </p>

      {/* Toggle Switch */}
      <DeviceToggle
        state={state}
        onToggle={onToggle}
        disabled={isDisabled}
      />
    </div>
  );
};
