# Fix Dashboard UI, Notification Filtering & Export

## Proposed Changes

### 1. Navigation Bar — Remove Settings Gear + Fix Connection Status

#### [MODIFY] [Navigation.tsx](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/components/shared/Navigation.tsx)

- **Xóa nút Settings (răng cưa)** — Nút này không gắn chức năng gì, chỉ gây rối.
- **Sửa logic trạng thái "Connected":** Hiện tại [isConnected](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/services/websocket.ts#20-23) chỉ theo dõi WebSocket (Backend ↔ Browser), luôn xanh nếu backend đang chạy, bất kể phần cứng có cắm hay không.
  - **Giải pháp:** Thêm prop `isHardwareOnline` từ Dashboard. Backend sẽ broadcast trạng thái này qua WebSocket mỗi khi nhận/mất dữ liệu sensor. Nếu > 10 giây không nhận được sensor data → hiện `Disconnected` (đỏ).

#### [MODIFY] [Index.tsx](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/pages/Index.tsx)

- Thêm logic tracking: nếu `sensorData.lastUpdated` cũ hơn 10 giây so với `Date.now()` → `isHardwareOnline = false`.

---

### 2. Notification Panel — Fix Tab Filtering + Warning Toggle

#### [MODIFY] [NotificationPanel.tsx](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/components/dashboard/NotificationPanel.tsx)

Hiện tại tabs (Tất cả / Thiết bị / Cảm biến / Hệ thống) và switch "Chỉ Warning/Error" chỉ thay đổi state nhưng **không filter danh sách `notifications`**.

- Thêm `category` vào interface [Notification](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/components/dashboard/NotificationPanel.tsx#7-15): `"device" | "sensor" | "system"`.
- Filter danh sách render theo `activeTab`:
  - `"all"` → hiển thị tất cả
  - `"device"` → chỉ hiện notification có `category === "device"`
  - `"sensor"` → chỉ hiện notification có `category === "sensor"`
  - `"system"` → chỉ hiện notification có `category === "system"`
- Khi switch "Chỉ Warning/Error" bật → chỉ hiện notifications có `type === "error"`.

#### [MODIFY] [useDeviceControl.ts](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/hooks/useDeviceControl.ts)

- Thêm field `category: "device"` vào mỗi lần gọi `addNotification(...)`.

#### [MODIFY] [useSensorData.ts](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/hooks/useSensorData.ts)

- Khi nhận được sensor data vượt ngưỡng (temp > 40, humidity > 80, light > 1500), tạo notification với `category: "sensor"` và `type: "error"` (cảnh báo ngưỡng).

---

### 3. Export CSV & Excel — Fix Broken + Giải thích khác biệt

> [!IMPORTANT]
> **Sự khác biệt giữa CSV và Excel:**
> - **CSV** (.csv): File text thuần, dùng dấu phẩy ngăn cách. Mở được trên mọi hệ điều hành, nhẹ, dễ import vào Excel/Google Sheets.
> - **Excel** (.xls): File dạng Excel, dùng tab ngăn cách + BOM header để Excel nhận Unicode tiếng Việt tự động. Ưu điểm: mở bằng Excel là tự động chia cột đẹp, hiển thị tiếng Việt không lỗi font.
> 
> **Gợi ý:** Giữ cả 2 vì chúng phục vụ mục đích khác nhau. CSV cho tương thích đa nền tảng, Excel cho trải nghiệm mở trực tiếp.

#### [MODIFY] [export-utils.ts](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/lib/export-utils.ts)

- **Root cause:** Export code dùng `record.sensorType`, `record.deviceType`, `record.timestamp` — các field này **không tồn tại** trên API response. API trả về `sensor_id`, `device_id`, `created_at`.
- Sửa lại để dùng đúng field names từ API: `record.sensor_id`, `record.sensor_name`, `record.device_id`, `record.device_name`, `record.created_at`.

## Verification Plan

### Manual Verification
1. Mở Dashboard → Settings gear biến mất, trạng thái hiện `Disconnected` (đỏ) khi không cắm hardware.
2. Bấm bật/tắt thiết bị → Notification hiện lên, chuyển tab "Thiết bị" chỉ còn notification thiết bị.
3. Bật switch "Chỉ Warning/Error" → chỉ còn notification loại error.
4. Vào Data Sensor / Action History → Bấm Export CSV / Export Excel → file tải về có dữ liệu đúng.
