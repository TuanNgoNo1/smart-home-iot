**TỔNG HỢP YÊU CẦU MÔN HỌC**

**IoT (Internet of Things) - Ứng Dụng**

4 Bài Thực Hành \| Bảo Vệ Cá Nhân \| Điểm Duy Nhất

**1. TỔNG QUAN MÔN HỌC**

**1.1 Thông Tin Chung**

| **Tiêu chí**        | **Chi tiết**                                         |
|---------------------|------------------------------------------------------|
| Tên môn             | IoT (Internet of Things) - Ứng dụng                  |
| Hình thức thi       | Bài tập lớn + Vấn đáp cá nhân                        |
| Số bài thực hành    | 4 bài (làm tuần tự, bài sau phụ thuộc bài trước)     |
| Điểm số             | Chỉ 1 điểm duy nhất (không có chuyên cần, giữa kỳ)   |
| Thang điểm cao nhất | 10 điểm (bảo vệ sớm)                                 |
| Thang điểm thấp hơn | Lùi mỗi tuần = mất 1 điểm                            |
| Điểm trượt          | Lùi 4+ tuần hoặc không trả lời được câu hỏi = Điểm 4 |

**1.2 Lịch Trình Bảo Vệ Để Đạt A+ (10 Điểm)**

| **Bài**                    | **Thời gian mục tiêu** | **Vai trò sinh viên** |
|----------------------------|------------------------|-----------------------|
| Bài 1 - Thiết kế tài liệu  | 2 tuần                 | BA (Business Analyst) |
| Bài 2 - Lập trình hardware | 1 tuần                 | Hardware Developer    |
| Bài 3 - Mô phỏng MQTT      | 1 tuần                 | Integration Developer |
| Bài 4 - Full hệ thống      | 2 tuần                 | Full-stack Developer  |
| TỔNG CỘNG                  | 6 tuần                 | Đạt điểm 10 (A+)      |

**2. KIẾN TRÚC HỆ THỐNG IoT**

**2.1 Tổng Quan Kiến Trúc**

Hệ thống gồm 3 lớp chính kết nối với nhau:

- HARDWARE (ESP8266/ESP32): Đọc dữ liệu từ 3 cảm biến, điều khiển 3 đèn LED, kết nối WiFi

- MQTT BROKER (Mosquitto): Middleware trung gian, nhận và phân phát dữ liệu theo cơ chế Publish/Subscribe

- LAPTOP/SERVER: Chạy Frontend (Web), Backend (Node/PHP/Python), Database (MySQL)

**2.2 Hai Luồng Dữ Liệu Chính**

**Luồng 1: Thu thập dữ liệu cảm biến**

Hardware → MQTT (publish) → Backend (subscribe) → Database (INSERT) → Frontend hiển thị

**Luồng 2: Điều khiển thiết bị (BẮT BUỘC có CONFIRM)**

User → Frontend → Backend → Database (status=WAITING) → MQTT → Hardware → \[BẬT THIẾT BỊ\]

Hardware phản hồi → MQTT → Backend → Database (status=ON) → Frontend → User thấy kết quả

**⚠️ QUAN TRỌNG: Nút điều khiển PHẢI có 3 trạng thái: OFF → LOADING → ON. Không có Loading = trừ điểm nặng!**

**2.3 Cấu Hình MQTT**

| **Thông số**     | **Yêu cầu**                                               |
|------------------|-----------------------------------------------------------|
| Thư viện         | Mosquitto                                                 |
| Port             | KHÔNG được dùng 1883 (mặc định) - phải đổi sang port khác |
| Username         | Họ và tên đầy đủ của sinh viên (để nhận diện cá nhân)     |
| Password         | Tự đặt                                                    |
| Topic cảm biến   | data_sensor (ví dụ)                                       |
| Topic điều khiển | device_control (ví dụ)                                    |
| Tần suất gửi     | Mỗi 2 giây                                                |

**Cấu trúc JSON Message mẫu:**

{ \"room_id\": \"401\", \"device_id\": 1, \"action\": \"ON\", \"temp\": 28, \"humidity\": 80, \"light\": 1000 }

**3. DANH SÁCH LINH KIỆN CẦN MUA**

**3.1 Linh Kiện Bắt Buộc**

| **\#** | **Linh kiện**                           | **Số lượng** | **Giá ước tính** | **Trạng thái**     |
|--------|-----------------------------------------|--------------|------------------|--------------------|
| 1      | NodeMCU ESP8266 hoặc ESP32              | 1 con        | 30.000 - 60.000đ | ✅ Đã mua          |
| 2      | Cảm biến DHT11/DHT22 (Nhiệt độ + Độ ẩm) | 1 con        | \~20.000đ        | ✅ Đã mua          |
| 3      | Cảm biến ánh sáng LDR (Quang trở)       | 1 con        | \~2.000đ         | ✅ Đã mua          |
| 4      | Đèn LED (5 màu khác nhau)               | 5+ con       | \~500đ/con       | ✅ Đã mua (50 con) |
| 5      | Điện trở 220Ω (cho LED)                 | 5+ con       | Rẻ               | ✅ Đã mua          |
| 6      | Điện trở 10kΩ (cho LDR)                 | 2+ con       | Rẻ               | ✅ Đã mua          |
| 7      | Breadboard MB-102                       | 1 cái        | \~20.000đ        | ✅ Đã mua          |
| 8      | Dây jumper/dupont                       | 1 bộ         | \~15.000đ        | ✅ Đã mua          |

**3.2 Linh Kiện Khuyến Nghị (Cho Live Code Bài 4)**

| **Linh kiện**                   | **Mục đích**                         | **Trạng thái**  |
|---------------------------------|--------------------------------------|-----------------|
| Cảm biến PIR (chuyển động)      | Thêm loại cảm biến mới khi live code | ❓ Chưa rõ      |
| Cảm biến MQ-2 (khí gas)         | Thêm loại cảm biến mới khi live code | ❓ Chưa rõ      |
| Buzzer                          | Thêm thiết bị điều khiển mới         | ❓ Chưa rõ      |
| Relay 1 kênh                    | Mô phỏng bật/tắt tải thực tế         | ❓ Chưa rõ      |
| Cáp USB (Micro-USB hoặc Type-C) | Kết nối NodeMCU với laptop           | ⚠️ Cần xác nhận |

**4. BÀI 1 - THIẾT KẾ TÀI LIỆU (2 Tuần)**

**Output: File SRS (PDF/Word) + Link Figma \| Không cần phần cứng**

**4.1 Thiết Kế Giao Diện Figma - 4 Màn Hình Bắt Buộc**

**Màn Hình 1: Dashboard (Trang chủ)**

| **Thành phần**              | **Yêu cầu chi tiết**                                                              |
|-----------------------------|-----------------------------------------------------------------------------------|
| 3 Card cảm biến             | Nhiệt độ (màu Đỏ/cam), Độ ẩm (màu Xanh), Ánh sáng (màu Vàng) - màu phải khác nhau |
| Biểu đồ thời gian thực      | 1 biểu đồ với 3 đường, màu tương ứng với 3 card cảm biến bên trên                 |
| 3 Card điều khiển           | Đèn, Quạt, Điều hòa (hoặc tùy chọn thiết bị khác)                                 |
| 3 trạng thái nút - BẮT BUỘC | OFF (mặc định) → LOADING (spinner xoay khi nhấn) → ON (có hiệu ứng glow/sáng)     |
| Hiệu ứng ON - BẮT BUỘC      | Đèn sáng lên, Quạt xoay (CSS spin/GIF), Điều hòa thả gió - Phân biệt rõ ON/OFF    |

**Màn Hình 2: Data Sensor (Lịch sử dữ liệu cảm biến)**

| **Thành phần**        | **Yêu cầu**                                                                         |
|-----------------------|-------------------------------------------------------------------------------------|
| Bảng dữ liệu          | Cột: ID \| Tên cảm biến \| Giá trị \| Thời gian                                     |
| Tìm kiếm              | Ô search theo giờ/phút/giây và theo loại cảm biến                                   |
| Bộ lọc                | Date picker (lọc theo thời gian) + Dropdown (lọc theo loại cảm biến)                |
| Sắp xếp               | Sort tăng/giảm dần                                                                  |
| Phân trang - BẮT BUỘC | Xử lý ở Backend, truyền page + limit vào API - KHÔNG lấy toàn bộ rồi lọc ở Frontend |

**Màn Hình 3: Action History (Lịch sử điều khiển)**

| **Thành phần**             | **Yêu cầu**                                                                       |
|----------------------------|-----------------------------------------------------------------------------------|
| Bảng dữ liệu               | Cột: ID \| Tên thiết bị \| Action \| Status \| Thời gian                          |
| Phân biệt Action vs Status | Action = hành động yêu cầu (ON/OFF), Status = trạng thái thực tế (WAITING/ON/OFF) |
| Tìm kiếm                   | Theo thời gian + theo tên thiết bị                                                |
| Bộ lọc                     | Lọc theo thiết bị (Dropdown danh sách thiết bị)                                   |
| Phân trang - BẮT BUỘC      | Xử lý ở Backend                                                                   |

**Màn Hình 4: Profile**

| **Thành phần**          | **Yêu cầu**                                                                                          |
|-------------------------|------------------------------------------------------------------------------------------------------|
| Ảnh đại diện - BẮT BUỘC | Ảnh CHUYÊN NGHIỆP - không phải selfie, không phải ảnh ngủ dậy - có thể dùng AI tạo ảnh chuyên nghiệp |
| Thông tin cá nhân       | Họ tên đầy đủ, Mã số sinh viên, Lớp                                                                  |
| Link báo cáo PDF        | Phải mở được ngay, không cần tìm                                                                     |
| Link API Documentation  | Postman Collection hoặc Swagger                                                                      |
| Link Git Repository     | PHẢI là repo mới tạo (không dùng repo cũ)                                                            |

**4.2 Sequence Diagram - 2 Luồng**

**Luồng 1: Thu thập dữ liệu cảm biến**

Các actor cần vẽ: Hardware \| MQTT Broker \| Backend \| Database \| Frontend \| User

Luồng: Hardware đọc cảm biến → Publish lên topic data_sensor → Backend subscribe nhận → INSERT vào Database → Trả về Frontend hiển thị

**Luồng 2: Điều khiển thiết bị (Có CONFIRM từ Hardware)**

User nhấn nút → Frontend gọi API Backend → Backend INSERT vào action_history (status=WAITING) → Backend publish lên MQTT topic device_control → Hardware nhận lệnh → Bật/tắt LED → Hardware publish phản hồi → Backend nhận → UPDATE action_history (status=ON/OFF) → Trả về Frontend → Nút chuyển từ LOADING sang ON

**4.3 Thiết Kế Database - 4 Bảng**

| **Tên bảng**   | **Các cột chính**                                                                    | **Mục đích**                    |
|----------------|--------------------------------------------------------------------------------------|---------------------------------|
| sensors        | id (PK), name (Nhiệt độ/Độ ẩm/Ánh sáng), unit (°C/%/lux), created_at                 | Danh mục loại cảm biến          |
| data_sensor    | id (PK), sensor_id (FK→sensors), value (FLOAT), timestamp                            | Lưu dữ liệu đo được từ cảm biến |
| devices        | id (PK), name (Đèn/Quạt/Điều hòa), type, created_at                                  | Danh mục thiết bị điều khiển    |
| action_history | id (PK), device_id (FK→devices), action (ON/OFF), status (WAITING/ON/OFF), timestamp | Log lịch sử bật/tắt thiết bị    |

**Lưu ý quan trọng: action ≠ status. action là hành động được yêu cầu, status là trạng thái thực tế sau khi hardware phản hồi.**

**5. BÀI 2 - LẬP TRÌNH HARDWARE (1 Tuần)**

**Output: Code Arduino chạy được \| Cần phần cứng thật**

**5.1 Yêu Cầu Lập Trình**

| **Chức năng**           | **Chi tiết kỹ thuật**                                               |
|-------------------------|---------------------------------------------------------------------|
| Đọc nhiệt độ + độ ẩm    | Dùng cảm biến DHT11 hoặc DHT22, cài thư viện tương ứng (DHT.h)      |
| Đọc ánh sáng            | Dùng cảm biến LDR (quang trở), đọc giá trị analog qua điện trở 10kΩ |
| Hiển thị Serial Monitor | In giá trị đọc được ra Serial Monitor (Ctrl+M) để debug             |
| Điều khiển 3 đèn LED    | Nhận lệnh qua MQTT topic device_control, bật/tắt LED tương ứng      |
| Kết nối WiFi            | Cấu hình SSID + Password WiFi, dùng điện thoại làm hotspot khi demo |
| Gửi dữ liệu MQTT        | Publish JSON lên topic data_sensor mỗi 2 giây                       |

**5.2 Công Cụ & Thư Viện**

| **Công cụ/Thư viện** | **Mục đích**                                |
|----------------------|---------------------------------------------|
| Arduino IDE          | Môi trường lập trình cho ESP8266/ESP32      |
| ESP8266WiFi / WiFi.h | Kết nối WiFi cho ESP8266/ESP32              |
| DHT.h                | Đọc cảm biến DHT11/DHT22 (nhiệt độ + độ ẩm) |
| PubSubClient.h       | MQTT client để publish/subscribe            |
| ArduinoJson.h        | Tạo và parse chuỗi JSON                     |

**5.3 Lưu Ý Kết Nối Phần Cứng**

- LDR cần điện trở 10kΩ nối đất để tạo cầu phân áp, đọc giá trị analog

- LED cần điện trở 220Ω để hạn chế dòng, tránh cháy LED và chân ESP

- Có 2 cách kết nối LED: cực dương (1=sáng, 0=tắt) hoặc cực âm chung (1=tắt, 0=sáng)

- Tra cứu cách kết nối cụ thể cho từng loại cảm biến trên mạng (search: \'ESP8266 + tên cảm biến\')

- Khi bảo vệ: dùng hotspot điện thoại làm WiFi để không phụ thuộc mạng trường

**6. BÀI 3 - MÔ PHỎNG MQTT (1 Tuần)**

**Output: Demo MQTT hoạt động 2 chiều \| Cần phần cứng từ Bài 2**

**6.1 Phần 1: Test Bằng Terminal (Không Cần Hardware)**

Mở 2 terminal để kiểm tra MQTT broker trước khi tích hợp phần cứng:

**Terminal 1 - Publish (Giả lập Hardware gửi dữ liệu):**

mosquitto_pub -h localhost -t \"data_sensor\" -m \'{\"temp\":28,\"humidity\":80,\"light\":1000}\' -u \"HoTenDayDu\" -P \"matkhau\" -p 1884

**Terminal 2 - Subscribe (Giả lập Backend nhận dữ liệu):**

mosquitto_sub -h localhost -t \"data_sensor\" -u \"HoTenDayDu\" -P \"matkhau\" -p 1884

**6.2 Phần 2: Kết Hợp Hardware Thật**

| **Kịch bản**        | **Mô tả**                                                                           |
|---------------------|-------------------------------------------------------------------------------------|
| Hardware → Terminal | ESP8266 publish dữ liệu cảm biến lên topic, Terminal subscribe nhận và hiển thị     |
| Terminal → Hardware | Terminal publish lệnh điều khiển lên topic device_control, LED trên ESP8266 bật/tắt |

**6.3 Yêu Cầu Cấu Hình MQTT Bắt Buộc**

| **Thông số**      | **Yêu cầu**                                                          |
|-------------------|----------------------------------------------------------------------|
| Port              | PHẢI đổi khác 1883 (ví dụ: 1884, 1885\...) - chứng tỏ đã tự cấu hình |
| Username          | Họ và tên đầy đủ (ví dụ: NguyenVanA)                                 |
| Password          | Tự đặt                                                               |
| Tần suất gửi      | Mỗi 2 giây                                                           |
| Định dạng dữ liệu | JSON với đầy đủ các trường cảm biến                                  |

**7. BÀI 4 - FULL HỆ THỐNG + VẤN ĐÁP (2 Tuần)**

**Output: Hệ thống hoàn chỉnh + Báo cáo PDF + Vấn đáp trực tiếp \| Cần phần cứng**

**7.1 Yêu Cầu Hệ Thống Đầy Đủ**

| **Tính năng**         | **Yêu cầu chi tiết**                                                                |
|-----------------------|-------------------------------------------------------------------------------------|
| Biểu đồ realtime      | Cập nhật mỗi 2 giây, 3 đường màu tương ứng 3 cảm biến                               |
| Che cảm biến ánh sáng | Giá trị trên biểu đồ phải GIẢM - không được tăng ngược (thầy sẽ kiểm tra)           |
| Bật/tắt thiết bị      | Nút có 3 trạng thái: OFF → LOADING (spinner) → ON, LED thật phải sáng/tắt tương ứng |
| Mất kết nối phần cứng | Thầy rút USB → Biểu đồ loading xoay → Sau 10 giây hiện thông báo lỗi                |
| Reload trang web      | Trạng thái thiết bị (ON/OFF) phải được giữ nguyên, KHÔNG reset về OFF               |
| Tìm kiếm dữ liệu      | Tìm kiếm theo giờ/phút/giây, theo loại cảm biến                                     |
| Phân trang            | Xử lý hoàn toàn ở Backend (truyền page + limit), không xử lý ở Frontend             |
| API Documentation     | Postman Collection hoặc Swagger, mở được ngay khi cần                               |

**7.2 Đề Bài Live Code (Thầy Yêu Cầu Làm Trực Tiếp)**

Thầy sẽ chọn 1-2 đề trong danh sách sau để yêu cầu làm ngay khi bảo vệ:

| **\#** | **Đề bài live code**                        | **Gợi ý chuẩn bị**                        |
|--------|---------------------------------------------|-------------------------------------------|
| 1      | Thêm 2 loại cảm biến mới vào hệ thống       | Mua sẵn cảm biến PIR và MQ-2              |
| 2      | Thêm 2 thiết bị điều khiển mới              | Chuẩn bị buzzer hoặc relay                |
| 3      | Cảnh báo khi cảm biến vượt ngưỡng           | Hiểu logic ngưỡng cảnh báo và cách lưu DB |
| 4      | Thay đổi giao diện theo yêu cầu             | Thành thạo Figma và code CSS/component    |
| 5      | Đếm số lần bật/tắt thiết bị theo ngày/tháng | Biết viết SQL aggregate query             |

**7.3 Câu Hỏi Vấn Đáp (3 Loại)**

| **Loại câu hỏi** | **Ví dụ câu hỏi thầy hỏi**                                                             |
|------------------|----------------------------------------------------------------------------------------|
| Luồng dữ liệu    | Dữ liệu này xuất hiện ở màn hình từ đâu? Đi qua những bước nào? Vào database bảng nào? |
| Function/Code    | Code xử lý tìm kiếm nằm ở file nào, function nào, dòng bao nhiêu?                      |
| SQL Query        | Viết query thống kê số lần cảnh báo trong tháng này / số lần bật thiết bị trong ngày   |

**7.4 Checklist Chuẩn Bị Bảo Vệ Bài 4**

| **Hạng mục**         | **Yêu cầu**                                                              | **Trạng thái** |
|----------------------|--------------------------------------------------------------------------|----------------|
| Link Figma           | Mở được ngay, thao tác được (thầy sẽ yêu cầu sửa màu, di chuyển element) | ☐              |
| Link Git Repository  | Lịch sử commit rõ ràng, thể hiện quá trình làm, PHẢI là repo mới         | ☐              |
| Link Postman/Swagger | API documentation đầy đủ, mở được ngay                                   | ☐              |
| Báo cáo PDF          | Theo format SRS, link trong màn Profile                                  | ☐              |
| Căn cước công dân    | BẮT BUỘC mang theo để xác minh danh tính                                 | ☐              |
| Hardware             | Đã kết nối sẵn, cắm USB, cảm biến hoạt động tốt                          | ☐              |
| Hotspot điện thoại   | Bật sẵn để ESP8266 kết nối WiFi ổn định                                  | ☐              |

**8. CÁC LỖI CẦN TRÁNH & BẪY KHI BẢO VỆ**

**8.1 Lỗi Dẫn Đến Trượt (Điểm 4)**

| **Lỗi**                                   | **Hậu quả**                     | **Mức độ**      |
|-------------------------------------------|---------------------------------|-----------------|
| Làm nhóm hoặc copy bài của bạn            | CẢ HAI TRƯỢT, không có ngoại lệ | 🔴 NGHIÊM TRỌNG |
| Giao diện giống giao diện của bạn khác    | CẢ HAI TRƯỢT                    | 🔴 NGHIÊM TRỌNG |
| Dùng Git repository cũ (tồn tại từ trước) | Bị nghi copy, trượt             | 🔴 NGHIÊM TRỌNG |
| Lấy bài từ mạng hoặc từ năm trước         | Thầy sẽ phát hiện, trượt        | 🔴 NGHIÊM TRỌNG |
| Không trả lời được câu hỏi vấn đáp        | Điểm 4 (Trượt)                  | 🔴 NGHIÊM TRỌNG |
| Lùi bảo vệ 4+ tuần so với lịch            | Điểm 4 (Trượt)                  | 🔴 NGHIÊM TRỌNG |

**8.2 Lỗi Trừ Điểm**

| **Lỗi**                                              | **Hậu quả**               |
|------------------------------------------------------|---------------------------|
| Ảnh profile là ảnh selfie, ảnh xấu, ảnh ngủ dậy      | Bị trừ điểm               |
| Không có trạng thái LOADING khi bật/tắt thiết bị     | Bị trừ điểm nặng          |
| Không có phân trang hoặc phân trang xử lý ở Frontend | Sai yêu cầu kỹ thuật      |
| Port MQTT vẫn là 1883 (mặc định)                     | Chứng tỏ chưa tự cấu hình |
| Reload web → thiết bị reset về OFF                   | Lỗi logic trạng thái      |
| Lùi mỗi tuần so với lịch tối ưu                      | Mất 1 điểm/tuần           |

**8.3 Các \"Bẫy\" Thầy Sẽ Kiểm Tra Khi Bảo Vệ**

| **Hành động của thầy**                  | **Kết quả kỳ vọng**                                           |
|-----------------------------------------|---------------------------------------------------------------|
| Yêu cầu đổi màu một element trong Figma | Phải thao tác được ngay, thành thạo Figma                     |
| Rút cáp USB của ESP8266 (ngắt kết nối)  | Giao diện phải hiện loading xoay, sau 10 giây báo lỗi rõ ràng |
| Reload (F5) trang web                   | Trạng thái các thiết bị (ON/OFF) phải giữ nguyên từ Database  |
| Che tay vào cảm biến ánh sáng LDR       | Biểu đồ ánh sáng phải GIẢM (không được tăng ngược)            |
| Hỏi code xử lý tính năng X ở đâu        | Phải chỉ được ngay file, function, dòng code cụ thể           |
| Yêu cầu viết SQL thống kê ngay          | Phải viết được query tổng hợp dữ liệu                         |

**9. CÔNG CỤ & TÀI NGUYÊN**

**9.1 Công Cụ Chính**

| **Công cụ**       | **Link**               | **Mục đích**                                |
|-------------------|------------------------|---------------------------------------------|
| Figma             | figma.com              | Thiết kế giao diện 4 màn hình               |
| Draw.io           | draw.io                | Vẽ Sequence Diagram 2 luồng                 |
| dbdiagram.io      | dbdiagram.io           | Thiết kế sơ đồ ERD Database                 |
| Arduino IDE       | arduino.cc/en/software | Lập trình ESP8266/ESP32                     |
| Mosquitto         | mosquitto.org          | MQTT Broker cài local                       |
| Postman           | postman.com            | API Documentation                           |
| Docker (tùy chọn) | docker.com             | Đóng gói và triển khai ứng dụng dễ dàng hơn |

**9.2 Plugin Figma Hữu Ích**

| **Plugin**         | **Mục đích**                      |
|--------------------|-----------------------------------|
| Iconify            | Thư viện icon đa dạng, miễn phí   |
| Chart              | Tạo biểu đồ realtime trong mockup |
| Unsplash           | Ảnh stock chất lượng cao miễn phí |
| Wireframe / UI Kit | Template bố cục sẵn có            |

**9.3 Bảng Màu Gradient Gợi Ý**

| **Tên màu**  | **Gradient**                   | **Dùng cho**                  |
|--------------|--------------------------------|-------------------------------|
| Sunset       | \#FF6B6B → \#FF8E53 → \#FED330 | Card Nhiệt độ                 |
| Purple Dream | \#667EEA → \#764BA2            | Card Độ ẩm                    |
| Emerald      | \#11998E → \#38EF7D            | Card Ánh sáng                 |
| Golden Hour  | \#FCD34D → \#F59E0B            | Thiết bị Đèn (trạng thái ON)  |
| Ocean Blue   | \#06B6D4 → \#3B82F6            | Thiết bị Quạt (trạng thái ON) |
| Cool Mint    | \#14B8A6 → \#6EE7B7            | Điều hòa (trạng thái ON)      |

**10. TIẾN ĐỘ & VIỆC CẦN LÀM**

**10.1 Trạng Thái Hiện Tại (Cập nhật: 13/01/2026)**

| **Bài**                    | **Trạng thái**  | **Chi tiết**                                   |
|----------------------------|-----------------|------------------------------------------------|
| Bài 1 - Thiết kế tài liệu  | 🔄 Đang làm     | Dashboard đang làm, 3 màn còn lại chưa bắt đầu |
| Bài 2 - Lập trình hardware | ⏳ Chưa bắt đầu | Đợi hoàn thành Bài 1                           |
| Bài 3 - Mô phỏng MQTT      | ⏳ Chưa bắt đầu | Đợi hoàn thành Bài 2                           |
| Bài 4 - Full hệ thống      | ⏳ Chưa bắt đầu | Đợi hoàn thành Bài 3                           |

**10.2 Ưu Tiên Tuần Này (Bài 1)**

- Hoàn thiện Dashboard: Thêm 3 trạng thái OFF/LOADING/ON cho mỗi nút điều khiển

- Hoàn thiện Dashboard: Thêm hiệu ứng ON (glow, animation cho đèn/quạt/điều hòa)

- Hoàn thiện Dashboard: Kiểm tra biểu đồ có đủ 3 đường màu tương ứng chưa

- Thiết kế màn Data Sensor: Bảng dữ liệu + Tìm kiếm + Bộ lọc + Phân trang

- Thiết kế màn Action History: Bảng lịch sử + Phân biệt Action vs Status + Phân trang

- Thiết kế màn Profile: Chuẩn bị ảnh chuyên nghiệp + Layout thông tin + Links

**10.3 Ưu Tiên Tuần Sau**

- Vẽ Sequence Diagram: Luồng thu thập cảm biến + Luồng điều khiển thiết bị (có CONFIRM)

- Thiết kế Database: Sơ đồ ERD + Chi tiết 4 bảng

- Viết báo cáo SRS: Tổng hợp tất cả vào file PDF

- Cài đặt Arduino IDE và test kết nối ESP8266

- Cài đặt Mosquitto MQTT Broker

\-\-- Tổng hợp từ 3 file: REQUIREMENTS.md, Vietsub_buoi_2.docx, Vietsub_full_buổi_1.docx \-\--
