import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
}

export const TimePicker = ({ value, onChange, className }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, minutes, seconds] = value.split(":").map(Number);

  const handleChange = (type: "hours" | "minutes" | "seconds", val: number) => {
    const newTime = {
      hours: type === "hours" ? val : hours,
      minutes: type === "minutes" ? val : minutes,
      seconds: type === "seconds" ? val : seconds,
    };
    const formatted = `${String(newTime.hours).padStart(2, "0")}:${String(newTime.minutes).padStart(2, "0")}:${String(newTime.seconds).padStart(2, "0")}`;
    onChange(formatted);
  };

  const TimeColumn = ({ 
    max, 
    current, 
    onSelect,
    label 
  }: { 
    max: number; 
    current: number; 
    onSelect: (val: number) => void;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <span className="text-xs text-muted-foreground mb-1 font-medium">{label}</span>
      <div className="h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="flex flex-col gap-1 p-1">
          {Array.from({ length: max }, (_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                "w-10 h-8 rounded-md text-sm font-medium transition-colors",
                current === i
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              )}
            >
              {String(i).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <input
        type="time"
        step="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full sm:w-[110px] flex-shrink-0 rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
          >
            <Clock className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-3 bg-popover border border-border shadow-lg z-50" 
          align="start"
          sideOffset={4}
        >
          <div className="flex gap-2">
            <TimeColumn
              label="Giờ"
              max={24}
              current={hours}
              onSelect={(val) => handleChange("hours", val)}
            />
            <div className="flex items-center justify-center text-muted-foreground pt-5">:</div>
            <TimeColumn
              label="Phút"
              max={60}
              current={minutes}
              onSelect={(val) => handleChange("minutes", val)}
            />
            <div className="flex items-center justify-center text-muted-foreground pt-5">:</div>
            <TimeColumn
              label="Giây"
              max={60}
              current={seconds}
              onSelect={(val) => handleChange("seconds", val)}
            />
          </div>
          <div className="mt-3 pt-3 border-t border-border flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange("00:00:00")}
              className="text-xs"
            >
              00:00:00
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange("23:59:59")}
              className="text-xs"
            >
              23:59:59
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              Đóng
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
