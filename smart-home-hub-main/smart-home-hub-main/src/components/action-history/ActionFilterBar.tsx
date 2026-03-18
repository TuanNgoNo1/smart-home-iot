import { Search, ArrowUpDown, Lightbulb, Fan, Snowflake, Calendar, RotateCcw, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ActionHistoryFilters, DeviceType, ActionStatus } from "@/types/action";
import { useState } from "react";

// Time Picker Component
const TimePickerButton = ({ value, onChange }: { value: string; onChange: (time: string) => void }) => {
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
    label,
  }: {
    max: number;
    current: number;
    onSelect: (val: number) => void;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <span className="text-xs text-muted-foreground mb-1 font-medium">{label}</span>
      <div className="h-[180px] overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-1 p-1">
          {Array.from({ length: max }, (_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                "w-10 h-8 rounded-md text-sm font-medium transition-colors",
                current === i ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground",
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-3 text-sm font-mono">
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-3 bg-popover border border-border shadow-lg z-50"
        align="start"
        sideOffset={4}
      >
        <div className="flex gap-2">
          <TimeColumn label="Giờ" max={24} current={hours} onSelect={(val) => handleChange("hours", val)} />
          <div className="flex items-center justify-center text-muted-foreground pt-5">:</div>
          <TimeColumn label="Phút" max={60} current={minutes} onSelect={(val) => handleChange("minutes", val)} />
          <div className="flex items-center justify-center text-muted-foreground pt-5">:</div>
          <TimeColumn label="Giây" max={60} current={seconds} onSelect={(val) => handleChange("seconds", val)} />
        </div>
        <div className="mt-3 pt-3 border-t border-border flex justify-end">
          <Button variant="default" size="sm" onClick={() => setIsOpen(false)} className="text-xs">
            Đóng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface ActionFilterBarProps {
  filters: ActionHistoryFilters;
  onFilterChange: (filters: Partial<ActionHistoryFilters>) => void;
}

const deviceTypeOptions: {
  value: DeviceType | "all";
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all", label: "Thiết bị", icon: null },
  { value: "led_01", label: "Đèn", icon: <Lightbulb className="w-4 h-4 text-yellow-500" /> },
  { value: "fan_01", label: "Quạt", icon: <Fan className="w-4 h-4 text-blue-500" /> },
  { value: "ac_01", label: "Điều hòa", icon: <Snowflake className="w-4 h-4 text-cyan-500" /> },
];

const statusOptions: {
  value: ActionStatus | "all" | "timeout" | "success" | "waiting" | "failed";
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all", label: "Trạng thái", icon: null },
  { value: "success", label: "Thành công", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
  { value: "waiting", label: "Đang xử lý", icon: <Clock className="w-4 h-4 text-amber-500" /> },
  { value: "failed", label: "Lỗi", icon: <XCircle className="w-4 h-4 text-red-500" /> },
  { value: "timeout", label: "Timeout", icon: <AlertCircle className="w-4 h-4 text-orange-500" /> },
];

const sortOptions = [
  { value: "desc", label: "Mới nhất" },
  { value: "asc", label: "Cũ nhất" },
];

export const ActionFilterBar = ({ filters, onFilterChange }: ActionFilterBarProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(filters.fromDate ? new Date(filters.fromDate) : undefined);
  const [toDate, setToDate] = useState<Date | undefined>(filters.toDate ? new Date(filters.toDate) : undefined);
  const [fromTime, setFromTime] = useState(
    filters.fromDate ? format(new Date(filters.fromDate), "HH:mm:ss") : "00:00:00",
  );
  const [toTime, setToTime] = useState(filters.toDate ? format(new Date(filters.toDate), "HH:mm:ss") : "23:59:59");

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    if (date) {
      const [hours, minutes, seconds] = fromTime.split(":").map(Number);
      date.setHours(hours, minutes, seconds);
      onFilterChange({ fromDate: date.toISOString() });
    } else {
      onFilterChange({ fromDate: "" });
    }
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    if (date) {
      const [hours, minutes, seconds] = toTime.split(":").map(Number);
      date.setHours(hours, minutes, seconds);
      onFilterChange({ toDate: date.toISOString() });
    } else {
      onFilterChange({ toDate: "" });
    }
  };

  const handleFromTimeChange = (time: string) => {
    setFromTime(time);
    if (fromDate) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const newDate = new Date(fromDate);
      newDate.setHours(hours, minutes, seconds);
      onFilterChange({ fromDate: newDate.toISOString() });
    }
  };

  const handleToTimeChange = (time: string) => {
    setToTime(time);
    if (toDate) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const newDate = new Date(toDate);
      newDate.setHours(hours, minutes, seconds);
      onFilterChange({ toDate: newDate.toISOString() });
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4 shadow-lg">
      {/* Row 1: Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm ID / Thiết bị / Action / Status..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Device Type Filter */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.deviceType}
            onValueChange={(value) => onFilterChange({ deviceType: value as DeviceType | "all" })}
          >
            <SelectTrigger className="w-auto min-w-[130px] bg-background">
              <SelectValue placeholder="Thiết bị" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {deviceTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    {option.icon && option.icon}
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => onFilterChange({ status: value as ActionStatus | "all" })}
        >
          <SelectTrigger className="w-auto min-w-[130px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border shadow-lg z-50">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className="flex items-center gap-2">
                  {option.icon && option.icon}
                  <span>{option.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select
            value={filters.sortOrder}
            onValueChange={(value) => onFilterChange({ sortOrder: value as "asc" | "desc" })}
          >
            <SelectTrigger className="w-[120px] bg-background">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filter */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 gap-2"
          onClick={() => {
            setFromDate(undefined);
            setToDate(undefined);
            setFromTime("00:00:00");
            setToTime("23:59:59");
            onFilterChange({
              search: "",
              deviceType: "all",
              status: "all",
              sortOrder: "desc",
              fromDate: "",
              toDate: "",
            });
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Row 2: Date/Time Range */}
      <div className="flex flex-wrap items-center gap-3">
        {/* From DateTime */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Từ:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 px-3 text-sm font-normal", !fromDate && "text-muted-foreground")}
              >
                {fromDate ? format(fromDate, "dd/MM/yyyy") : "Ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border border-border shadow-lg z-50" align="start">
              <CalendarComponent
                mode="single"
                selected={fromDate}
                onSelect={handleFromDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <TimePickerButton value={fromTime} onChange={handleFromTimeChange} />
        </div>

        {/* To DateTime */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Đến:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("h-8 px-3 text-sm font-normal", !toDate && "text-muted-foreground")}
              >
                {toDate ? format(toDate, "dd/MM/yyyy") : "Ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover border border-border shadow-lg z-50" align="start">
              <CalendarComponent
                mode="single"
                selected={toDate}
                onSelect={handleToDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <TimePickerButton value={toTime} onChange={handleToTimeChange} />
        </div>
      </div>
    </div>
  );
};
