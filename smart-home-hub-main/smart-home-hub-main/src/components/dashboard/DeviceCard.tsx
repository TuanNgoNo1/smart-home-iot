import { Lightbulb, Fan, Snowflake, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeviceToggle } from "./DeviceToggle";

type DeviceType = "light" | "fan" | "ac";
type DeviceState = "off" | "loading" | "on" | "failed";

interface DeviceCardProps {
  type: DeviceType;
  state: DeviceState;
  onToggle: () => void;
  compact?: boolean;
}

const deviceConfig: Record<DeviceType, {
  label: string;
  labelVi: string;
  iconBgOn: string;
  iconColorOn: string;
  glowClass: string;
  gradientBorder: string;
}> = {
  light: {
    label: "Light",
    labelVi: "Đèn",
    iconBgOn: "bg-yellow-100",
    iconColorOn: "text-yellow-500",
    glowClass: "ring-yellow-400/50 border-yellow-400/60 shadow-[0_0_30px_hsl(48,100%,50%,0.4)]",
    gradientBorder: "bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500",
  },
  fan: {
    label: "Fan",
    labelVi: "Quạt",
    iconBgOn: "bg-emerald-100",
    iconColorOn: "text-emerald-500",
    glowClass: "ring-emerald-400/50 border-emerald-400/60 shadow-[0_0_30px_hsl(150,80%,50%,0.4)]",
    gradientBorder: "bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500",
  },
  ac: {
    label: "Air Conditioner",
    labelVi: "Điều hòa",
    iconBgOn: "bg-blue-100",
    iconColorOn: "text-blue-500",
    glowClass: "ring-blue-400/50 border-blue-400/60 shadow-[0_0_30px_hsl(210,95%,55%,0.4)]",
    gradientBorder: "bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500",
  },
};

export const DeviceCard = ({ type, state, onToggle, compact = false }: DeviceCardProps) => {
  const config = deviceConfig[type];
  const isOn = state === "on";
  const isLoading = state === "loading";
  const isFailed = state === "failed";
  const isDisabled = isLoading;

  const renderIcon = (size: string = "w-12 h-12") => {
    const baseClasses = `${size} transition-all duration-300`;
    
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
                ? "text-yellow-500 animate-pulse-glow"
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
                ? "text-emerald-500 animate-spin-slow"
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
                ? "text-blue-500 animate-wave"
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

  // ===================== COMPACT LAYOUT =====================
  if (compact) {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-xl p-4 bg-card transition-all duration-500 cursor-pointer flex-1",
        "border",
        isOn && `ring-2 ${config.glowClass}`,
        !isOn && !isFailed && "border-border hover:border-primary/30",
        isFailed && "ring-2 ring-device-failed/30 border-red-300",
      )}
        style={{
          boxShadow: isOn
            ? `0 4px 15px -2px ${type === "light" ? "rgba(250,204,21,0.3)" : type === "fan" ? "rgba(16,185,129,0.3)" : "rgba(59,130,246,0.3)"}`
            : "var(--shadow-sm)",
        }}
      >
        {/* Gradient border overlay when ON */}
        {isOn && (
          <div className={cn(
            "absolute inset-0 rounded-xl opacity-20 pointer-events-none",
            config.gradientBorder
          )} />
        )}

        <div className="relative flex items-center gap-4 h-full">
          {/* Icon */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300",
            isOn && type === "light" && "bg-yellow-50",
            isOn && type === "fan" && "bg-emerald-50",
            isOn && type === "ac" && "bg-blue-50",
            !isOn && !isFailed && "bg-gray-100",
            isFailed && "bg-red-50"
          )}>
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            ) : (
              renderIcon("w-6 h-6")
            )}
          </div>

          {/* Name + Status */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground">
              {config.labelVi}
            </h3>
            <p className={cn(
              "text-sm font-medium",
              state === "off" && "text-muted-foreground",
              state === "loading" && "text-amber-500",
              state === "on" && "text-emerald-600",
              state === "failed" && "text-red-500"
            )}>
              {getStateLabel()}
            </p>
          </div>

          {/* Status dot + Toggle (not for light) */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              state === "off" && "bg-gray-300",
              state === "loading" && "bg-amber-400 animate-pulse",
              state === "on" && "bg-emerald-500 shadow-[0_0_6px_hsl(150,70%,45%)]",
              state === "failed" && "bg-red-500 animate-pulse"
            )} />
            {type !== "light" && (
              <DeviceToggle
                state={state}
                onToggle={onToggle}
                disabled={isDisabled}
              />
            )}
          </div>
        </div>

        {/* AUTO Mode Info (Only for Light) */}
        {type === "light" && (
          <div className="relative mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary/10">
              <span className="text-xs font-medium text-primary">AUTO MODE</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              Tự động bật khi ánh sáng &lt; 500 lux
            </p>
          </div>
        )}
      </div>
    );
  }

  // ===================== FULL LAYOUT (original) =====================
  return (
    <div className={cn(
      "device-card flex flex-col items-center text-center transition-all duration-500",
      isOn && `ring-2 ${config.glowClass}`,
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
        isOn && type === "fan" && "bg-emerald-50",
        isOn && type === "ac" && "bg-blue-50",
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

      {/* Toggle Switch (not for light) */}
      {type !== "light" ? (
        <DeviceToggle
          state={state}
          onToggle={onToggle}
          disabled={isDisabled}
        />
      ) : (
        <div className="w-full px-4">
          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
            <span className="text-sm font-medium text-primary">AUTO MODE</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Tự động bật khi ánh sáng &lt; 500 lux
          </p>
        </div>
      )}
    </div>
  );
};
