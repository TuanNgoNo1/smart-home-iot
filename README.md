# 🏠 IoT Smart Home - Final Project (Project 4)
**Tác giả:** Ngô Đức Anh Tuấn - D22PTDPT02 (PTIT)

Hệ thống IoT Smart Home hoàn chỉnh, cho phép theo dõi dữ liệu cảm biến (nhiệt độ, độ ẩm, ánh sáng) và điều khiển các thiết bị dân dụng theo thời gian thực (Real-time). Mọi hành động thao tác đều được lưu lại và hiển thị lên giao diện Website Dashboard được thiết kế chuẩn chuyên nghiệp.

---

## 🌟 Chức Năng Cốt Lõi (Core Features)
- **Real-time Monitoring:** Thu thập, giám sát luồng dữ liệu cảm biến trực tiếp mỗi 2 giây. Các giá trị hiển thị bao gồm: Nhiệt độ (°C), Độ ẩm (%) và Cường độ ánh sáng (lux). Biểu đồ trục x2 Y, Auto Scale.
- **Remote Device Control:** Giao tiếp 2 chiều (bật/tắt) quạt, đèn led, điều hòa qua giao thức MQTT. Luôn hiển thị trạng thái chuẩn xác với thiết bị vật lý dựa trên bản tin phản hồi (ACK message).
- **Smart Notification System:** Báo cáo mọi hoạt động của phần cứng. Đặc biệt: Cảnh báo đỏ tự động khi nhiệt độ > 40°C, độ ẩm > 80% hoặc độ chói sáng > 1500 lux.
- **Export Data (XLS & CSV):** Xuất báo cáo dữ liệu dạng bảng tính (hỗ trợ hiển thị và chia cột thông minh tương thích 100% với file chạy của Microsoft Excel).
- **History Logs:** Lưu toàn bộ lịch sử thiết bị và lịch sử thay đổi cảm biến. Bộ lọc thời gian (5 phút, 1 giờ, Custom Range) hoạt động độc lập và chính xác với timezone (Múi giờ local).

---

## 🛠 Cấu Trúc Dự Án (Architecture & Stack)

Dự án được triển khai dựa trên 3 khối hệ thống chính:

### 1. 🎛 Front-End (Giao diện Quản trị Website)
* **Vị trí thư mục:** `smart-home-hub-main/smart-home-hub-main/`
* **Công nghệ:** React 18, Vite, Tailwind CSS, TypeScript.
* **Biểu đồ:** Recharts.
* **Component UI:** Shadcn/UI (Radix UI).

### 2. ⚙️ Back-End & Database (Máy chủ Xử lý)
* **Vị trí thư mục:** `backend/`
* **Công nghệ:** Node.js, Express.js.
* **Cơ sở dữ liệu:** MySQL (Port: 3306).
* **Broker & Giao thức mạng:** MQTT (Port: 1884), WebSocket, HTTP RESTful APIs.

### 3. 🔌 Hardware (Thiết bị Phần Cứng)
* **Vị trí thư mục:** `hardware/smart_home/`
* **Vi điều khiển:** NodeMCU ESP8266.
* **Modules:** DHT11 (Nhiệt/Ẩm), LDR (Cảm biến quang - đảo vế). Led giả lập các hành vi thiết bị...
* **Framework Code:** C++ (Arduino IDE) với thư viện PubSubClient.

---

## 🚀 Hướng Dẫn Cài Đặt Khởi Chạy (Local Testing)
### 1. Khởi chạy Backend & kết nối MQTT
Yêu cầu: Máy đã có `Node.js`, `MySQL` và cấu hình file `.env` (User/Password Database).
```bash
# Mở Terminal thứ nhất tại thư mục backend/
cd backend
npm install
node server.js
```

### 2. Khởi chạy Giao diện Frontend
```bash
# Mở Terminal thứ hai tại thư mục Frontend React
cd "smart-home-hub-main/smart-home-hub-main"
npm install
npm run dev
# Dashboard sẽ khả dụng ở cổng: http://localhost:8080
```

### 3. Cắm mạch Hardware (ESP8266)
Sử dụng công cụ Arduino IDE. Điều chỉnh WiFi SSID và Password, đặc biệt **IP của MQTT_HOST** trong file `smart_home.ino` về IP Address thực tế trên thiết bị của bạn.
Sau đó ấn nạp (Upload) Code tới bo mạch. Hệ thống sẽ tự động gửi request giao tiếp qua Broker chạy ở Backend.

---

> *Dự án được xây dựng đặc thù trong khuôn khổ bài tập cơ sở bộ môn Internet of Things (PTIT). Mọi mã nguồn front-end đều được tùy biến và bảo vệ kỹ càng thông qua React Context. Không sao chép sử dụng dưới mục đích thương mại ảo.*
