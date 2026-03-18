import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartDataPoint } from "@/services/api";

interface RealtimeChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: entry.stroke }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono font-medium" style={{ color: entry.stroke }}>
              {entry.value}
              {entry.name === "Nhiệt độ" && "°C"}
              {entry.name === "Độ ẩm" && "%"}
              {entry.name === "Ánh sáng" && " lux"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const RealtimeChart = ({ data }: RealtimeChartProps) => {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="chart-container h-[400px] flex flex-col shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Biểu đồ thời gian thực</h2>
          <p className="text-sm text-muted-foreground">Cập nhật mỗi 2 giây</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sensor-temperature" />
            <span className="text-xs text-muted-foreground">Nhiệt độ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sensor-humidity" />
            <span className="text-xs text-muted-foreground">Độ ẩm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sensor-light" />
            <span className="text-xs text-muted-foreground">Ánh sáng</span>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Đang chờ dữ liệu...</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Biểu đồ sẽ hiển thị khi có dữ liệu cảm biến</p>
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="gradientTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 85%, 58%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(0, 85%, 58%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gradientHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(210, 95%, 58%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(210, 95%, 58%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(48, 100%, 50%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(48, 100%, 50%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 2000]}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="temperature"
              name="Nhiệt độ"
              stroke="hsl(0, 85%, 58%)"
              strokeWidth={2.5}
              fill="url(#gradientTemperature)"
              dot={false}
              activeDot={{ r: 4, fill: "hsl(0, 85%, 58%)" }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              name="Độ ẩm"
              stroke="hsl(210, 95%, 58%)"
              strokeWidth={2.5}
              fill="url(#gradientHumidity)"
              dot={false}
              activeDot={{ r: 4, fill: "hsl(210, 95%, 58%)" }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="light"
              name="Ánh sáng"
              stroke="hsl(48, 100%, 50%)"
              strokeWidth={2.5}
              fill="url(#gradientLight)"
              dot={false}
              activeDot={{ r: 4, fill: "hsl(48, 100%, 50%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};