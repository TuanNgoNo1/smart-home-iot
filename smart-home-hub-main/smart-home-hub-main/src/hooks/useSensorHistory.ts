import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { sensorApi, SensorDataRecord, SensorInfo, PaginatedResponse } from "@/services/api";

export type SensorType = "dht_temp" | "dht_hum" | "light";

export interface SensorDataFilters {
  search: string;
  sensorType: string; // sensor_id or "all"
  fromDate: string;
  toDate: string;
  sortBy: "created_at" | "value";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

const defaultFilters: SensorDataFilters = {
  search: "",
  sensorType: "all",
  fromDate: "",
  toDate: "",
  sortBy: "created_at",
  sortOrder: "desc",
  page: 1,
  pageSize: 10,
};

export const useSensorHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<SensorDataRecord[]>([]);
  const [sensorList, setSensorList] = useState<SensorInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  // Load sensor types for dropdown filter
  useEffect(() => {
    sensorApi.getSensors()
      .then(setSensorList)
      .catch(err => console.error("Failed to load sensor list:", err));
  }, []);

  // Parse filters from URL
  const filters: SensorDataFilters = useMemo(
    () => ({
      search: searchParams.get("search") || defaultFilters.search,
      sensorType: searchParams.get("sensorType") || defaultFilters.sensorType,
      fromDate: searchParams.get("fromDate") || defaultFilters.fromDate,
      toDate: searchParams.get("toDate") || defaultFilters.toDate,
      sortBy: (searchParams.get("sortBy") as "created_at" | "value") || defaultFilters.sortBy,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || defaultFilters.sortOrder,
      page: parseInt(searchParams.get("page") || "1"),
      pageSize: parseInt(searchParams.get("pageSize") || "10"),
    }),
    [searchParams]
  );

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters: Partial<SensorDataFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };

      // Reset to page 1 when filters change (except page/pageSize changes)
      if (!("page" in newFilters) && !("pageSize" in newFilters)) {
        updatedFilters.page = 1;
      }

      const params = new URLSearchParams();
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (
          value !== defaultFilters[key as keyof SensorDataFilters] &&
          value !== ""
        ) {
          params.set(key, String(value));
        }
      });
      setSearchParams(params);
    },
    [filters, setSearchParams]
  );

  // Fetch data from backend API when filters change
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await sensorApi.getSensorData({
          sensor_id: filters.sensorType,
          from: filters.fromDate,
          to: filters.toDate,
          search: filters.search,
          page: filters.page,
          pageSize: filters.pageSize,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });

        setData(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
        });
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
        setData([]);
        setPagination({ total: 0, page: 1, pageSize: 10, totalPages: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  return {
    data,
    isLoading,
    pagination,
    filters,
    updateFilters,
    sensorList,
  };
};
