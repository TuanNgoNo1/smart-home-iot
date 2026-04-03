import { Search, ArrowUpDown, RotateCcw, Thermometer, Droplets, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SensorDataFilters, SensorType } from "@/types/sensor";

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

export const SensorFilterBar = ({ filters, onFilterChange }: SensorFilterBarProps) => {
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as ["created_at" | "value", "asc" | "desc"];
    onFilterChange({ sortBy, sortOrder });
  };

  const currentSort = `${filters.sortBy}-${filters.sortOrder}`;

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ID / Giá trị / Thời gian / Ngày..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Sensor Type Filter */}
        <Select
          value={filters.sensorType}
          onValueChange={(value) => onFilterChange({ sensorType: value as SensorType | "all" })}
        >
          <SelectTrigger className="w-auto min-w-[130px] bg-background">
            <SelectValue placeholder="Cảm biến" />
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
            onFilterChange({
              search: "",
              sensorType: "all",
              sortBy: "created_at",
              sortOrder: "desc",
            });
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};
