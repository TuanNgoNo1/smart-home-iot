import { Thermometer, Droplets, Sun, LucideIcon, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

type SensorType = "temperature" | "humidity" | "light";

interface SensorCardProps {
  type: SensorType;
  value: number;
  unit: string;
  lastUpdated: Date;
  warning?: string;
}

interface SensorTheme {
  icon: LucideIcon;
  label: string;
  hue: number;        // Fixed hue for this sensor
  hueEnd: number;     // End hue for gradient
  maxValue: number;    // Value at which intensity = 100%
  warningThreshold?: { high?: number; low?: number };
}

const sensorConfig: Record<SensorType, SensorTheme> = {
  temperature: {
    icon: Thermometer,
    label: "Nhiệt độ",
    hue: 0,            // Red
    hueEnd: 350,       // Slightly warm red
    maxValue: 40,      // 40°C = full intensity
    warningThreshold: { high: 30 },
  },
  humidity: {
    icon: Droplets,
    label: "Độ ẩm",
    hue: 210,          // Blue
    hueEnd: 200,       // Slightly cyan-blue
    maxValue: 100,     // 100% = full intensity
    warningThreshold: { high: 80, low: 30 },
  },
  light: {
    icon: Sun,
    label: "Ánh sáng",
    hue: 45,           // Amber/Gold
    hueEnd: 38,        // Slightly deeper gold
    maxValue: 2000,    // 2000 lux = full intensity
    warningThreshold: { high: 1500 },
  },
};

/** Calculate 0-1 intensity from sensor value */
const getIntensity = (value: number, maxValue: number): number => {
  return Math.min(Math.max(value / maxValue, 0), 1);
};

export const SensorCard = ({ type, value, unit, lastUpdated, warning }: SensorCardProps) => {
  const config = sensorConfig[type];
  const Icon = config.icon;

  // Calculate dynamic colors based on value
  const dynamicStyles = useMemo(() => {
    const intensity = getIntensity(value, config.maxValue);
    const h = config.hue;
    const hEnd = config.hueEnd;

    // Background: light when low, more saturated/colored when high
    // Saturation: 40% → 90% (more vivid as value rises)
    // Lightness: 97% → 87% (slightly darker but still light enough for text)
    const bgSat = 40 + intensity * 50;         // 40 → 90
    const bgLight = 97 - intensity * 10;       // 97 → 87
    const bgSatEnd = 45 + intensity * 50;      // 45 → 95
    const bgLightEnd = 96 - intensity * 10;    // 96 → 86

    // Icon background: more saturated
    const iconBgSat = 60 + intensity * 35;     // 60 → 95
    const iconBgLight = 92 - intensity * 12;   // 92 → 80

    // Icon color: darker as value rises
    const iconSat = 70 + intensity * 25;       // 70 → 95
    const iconLight = 55 - intensity * 15;     // 55 → 40

    // Value text: always dark enough to read
    const valueSat = 80 + intensity * 15;      // 80 → 95
    const valueLight = 45 - intensity * 10;    // 45 → 35

    // Border: more visible as value rises
    const borderSat = 30 + intensity * 40;     // 30 → 70
    const borderLight = 90 - intensity * 8;    // 90 → 82

    // Glow shadow: only visible at higher intensities
    const glowOpacity = Math.max(0, (intensity - 0.4) * 0.8); // starts at 40% intensity
    const glowSpread = intensity * 25;

    return {
      background: `linear-gradient(135deg, hsl(${h}, ${bgSat}%, ${bgLight}%) 0%, hsl(${hEnd}, ${bgSatEnd}%, ${bgLightEnd}%) 100%)`,
      border: `1px solid hsl(${h}, ${borderSat}%, ${borderLight}%)`,
      iconBg: `hsl(${h}, ${iconBgSat}%, ${iconBgLight}%)`,
      iconColor: `hsl(${h}, ${iconSat}%, ${iconLight}%)`,
      valueColor: `hsl(${h}, ${valueSat}%, ${valueLight}%)`,
      boxShadow: glowOpacity > 0
        ? `0 4px 15px -3px hsla(${h}, 80%, 50%, ${glowOpacity}), 0 ${glowSpread}px ${glowSpread * 1.5}px -5px hsla(${h}, 90%, 55%, ${glowOpacity * 0.5})`
        : "var(--shadow-md)",
      intensity,
    };
  }, [value, config.hue, config.hueEnd, config.maxValue]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Check for auto warning based on threshold
  const getWarning = () => {
    if (warning) return warning;
    const threshold = config.warningThreshold;
    if (threshold?.high && value >= threshold.high) {
      if (type === "temperature") return "Nhiệt độ cao";
      if (type === "humidity") return "Độ ẩm cao";
      if (type === "light") return "Ánh sáng mạnh";
    }
    if (threshold?.low && value <= threshold.low) {
      if (type === "humidity") return "Độ ẩm thấp";
    }
    return null;
  };

  const warningText = getWarning();

  // Warning badge colors (dynamic based on hue)
  const h = config.hue;
  const warningBadgeBg = `hsla(${h}, 80%, 95%, 0.9)`;
  const warningBadgeColor = `hsl(${h}, 75%, 40%)`;
  const warningBadgeBorder = `hsl(${h}, 50%, 82%)`;

  return (
    <div
      className="sensor-card transition-all duration-700 ease-out"
      style={{
        background: dynamicStyles.background,
        border: dynamicStyles.border,
        boxShadow: dynamicStyles.boxShadow,
      }}
    >
      {/* Warning Badge */}
      {warningText && (
        <Badge 
          variant="outline" 
          className="absolute top-3 left-3 text-[10px] px-1.5 py-0.5 font-medium gap-1"
          style={{
            backgroundColor: warningBadgeBg,
            color: warningBadgeColor,
            borderColor: warningBadgeBorder,
          }}
        >
          <AlertTriangle className="w-3 h-3" />
          {warningText}
        </Badge>
      )}

      {/* Last Updated Badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[11px] font-medium text-muted-foreground">
          {formatTime(lastUpdated)}
        </span>
      </div>

      {/* Icon - dynamic background */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mt-4 transition-all duration-700"
        style={{ backgroundColor: dynamicStyles.iconBg }}
      >
        <Icon
          className="w-6 h-6 transition-all duration-700"
          style={{ color: dynamicStyles.iconColor }}
        />
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-muted-foreground mb-1">
        {config.label}
      </p>

      {/* Value - dynamic color */}
      <div className="flex items-baseline gap-1">
        <span
          className="text-4xl font-bold tracking-tight transition-all duration-700"
          style={{ color: dynamicStyles.valueColor }}
        >
          {value}
        </span>
        <span
          className="text-lg font-medium transition-all duration-700"
          style={{ color: dynamicStyles.valueColor, opacity: 0.7 }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
};
