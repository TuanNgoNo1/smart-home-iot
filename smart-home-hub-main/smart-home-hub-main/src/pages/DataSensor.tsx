import { useState, useEffect } from "react";
import { Navigation } from "@/components/shared/Navigation";
import { SensorFilterBar } from "@/components/sensor-history/SensorFilterBar";
import { SensorDataTable } from "@/components/sensor-history/SensorDataTable";
import { SensorPagination } from "@/components/sensor-history/SensorPagination";
import { ExportDropdown } from "@/components/shared/ExportDropdown";
import { useSensorHistory } from "@/hooks/useSensorHistory";
import { exportSensorDataToCSV, exportSensorDataToExcel } from "@/lib/export-utils";
import { Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { wsService } from "@/services/websocket";

const DataSensor = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { data, isLoading, pagination, filters, updateFilters, refresh } = useSensorHistory();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unsub = wsService.onConnectionChange(setIsConnected);
    return () => unsub();
  }, []);

  const handleSort = (column: "created_at" | "value") => {
    if (filters.sortBy === column) {
      updateFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
    } else {
      updateFilters({ sortBy: column, sortOrder: "desc" });
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="min-h-screen">
      <Navigation isConnected={isConnected} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Data Sensor</h1>
              <p className="text-sm text-muted-foreground">Lịch sử dữ liệu cảm biến</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ExportDropdown
              onExportCSV={() => {
                exportSensorDataToCSV(data);
                toast.success("Đã xuất file CSV thành công!");
              }}
              onExportExcel={() => {
                exportSensorDataToExcel(data);
                toast.success("Đã xuất file Excel thành công!");
              }}
              disabled={data.length === 0}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
          </div>
        </div>
        <SensorFilterBar filters={filters} onFilterChange={updateFilters} />

        {/* Data Table */}
        <SensorDataTable
          data={data}
          isLoading={isLoading}
          onSort={handleSort}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
        />

        {/* Pagination */}
        {!isLoading && pagination.total > 0 && (
          <SensorPagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={(page) => updateFilters({ page })}
            onPageSizeChange={(pageSize) => updateFilters({ pageSize, page: 1 })}
          />
        )}
      </main>
    </div>
  );
};

// Helper function for className
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default DataSensor;
