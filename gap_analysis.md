# 🔍 Gap Analysis — Implementation Plan vs Requirements

## Phương pháp
Đối chiếu **từng yêu cầu** trong 2 file (REQUIREMENTS.md + TongHopYeuCau) với Implementation Plan hiện tại.

---

## ✅ YÊU CẦU ĐÃ COVER ĐẦY ĐỦ

### Dashboard
| Yêu cầu | Plan | ✅ |
|----------|------|----|
| 3 Card cảm biến (đỏ/xanh/vàng) | FE đã có `SensorCard` | ✅ |
| Biểu đồ realtime mỗi 2s, 3 đường màu | WebSocket + RealtimeChart | ✅ |
| 3 Card điều khiển (Đèn/Quạt/Điều hòa) | FE đã có `DeviceCard` | ✅ |
| 3 trạng thái: OFF → LOADING → ON | [useDeviceControl](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/hooks/useDeviceControl.ts#38-166) đã có | ✅ |
| Hiệu ứng ON (glow, quạt quay, gió) | FE đã có trong DeviceCard | ✅ |
| Trạng thái FAILED + nút "Thử lại" | Plan SD-02 Case 2 | ✅ |
| Notification Panel | FE đã có `NotificationPanel` | ✅ |

### Data Sensor
| Yêu cầu | Plan | ✅ |
|----------|------|----|
| Bảng: ID, Loại cảm biến, Giá trị, Thời gian | `GET /api/sensor-data` | ✅ |
| Lọc theo loại cảm biến (Dropdown) | `sensor_id` param + `GET /api/sensors` | ✅ |
| Lọc theo khoảng thời gian (DatePicker) | `from` + [to](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/pages/ActionHistory.tsx#13-97) params | ✅ |
| Sắp xếp theo thời gian | `sort` param | ✅ |
| Phân trang backend | `page` + `pageSize` params | ✅ |
| Hiển thị tổng bản ghi + số trang | Response: `total`, `totalPages` | ✅ |

### Action History
| Yêu cầu | Plan | ✅ |
|----------|------|----|
| Bảng: ID, Thiết bị, Action, Status, Thời gian | `GET /api/action-history` | ✅ |
| Phân biệt Action vs Status | DB design: `action` ≠ `status` | ✅ |
| Lọc theo thiết bị (Dropdown) | `device_id` param + `GET /api/devices` | ✅ |
| Lọc theo trạng thái | `status` param: WAITING/SUCCESS/FAILED/TIMEOUT | ✅ |
| Lọc theo khoảng thời gian | `from` + [to](file:///f:/uni/2025-2026/HK2/IOT/Project%204/smart-home-hub-main/smart-home-hub-main/src/pages/ActionHistory.tsx#13-97) params | ✅ |
| Phân trang backend | `page` + `pageSize` params | ✅ |
| Nút Refresh | FE đã có (auto-refresh 30s) | ✅ |

### Profile
| Yêu cầu | Plan | ✅ |
|----------|------|----|
| Ảnh đại diện CHUYÊN NGHIỆP | FE đã có Avatar component | ✅ |
| Họ tên, Lớp, MSSV | FE đã có | ✅ |
| Link báo cáo PDF | FE đã có, cần cập nhật URL thật | ✅ |
| Link API Documentation | FE đã có, cần Postman/Swagger | ✅ |
| Link Git Repository (MỚI) | FE đã có, cần tạo repo mới | ✅ |
| Tech Stack | FE đã có | ✅ |

### MQTT
| Yêu cầu | Plan | ✅ |
|----------|------|----|
| Port ≠ 1883 | 1884 | ✅ |
| Username = Họ tên đầy đủ | NgoDucAnhTuan | ✅ |
| Password tự đặt | ✅ | ✅ |
| Dữ liệu mỗi 2 giây | Hardware code | ✅ |
| 3 Topics (sensor, cmd, ack) | Plan có đủ | ✅ |

### Database
| Yêu cầu | Plan | ✅ |
|----------|------|----|
| 4 bảng: sensors, sensor_data, devices, action_history | ✅ Đúng SRS | ✅ |
| sensors: VARCHAR(50) PK + topic | ✅ | ✅ |
| devices: VARCHAR(50) PK + device_state + topic | ✅ | ✅ |
| action_history: request_id UUID | ✅ | ✅ |
| Composite indexes | ✅ | ✅ |

### Non-Functional
| Yêu cầu | Plan | ✅ |
|----------|------|----|
| Realtime mỗi 2s | WebSocket | ✅ |
| Tối đa 20 điểm biểu đồ | FE `MAX_DATA_POINTS = 20` | ✅ |
| Phân trang backend (không load hết) | API design | ✅ |
| Page size mặc định 10 | FE đã có | ✅ |
| Timeout 10s | Plan SD-02 Case 3 | ✅ |
| Giữ trạng thái khi reload | `devices.device_state` + `GET /api/devices` | ✅ |
| Không commit credential (.env) | Backend `.env` | ✅ |

---

## ⚠️ CÁC GAP — CẦN BỔ SUNG VÀO PLAN

### GAP 1: 🔍 Tìm kiếm theo chuỗi giờ (HH:mm:ss)
- **Nguồn**: REQUIREMENTS.md dòng 120, 250, 377; SRS FR-SENS-04, FR-ACT-02
- **Yêu cầu**: Ô search theo **giờ/phút/giây**, tìm kiếm nhanh theo chuỗi thời gian (VD: `10:30`)
- **Plan hiện tại**: API có `from/to` (DatePicker) nhưng **chưa rõ search theo TIME string**
- **Cần thêm**: Param `search` cho `/api/sensor-data` — hỗ trợ search theo chuỗi giờ + theo giá trị

### GAP 2: 📊 Sort theo giá trị (Value) cho Data Sensor
- **Nguồn**: REQUIREMENTS.md dòng 121 "Sort tăng/giảm dần"; SRS FR-SENS-06 chỉ ghi "Mới nhất/Cũ nhất"
- **Yêu cầu gốc (TongHop)**: Sort tăng/giảm dần (có thể sort nhiều cột)
- **Plan hiện tại**: Chỉ có `sort` param chung
- **Cần cụ thể hóa**: `sortBy=created_at|value` + `sortOrder=asc|desc`

### GAP 3: ⏱️ Quick Range (5 phút / 1 giờ / 24 giờ)
- **Nguồn**: SRS FR-SENS-05 (Priority: Medium)
- **Plan hiện tại**: Chỉ có `from/to` DatePicker
- **Cần thêm**: FE preset buttons — click → tự tính `from/to` rồi gọi cùng API (FE-only logic)
- **Kết luận**: **Không cần đổi API**, chỉ cần FE component — FE đã có sẵn chưa? → Cần kiểm tra

### GAP 4: 📈 API lấy dữ liệu biểu đồ (Chart History)
- **Nguồn**: TongHop dòng 246 "Cập nhật mỗi 2 giây", dòng 109 "biểu đồ 3 đường"
- **Plan hiện tại**: Chỉ có `/api/sensors/latest` (1 điểm mới nhất) + WebSocket cho realtime
- **Vấn đề**: Khi load trang lần đầu, biểu đồ cần **20 điểm gần nhất** → cần 1 API riêng
- **Cần thêm**: `GET /api/sensors/chart?limit=20` — lấy N điểm dữ liệu gần nhất

### GAP 5: 🔎 Tìm kiếm sensor data theo ID hoặc giá trị
- **Nguồn**: SRS FR-SENS-02 "Tìm kiếm theo ID hoặc giá trị"
- **Plan hiện tại**: `/api/sensor-data` chỉ có `sensor_id` filter, không có `search` param
- **Cần thêm**: Param `search` cho `/api/sensor-data` — tìm theo ID record hoặc value

### GAP 6: ⚠️ Cảnh báo khi cảm biến vượt ngưỡng
- **Nguồn**: SRS FR-DASH-07 (Priority: Medium); TongHop dòng 262 (Live code đề 3)
- **Plan hiện tại**: Không đề cập
- **Cần thêm**: Logic kiểm tra ngưỡng trong Backend khi nhận sensor data → Push thông báo qua WebSocket
- **Lưu ý**: Priority Medium, có thể triển khai đơn giản (hardcode ngưỡng)

### GAP 7: 🎯 Chuẩn bị cho Live Code
- **Nguồn**: TongHop mục 7.2 — 5 đề live code
- **Plan hiện tại**: Chưa đề cập cách chuẩn bị
- **Cần xem xét**: Code modular để dễ thêm sensor/device mới khi live code

---

## 📝 TÓM TẮT

| Metric | Con số |
|--------|--------|
| **Tổng yêu cầu đã đối chiếu** | ~50 |
| **Đã cover đầy đủ** | 43 ✅ |
| **Gaps cần bổ sung** | 7 ⚠️ |
| **Gaps nghiêm trọng (High)** | 3 (GAP 1, 4, 5) |
| **Gaps trung bình (Medium)** | 3 (GAP 2, 3, 6) |
| **Gaps thấp (preparation)** | 1 (GAP 7) |

> [!TIP]
> Plan hiện tại cover ~86% yêu cầu. 7 gaps còn lại đều nhỏ và dễ bổ sung — chủ yếu là thêm params cho API và logic FE.
