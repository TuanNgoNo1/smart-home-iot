/**
 * API Service Layer
 * Base configuration for all API calls to backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

/**
 * Generic fetch wrapper with error handling
 */
async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 'all') {
        searchParams.set(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || response.statusText, errorData);
  }

  return response.json();
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// ============================================
// Sensor APIs
// ============================================

export interface SensorInfo {
  id: string;
  name: string;
  topic: string;
  created_at: string;
}

export interface LatestSensorData {
  [key: string]: {
    sensor_id: string;
    sensor_name: string;
    value: number;
    created_at: string;
  };
}

export interface ChartDataPoint {
  time: string;
  created_at: string;
  temperature?: number;
  humidity?: number;
  light?: number;
}

export interface SensorDataRecord {
  id: number;
  sensor_id: string;
  sensor_name: string;
  value: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const sensorApi = {
  /** GET /api/sensors - Danh sách loại cảm biến */
  getSensors: () => request<SensorInfo[]>('/sensors'),

  /** GET /api/sensors/latest - 3 chỉ số mới nhất */
  getLatest: () => request<LatestSensorData>('/sensors/latest'),

  /** GET /api/sensors/chart?limit=20 - Dữ liệu biểu đồ */
  getChartData: (limit = 20) => request<ChartDataPoint[]>('/sensors/chart', {
    params: { limit },
  }),

  /** GET /api/sensor-data - Lịch sử cảm biến (phân trang) */
  getSensorData: (filters: {
    sensor_id?: string;
    from?: string;
    to?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => request<PaginatedResponse<SensorDataRecord>>('/sensor-data', {
    params: filters as Record<string, string | number | undefined>,
  }),
};

// ============================================
// Device APIs
// ============================================

export interface DeviceInfo {
  id: string;
  name: string;
  topic: string;
  device_state: string;
  created_at: string;
}

export interface ControlResponse {
  request_id: string;
  request_status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  device_state?: string;
  message?: string;
}

export const deviceApi = {
  /** GET /api/devices - Danh sách thiết bị + trạng thái */
  getDevices: () => request<DeviceInfo[]>('/devices'),

  /** POST /api/devices/control - Gửi lệnh bật/tắt */
  control: (deviceId: string, action: 'ON' | 'OFF') =>
    request<ControlResponse>('/devices/control', {
      method: 'POST',
      body: JSON.stringify({ deviceId, action }),
    }),
};

// ============================================
// Action History APIs
// ============================================

export interface ActionHistoryRecord {
  id: number;
  request_id: string;
  device_id: string;
  device_name: string;
  action: string;
  status: string;
  created_at: string;
}

export const actionApi = {
  /** GET /api/action-history - Lịch sử điều khiển (phân trang) */
  getHistory: (filters: {
    device_id?: string;
    status?: string;
    from?: string;
    to?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    sortOrder?: string;
  }) => request<PaginatedResponse<ActionHistoryRecord>>('/action-history', {
    params: filters as Record<string, string | number | undefined>,
  }),
};
