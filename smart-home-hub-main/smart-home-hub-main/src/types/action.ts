// Re-export types matching SRS
export type DeviceType = "led_01" | "fan_01" | "ac_01";
export type ActionType = "ON" | "OFF";
export type ActionStatus = "WAITING" | "SUCCESS" | "FAILED" | "TIMEOUT";

export interface ActionRecord {
  id: number;
  request_id: string;
  device_id: string;
  device_name: string;
  action: string;
  status: string;
  created_at: string;
}

export interface ActionHistoryFilters {
  deviceType: string; // device_id or "all"
  status: string;     // ActionStatus or "all"
  action: string;     // "ON" | "OFF" | "all"
  search: string;
  sortOrder: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface PaginatedActionResponse {
  data: ActionRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
