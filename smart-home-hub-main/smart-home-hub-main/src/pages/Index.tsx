import { useState, useEffect } from "react";
import { Navigation } from "@/components/shared/Navigation";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { DeviceCard } from "@/components/dashboard/DeviceCard";
import { RealtimeChart } from "@/components/dashboard/RealtimeChart";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { useSensorData } from "@/hooks/useSensorData";
import { useDeviceControl } from "@/hooks/useDeviceControl";
import { wsService } from "@/services/websocket";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { sensorData, chartData, notifications: sensorNotifications, clearNotifications: clearSensorNotifications } = useSensorData();
  const { deviceStates, toggleDevice, notifications: deviceNotifications, clearNotifications: clearDeviceNotifications } = useDeviceControl();

  const allNotifications = [...deviceNotifications, ...sensorNotifications].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const handleClearNotifications = () => {
    clearDeviceNotifications();
    clearSensorNotifications();
  };

  // Track WebSocket connection status
  useEffect(() => {
    const unsub = wsService.onConnectionChange(setIsConnected);
    return () => unsub();
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navigation
        isConnected={isConnected}
        notificationCount={allNotifications.length}
        notificationPanel={
          <NotificationPanel 
            notifications={allNotifications} 
            onClear={handleClearNotifications} 
          />
        }
      />

      <main className="container mx-auto px-4 py-3 flex-1 flex flex-col gap-3 overflow-hidden">
        {/* Sensor Cards Section */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Cảm biến
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SensorCard
              type="temperature"
              value={sensorData.temperature}
              unit="°C"
              lastUpdated={sensorData.lastUpdated}
            />
            <SensorCard
              type="humidity"
              value={sensorData.humidity}
              unit="%"
              lastUpdated={sensorData.lastUpdated}
            />
            <SensorCard
              type="light"
              value={sensorData.light}
              unit="lux"
              lastUpdated={sensorData.lastUpdated}
            />
          </div>
        </section>

        {/* Chart + Device Control Section (fills remaining viewport) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0">
          <div className="md:col-span-2 min-h-0">
            <RealtimeChart data={chartData} />
          </div>
          
          {/* Device Controls - fills same height as chart */}
          <div className="flex flex-col gap-3">
            <DeviceCard
              type="light"
              state={deviceStates.light}
              onToggle={() => {}}
              compact
            />
            <DeviceCard
              type="fan"
              state={deviceStates.fan}
              onToggle={() => toggleDevice("fan")}
              compact
            />
            <DeviceCard
              type="ac"
              state={deviceStates.ac}
              onToggle={() => toggleDevice("ac")}
              compact
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
