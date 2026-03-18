import { useState, useEffect, useCallback, useRef } from "react";
import { sensorApi, ChartDataPoint } from "@/services/api";
import { wsService } from "@/services/websocket";
import { DeviceNotification } from "./useDeviceControl";

interface SensorData {
  temperature: number;
  humidity: number;
  light: number;
  lastUpdated: Date;
}

const MAX_DATA_POINTS = 20;

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    light: 0,
    lastUpdated: new Date(),
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [notifications, setNotifications] = useState<DeviceNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);

  const addNotification = useCallback(
    (notification: Omit<DeviceNotification, "id" | "timestamp">) => {
      const newNotification: DeviceNotification = {
        ...notification,
        id: Date.now().toString() + Math.random().toString(),
        timestamp: new Date(),
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
    },
    []
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Load initial data from API
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadInitialData = async () => {
      try {
        // Fetch latest sensor values
        const latest = await sensorApi.getLatest();
        if (latest) {
          setSensorData({
            temperature: latest.dht_temp?.value ?? 0,
            humidity: latest.dht_hum?.value ?? 0,
            light: latest.light?.value ?? 0,
            lastUpdated: new Date(latest.dht_temp?.created_at || Date.now()),
          });
        }

        // Fetch chart history (20 points)
        const chart = await sensorApi.getChartData(MAX_DATA_POINTS);
        if (chart && chart.length > 0) {
          setChartData(chart);
        }
      } catch (error) {
        console.error("Failed to load initial sensor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Subscribe to WebSocket for realtime updates
  useEffect(() => {
    wsService.connect();

    const unsubSensor = wsService.on("sensor_update", (data: unknown) => {
      const update = data as {
        temperature: number;
        humidity: number;
        light: number;
        timestamp: string;
        time: string;
      };

      // Update current values
      setSensorData({
        temperature: Math.round(update.temperature),
        humidity: Math.round(update.humidity),
        light: Math.round(update.light),
        lastUpdated: new Date(update.timestamp),
      });

      // Threshold Checks
      if (update.temperature > 40) {
        addNotification({
          type: "error",
          category: "sensor",
          title: `Cảnh báo nhiệt độ cao`,
          subtitle: `Nhiệt độ đạt mức ${Math.round(update.temperature)}°C`,
          device: "dht_temp",
        });
      }
      if (update.humidity > 80) {
        addNotification({
          type: "error",
          category: "sensor",
          title: `Cảnh báo độ ẩm cao`,
          subtitle: `Độ ẩm đạt mức ${Math.round(update.humidity)}%`,
          device: "dht_hum",
        });
      }
      if (update.light > 1500) {
        addNotification({
          type: "error",
          category: "sensor",
          title: `Cảnh báo ánh sáng chói`,
          subtitle: `Cường độ sáng đạt mức ${Math.round(update.light)} lux`,
          device: "light",
        });
      }

      // Append to chart data
      setChartData((prev) => {
        const newPoint: ChartDataPoint = {
          time: update.time,
          created_at: update.timestamp,
          temperature: Math.round(update.temperature),
          humidity: Math.round(update.humidity),
          light: Math.round(update.light),
        };

        const newData = [...prev, newPoint];
        if (newData.length > MAX_DATA_POINTS) {
          return newData.slice(-MAX_DATA_POINTS);
        }
        return newData;
      });
    });

    return () => {
      unsubSensor();
    };
  }, []);

  return {
    sensorData,
    chartData,
    notifications,
    clearNotifications,
    isLoading,
  };
};
