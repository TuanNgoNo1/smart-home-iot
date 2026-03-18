# 🏠 Hệ Thống Giám Sát và Điều Khiển Thiết Bị IoT Thông Minh

> **Smart Home IoT Dashboard** - Giám sát cảm biến và điều khiển thiết bị thời gian thực

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Giới Thiệu

Hệ thống IoT cho phép giám sát và điều khiển thiết bị thông minh từ xa qua giao diện web. Dự án được xây dựng cho môn học **Internet of Things (IoT)** với các tính năng:

- 🌡️ **Giám sát Real-time:** Nhiệt độ, Độ ẩm, Ánh sáng (cập nhật mỗi 2 giây)
- 💡 **Điều khiển Thiết bị:** Đèn, Quạt, Điều hòa (với xác nhận trạng thái)
- 📊 **Biểu đồ Trực quan:** Line chart theo thời gian thực
- 📜 **Lịch sử Dữ liệu:** Tìm kiếm, lọc, phân trang
- 🔍 **Lịch sử Hành động:** Theo dõi mọi thao tác điều khiển

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │◄────►│   Backend   │◄────►│  Hardware   │
│  (React)    │ HTTP │  (Node.js)  │ MQTT │ (ESP8266)   │
│             │      │             │      │             │
│  • Dashboard│      │  • REST API │      │  • DHT22    │
│  • Charts   │      │  • MQTT Sub │      │  • BH1750   │
│  • History  │      │  • MySQL    │      │  • 3x LED   │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## 🚀 Cài Đặt và Chạy

### Yêu Cầu

- Node.js 18+ và npm
- MySQL 8.0+
- Mosquitto MQTT Broker
- ESP8266/ESP32 (cho phần cứng)

### Bước 1: Clone Repository

```bash
git clone https://github.com/your-username/smart-home-iot.git
cd smart-home-iot
```

### Bước 2: Cài Đặt Dependencies

```bash
npm install
```

### Bước 3: Cấu Hình Environment

Tạo file `.env` trong thư mục gốc:

```env
# --- Frontend (.env) ---
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000

# --- Backend (.env) ---
# Server
PORT=3000

# Database (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_home_iot

# MQTT Broker
MQTT_HOST=localhost
MQTT_PORT=1884
MQTT_USERNAME=YourFullName
MQTT_PASSWORD=your_password
```

### Bước 4: Khởi Động Development Server

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:5173`

---

## 📁 Cấu Trúc Thư Mục

```
smart-home-iot/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard cards, charts
│   │   ├── sensor-history/  # Data sensor table
│   │   ├── action-history/  # Action history table
│   │   └── ui/              # shadcn/ui components
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Dashboard page
│   │   ├── DataSensor.tsx   # Sensor history page
│   │   ├── ActionHistory.tsx
│   │   └── Profile.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useSensorData.ts
│   │   ├── useDeviceControl.ts
│   │   └── useActionHistory.ts
│   ├── contexts/            # React contexts
│   ├── types/               # TypeScript types
│   └── lib/                 # Utilities
├── public/                  # Static assets
└── README.md                # This file
```

---

## 🎨 Công Nghệ Sử Dụng

### Frontend

- **React 18.3** - UI library
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool
- **TailwindCSS 3.4** - Styling
- **shadcn/ui** - Component library
- **Recharts 2.15** - Charts
- **React Query** - Data fetching
- **React Router 6** - Routing

### Backend (Riêng biệt)

- **Node.js + Express** - REST API
- **MQTT.js** - MQTT client
- **MySQL2** - Database driver
- **Socket.io** - WebSocket (optional)

### Hardware

- **ESP8266/ESP32** - Microcontroller
- **DHT11** - Temperature & Humidity sensor
- **LDR** - Light sensor
- **3x LED** - Device simulation

---

## 📊 Chức Năng Chính

### 1. Dashboard (Trang Chủ)

- **3 Card Cảm biến:** Hiển thị giá trị real-time với gradient đẹp
- **Biểu đồ Line Chart:** 3 đường màu theo thời gian
- **3 Nút Điều khiển:** OFF → LOADING → ON (với hiệu ứng)
- **Toggle Switch:** Nút gạt bật/tắt thiết bị với loading spinner khi đang xử lý

### 2. Data Sensor (Lịch sử Cảm biến)

- Bảng dữ liệu với ID, Loại, Giá trị, Đơn vị, Thời gian
- Tìm kiếm theo keyword
- Lọc theo loại cảm biến và khoảng thời gian
- Phân trang (10/25/50/100 bản ghi/trang)

### 3. Action History (Lịch sử Hành động)

- Bảng lịch sử với Thiết bị, Action, Status, Thời gian
- Phân biệt Action (yêu cầu) vs Status (kết quả)
- Lọc theo thiết bị và thời gian
- Phân trang

### 4. Profile (Hồ sơ)

- Thông tin sinh viên (Họ tên, MSSV, Lớp)
- Link báo cáo PDF
- Link API Documentation
- Link Git Repository

---

## 🔧 Scripts

```bash
# Development
npm run dev              # Chạy dev server (port 5173)

# Build
npm run build            # Build production
npm run preview          # Preview production build

# Linting
npm run lint             # Check code quality
```

---

## 📡 API Endpoints (Backend)

### 1. Dashboard APIs
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/sensors/latest` | Lấy 3 chỉ số môi trường mới nhất (Temp, Hum, Light) để hiển thị Dashboard. |
| `GET` | `/api/devices` | Lấy danh sách thiết bị kèm trạng thái hiện tại (`device_state`) để hiển thị nút Toggle. |
| `POST` | `/api/devices/control` | Gửi lệnh điều khiển (Body: `deviceId`, `action`). Backend sẽ tự sinh `requestId`. |

### 2. Data Sensor APIs
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/sensors` | Lấy danh sách các loại cảm biến (`dht_temp`, `light`...) cho Dropdown lọc. |
| `GET` | `/api/sensor-data` | Tìm kiếm và phân trang lịch sử cảm biến.<br>**Params:** `sensor_id`, `from`, `to`, `page`, `pageSize`, `sort`. |

### 3. Action History APIs
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/action-history` | Tìm kiếm lịch sử điều khiển.<br>**Params:** `device_id`, `status` (WAITING/SUCCESS...), `search` (theo giờ), `page`, `pageSize`. |

---

## 🔌 MQTT Topics

Hệ thống sử dụng giao thức MQTT để giao tiếp giữa Hardware (ESP32) và Backend.

| Topic | Direction | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `iot/room1/sensor/data` | HW $\to$ BE | Gửi dữ liệu cảm biến (2s/lần) | `{ "temp": 28.5, "hum": 65, "light": 1200 }` |
| `iot/room1/device/cmd` | BE $\to$ HW | Gửi lệnh điều khiển | `{ "requestId": "req-123", "deviceId": "led_01", "action": "ON" }` |
| `iot/room1/device/ack` | HW $\to$ BE | Phản hồi trạng thái (ACK) | `{ "requestId": "req-123", "device_state": "ON", "result": "SUCCESS" }` |

---

## 🗄️ Database Schema (MySQL)

Hệ thống gồm 4 bảng chính, hỗ trợ lưu trữ trạng thái vật lý và log lịch sử.

```sql
-- 1. Bảng Devices (Lưu trạng thái vật lý dùng cho F5 Reload)
devices (
  id VARCHAR(50) PK,      -- e.g., 'led_01'
  name VARCHAR(100),
  topic VARCHAR(255),
  device_state VARCHAR(20), -- 'ON' / 'OFF'
  created_at DATETIME
)

-- 2. Bảng Sensors
sensors (
  id VARCHAR(50) PK,      -- e.g., 'dht_temp'
  name VARCHAR(100),
  topic VARCHAR(255),
  created_at DATETIME
)

-- 3. Bảng Sensor Data (Lưu lịch sử đo đạc)
sensor_data (
  id BIGINT PK,
  sensor_id VARCHAR(50) FK,
  value FLOAT,
  created_at DATETIME
)

-- 4. Bảng Action History (Lưu lịch sử điều khiển & trạng thái lệnh)
action_history (
  id BIGINT PK,
  request_id VARCHAR(50) UNIQUE, -- Map với ACK từ MQTT
  device_id VARCHAR(50) FK,
  action VARCHAR(10),     -- 'ON' / 'OFF'
  status VARCHAR(20),     -- 'WAITING', 'SUCCESS', 'FAILED', 'TIMEOUT'
  created_at DATETIME
)
```
---

## 📝 Tài Liệu
- **Figma Design:** [Link Figma](https://figma.com/...)
- **API Documentation:** [Link Postman](https://postman.com/...)

---

## 🎯 Roadmap

- [x] Thiết kế giao diện Figma (4 màn hình)
- [x] Viết tài liệu SRS
- [ ] Lập trình phần cứng ESP8266
- [ ] Xây dựng Backend API
- [ ] Tích hợp MQTT
- [ ] Hoàn thiện Frontend
- [ ] Testing và Debug
- [ ] Bảo vệ đồ án

---

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

## 🙏 Lời Cảm Ơn

- Thầy giáo hướng dẫn môn IoT
- Cộng đồng React và TypeScript
- shadcn/ui cho component library tuyệt vời

---

**⭐ Nếu thấy dự án hữu ích, hãy cho một star nhé!**
