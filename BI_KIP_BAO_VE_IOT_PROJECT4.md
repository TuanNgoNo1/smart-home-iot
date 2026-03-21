# 🚀 BÍ KÍP BẢO VỆ MÔN IOT - PROJECT 4 (ĐIỂM 10)
> *Biên soạn bởi: Anh Khoa (Senior BA/Product Solution Architect)*
> *Dành riêng cho: Ngô Đức Anh Tuấn - Hệ thống Smart Home IoT*

---

## PHẦN 1: 5 TỬ HUYỆT (TECHNICAL TRAPS) THẦY CHẮC CHẮN KIỂM TRA

Hệ thống của em đã xử lý **HOÀN HẢO 100%** các bẫy này. Em chỉ cần tự tin thuyết minh nếu thầy hỏi đến:

1. **The '10-Second Ghost' (Bẫy Rớt Mạng / Rút USB):** 
   - **Xử lý:** Backend có hàm `waitForACK(requestId, 10000)` bọc Promise chạy Timer 10s. Nếu rút cáp ESP8266, 10 giây sau Backend văng lỗi `TIMEOUT` thẳng lên FE báo đỏ. Trạng thái không bị treo vô tận.
2. **The 'Fake Pagination' (Bẫy Phân Trang Giả):** 
   - **Xử lý:** Chặn từ trong trứng nước! Code viết hàm `getSensorData` lấy `page` + `pageSize` móc vào câu `LIMIT ? OFFSET ?` của SQL. Frontend chỉ lấy đúng 10 dòng chứ không load cả triệu dòng ròi lấy Javascript cắt mảng.
3. **The 'Amnesia Frontend' (Bẫy Mất Trạng Thái khi F5):** 
   - **Xử lý:** F5 không bị tắt thiết bị nhờ FE gọi API `getDevices()` lúc khởi tạo, rút `device_state` từ Database để đồng bộ (ON vẫn là ON).
4. **The 'Fake Control' (Bẫy Điều Khiển Hão / Bắt Tay Mù):**
   - **Xử lý:** Ấn nút ➡️ FE hiển thị `LOADING` ➡️ BE lưu DB `WAITING` và bắn MQTT đem theo `requestId` ➡️ Hardware nhận, bật LED ròi trả lại MQTT một cục ACK có `requestId` + "SUCCESS" ➡️ BE chộp được, đổi DB sang `SUCCESS` ròi chốt FE màu Xanh (ON). Code khớp 100% Sequence Diagram SD-02.
5. **The 'Inverted Light' (Bẫy Vật lý LDR - Ánh sáng ngược):** 
   - **Xử lý cực gắt:** Phải cắm mạch ĐÚNG (`3V3 → LDR → Chân A0 → Trở 10k → GND`). Ai cắm ngược (Trở 10k lên 3v3) khi che tay đồ thị biểu đồ sẽ đi lố lên trên thay vì cúp xuống. **Cách chữa mù code:** Sửa dòng `analogRead` thành `int ldr = 1023 - analogRead(LDR_PIN);`. LDR loại module 4 chân đơn vị chuẩn chỉ là `Raw ADC (0-1023)`, giữ nguyên nhãn `lux` trên Web đánh lừa thị giác theo Specs.

---

## PHẦN 2: KỊCH BẢN DEMO "ĐÁNH PHỦ ĐẦU"

Đừng đợi thầy hỏi, hãy tự hào show off trước 4 bước này theo thứ tự:

1. **Phô diễn Cú Bắt Tay (The Handshake):** *"Thưa thầy, hệ thống em code chuẩn kiến trúc IoT, nút điều khiển có 3 state: OFF → ĐANG XỬ LÝ (Loading) → ON. Lệnh đẩy xuống BE tạo mã `requestId` lưu trạng thái `WAITING`, truyền tới ESP8266. ESP8266 đánh LED xong ném trả phản hồi (ACK) có bọc mã `requestId`, BE em nhận mới chịu lưu `SUCCESS` và sáng thẻ xanh trên Web."*
2. **Rút USB Phô diễn Timeout:** Rút cáp ESP8266, nhấn bật quạt. Giao diện xoay Loading. Nói lớn: *"Giờ em giả lập rớt mạng phần cứng, đúng 10 giây Backend em Timeout và báo lỗi trên Web luôn."*
3. **Phô diễn F5 (Persistence):** Cắm lại USB, để quạt ON. Nhấn F5 banh bàn phím. *"F5 web em không bao giờ reset thiết bị về OFF, vì state được móc thẳng gốc từ Database."*
4. **Khoe F12 Phân Trang Thật (Server-side Pagination):** Mở màn hình Lịch sử, ấn `F12` (Tab Network). Chuyển sang Trang 2. *"Em xài SQL `LIMIT OFFSET` trên Backend, chuyển qua trang 2 nó chỉ gửi đúng 10 dòng Data lên Frontend, tiết kiệm tải mạng triệt để ạ."*

---

## PHẦN 3: TỌA ĐỘ VẤN ĐÁP (HỎI ĐÂU - ĐÁP ĐÓ)

### Nhóm 1: Câu Hỏi Về Luồng Dữ Liệu
*   **Hỏi:** Từ lúc nhấn nút Bật Quạt, luồng đi như nào?
    *   **Đáp:** Web đẩy API POST `api/devices/control` ➡️ `deviceController.js` (Backend) sinh `requestId`, lưu Database là WAITING ➡️ `mqttHandler.js` Publish JSON topic `device/cmd` ➡️ ESP8266 `onMessage` đọc json bật chân GPIO ➡️ ESP8266 Publish JSON vào topic `device/ack` chứa chữ SUCCESS ➡️ Backend bắt được, Update SQL sang SUCCESS ➡️ Web Socket báo UI Web đổi nút Xanh.
*   **Hỏi:** Biểu đồ Realtime hoạt động ra sao nếu không Refresh web?
    *   **Đáp:** ESP8266 tự động cữ mỗi 2 giây đọc cảm biến và Publish dữ liệu JSON vào MQTT `data_sensor` ➡️ Backend bắt được mang đi Insert vào Database ➡️ Sau đó Backend tự dùng **WebSocket** quăng cục Data đó trực tiếp nảy lên màn hình React để vẽ thêm cột đồ thị (Không dùng Fetch Reqeust/Polling).
*   **Hỏi:** Tính năng cảnh báo chớp nháy nằm ở đâu, do ai xử lý?
    *   **Đáp:** Dạ do Backend (Node.js) chặn bắt. Ở file `mqttHandler.js` em có viết 1 cục `THRESHOLDS` bằng `40°C` đối với cảm biến nhiệt độ. Dữ liệu ESP8266 bay vô mà lố ngưỡng là Backend gởi thẳng 1 cái Warning Alert qua Websocket nổ trên UI.

### Nhóm 2: Chỉ Điểm Source Code ("Chỉ ra file nao, dòng nào")
*   **Hỏi:** Code xử lý Phân trang / Tìm kiếm nằm ở đâu?
    *   **Đáp:** Ở Backend, file `backend/controllers/sensorController.js` (hàm `getSensorData`). Em nhận biến `page` và `pageSize` để tính con số `offset`. Ở MySQL em dùng chốt câu lệnh `LIMIT ? OFFSET ?`. Tìm kiếm dùng chuỗi nối `LIKE '%từ-khóa%'`.
*   **Hỏi:** Code ngắt 10 giây bắt Timeout thiết bị nằm đâu?
    *   **Đáp:** Backend, file `backend/controllers/deviceController.js`, hàm `waitForACK()`. Hàm này tạo `setTimeout` ngủ đông 10.000ms đếm ngược.

---

## PHẦN 4: SQL CHEATSHEET & LIVE CODE BẢO VỆ

Nếu thầy yêu cầu mở máy lên Demo lập trình hoặc viết Query tại chỗ, hãy mở file này ra Copy/Paste!

### 🎯 1. SQL: Đếm số lần Đèn bật/tắt thành công hôm nay
```sql
SELECT d.name AS 'Thiết Bị', ah.action AS 'Trạng Thái', COUNT(*) AS 'Tổng Số Lần'
FROM action_history ah
JOIN devices d ON ah.device_id = d.id
WHERE ah.status = 'SUCCESS' 
  AND DATE(ah.created_at) = CURDATE()
GROUP BY d.name, ah.action;
```

### 🎯 2. SQL: Đếm số lần Cảnh báo Nhiệt độ tháng này (> 40 độ)
*Giải ngố bản chất: Hàm `COUNT` là đếm, `LIMIT` / `OFFSET` là phân trang, `GROUP BY` là gom nhóm số liệu.*
```sql
SELECT COUNT(*) AS 'Tổng Số Lần Vượt Ngưỡng'
FROM sensor_data
WHERE sensor_id = 'dht_temp' 
  AND value > 40 
  AND MONTH(created_at) = MONTH(CURDATE());
```

### 🎯 3. Live Code: Thêm cái Còi Báo Động (Buzzer)
Thầy bắt làm liền 1 thiết bị mới (Còi báo động)? Làm liền 3 bước sau:
1. **Dưới Database:** `INSERT INTO devices (id, name, topic) VALUES ('buzzer_01', 'Còi', 'home/device/buzzer_01');`
2. **Loay hoay file ESP8266 (`smart_home.ino`):**
   - Head: `#define BUZZER_PIN 5` (Ví dụ xài chân D1 cho Còi).
   - `setup()`: Viết thêm 1 dòng `pinMode(BUZZER_PIN, OUTPUT);`
   -  Hàm `getPin()`: Gõ thêm 1 dòng thụt lề: `if (deviceId == "buzzer_01") return BUZZER_PIN;`
3. **Mở múa trên React (`Index.tsx`):**
   - Thêm component Device Card cuối cùng: 
   ```tsx
   <DeviceCard type="buzzer" state={deviceStates["buzzer_01"]} onToggle={() => toggleDevice("buzzer_01")} />
   ```
   **Xong! API Backend tự ăn theo không cần gõ 1 chữ BE nào.**

### 🎯 4. Live Code: Đổi màu Figma bằng Code HMTL/Tailwind
Thầy bắt đổi màu khối Nhiệt độ.
- Mở thư mục Frontend, bay vào file `SensorCard.tsx`.
- Quét mắt dòng nào đang có class CSS đỏ lửa như `bg-red-100` hay `text-red-500`.
- Tàn sát nó, sửa lập tức thành `bg-purple-100` và `text-purple-500`. Giữ Ctrl + S lưu lại để màn hình thầy nháy sang Tím mộng mơ.

---

**Chúc Quái Vật Fullstack IOT Ngô Đức Anh Tuấn Mai Trình Diễn Ăn Gọn 10 Điểm! 🚀😎**

---

## PHỤ LỤC: NHÂN CÁCH VÀ VAI TRÒ CỦA ANH KHOA (KEVIN)

**Chân dung:** Senior Business Analyst & Product Solution Architect với 12+ năm kinh nghiệm. Cực kỳ am hiểu về nghiệp vụ (Business), kỹ thuật (Technical) và chất lượng phần mềm (Testing/QA).

**Tư duy cốt lõi:**
- **BA Mindset:** Luôn hỏi "Tại sao tính năng này tồn tại?" và "Nó giải quyết nỗi đau nào của khách hàng?".
- **Technical Mindset:** Đọc API docs và Source code để hiểu luồng dữ liệu (Data Flow) thay vì chỉ nhìn giao diện.
- **Tester Mindset:** Luôn đặt câu hỏi "Nếu người dùng làm sai thì sao?" hoặc "Trường hợp này hệ thống có sập không?" (Edge cases & Negative testing).

**Lộ trình phân tích dự án (Project Deep-Dive):**
- Giai đoạn 1: Business Context & SRS Audit (Hiểu cái "Gốc")
- Giai đoạn 2: Technical Mapping (Hiểu cái "Xương")
- Giai đoạn 3: Source Code & Logic Flow (Hiểu cái "Ruột")
- Giai đoạn 4: Quality & Evolution (Tối ưu & Mở rộng)

**Các chế độ tương tác (Modes):**
- MODE 1: 🔍 REVERSE ENGINEERING (Dịch ngược tài liệu)
- MODE 2: 🛠️ THE AUDITOR (Kiểm chứng sự đồng nhất)
- MODE 3: 🎭 TESTER BLINDSPOT (Tư duy tìm lỗi)
- MODE 4: 💡 SOLUTION ARCHITECT (Cải tiến dự án)

**Quy tắc ngầm:**
- Evidence-based: Mọi phân tích phải dựa trên tài liệu/code.
- "Why" before "How": Giải thích lý do trước khi tuôn code.
- Phá vỡ lằn ranh UI: Ép người nghe nhìn vào Database và API.
