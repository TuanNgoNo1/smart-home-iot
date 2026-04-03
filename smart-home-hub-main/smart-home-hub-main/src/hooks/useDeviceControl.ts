import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { deviceApi, DeviceInfo } from "@/services/api";
import { wsService } from "@/services/websocket";

type DeviceState = "off" | "loading" | "on" | "failed";
type DeviceMode = "manual" | "auto";

interface DeviceStates {
  [key: string]: DeviceState;
}

interface DeviceModes {
  [key: string]: DeviceMode;
}

export interface DeviceNotification {
  id: string;
  type: "success" | "pending" | "error";
  category?: "device" | "sensor" | "system";
  title: string;
  subtitle: string;
  device: string;
  timestamp: Date;
}

const ACK_TIMEOUT = 10000; // 10 seconds

export const useDeviceControl = () => {
  const [deviceStates, setDeviceStates] = useState<DeviceStates>({});
  const [deviceModes, setDeviceModes] = useState<DeviceModes>({});
  const [deviceList, setDeviceList] = useState<DeviceInfo[]>([]);
  const [notifications, setNotifications] = useState<DeviceNotification[]>(() => {
    // Load notifications from localStorage on mount
    try {
      const saved = localStorage.getItem('device_notifications');
      return saved ? JSON.parse(saved, (key, value) => {
        // Revive Date objects
        if (key === 'timestamp') return new Date(value);
        return value;
      }) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  // Persist notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('device_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Load device states from DB on mount (for F5 reload persistence)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadDevices = async () => {
      try {
        const devices = await deviceApi.getDevices();
        setDeviceList(devices);

        const states: DeviceStates = {};
        const modes: DeviceModes = {};
        devices.forEach((device) => {
          states[device.id] = device.device_state === "ON" ? "on" : "off";
          modes[device.id] = "manual"; // Default to manual mode
        });
        setDeviceStates(states);
        setDeviceModes(modes);
      } catch (error) {
        console.error("Failed to load device states:", error);
        // Fallback
        setDeviceStates({ led_01: "off", fan_01: "off", ac_01: "off" });
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, []);

  // Subscribe to WebSocket for device updates
  useEffect(() => {
    wsService.connect();

    const unsubDevice = wsService.on("device_update", (data: unknown) => {
      const update = data as {
        deviceId: string;
        device_state?: string;
        status: string;
      };

      if (update.status === "SUCCESS" && update.device_state) {
        setDeviceStates((prev) => ({
          ...prev,
          [update.deviceId]: update.device_state === "ON" ? "on" : "off",
        }));
      } else if (update.status === "FAILED" || update.status === "TIMEOUT") {
        setDeviceStates((prev) => ({
          ...prev,
          [update.deviceId]: "failed",
        }));
      }
    });

    return () => {
      unsubDevice();
    };
  }, []);

  const addNotification = useCallback(
    (notification: Omit<DeviceNotification, "id" | "timestamp">) => {
      const newNotification: DeviceNotification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
    },
    []
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('device_notifications');
  }, []);

  const setDeviceMode = useCallback((deviceId: string, mode: DeviceMode) => {
    setDeviceModes((prev) => ({ ...prev, [deviceId]: mode }));

    // Call backend API to set mode
    deviceApi.setMode(deviceId, mode).catch((error) => {
      console.error('Failed to set device mode:', error);
      // Revert on error
      setDeviceModes((prev) => ({ ...prev, [deviceId]: prev[deviceId] || 'manual' }));
    });
  }, []);

  const getDeviceName = useCallback(
    (deviceId: string): string => {
      const device = deviceList.find((d) => d.id === deviceId);
      return device?.name || deviceId;
    },
    [deviceList]
  );

  // Map device id to legacy type for existing FE components
  const getDeviceType = (deviceId: string): string => {
    if (deviceId === "led_01") return "light";
    if (deviceId === "fan_01") return "fan";
    if (deviceId === "ac_01") return "ac";
    return deviceId;
  };

  const toggleDevice = useCallback(
    async (deviceId: string) => {
      const currentState = deviceStates[deviceId];

      // Don't allow toggle if already loading
      if (currentState === "loading") return;

      const targetAction = currentState === "on" ? "OFF" : "ON";

      // Set to loading state immediately
      setDeviceStates((prev) => ({ ...prev, [deviceId]: "loading" }));

      const deviceName = getDeviceName(deviceId);

      // Add pending notification
      addNotification({
        type: "pending",
        category: "device",
        title: `Gửi lệnh ${targetAction === "ON" ? "bật" : "tắt"} ${deviceName}`,
        subtitle: "Đang chờ phản hồi...",
        device: getDeviceType(deviceId),
      });

      try {
        const result = await deviceApi.control(deviceId, targetAction);

        if (result.request_status === "SUCCESS") {
          setDeviceStates((prev) => ({
            ...prev,
            [deviceId]: targetAction === "ON" ? "on" : "off",
          }));

          addNotification({
            type: "success",
            category: "device",
            title: `${deviceName} ${targetAction === "ON" ? "bật" : "tắt"} OK`,
            subtitle: "ACK received",
            device: getDeviceType(deviceId),
          });

          toast({
            variant: "success",
            title: "Thành công",
            description: `${deviceName} đã ${targetAction === "ON" ? "bật" : "tắt"}`,
          });
        } else {
          throw new Error(result.request_status);
        }
      } catch (error: unknown) {
        setDeviceStates((prev) => ({ ...prev, [deviceId]: "failed" }));

        const errorMessage =
          error instanceof Error && error.message === "TIMEOUT"
            ? "Timeout - không nhận được tín hiệu"
            : "Không nhận được tín hiệu";

        addNotification({
          type: "error",
          category: "device",
          title: `Lỗi ${deviceName}`,
          subtitle: errorMessage,
          device: getDeviceType(deviceId),
        });

        toast({
          variant: "destructive",
          title: "Lỗi kết nối",
          description: `${errorMessage} từ ${deviceName}. Vui lòng thử lại.`,
        });
      }
    },
    [deviceStates, deviceList, addNotification, getDeviceName]
  );

  // Build legacy-compatible deviceStates for existing components
  const legacyDeviceStates = {
    light: (deviceStates["led_01"] || "off") as DeviceState,
    fan: (deviceStates["fan_01"] || "off") as DeviceState,
    ac: (deviceStates["ac_01"] || "off") as DeviceState,
  };

  return {
    deviceStates: legacyDeviceStates,
    deviceModes: {
      light: (deviceModes["led_01"] || "manual") as DeviceMode,
      fan: (deviceModes["fan_01"] || "manual") as DeviceMode,
      ac: (deviceModes["ac_01"] || "manual") as DeviceMode,
    },
    toggleDevice: (type: string) => {
      // Map legacy type to device id
      const deviceIdMap: Record<string, string> = {
        light: "led_01",
        fan: "fan_01",
        ac: "ac_01",
      };
      const deviceId = deviceIdMap[type] || type;
      toggleDevice(deviceId);
    },
    setDeviceMode: (type: string, mode: DeviceMode) => {
      const deviceIdMap: Record<string, string> = {
        light: "led_01",
        fan: "fan_01",
        ac: "ac_01",
      };
      const deviceId = deviceIdMap[type] || type;
      setDeviceMode(deviceId, mode);
    },
    notifications,
    clearNotifications,
    isLoading,
    deviceList,
  };
};
