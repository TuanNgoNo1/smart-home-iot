# 📋 Kế Hoạch Triển Khai — Project 4: IoT Smart Home (Bám Sát SRS)

## ⚡ SỰ KHÁC BIỆT SRS vs KẾ HOẠCH BAN ĐẦU

> [!IMPORTANT]
> Sau khi đọc kỹ báo cáo SRS, mình phát hiện **nhiều điểm quan trọng** cần chỉnh lại. Dưới đây là bảng so sánh:

| # | Hạng mục | ❌ Kế hoạch ban đầu | ✅ Theo SRS (cần theo) |
|---|----------|---------------------|------------------------|
| 1 | **sensors.id** | `INT AUTO_INCREMENT` | `VARCHAR(50)` PK — giá trị: `dht_temp`, `dht_hum`, `light` |
| 2 | **sensors** columns | `name`, `unit` | `name`, `topic` (topic MQTT: `home/sensor/dht_temp`...) — **không có `unit`** |
| 3 | **Tên bảng sensor** | `data_sensor` | `sensor_data` |
| 4 | **sensor_data.id** | `INT` | `BIGINT AUTO_INCREMENT` |
| 5 | **sensor_data** timestamp | `timestamp` | `created_at` DATETIME |
| 6 | **devices.id** | `INT AUTO_INCREMENT` | `VARCHAR(50)` PK — giá trị: `led_01`, `fan_01`, `ac_01` |
| 7 | **devices** columns | `name`, `type` | `name`, `topic`, **`device_state`** (ON/OFF — dùng cho F5 reload) |
| 8 | **action_history.id** | `INT` | `BIGINT AUTO_INCREMENT` |
| 9 | **action_history** | Không có `request_id` | Có `request_id` VARCHAR(50) UNIQUE — UUID để map ACK |
| 10 | **action_history.status** | `WAITING / ON / OFF` | `WAITING / SUCCESS / FAILED / TIMEOUT` |
| 11 | **action_history** timestamp | `timestamp` | `created_at` DATETIME |
| 12 | **API lấy sensor mới nhất** | `/api/dashboard/latest` | `/api/sensors/latest` |
| 13 | **API lấy devices** | `/api/devices/status` | `/api/devices` (kèm `device_state`) |
| 14 | **API điều khiển** | `POST /api/devices/:id/control` | `POST /api/devices/control` (body: `{deviceId, action}`) |
| 15 | **API sensor data** | `/api/sensor-data` | `/api/sensor-data?sensor_id=&from=&to=&page=&pageSize=&sort=` |
| 16 | **API danh sách sensors** | Không có | `GET /api/sensors` (cho Dropdown filter) |
| 17 | **API action history** | `/api/action-history` params khác | `/api/action-history?device_id=&status=&from=&to=&search=&page=&pageSize=` |
| 18 | **MQTT topic điều khiển** | `device_control` | `device/cmd` |
| 19 | **MQTT topic ACK** | `device_confirm` | `device/ack` |
| 20 | **FE ActionStatus type** | `waiting / success / failed` | `waiting / success / failed / timeout` (thêm **timeout**) |
| 21 | **FE Device state on reload** | `localStorage` | Lấy từ DB qua `GET /api/devices` → field `device_state` |
| 22 | **Timeout** | Chỉ hiện loading | Backend UPDATE `status=TIMEOUT` + trả `504` |

---

## 🗄️ PHẦN 1: DATABASE (MySQL) — Theo SRS

```sql
-- 1. Bảng sensors
CREATE TABLE sensors (
    id VARCHAR(50) PRIMARY KEY,           -- 'dht_temp', 'dht_hum', 'light'
    name VARCHAR(100) NOT NULL,           -- 'Nhiệt độ', 'Độ ẩm', 'Ánh sáng'
    topic VARCHAR(255) NOT NULL,          -- 'home/sensor/dht_temp'
    created_at DATETIME DEFAULT NOW()
);

INSERT INTO sensors (id, name, topic) VALUES
('dht_temp', 'Nhiệt độ', 'home/sensor/dht_temp'),
('dht_hum', 'Độ ẩm', 'home/sensor/dht_hum'),
('light', 'Ánh sáng', 'home/sensor/light');

-- 2. Bảng sensor_data (KHÔNG phải data_sensor)
CREATE TABLE sensor_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sensor_id VARCHAR(50) NOT NULL,
    value FLOAT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (sensor_id) REFERENCES sensors(id)
);

CREATE INDEX idx_sensor_data ON sensor_data(sensor_id, created_at);

-- 3. Bảng devices (có device_state cho F5 reload)
CREATE TABLE devices (
    id VARCHAR(50) PRIMARY KEY,           -- 'led_01', 'fan_01', 'ac_01'
    name VARCHAR(100) NOT NULL,           -- 'Đèn', 'Quạt', 'Điều hòa'
    topic VARCHAR(255) NOT NULL,          -- 'home/device/led_01'
    device_state VARCHAR(20) DEFAULT 'OFF', -- ON/OFF (trạng thái vật lý, dùng khi reload)
    created_at DATETIME DEFAULT NOW()
);

INSERT INTO devices (id, name, topic) VALUES
('led_01', 'Đèn', 'home/device/led_01'),
('fan_01', 'Quạt', 'home/device/fan_01'),
('ac_01', 'Điều hòa', 'home/device/ac_01');

-- 4. Bảng action_history (có request_id cho ACK mapping)
CREATE TABLE action_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(50) UNIQUE,        -- UUID định danh request (map ACK)
    device_id VARCHAR(50) NOT NULL,
    action VARCHAR(10) NOT NULL,          -- 'ON' / 'OFF'
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING',  -- WAITING/SUCCESS/FAILED/TIMEOUT
    created_at DATETIME NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE INDEX idx_action_history ON action_history(device_id, created_at);
```

---

## ⚙️ PHẦN 2: BACKEND (Node.js + Express)

### API Endpoints — Theo SRS chính xác

#### Dashboard APIs
| Method | Endpoint | Mô tả | SRS ID |
|--------|----------|-------|--------|
| `GET` | `/api/sensors/latest` | Lấy 3 chỉ số mới nhất (temp, hum, light) | SRS |
| `GET` | `/api/sensors/chart?limit=20` | Lấy N điểm gần nhất cho biểu đồ (load lần đầu) | **GAP 4** |
| `GET` | `/api/devices` | Danh sách devices + `device_state` (cho F5 reload + Dropdown) | SRS |
| `POST` | `/api/devices/control` | Body: `{deviceId, action}`. BE tự sinh `requestId` | SRS |

#### Data Sensor APIs
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/sensors` | Danh sách loại cảm biến (cho Dropdown filter) |
| `GET` | `/api/sensor-data?sensor_id=&from=&to=&search=&page=&pageSize=&sortBy=&sortOrder=` | Phân trang + filter + **search theo ID/giá trị/chuỗi giờ** + **sort theo created_at hoặc value** |

#### Action History APIs
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/devices` | (Tái sử dụng) cho Dropdown filter thiết bị |
| `GET` | `/api/action-history?device_id=&status=&from=&to=&search=&page=&pageSize=&sortOrder=` | Phân trang + filter + **search hỗ trợ chuỗi giờ (VD: '10:30')** |

### Luồng điều khiển (Theo SD-02 SRS)

```
1. User click Toggle → FE hiện WAITING (Spinner)
2. FE → POST /api/devices/control { deviceId: "led_01", action: "ON" }
3. BE sinh requestId (UUID)
4. BE → INSERT action_history (request_id, device_id, action, status='WAITING')
5. BE → MQTT publish topic "device/cmd" { requestId, deviceId, action }
6. BE chờ ACK tối đa 10 giây...

   ✅ Case 1 — SUCCESS:
   7. HW thực thi GPIO → MQTT publish "device/ack" { requestId, result: "SUCCESS" }
   8. BE nhận ACK → UPDATE action_history SET status='SUCCESS'
   9. BE → UPDATE devices SET device_state='ON'
   10. BE → trả 200 { request_status: "SUCCESS" }
   11. FE → Toggle chuyển sang ON

   ❌ Case 2 — FAILED:
   7. HW báo lỗi → MQTT publish "device/ack" { requestId, result: "FAILED" }
   8-9. BE UPDATE status='FAILED', KHÔNG update device_state
   10. BE → trả 200 { request_status: "FAILED" }
   11. FE → Hiện lỗi + Nút "Thử lại"

   ⏱️ Case 3 — TIMEOUT:
   7. Không nhận ACK trong 10s
   8. BE → UPDATE action_history SET status='TIMEOUT'
   9. BE → trả 504 Timeout
   10. FE → Hiện trạng thái TIMEOUT
```

### Cấu trúc Backend

```
backend/
├── server.js                 # Entry + WebSocket
├── .env                      # DB + MQTT config
├── package.json
├── database/
│   ├── db.js                 # MySQL pool
│   └── schema.sql            # Tạo bảng (SQL ở trên)
├── routes/
│   ├── sensorRoutes.js       # /api/sensors, /api/sensors/latest, /api/sensor-data
│   ├── deviceRoutes.js       # /api/devices, /api/devices/control
│   └── actionRoutes.js       # /api/action-history
├── controllers/
│   ├── sensorController.js
│   ├── deviceController.js
│   └── actionController.js
├── mqtt/
│   └── mqttHandler.js        # Subscribe device/ack, data_sensor | Publish device/cmd
└── websocket/
    └── wsHandler.js          # Push realtime sensor + device status → FE
```

---

## 📡 PHẦN 3: MQTT (Mosquitto)

| Thông số | Giá trị theo SRS |
|----------|-----------------|
| Port | **1884** |
| Username | **NgoDucAnhTuan** |
| Password | Tự đặt |

### MQTT Topics (theo SRS)

| Topic | Direction | Payload |
|-------|-----------|---------|
| `home/sensor/+` hoặc `data_sensor` | HW → BE | `{ sensor_id, value, timestamp }` |
| `device/cmd` | BE → HW | `{ requestId, deviceId, action }` |
| `device/ack` | HW → BE | `{ requestId, result: "SUCCESS"/"FAILED" }` |

---

## 🔄 PHẦN 4: FRONTEND — Những Gì Cần Sửa

### Types cần cập nhật

#### [types/action.ts](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/types/action.ts)
```diff
- export type ActionStatus = "waiting" | "success" | "failed";
+ export type ActionStatus = "waiting" | "success" | "failed" | "timeout";
```

#### [types/sensor.ts](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/types/sensor.ts) — thêm `created_at`
```diff
  export interface SensorRecord {
    id: string;
-   sensorType: SensorType;
+   sensor_id: string;        // 'dht_temp', 'dht_hum', 'light'
+   sensor_name?: string;     // 'Nhiệt độ', 'Độ ẩm', 'Ánh sáng'
    value: number;
-   timestamp: string;
+   created_at: string;
  }
```

### Hooks cần refactor

| Hook | Thay đổi chính |
|------|----------------|
| [useSensorData](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/hooks/useSensorData.ts#31-121) | Mock → WebSocket nhận realtime + `GET /api/sensors/latest` + `GET /api/sensors/chart?limit=20` lần đầu |
| [useDeviceControl](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/hooks/useDeviceControl.ts#38-166) | Mock → `POST /api/devices/control` + `GET /api/devices` (load state khi reload) |
| [useSensorHistory](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/hooks/useSensorHistory.ts#112-184) | Mock → `GET /api/sensor-data?...` + `GET /api/sensors` (cho dropdown). Thêm `search` param (tìm theo ID/giá trị/giờ). Thêm `sortBy` (created_at/value) |
| [useActionHistory](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/hooks/useActionHistory.ts#114-206) | Mock → `GET /api/action-history?...` + `GET /api/devices` (cho dropdown). `search` hỗ trợ chuỗi giờ |

### FE bổ sung
- **Quick Range buttons** (5 phút / 1 giờ / 24 giờ) cho Data Sensor filter — FE-only, tự tính `from/to`
- **Threshold alert badge** trên SensorCard khi nhận WebSocket event `threshold_alert`
- **Dynamic rendering**: Dashboard map qua danh sách sensors/devices từ API (dễ thêm mới khi live code)

### Files mới cần tạo
- `src/services/api.ts` — API base config + fetch wrapper
- `src/services/websocket.ts` — WebSocket client (nhận sensor_update, device_update)

---

## ⚠️ PHẦN 5: CẢNH BÁO VƯỢT NGƯỠNG (FR-DASH-07)

- Backend kiểm tra khi nhận sensor data: nếu value > ngưỡng → push WebSocket event `threshold_alert`
- Ngưỡng mặc định: Nhiệt độ > 40°C, Độ ẩm > 90%, Ánh sáng > 2000 lux
- FE hiển thị badge cảnh báo trên SensorCard + thêm vào NotificationPanel
- Priority: Medium — có thể hardcode ngưỡng, không cần UI cấu hình

---

## 🔌 PHẦN 6: HARDWARE (ESP8266)

Không đổi so với plan ban đầu, nhưng cần chú ý:
- MQTT publish `device/ack` topic (không phải `device_confirm`)
- Payload ACK phải kèm `requestId` để Backend map đúng action

---

## 🎯 PHẦN 7: CHUẨN BỊ LIVE CODE

Thầy sẽ yêu cầu 1-2 đề khi bảo vệ. Code phải **modular** để dễ mở rộng:
- **Thêm sensor mới**: Chỉ cần INSERT vào bảng `sensors` + sửa Arduino code
- **Thêm device mới**: Chỉ cần INSERT vào bảng `devices` + thêm LED + sửa Arduino code
- **Cảnh báo ngưỡng**: Đã có sẵn logic (Phần 5 ở trên)
- **Đổi giao diện**: FE dùng component tái sử dụng (`SensorCard`, `DeviceCard`)
- **Thống kê SQL**: Chuẩn bị sẵn các query mẫu (COUNT, GROUP BY)

> [!TIP]
> FE nên dùng **dynamic rendering** (map qua danh sách sensors/devices từ API) thay vì hardcode 3 sensor + 3 device → khi thêm mới chỉ cần INSERT DB, FE tự render

---

## 🤖 MÌNH HỖ TRỢ ĐƯỢC

| # | Việc | Chi tiết |
|---|------|---------|
| 1 | **Backend Node.js hoàn chỉnh** | Tất cả APIs theo SRS, MQTT handler, WebSocket |
| 2 | **Database schema.sql** | SQL tạo bảng + seed data đúng SRS |
| 3 | **Refactor 4 hooks FE** | Mock → API thật + WebSocket |
| 4 | **Arduino code ESP8266** | File `.ino` với đúng MQTT topics |
| 5 | **API service layer FE** | `api.ts` + `websocket.ts` |
| 6 | **Postman Collection** | API documentation |

## ⚠️ BẠN CẦN TỰ LÀM

| # | Việc | Lý do |
|---|------|------|
| 1 | Cài MySQL + Mosquitto | Quyền admin |
| 2 | Cài Arduino IDE + nạp code | Cần cắm USB |
| 3 | Kết nối phần cứng (nối dây) | Thao tác tay |
| 4 | Figma, Git repo mới, PDF report | Nội dung cá nhân |

---

## Verification Plan

### Automated Tests
- Test từng API endpoint bằng `curl`/Postman
- Kiểm tra phân trang: response có `data[]`, `total`, `page`, `pageSize`, `totalPages`
- Kiểm tra filter/sort/search hoạt động

### Manual Verification
- Dashboard: biểu đồ cập nhật mỗi 2s qua WebSocket
- Device control: OFF → WAITING(spinner) → SUCCESS(ON) | FAILED | TIMEOUT
- F5 reload: trạng thái giữ nguyên (từ `devices.device_state`)
- Mất kết nối HW: biểu đồ loading → 10s thông báo lỗi
