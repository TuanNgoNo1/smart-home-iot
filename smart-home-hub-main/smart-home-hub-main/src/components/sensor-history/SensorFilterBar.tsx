import { Search, Filter, ArrowUpDown, Clock, Calendar, RotateCcw, Thermometer, Droplets, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { SensorDataFilters, SensorType } from "@/types/sensor";
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

interface SensorFilterBarProps {
  filters: SensorDataFilters;
  onFilterChange: (filters: Partial<SensorDataFilters>) => void;
}

const sensorTypeOptions: {
  value: SensorType | "all" | "dht_temp" | "dht_hum" | "light";
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all", label: "Cảm biến", icon: null },
  { value: "dht_temp", label: "Nhiệt độ", icon: <Thermometer className="w-4 h-4 text-red-500" /> },
  { value: "dht_hum", label: "Độ ẩm", icon: <Droplets className="w-4 h-4 text-blue-500" /> },
  { value: "light", label: "Ánh sáng", icon: <Sun className="w-4 h-4 text-yellow-500" /> },
];

const sortOptions = [
  { value: "created_at-desc", label: "Mới nhất" },
  { value: "created_at-asc", label: "Cũ nhất" },
];

const quickTimeFilters = [
  { label: "5 phút", value: "5m" },
  { label: "1 giờ", value: "1h" },
  { label: "24 giờ", value: "24h" },
];

export const SensorFilterBar = ({ filters, onFilterChange }: SensorFilterBarProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(filters.fromDate ? new Date(filters.fromDate) : undefined);
  const [toDate, setToDate] = useState<Date | undefined>(filters.toDate ? new Date(filters.toDate) : undefined);
  const [fromTime, setFromTime] = useState(
    filters.fromDate ? format(new Date(filters.fromDate), "HH:mm:ss") : "00:00:00",
  );
  const [toTime, setToTime] = useState(filters.toDate ? format(new Date(filters.toDate), "HH:mm:ss") : "23:59:59");
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
    setActiveQuickFilter(null);
    if (date) {
      const [hours, minutes, seconds] = fromTime.split(":").map(Number);
      date.setHours(hours, minutes, seconds);
      onFilterChange({ fromDate: format(date, "yyyy-MM-dd HH:mm:ss") });
    } else {
      onFilterChange({ fromDate: "" });
    }
  };

  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
    setActiveQuickFilter(null);
    if (date) {
      const [hours, minutes, seconds] = toTime.split(":").map(Number);
      date.setHours(hours, minutes, seconds);
      onFilterChange({ toDate: format(date, "yyyy-MM-dd HH:mm:ss") });
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
      onFilterChange({ fromDate: format(newDate, "yyyy-MM-dd HH:mm:ss") });
    }
  };

  const handleToTimeChange = (time: string) => {
    setToTime(time);
    if (toDate) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const newDate = new Date(toDate);
      newDate.setHours(hours, minutes, seconds);
      onFilterChange({ toDate: format(newDate, "yyyy-MM-dd HH:mm:ss") });
    }
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as ["created_at" | "value", "asc" | "desc"];
    onFilterChange({ sortBy, sortOrder });
  };

  const handleQuickFilter = (value: string) => {
    setActiveQuickFilter(value);
    const now = new Date();
    let fromDate: Date;

    switch (value) {
      case "5m":
        fromDate = new Date(now.getTime() - 5 * 60 * 1000);
        break;
      case "1h":
        fromDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "24h":
        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }

    setFromDate(fromDate);
    setToDate(now);
    setFromTime(format(fromDate, "HH:mm:ss"));
    setToTime(format(now, "HH:mm:ss"));
    onFilterChange({
      fromDate: format(fromDate, "yyyy-MM-dd HH:mm:ss"),
      toDate: format(now, "yyyy-MM-dd HH:mm:ss"),
    });
  };

  const currentSort = `${filters.sortBy}-${filters.sortOrder}`;

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4 shadow-lg">
      {/* Row 1: Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ID hoặc giá trị..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Sensor Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select
            value={filters.sensorType}
            onValueChange={(value) => onFilterChange({ sensorType: value as SensorType | "all" })}
          >
            <SelectTrigger className="w-auto min-w-[120px] bg-background">
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg z-50">
              {sensorTypeOptions.map((option) => (
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

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px] bg-background">
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
            setActiveQuickFilter(null);
            onFilterChange({
              search: "",
              sensorType: "all",
              sortBy: "created_at",
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

      {/* Row 2: Quick Filters + Date/Time Range */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Quick Time Filters */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          {quickTimeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeQuickFilter === filter.value ? "default" : "outline"}
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => handleQuickFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

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
