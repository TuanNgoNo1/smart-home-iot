import { SensorRecord } from "@/types/sensor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Copy, Check } from "lucide-react";
import { useState } from "react";

interface SensorDataTableProps {
  data: SensorRecord[];
  isLoading: boolean;
  onSort?: (column: "created_at" | "value") => void;
  sortBy?: "created_at" | "value";
  sortOrder?: "asc" | "desc";
}

const sensorConfig: Record<
  string,
  { label: string; unit: string; badgeClass: string }
> = {
  dht_temp: {
    label: "Nhiệt độ",
    unit: "°C",
    badgeClass: "bg-red-500/20 text-red-700 border-red-400/50 font-semibold",
  },
  dht_hum: {
    label: "Độ ẩm",
    unit: "%",
    badgeClass: "bg-blue-500/20 text-blue-700 border-blue-400/50 font-semibold",
  },
  light: {
    label: "Ánh sáng",
    unit: "lux",
    badgeClass: "bg-yellow-500/20 text-yellow-700 border-yellow-400/50 font-semibold",
  },
};

export const SensorDataTable = ({
  data,
  isLoading,
  onSort,
  sortBy,
  sortOrder,
}: SensorDataTableProps) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (timestamp: string, id: number) => {
    navigator.clipboard.writeText(timestamp);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderSortIndicator = (column: "created_at" | "value") => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-1/4">ID</TableHead>
              <TableHead className="w-1/4">Loại cảm biến</TableHead>
              <TableHead className="w-1/4">Giá trị</TableHead>
              <TableHead className="w-1/4">Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-12 text-center shadow-lg">
        <p className="text-muted-foreground">Không có dữ liệu phù hợp với bộ lọc</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-1/4 font-medium text-muted-foreground">ID</TableHead>
            <TableHead className="w-1/4 font-medium text-muted-foreground">Loại cảm biến</TableHead>
            <TableHead className="w-1/4 font-medium text-muted-foreground">Giá trị</TableHead>
            <TableHead
              className={cn(
                "font-medium text-muted-foreground",
                onSort && "cursor-pointer hover:text-foreground transition-colors"
              )}
              onClick={() => onSort?.("created_at")}
            >
              <span className="flex items-center gap-1">
                Thời gian
                {sortBy === "created_at" && (
                  <ArrowUpDown className="w-3 h-3" />
                )}
                {renderSortIndicator("created_at")}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => {
            const config = sensorConfig[record.sensor_id] || { label: record.sensor_name || record.sensor_id, unit: "", badgeClass: "" };
            return (
              <TableRow key={record.id} className="group hover:bg-muted/30 transition-colors border-b border-border/50">
                <TableCell className="font-medium text-primary">
                  {record.id}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("font-medium text-xs px-2 py-0.5", config.badgeClass)}
                  >
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{record.value}</span>
                  <span className="text-muted-foreground ml-1 text-sm">
                    {config.unit}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>{format(new Date(record.created_at), "yyyy-MM-dd HH:mm:ss")}</span>
                    <button
                      onClick={() => handleCopy(format(new Date(record.created_at), "yyyy-MM-dd HH:mm:ss"), record.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                      title="Copy timestamp"
                    >
                      {copiedId === record.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
