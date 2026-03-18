import { Home, Wifi, WifiOff, Database, History, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { wsService } from "@/services/websocket";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  isConnected: boolean;
}

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/data-sensor", label: "Data Sensor", icon: Database },
  { path: "/action-history", label: "Action History", icon: History },
  { path: "/profile", label: "Profile", icon: User },
];

export const Navigation = ({ isConnected }: NavigationProps) => {
  const location = useLocation();
  const [isHardwareOnline, setIsHardwareOnline] = useState(false);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const unsub = wsService.on("sensor_update", () => {
      lastUpdateRef.current = Date.now();
      setIsHardwareOnline(true);
    });

    const interval = setInterval(() => {
      if (Date.now() - lastUpdateRef.current > 10000) {
        setIsHardwareOnline(false);
      } else {
        setIsHardwareOnline(true);
      }
    }, 1000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const isFullyConnected = isConnected && isHardwareOnline;

  return (
    <header className="dashboard-header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Smart Home</h1>
                <p className="text-xs text-muted-foreground">IoT Dashboard</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className={`status-badge ${isFullyConnected ? 'status-badge-success' : 'status-badge-error'}`}>
              {isFullyConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
