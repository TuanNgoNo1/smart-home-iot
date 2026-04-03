// Re-export from API service for backward compatibility
export type SensorType = "dht_temp" | "dht_hum" | "light";

export interface SensorRecord {
  id: number;
  sensor_id: string;
  sensor_name: string;
  value: number;
  created_at: string;
}

export interface SensorDataFilters {
  search: string;
  sensorType: string; // sensor_id or "all"
  sortBy: "created_at" | "value";
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
