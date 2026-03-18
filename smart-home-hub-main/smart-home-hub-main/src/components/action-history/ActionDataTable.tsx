import { ActionRecord, DeviceType, ActionType, ActionStatus } from "@/types/action";
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
import { Power, Lightbulb, Fan, Snowflake } from "lucide-react";

interface ActionDataTableProps {
  data: ActionRecord[];
  isLoading: boolean;
}

const deviceConfig: Record<string, { label: string; icon: React.ReactNode }> = {
  led_01: { 
    label: "Đèn", 
    icon: <Lightbulb className="w-5 h-5 text-yellow-500" /> 
  },
  fan_01: { 
    label: "Quạt", 
    icon: <Fan className="w-5 h-5 text-blue-500" /> 
  },
  ac_01: { 
    label: "Điều hòa", 
    icon: <Snowflake className="w-5 h-5 text-cyan-500" /> 
  },
};

const actionConfig: Record<string, { label: string; colorClass: string }> = {
  ON: { label: "BẬT", colorClass: "text-emerald-600" },
  OFF: { label: "TẮT", colorClass: "text-muted-foreground" },
};

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  WAITING: {
    label: "Đang xử lý",
    badgeClass: "bg-amber-50 text-amber-600 border-amber-300",
  },
  SUCCESS: {
    label: "Thành công",
    badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-300",
  },
  FAILED: {
    label: "Thất bại",
    badgeClass: "bg-red-50 text-red-600 border-red-300",
  },
  TIMEOUT: {
    label: "Timeout",
    badgeClass: "bg-orange-50 text-orange-600 border-orange-300",
  },
};

export const ActionDataTable = ({ data, isLoading }: ActionDataTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-1/5">ID</TableHead>
              <TableHead className="w-1/5">Thiết bị</TableHead>
              <TableHead className="w-1/5">Action</TableHead>
              <TableHead className="w-1/5">Status</TableHead>
              <TableHead className="w-1/5">Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
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
            <TableHead className="w-1/5 font-medium text-muted-foreground">ID</TableHead>
            <TableHead className="w-1/5 font-medium text-muted-foreground">Thiết bị</TableHead>
            <TableHead className="w-1/5 font-medium text-muted-foreground">Action</TableHead>
            <TableHead className="w-1/5 font-medium text-muted-foreground">Status</TableHead>
            <TableHead className="w-1/5 font-medium text-muted-foreground">Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => {
            const device = deviceConfig[record.device_id] || { label: record.device_name || record.device_id, icon: <Power className="w-5 h-5" /> };
            const action = actionConfig[record.action] || { label: record.action, colorClass: "" };
            const status = statusConfig[record.status] || { label: record.status, badgeClass: "" };
            
            return (
              <TableRow key={record.id} className="hover:bg-muted/30 transition-colors border-b border-border/50">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {record.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                      {device.icon}
                    </div>
                    <span className="font-medium">{device.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn("flex items-center gap-1.5 font-semibold", action.colorClass)}>
                    <Power className="w-4 h-4" />
                    <span>{action.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("font-medium text-xs rounded-full px-3 py-1", status.badgeClass)}
                  >
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {format(new Date(record.created_at), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
