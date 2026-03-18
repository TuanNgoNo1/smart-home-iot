import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { actionApi, ActionHistoryRecord, deviceApi, DeviceInfo, PaginatedResponse } from "@/services/api";

export type DeviceType = "led_01" | "fan_01" | "ac_01";
export type ActionType = "ON" | "OFF";
export type ActionStatus = "WAITING" | "SUCCESS" | "FAILED" | "TIMEOUT";

export interface ActionHistoryFilters {
  deviceType: string; // device_id or "all"
  status: string;     // ActionStatus or "all"
  search: string;
  fromDate: string;
  toDate: string;
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

const defaultFilters: ActionHistoryFilters = {
  deviceType: "all",
  status: "all",
  search: "",
  fromDate: "",
  toDate: "",
  sortOrder: "desc",
  page: 1,
  pageSize: 10,
};

export const useActionHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<ActionHistoryRecord[]>([]);
  const [deviceList, setDeviceList] = useState<DeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  // Load device list for dropdown filter
  useEffect(() => {
    deviceApi.getDevices()
      .then(setDeviceList)
      .catch(err => console.error("Failed to load device list:", err));
  }, []);

  // Parse filters from URL
  const filters: ActionHistoryFilters = useMemo(
    () => ({
      deviceType: searchParams.get("deviceType") || defaultFilters.deviceType,
      status: searchParams.get("status") || defaultFilters.status,
      search: searchParams.get("search") || defaultFilters.search,
      fromDate: searchParams.get("fromDate") || defaultFilters.fromDate,
      toDate: searchParams.get("toDate") || defaultFilters.toDate,
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || defaultFilters.sortOrder,
      page: parseInt(searchParams.get("page") || "1"),
      pageSize: parseInt(searchParams.get("pageSize") || "10"),
    }),
    [searchParams]
  );

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters: Partial<ActionHistoryFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };

      // Reset to page 1 when filters change (except page/pageSize changes)
      if (!("page" in newFilters) && !("pageSize" in newFilters)) {
        updatedFilters.page = 1;
      }

      const params = new URLSearchParams();
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (
          value !== defaultFilters[key as keyof ActionHistoryFilters] &&
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
        const response = await actionApi.getHistory({
          device_id: filters.deviceType,
          status: filters.status,
          from: filters.fromDate,
          to: filters.toDate,
          search: filters.search,
          page: filters.page,
          pageSize: filters.pageSize,
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
        console.error("Failed to fetch action history:", error);
        setData([]);
        setPagination({ total: 0, page: 1, pageSize: 10, totalPages: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // Manual refresh
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await actionApi.getHistory({
        device_id: filters.deviceType,
        status: filters.status,
        from: filters.fromDate,
        to: filters.toDate,
        search: filters.search,
        page: filters.page,
        pageSize: filters.pageSize,
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
      console.error("Failed to refresh action history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return {
    data,
    isLoading,
    pagination,
    filters,
    updateFilters,
    refresh,
    deviceList,
  };
};
