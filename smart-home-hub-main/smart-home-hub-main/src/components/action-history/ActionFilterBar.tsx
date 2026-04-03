import { Search, ArrowUpDown, Lightbulb, Fan, Snowflake, RotateCcw, CheckCircle2, Clock, XCircle, AlertCircle, Power } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionHistoryFilters, DeviceType, ActionStatus } from "@/types/action";

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

const actionOptions: {
  value: "all" | "ON" | "OFF";
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "all", label: "Action", icon: null },
  { value: "ON", label: "Turn On", icon: <Power className="w-4 h-4 text-emerald-500" /> },
  { value: "OFF", label: "Turn Off", icon: <Power className="w-4 h-4 text-red-500" /> },
];

const sortOptions = [
  { value: "desc", label: "Mới nhất" },
  { value: "asc", label: "Cũ nhất" },
];

export const ActionFilterBar = ({ filters, onFilterChange }: ActionFilterBarProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ID / Thiết bị / Action / Status / Thời gian..."
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

        {/* Action Filter */}
        <Select
          value={filters.action || "all"}
          onValueChange={(value) => onFilterChange({ action: value as "all" | "ON" | "OFF" })}
        >
          <SelectTrigger className="w-auto min-w-[130px] bg-background">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border shadow-lg z-50">
            {actionOptions.map((option) => (
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
            onFilterChange({
              search: "",
              deviceType: "all",
              status: "all",
              action: "all",
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
