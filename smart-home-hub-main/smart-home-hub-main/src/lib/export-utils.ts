import { SensorRecord } from "@/types/sensor";
import { ActionRecord } from "@/types/action";
import { format } from "date-fns";

// Sensor data export
export const exportSensorDataToCSV = (data: SensorRecord[], filename?: string) => {
  const sensorTypeLabels: Record<string, string> = {
    dht_temp: "Nhiệt độ",
    dht_hum: "Độ ẩm",
    light: "Ánh sáng",
  };

  const sensorUnits: Record<string, string> = {
    dht_temp: "°C",
    dht_hum: "%",
    light: "lux",
  };

  const headers = ["ID", "Loại cảm biến", "Giá trị", "Đơn vị", "Thời gian"];
  
  const rows = data.map((record) => [
    record.id,
    sensorTypeLabels[record.sensor_id] || record.sensor_name || record.sensor_id,
    record.value.toString(),
    sensorUnits[record.sensor_id] || "",
    format(new Date(record.created_at), "dd/MM/yyyy HH:mm:ss"),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, filename || `sensor-data-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`, "text/csv");
};

// Action history export
export const exportActionHistoryToCSV = (data: ActionRecord[], filename?: string) => {
  const deviceTypeLabels: Record<string, string> = {
    led_01: "Đèn",
    fan_01: "Quạt",
    ac_01: "Điều hòa",
  };

  const actionLabels: Record<string, string> = {
    on: "BẬT",
    off: "TẮT",
  };

  const statusLabels: Record<string, string> = {
    SUCCESS: "Thành công",
    WAITING: "Đang xử lý",
    FAILED: "Lỗi",
    TIMEOUT: "Hết hạn",
  };

  const headers = ["ID", "Thiết bị", "Hành động", "Trạng thái", "Thời gian"];
  
  const rows = data.map((record) => [
    record.id,
    deviceTypeLabels[record.device_id] || record.device_name || record.device_id,
    actionLabels[record.action.toLowerCase()] || record.action,
    statusLabels[record.status] || record.status,
    format(new Date(record.created_at), "dd/MM/yyyy HH:mm:ss"),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, filename || `action-history-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`, "text/csv");
};

// Excel export (using CSV with BOM for Excel compatibility)
export const exportSensorDataToExcel = (data: SensorRecord[], filename?: string) => {
  const sensorTypeLabels: Record<string, string> = {
    dht_temp: "Nhiệt độ",
    dht_hum: "Độ ẩm",
    light: "Ánh sáng",
  };

  const sensorUnits: Record<string, string> = {
    dht_temp: "°C",
    dht_hum: "%",
    light: "lux",
  };

  const headers = ["ID", "Loại cảm biến", "Giá trị", "Đơn vị", "Thời gian"];
  
  const rows = data.map((record) => [
    record.id,
    sensorTypeLabels[record.sensor_id] || record.sensor_name || record.sensor_id,
    record.value.toString(),
    sensorUnits[record.sensor_id] || "",
    format(new Date(record.created_at), "dd/MM/yyyy HH:mm:ss"),
  ]);

  const tableRows = rows.map((row) => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("\n");
  
  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8"></head>
    <body>
      <table border="1">
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  downloadFile(htmlContent, filename || `sensor-data-${format(new Date(), "yyyyMMdd-HHmmss")}.xls`, "application/vnd.ms-excel");
};

export const exportActionHistoryToExcel = (data: ActionRecord[], filename?: string) => {
  const deviceTypeLabels: Record<string, string> = {
    led_01: "Đèn",
    fan_01: "Quạt",
    ac_01: "Điều hòa",
  };

  const actionLabels: Record<string, string> = {
    on: "BẬT",
    off: "TẮT",
  };

  const statusLabels: Record<string, string> = {
    SUCCESS: "Thành công",
    WAITING: "Đang xử lý",
    FAILED: "Lỗi",
    TIMEOUT: "Hết hạn",
  };

  const headers = ["ID", "Thiết bị", "Hành động", "Trạng thái", "Thời gian"];
  
  const rows = data.map((record) => [
    record.id,
    deviceTypeLabels[record.device_id] || record.device_name || record.device_id,
    actionLabels[record.action.toLowerCase()] || record.action,
    statusLabels[record.status] || record.status,
    format(new Date(record.created_at), "dd/MM/yyyy HH:mm:ss"),
  ]);

  const tableRows = rows.map((row) => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("\n");
  
  const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8"></head>
    <body>
      <table border="1">
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  downloadFile(htmlContent, filename || `action-history-${format(new Date(), "yyyyMMdd-HHmmss")}.xls`, "application/vnd.ms-excel");
};

// Helper function to trigger file download
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
