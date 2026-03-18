# 🚀 Hướng Dẫn Chạy Project 4 — Từng Bước

## Bước 1: MySQL — Tạo Database

### 1.1 Mở MySQL (CMD hoặc MySQL Workbench)

```bash
# Mở CMD, gõ lệnh (nếu MySQL đã thêm vào PATH):
mysql -u root -p
```

### 1.2 Chạy file schema.sql

```sql
-- Copy toàn bộ nội dung file backend/database/schema.sql vào MySQL và chạy
-- HOẶC dùng lệnh:
SOURCE F:/uni/2025-2026/HK2/IOT/Project 4/backend/database/schema.sql;
```

### 1.3 Kiểm tra

```sql
USE iot_smart_home;

SHOW TABLES;
-- Phải thấy: sensors, sensor_data, devices, action_history

SELECT * FROM sensors;
-- Phải thấy 3 dòng: dht_temp, dht_hum, light

SELECT * FROM devices;
-- Phải thấy 3 dòng: led_01, fan_01, ac_01
```

### 1.4 Sửa mật khẩu MySQL trong `.env`

Mở file `backend/.env`, sửa `DB_PASSWORD` thành mật khẩu MySQL root của bạn:

```
DB_PASSWORD=your_mysql_password
```

---

## Bước 2: Mosquitto — Cấu Hình MQTT Broker

### 2.1 Tìm file cấu hình

File `mosquitto.conf` thường ở:
- Windows: `C:\Program Files\mosquitto\mosquitto.conf`

### 2.2 Sửa cấu hình

Mở file `mosquitto.conf` bằng Notepad (Run as Admin), thêm/sửa:

```conf
# Port khác 1883 (yêu cầu bắt buộc)
listener 1884

# Bắt buộc đăng nhập
allow_anonymous false

# File chứa password
password_file C:\Program Files\mosquitto\pwfile.txt
```

### 2.3 Tạo user/password

Mở CMD (Run as Admin):

```bash
cd "C:\Program Files\mosquitto"

# Tạo user (Tên đầy đủ — yêu cầu bắt buộc)
mosquitto_passwd -c pwfile.txt NgoDucAnhTuan
# Nhập password: 123456 (confirm lại)
```

> ⚠️ Lưu ý: `-c` chỉ dùng lần đầu (create file). Lần sau thêm user khác dùng `-b`.

### 2.4 Khởi động Mosquitto

```bash
# Chạy với cấu hình mới
mosquitto -c "C:\Program Files\mosquitto\mosquitto.conf" -v
```

> `-v` để hiện log, dễ debug.
> Nếu thấy `Opening ipv4 listen socket on port 1884` → thành công!

### 2.5 Test kết nối (mở CMD mới)

```bash
# Terminal 1: Subscribe
mosquitto_sub -h localhost -p 1884 -u NgoDucAnhTuan -P 123456 -t "test"

# Terminal 2: Publish
mosquitto_pub -h localhost -p 1884 -u NgoDucAnhTuan -P 123456 -t "test" -m "hello"
```

Nếu Terminal 1 hiện `hello` → MQTT OK!

---

## Bước 3: Chạy Backend

```bash
cd "F:\uni\2025-2026\HK2\IOT\Project 4\backend"
npm run dev
```

Output thành công:
```
╔══════════════════════════════════════════╗
║   🏠 IoT Smart Home Backend Server      ║
╠══════════════════════════════════════════╣
║   HTTP:      http://localhost:3001       ║
║   WebSocket: ws://localhost:3001         ║
║   MQTT:      localhost:1884              ║
╚══════════════════════════════════════════╝
✅ MySQL connected successfully
✅ MQTT connected to mqtt://localhost:1884
📡 Subscribed to: data_sensor
📡 Subscribed to: device/ack
```

### Test nhanh:

```bash
# Mở trình duyệt hoặc curl:
curl http://localhost:3001/api/sensors
# Phải trả về: [{"id":"dht_temp",...}, {"id":"dht_hum",...}, {"id":"light",...}]

curl http://localhost:3001/api/devices
# Phải trả về: [{"id":"led_01","device_state":"OFF",...}, ...]
```

---

## Bước 4: Chạy Frontend

```bash
cd "F:\uni\2025-2026\HK2\IOT\Project 4\smart-home-hub-main\smart-home-hub-main"
npm run dev
```

Mở trình duyệt: `http://localhost:5173`

---

## Bước 5: Nạp Code ESP8266

1. Mở Arduino IDE
2. Mở file: `F:\uni\2025-2026\HK2\IOT\Project 4\hardware\smart_home.ino`
3. Kiểm tra lại WiFi SSID/PASS và MQTT_HOST (IP laptop)
4. Board: NodeMCU 1.0 (ESP-12E Module)
5. Port: COM port phù hợp
6. Upload!

### ⚠️ Lưu ý quan trọng về IP:
- `MQTT_HOST` trong code Arduino phải là **IP laptop trong mạng WiFi**
- Kiểm tra: Mở CMD → `ipconfig` → lấy IPv4 của WiFi adapter
- Nếu dùng hotspot điện thoại: thường là `172.20.10.x`

---

## Bước 6: Test End-to-End

### Thứ tự chạy:
1. ✅ MySQL đang chạy
2. ✅ Mosquitto đang chạy (port 1884)
3. ✅ Backend Node.js đang chạy
4. ✅ Frontend Vite đang chạy
5. ✅ ESP8266 đã nạp code và bật nguồn

### Kiểm tra:
- Dashboard: 3 ô cảm biến hiện giá trị thật (cập nhật 2s)
- Biểu đồ: 3 đường di chuyển realtime
- Click Toggle Đèn: OFF → WAITING(spinner) → ON (LED1 sáng)
- F5 reload: trạng thái giữ nguyên
- Data Sensor: bảng hiện dữ liệu phân trang
- Action History: bảng hiện lịch sử bật/tắt

---

## So Sánh Code P3 vs P4

| Thay đổi | P3 | P4 |
|----------|----|----|
| Subscribe topic | `device_control` | `device/cmd` |
| ACK topic | `device_status` | `device/ack` |
| Device IDs | `1, 2, 3` (int) | `"led_01", "fan_01", "ac_01"` (string) |
| ACK format | `{device_id:1, status:"ON"}` | `{requestId:"uuid", result:"SUCCESS"}` |
| Sensor payload | Có `room_id`, `timestamp` | Chỉ `{temp, humidity, light}` |
| MQTT password | `123456` | `123456` (giữ nguyên) |
