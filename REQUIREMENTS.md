# REQUIREMENTS.md - Tổng Hợp Yêu Cầu Môn Học IoT

> **Tài liệu này tổng hợp toàn bộ yêu cầu môn học IoT (Internet of Things) dựa trên hướng dẫn của thầy giáo.**
> 
> **Cập nhật lần cuối:** 13/01/2026

---

## 📋 MỤC LỤC

1. [Tổng Quan Môn Học](#1-tổng-quan-môn-học)
2. [Lưu Ý Quan Trọng Từ Thầy](#2-lưu-ý-quan-trọng-từ-thầy)
3. [Kiến Trúc Hệ Thống IoT](#3-kiến-trúc-hệ-thống-iot)
4. [Danh Sách Linh Kiện Cần Mua](#4-danh-sách-linh-kiện-cần-mua)
5. [Chi Tiết 4 Bài Thực Hành](#5-chi-tiết-4-bài-thực-hành)
6. [Tiến Độ Hiện Tại](#6-tiến-độ-hiện-tại)
7. [Việc Cần Làm Tiếp Theo](#7-việc-cần-làm-tiếp-theo)

---

## 1. TỔNG QUAN MÔN HỌC

### 1.1. Thông Tin Chung

| Tiêu chí | Chi tiết |
|----------|----------|
| **Tên môn** | IoT (Internet of Things) - Ứng dụng |
| **Hình thức** | Bài tập lớn + Vấn đáp cá nhân |
| **Số bài thực hành** | 4 bài |
| **Điểm số** | Chỉ có 1 điểm duy nhất (không chia chuyên cần, giữa kỳ) |
| **Thang điểm** | Bảo vệ sớm: 10-9-8, Bảo vệ muộn: 8-7 trở xuống |

### 1.2. Lịch Trình Bảo Vệ (Mục Tiêu A+ = 10 điểm)

```
Bài 1: 2 tuần  ──►  Bài 2: 1 tuần  ──►  Bài 3: 1 tuần  ──►  Bài 4: 2 tuần
                         Tổng: 6 tuần để đạt điểm 10
```

**Quy tắc tính điểm:**
- Mỗi tuần lùi = Mất 1 điểm
- Lùi 4+ tuần hoặc không trả lời được câu hỏi = Điểm 4 (Trượt)
- Điểm 5-6 không tồn tại (hoặc đạt hoặc trượt)

### 1.3. Vai Trò Sinh Viên Cần Đóng

Qua môn học này, sinh viên sẽ đóng vai:

| Vai trò | Bài tương ứng |
|---------|---------------|
| **BA (Business Analyst)** | Bài 1 - Viết tài liệu, thiết kế |
| **Hardware Developer** | Bài 2 - Lập trình ESP8266/ESP32 |
| **Integration Developer** | Bài 3 - Kết nối MQTT |
| **Full-stack Developer** | Bài 4 - Hoàn thiện hệ thống |

---

## 2. LƯU Ý QUAN TRỌNG TỪ THẦY

### 2.1. Tuyệt Đối TRÁNH

| Lỗi | Hậu quả |
|-----|---------|
| Làm nhóm / Copy bài | **CẢ 2 TRƯỢT** |
| Dùng Git repository cũ | Bị nghi copy, trượt |
| Lấy bài từ mạng/năm trước | Thầy sẽ phát hiện, trượt |
| Ảnh profile xấu/selfie | Bị trừ điểm |
| Giao diện giống bạn khác | **CẢ 2 TRƯỢT** |
| Không có trạng thái LOADING | Bị trừ điểm nặng |
| Không có phân trang | Sai yêu cầu kỹ thuật |

### 2.2. Bắt Buộc PHẢI LÀM

| Yêu cầu | Lý do |
|---------|-------|
| Tự làm hoặc hiểu rõ code | Vấn đáp trực tiếp, hỏi chi tiết |
| Port MQTT ≠ 1883 (mặc định) | Thể hiện đã tự cấu hình |
| Username MQTT = Họ tên đầy đủ | Nhận diện cá nhân |
| Căn cước công dân khi bảo vệ bài 4 | Xác minh danh tính |
| Mở được link Figma, Postman, Git ngay | Không có thời gian chờ đợi |

### 2.3. Các "Bẫy" Khi Bảo Vệ

- Thầy sẽ yêu cầu **đổi màu, di chuyển element** trong Figma → Phải thao tác được
- Thầy sẽ **rút USB phần cứng** → Giao diện phải hiện loading, sau 10s báo lỗi
- Thầy sẽ **reload web** → Trạng thái thiết bị phải giữ nguyên (không reset về OFF)
- Thầy sẽ **che cảm biến** → Biểu đồ phải giảm (không tăng ngược)

---

## 3. KIẾN TRÚC HỆ THỐNG IoT

### 3.1. Sơ Đồ Tổng Quan

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────────────────────┐
│    HARDWARE     │      │      MQTT       │      │         LAPTOP/SERVER           │
│  (ESP8266/32)   │◄────►│   (Mosquitto)   │◄────►│  ┌─────────────────────────────┐│
│                 │ WiFi │   Middleware    │      │  │  Frontend (Web/App)        ││
│  • 3 Cảm biến   │      │                 │      │  ├─────────────────────────────┤│
│  • 3 Đèn LED    │      │  • Topics       │      │  │  Backend (Node/PHP/Python) ││
│                 │      │  • Pub/Sub      │      │  ├─────────────────────────────┤│
└─────────────────┘      └─────────────────┘      │  │  Database (MySQL)          ││
                                                  │  └─────────────────────────────┘│
                                                  └─────────────────────────────────┘
```

### 3.2. Hai Luồng Dữ Liệu Chính

**Luồng 1: Thu thập dữ liệu cảm biến**
```
Hardware → MQTT (publish) → Backend (subscribe) → Database → Frontend
```

**Luồng 2: Điều khiển thiết bị (CÓ CONFIRM)**
```
User → Frontend → Backend → MQTT → Hardware → [BẬT THIẾT BỊ]
                                        ↓
User ← Frontend ← Backend ← MQTT ← Hardware (phản hồi "ĐÃ BẬT")
```

> ⚠️ **QUAN TRỌNG:** Luồng điều khiển PHẢI có bước CONFIRM từ hardware quay lại. Nút PHẢI có trạng thái LOADING.

### 3.3. Giao Thức MQTT

| Đặc điểm | Chi tiết |
|----------|----------|
| **Giao thức** | TCP-based, Publish/Subscribe |
| **Thư viện** | Mosquitto |
| **Ưu điểm** | Tiết kiệm năng lượng, gói tin nhẹ (KB) |
| **So với HTTP** | Nhẹ hơn nhiều, phù hợp IoT |

**Cấu trúc Topic:**
- `data_sensor` - Gửi dữ liệu cảm biến
- `device_control` - Điều khiển thiết bị

**Cấu trúc Message (JSON):**
```json
{
  "room_id": "401",
  "device_id": 1,
  "action": "ON",
  "temp": 28,
  "humidity": 80,
  "light": 1000
}
```

---

## 4. DANH SÁCH LINH KIỆN CẦN MUA

### 4.1. Linh Kiện Bắt Buộc

| # | Linh kiện | Số lượng | Giá ước tính | Trạng thái |
|---|-----------|----------|--------------|------------|
| 1 | NodeMCU ESP8266 (hoặc ESP32) | 1 | 30-60k | ✅ Đã mua |
| 2 | Cảm biến DHT11/DHT22 (Nhiệt độ + Độ ẩm) | 1 | 20k | ✅ Đã mua |
| 3 | Cảm biến ánh sáng LDR (Quang trở) | 1 | 2k | ✅ Đã mua |
| 4 | Đèn LED (5 màu) | 5+ | 500đ/cái | ✅ Đã mua (50 con) |
| 5 | Điện trở 220Ω (cho LED) | 5+ | Rẻ | ✅ Đã mua |
| 6 | Điện trở 10kΩ (cho LDR) | 2+ | Rẻ | ✅ Đã mua |
| 7 | Breadboard MB-102 | 1 | 20k | ✅ Đã mua |
| 8 | Dây jumper/dupont | 1 bộ | 15k | ✅ Đã mua |

### 4.2. Linh Kiện Khuyến Nghị (Cho Live Code Bài 4)

| # | Linh kiện | Mục đích | Trạng thái |
|---|-----------|----------|------------|
| 1 | Cảm biến PIR (chuyển động) | Thêm cảm biến mới | ❓ Chưa rõ |
| 2 | Cảm biến MQ-2 (khí gas) | Thêm cảm biến mới | ❓ Chưa rõ |
| 3 | Buzzer | Thêm thiết bị điều khiển | ❓ Chưa rõ |
| 4 | Relay 1 kênh | Mô phỏng bật/tắt tải | ❓ Chưa rõ |

### 4.3. Cần Kiểm Tra

| # | Item | Trạng thái |
|---|------|------------|
| 1 | Cáp USB (Micro-USB hoặc Type-C cho NodeMCU) | ⚠️ Cần xác nhận |
| 2 | Nguồn cấp (USB laptop hoặc power bank) | ⚠️ Cần xác nhận |

---

## 5. CHI TIẾT 4 BÀI THỰC HÀNH

### 5.1. BÀI 1: THIẾT KẾ TÀI LIỆU

| Thông tin | Chi tiết |
|-----------|----------|
| **Thời gian** | 2 tuần |
| **Output** | File SRS (PDF/Word) + Link Figma |
| **Cần hardware** | ❌ Không |

#### 5.1.1. Thiết Kế Giao Diện (Figma) - 4 Màn Hình

**Màn 1: Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER / NAVIGATION                                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │ NHIỆT ĐỘ│  │  ĐỘ ẨM  │  │ÁNH SÁNG │  ← 3 Card cảm biến   │
│  │  28°C   │  │   80%   │  │ 1000lux │                      │
│  └─────────┘  └─────────┘  └─────────┘                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           BIỂU ĐỒ THỜI GIAN THỰC                    │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │   ĐÈN   │  │  QUẠT   │  │ ĐIỀU HÒA│  ← 3 Nút điều khiển  │
│  │ ON/OFF  │  │ ON/OFF  │  │  ON/OFF │                      │
│  └─────────┘  └─────────┘  └─────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

**Yêu cầu Dashboard:**
- [ ] 3 Card cảm biến (màu khác nhau: Đỏ/Xanh/Vàng)
- [ ] 1 Biểu đồ realtime (3 đường màu tương ứng)
- [ ] 3 Card điều khiển thiết bị
- [ ] **⚠️ Mỗi thiết bị có 3 trạng thái: OFF / LOADING / ON**
- [ ] Hiệu ứng visual (đèn sáng, quạt quay, điều hòa gió)

**Màn 2: Data Sensor**
- [ ] Bảng dữ liệu (ID, Giá trị, Thời gian)
- [ ] Ô tìm kiếm
- [ ] Lọc theo thời gian (Date picker)
- [ ] Lọc theo loại cảm biến (Dropdown)
- [ ] Sắp xếp (Sort)
- [ ] **Phân trang (BẮT BUỘC)**

**Màn 3: Action History**
- [ ] Bảng lịch sử (ID, Thiết bị, Action, Status, Thời gian)
- [ ] Phân biệt Action vs Status
- [ ] Lọc theo thời gian
- [ ] Lọc theo thiết bị
- [ ] **Phân trang (BẮT BUỘC)**

**Màn 4: Profile**
- [ ] Ảnh đại diện **CHUYÊN NGHIỆP** (không selfie)
- [ ] Họ tên, Lớp, MSSV
- [ ] Link báo cáo PDF
- [ ] Link API Documentation
- [ ] Link Git Repository (PHẢI MỚI)

#### 5.1.2. Sequence Diagram - 2 Luồng

**Luồng 1: Thu thập dữ liệu cảm biến**
```
Hardware → MQTT (topic: data_sensor) → Backend → Database (INSERT) → Frontend
```

**Luồng 2: Điều khiển thiết bị**
```
User → Frontend → Backend → Database (status=WAITING) 
                     ↓
                   MQTT → Hardware → [BẬT THIẾT BỊ]
                     ↓
                   MQTT ← Hardware (phản hồi)
                     ↓
                 Backend → Database (status=ON) → Frontend → User
```

#### 5.1.3. Thiết Kế Database - 4 Bảng

```sql
-- Bảng 1: sensors
CREATE TABLE sensors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),  -- "Nhiệt độ", "Độ ẩm", "Ánh sáng"
    unit VARCHAR(20),  -- "°C", "%", "lux"
    created_at DATETIME
);

-- Bảng 2: data_sensor
CREATE TABLE data_sensor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sensor_id INT,
    value FLOAT,
    timestamp DATETIME,
    FOREIGN KEY (sensor_id) REFERENCES sensors(id)
);

-- Bảng 3: devices
CREATE TABLE devices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),  -- "Đèn", "Quạt", "Điều hòa"
    type VARCHAR(30),
    created_at DATETIME
);

-- Bảng 4: action_history
CREATE TABLE action_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    device_id INT,
    action VARCHAR(10),   -- "ON" hoặc "OFF"
    status VARCHAR(20),   -- "WAITING", "ON", "OFF"
    timestamp DATETIME,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);
```

> **Lưu ý:** `action` ≠ `status`. Action là hành động yêu cầu, Status là trạng thái thực tế.

---

### 5.2. BÀI 2: LẬP TRÌNH HARDWARE

| Thông tin | Chi tiết |
|-----------|----------|
| **Thời gian** | 1 tuần |
| **Output** | Code Arduino chạy được |
| **Cần hardware** | ✅ CẦN |

**Yêu cầu:**
- [ ] Đọc dữ liệu cảm biến DHT11 (nhiệt độ + độ ẩm)
- [ ] Đọc dữ liệu cảm biến LDR (ánh sáng)
- [ ] Hiển thị trên Serial Monitor (Ctrl+M)
- [ ] Bật/tắt 3 đèn LED theo lệnh
- [ ] Kết nối WiFi

**Công cụ:** Arduino IDE, thư viện ESP8266WiFi, DHT, PubSubClient

---

### 5.3. BÀI 3: MÔ PHỎNG MQTT

| Thông tin | Chi tiết |
|-----------|----------|
| **Thời gian** | 1 tuần |
| **Output** | Demo MQTT hoạt động |
| **Cần hardware** | ✅ CẦN (từ bài 2) |

#### Phần 1: Test bằng Terminal

**Terminal 1 - Publish (Giả lập Hardware):**
```bash
mosquitto_pub -h localhost -t "data_sensor" \
  -m '{"temp":28,"humidity":80,"light":1000}' \
  -u "NguyenVanA" -P "matkhau123" -p 1884
```

**Terminal 2 - Subscribe (Giả lập Backend):**
```bash
mosquitto_sub -h localhost -t "data_sensor" \
  -u "NguyenVanA" -P "matkhau123" -p 1884
```

#### Phần 2: Kết hợp Hardware thật

- Hardware publish dữ liệu cảm biến → Terminal subscribe nhận
- Terminal publish lệnh điều khiển → Hardware bật/tắt LED

**Yêu cầu cấu hình:**
- [ ] Port ≠ 1883 (đổi thành port khác)
- [ ] Username = Họ tên đầy đủ
- [ ] Password = Tự đặt
- [ ] Gửi dữ liệu mỗi 2 giây

---

### 5.4. BÀI 4: FULL HỆ THỐNG + VẤN ĐÁP

| Thông tin | Chi tiết |
|-----------|----------|
| **Thời gian** | 2 tuần |
| **Output** | Hệ thống hoàn chỉnh + Báo cáo + Vấn đáp |
| **Cần hardware** | ✅ CẦN |

#### Yêu cầu Hệ Thống

| Tính năng | Yêu cầu chi tiết |
|-----------|------------------|
| **Biểu đồ realtime** | Cập nhật mỗi 2 giây |
| **Che cảm biến** | Giá trị giảm (không tăng ngược) |
| **Bật/tắt thiết bị** | Có LOADING, LED thật sáng/tắt |
| **Mất kết nối** | Loading xoay → Thông báo lỗi sau 10s |
| **Reload web** | Giữ nguyên trạng thái (không reset OFF) |
| **Tìm kiếm** | Theo giờ/phút/giây, theo loại |
| **Phân trang** | Xử lý ở Backend |

#### Đề Bài Live Code (Làm Trực Tiếp)

Thầy sẽ yêu cầu 1-2 trong các đề sau:
1. Thêm 2 loại cảm biến mới
2. Thêm 2 thiết bị điều khiển mới
3. Cảnh báo khi cảm biến vượt ngưỡng
4. Thay đổi giao diện theo yêu cầu
5. Đếm số lần bật/tắt thiết bị

#### Câu Hỏi Vấn Đáp (3 Loại)

| Loại | Ví dụ câu hỏi |
|------|---------------|
| **Luồng** | "Dữ liệu này xuất hiện ở đâu? Đi qua những bước nào?" |
| **Function/API** | "Code xử lý tìm kiếm ở file nào, dòng nào?" |
| **SQL** | "Viết query thống kê số lần cảnh báo trong tháng" |

#### Chuẩn Bị Bảo Vệ

- [ ] Link Figma (mở được, thao tác được)
- [ ] Link Git (lịch sử commit rõ ràng)
- [ ] Link Postman/Swagger (API docs)
- [ ] Báo cáo PDF (theo format SRS)
- [ ] **Căn cước công dân**
- [ ] Hardware hoạt động, cắm sẵn

---

## 6. TIẾN ĐỘ HIỆN TẠI

### 6.1. Tổng Quan

| Bài | Trạng thái | Ghi chú |
|-----|------------|---------|
| Bài 1 | 🔄 Đang làm | Đang thiết kế Figma |
| Bài 2 | ⏳ Chưa bắt đầu | Đợi hoàn thành bài 1 |
| Bài 3 | ⏳ Chưa bắt đầu | Đợi hoàn thành bài 2 |
| Bài 4 | ⏳ Chưa bắt đầu | Đợi hoàn thành bài 3 |

### 6.2. Chi Tiết Bài 1

**Giao diện Figma:**

| Màn hình | Trạng thái | Thiếu gì |
|----------|------------|----------|
| Dashboard | 🔄 Đang làm | Cần thêm trạng thái LOADING cho nút |
| Data Sensor | ⏳ Chưa làm | Toàn bộ |
| Action History | ⏳ Chưa làm | Toàn bộ |
| Profile | ⏳ Chưa làm | Toàn bộ |

**Các vấn đề cần sửa ở Dashboard:**
- [ ] Thêm trạng thái LOADING (spinner) cho 3 nút điều khiển
- [ ] Thêm trạng thái ON với hiệu ứng (glow, sáng)
- [ ] Kiểm tra biểu đồ có đủ 3 đường màu chưa
- [ ] Đảm bảo màu sắc đồng nhất (Card → Chart)

### 6.3. Linh Kiện

| Hạng mục | Trạng thái |
|----------|------------|
| Linh kiện bắt buộc | ✅ Đã đặt mua |
| Cáp USB | ⚠️ Cần xác nhận có sẵn |
| Linh kiện bổ sung (live code) | ❓ Chưa mua |

---

## 7. VIỆC CẦN LÀM TIẾP THEO

### 7.1. Ưu Tiên Cao (Tuần Này)

```
□ Hoàn thiện Dashboard
  ├── □ Thêm 3 trạng thái cho mỗi nút (OFF/LOADING/ON)
  ├── □ Thêm hiệu ứng ON (glow, animation)
  └── □ Kiểm tra biểu đồ đủ 3 đường

□ Thiết kế màn Data Sensor
  ├── □ Bảng dữ liệu
  ├── □ Ô tìm kiếm + Bộ lọc
  └── □ Phân trang

□ Thiết kế màn Action History
  ├── □ Bảng lịch sử
  ├── □ Phân biệt Action vs Status
  └── □ Phân trang

□ Thiết kế màn Profile
  ├── □ Chuẩn bị ảnh chuyên nghiệp
  └── □ Layout thông tin + links
```

### 7.2. Ưu Tiên Trung Bình (Tuần Sau)

```
□ Vẽ Sequence Diagram
  ├── □ Luồng thu thập cảm biến
  └── □ Luồng điều khiển thiết bị (có CONFIRM)

□ Thiết kế Database
  ├── □ Sơ đồ ERD
  └── □ Chi tiết 4 bảng

□ Viết báo cáo SRS
  └── □ Tổng hợp tất cả vào file PDF
```

### 7.3. Chuẩn Bị Cho Bài 2

```
□ Kiểm tra linh kiện đã về đủ
□ Cài đặt Arduino IDE
□ Test kết nối ESP8266 với máy tính
□ Cài đặt Mosquitto MQTT Broker
```

---

## 8. TÀI LIỆU THAM KHẢO

### 8.1. Công Cụ

| Công cụ | Link | Mục đích |
|---------|------|----------|
| Figma | figma.com | Thiết kế giao diện |
| Draw.io | draw.io | Vẽ Sequence Diagram |
| dbdiagram.io | dbdiagram.io | Thiết kế Database |
| Arduino IDE | arduino.cc | Lập trình ESP8266 |
| Mosquitto | mosquitto.org | MQTT Broker |
| Postman | postman.com | API Documentation |

### 8.2. Plugin Figma Hữu Ích

- **Iconify** - Thư viện icon
- **Chart** - Tạo biểu đồ
- **Unsplash** - Ảnh stock
- **Wireframe** - UI Kit

### 8.3. Bảng Màu Gradient Đẹp

| Tên | Gradient | Dùng cho |
|-----|----------|----------|
| Sunset | `#FF6B6B → #FF8E53 → #FED330` | Nhiệt độ |
| Purple Dream | `#667EEA → #764BA2` | Độ ẩm |
| Emerald | `#11998E → #38EF7D` | Ánh sáng |
| Golden Hour | `#FCD34D → #F59E0B` | Đèn (ON) |
| Ocean Blue | `#06B6D4 → #3B82F6` | Quạt (ON) |
| Cool Mint | `#14B8A6 → #6EE7B7` | Điều hòa (ON) |

---

## 9. LIÊN HỆ & HỖ TRỢ

- **Lớp trưởng:** Tạo group liên lạc với thầy
- **Nộp bài:** Qua lớp trưởng → Lớp trưởng gửi thầy

---

> **Ghi chú:** File này sẽ được cập nhật liên tục trong quá trình học.
> 
> **Lần cập nhật tiếp theo:** Sau khi hoàn thành Bài 1.
