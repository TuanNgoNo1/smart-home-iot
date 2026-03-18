---
title: "SRS - PROJECT 1: SMART HOME IoT SYSTEM"
---

> **HỆ THỐNG GIÁM SÁT VÀ ĐIỀU KHIỂN THIẾT BỊ THÔNG MINH**

| **Môn học**       | Ứng dụng IoT                                        |
|-------------------|-----------------------------------------------------|
| **Bài thực hành** | Project 1 - Thiết kế tài liệu                       |
| **Đề tài**        | Hệ thống giám sát và điều khiển thiết bị thông minh |
| **Họ và tên**     | Ngô Đức Anh Tuấn                                    |
| **MSSV**          | B22DCPT248                                          |
| **Lớp**           | D22PTDPT02                                          |
| **Ngày nộp**      | 20/01/2026                                          |

> **Mục lục**

1.  [INTRODUCTION](#introduction) 3

    1.  [Purpose (Mục tiêu tài liệu)](#purpose-mục-tiêu-tài-liệu) 3

    2.  [Scope (Phạm vi hệ thống)](#scope-phạm-vi-hệ-thống) 3

    3.  [Intended Audience (Đối tượng sử dụng tài liệu)](#_bookmark3) 3

    4.  [Definitions & Acronyms (Thuật ngữ & viết tắt)](#_bookmark4) 3

2.  [OVERALL DESCRIPTION](#overall-description) 4

    1.  [System Overview (Tổng quan hệ thống)](#system-overview-tổng-quan-hệ-thống) 4

        1.  [Kiến trúc hệ thống](#kiến-trúc-hệ-thống) 4

    2.  [Key Features / Product Functions (Chức năng tổng quan)](#_bookmark8) 4

    3.  [Assumptions & Constraints (Giả định & ràng buộc)](#assumptions-constraints-giả-định-ràng-buộc) 4

3.  [SPECIFIC REQUIREMENTS](#specific-requirements) 5

    1.  [Functional Requirements (FR)](#functional-requirements-fr) 5

        1.  [Dashboard](#dashboard) 5

        2.  [Data Sensor (Sensor Data History)](#data-sensor-sensor-data-history) 5

        3.  [Action History (Device Control History)](#action-history-device-control-history) 5

        4.  [Profile](#profile) 6

    2.  [Non-Functional Requirements (NFR)](#non-functional-requirements-nfr) 6

        1.  [Realtime & Performance](#realtime-performance) 6

        2.  [Reliability (ACK/Timeout/Retry)](#reliability-acktimeoutretry) 6

        3.  [Security](#security) 6

        4.  [Persistence (Device state on reload)](#profile) 7

4.  [SYSTEM DESIGN](#system-design) 8

    1.  [ERD](#erd) 8

    2.  [Data Dictionary](#system-design) 9

        1.  [Bảng sensors](#bảng-sensors) 9

        2.  [Bảng sensor_data](#bảng-sensor_data) 9

        3.  [Bảng devices](#_bookmark26) 9

        4.  [Bảng action_history](#bảng-action_history) 9

    3.  [Sample SQL Queries](#_bookmark28) 9

5.  [EXTERNAL INTERFACES](#external-interfaces) 11

    1.  [User Interface Requirements](#user-interface-requirements) 11

        1.  [Quy tắc màu sắc](#quy-tắc-màu-sắc) 11

        2.  [Trạng thái thiết bị (Mapping UI *↔* DB)](#trạng-thái-thiết-bị-mapping-ui-db) 11

    2.  [Communication Interface](#communication-interface) 11

        1.  [Topic 1: Dữ liệu cảm biến](#_bookmark34) 11

        2.  [Topic 2: Lệnh điều khiển thiết bị](#topic-2-lệnh-điều-khiển-thiết-bị) 11

        3.  [Topic 3: ACK phản hồi từ hardware](#_bookmark36) 11

    3.  [API Endpoints](#api-endpoints) 12

        1.  [Dashboard APIs](#dashboard-apis) 12

        2.  [Data Sensor APIs](#data-sensor-apis) 12

        3.  [Action History APIs](#_bookmark40) 12

6.  [APPENDICES](#appendices) 13

    1.  [Screenshots](#screenshots) 13

        1.  [Dashboard](#dashboard-1) 13

        2.  [Data Sensor](#data-sensor) 14

        3.  [Action History](#action-history) 15

        4.  [Profile](#profile-1) 16

    2.  [Sequence Diagrams](#sequence-diagrams) 17

        1.  [SD-01: Thu thập dữ liệu cảm biến](#_bookmark48) 17

        2.  [SD-02: Điều khiển thiết bị có ACK/Timeout](#sd-02-điều-khiển-thiết-bị-có-acktimeout) 18

        3.  [SD-03: Xem lịch sử dữ liệu cảm biến](#_bookmark50) 20

        4.  [SD-04: Xem lịch sử hành động](#_bookmark51) 22

    3.  [Contact / Links](#contact-links) 23

# INTRODUCTION

## Purpose (Mục tiêu tài liệu)

> Tài liệu này mô tả đặc tả yêu cầu phần mềm (SRS) cho hệ thống IoT Smart Home, bao gồm:

- Yêu cầu chức năng và phi chức năng

- Thiết kế giao diện 4 màn hình

- Luồng dữ liệu và điều khiển (Sequence Diagram)

- Thiết kế cơ sở dữ liệu

## Scope (Phạm vi hệ thống)

| **Phạm vi** | **Chi tiết**                                      |
|-------------|---------------------------------------------------|
| Giám sát    | 3 loại cảm biến: Nhiệt độ, Độ ẩm, Ánh sáng        |
| Điều khiển  | 3 thiết bị: Đèn, Quạt, Điều hòa                   |
| Realtime    | Cập nhật dữ liệu mỗi 2 giây                       |
| Lịch sử     | Lưu trữ và truy vấn dữ liệu cảm biến + điều khiển |
| Phân trang  | Xử lý Backend, hỗ trợ filter/sort/search          |

1.  []{#_bookmark3 .anchor}**Intended Audience (Đối tượng sfi dụng tài liệu)**

- Giảng viên đánh giá bài thực hành

- Sinh viên thực hiện dự án

  1.  []{#_bookmark4 .anchor}**Definitions & Acronyms (Thuật ngfi & viết tắt)**

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 79%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Thuật ngfi</strong></th>
<th><strong>Giải thích</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>MQTT</td>
<td><p>Message Queuing Telemetry Transport - Giao thức</p>
<p>truyền tin nhẹ cho IoT</p></td>
</tr>
<tr class="even">
<td>Topic</td>
<td>Kênh truyền tin trong MQTT (publisher/subscriber)</td>
</tr>
<tr class="odd">
<td>ACK</td>
<td><p>Acknowledgment - Xác nhận từ thiết bị sau khi thực</p>
<p>hiện lệnh</p></td>
</tr>
<tr class="even">
<td>Pagination</td>
<td>Phân trang dữ liệu, xử lý phía Backend</td>
</tr>
<tr class="odd">
<td>HW</td>
<td>Hardware - Phần cứng (ESP32/ESP8266)</td>
</tr>
<tr class="even">
<td>BE</td>
<td>Backend - Server xử lý logic</td>
</tr>
<tr class="odd">
<td>FE</td>
<td>Frontend - Giao diện người dùng (Web)</td>
</tr>
<tr class="even">
<td>DB</td>
<td>Database - Cơ sở dữ liệu (MySQL)</td>
</tr>
<tr class="odd">
<td>FR</td>
<td>Functional Requirement - Yêu cầu chức năng</td>
</tr>
<tr class="even">
<td>NFR</td>
<td>Non-Functional Requirement - Yêu cầu phi chức năng</td>
</tr>
</tbody>
</table>

# OVERALL DESCRIPTION

## System Overview (Tổng quan hệ thống)

Hệ thống IoT Smart Home cho phép người dùng:

- **Giám sát**: Theo dõi nhiệt độ, độ ẩm, ánh sáng trong phòng qua biểu đồ thời gian thực

- **Điều khiển**: Bật/tắt các thiết bị (đèn, quạt, điều hòa) từ xa với xác nhận ACK

- **Lịch sfi**: Xem lịch sử dữ liệu cảm biến và thao tác điều khiển

- **Cảnh báo**: Thông báo khi giá trị cảm biến vượt ngưỡng

### Kiến trúc hệ thống

> MQTT

1.  []{#_bookmark8 .anchor}**Key Features / Product Functions (Chfíc năng tổng quan)**

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 22%" />
<col style="width: 71%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>#</strong></th>
<th><strong>Màn hình</strong></th>
<th><blockquote>
<p><strong>Chfíc năng chính</strong></p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>1</td>
<td>Dashboard</td>
<td><blockquote>
<p>Hiển thị realtime cảm biến + điều khiển thiết bị</p>
</blockquote></td>
</tr>
<tr class="even">
<td>2</td>
<td>Data Sensor</td>
<td><blockquote>
<p>Lịch sử dữ liệu cảm biến với filter/sort/pagination</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>3</td>
<td>Action History</td>
<td><blockquote>
<p>Lịch sử điều khiển thiết bị với filter/sort/pagination</p>
</blockquote></td>
</tr>
<tr class="even">
<td>4</td>
<td>Profile</td>
<td><blockquote>
<p>Thông tin sinh viên</p>
</blockquote></td>
</tr>
</tbody>
</table>

## Assumptions & Constraints (Giả định & ràng buộc) {#assumptions-constraints-giả-định-ràng-buộc}

| **Loại** | **Chi tiết**                                |
|----------|---------------------------------------------|
| Phạm vi  | Hệ thống quản lý 1 phòng duy nhất           |
| Hardware | 1 bộ ESP32/ESP8266                          |
| Cảm biến | DHT22 (nhiệt độ + độ ẩm), BH1750 (ánh sáng) |
| Thiết bị | 3 đèn LED giả lập (Đèn, Quạt, Điều hòa)     |
| Kết nối  | WiFi local hoặc Internet                    |
| Timeout  | 10 giây cho ACK                             |

# SPECIFIC REQUIREMENTS

## Functional Requirements (FR)

### Dashboard

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 65%" />
<col style="width: 14%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID</strong></th>
<th><strong>Mô tả</strong></th>
<th><blockquote>
<p><strong>Priority</strong></p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>FR-DASH-01</td>
<td><p>Hiển thị 3 ô giá trị cảm biến (nhiệt độ, độ ẩm, ánh</p>
<p>sáng) với icon và đơn vị</p></td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-DASH-02</td>
<td><p>Hiển thị biểu đồ thời gian thực, cập nhật mỗi 2</p>
<p>giây</p></td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>FR-DASH-03</td>
<td><p>Hiển thị 3 card điều khiển thiết bị (Đèn, Quạt,</p>
<p>Điều hòa)</p></td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-DASH-04</td>
<td><p>Mỗi card có Toggle Switch hiển thị trạng thái: OFF</p>
<p>/ WAITING / ON / FAILED</p></td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>FR-DASH-05</td>
<td><p>Nút Tooggle Switch on/off thiết bị với loading</p>
<p>spinner khi đang xử lý</p></td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-DASH-06</td>
<td>Hiển thị nút "Thử lại"khi trạng thái FAILED</td>
<td><blockquote>
<p>Medium</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>FR-DASH-07</td>
<td>Hiển thị cảnh báo (badge) khi giá trị vượt ngưỡng</td>
<td><blockquote>
<p>Medium</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-DASH-08</td>
<td>Hiển thị panel thông báo (Notification Feed)</td>
<td><blockquote>
<p>Low</p>
</blockquote></td>
</tr>
</tbody>
</table>

### Data Sensor (Sensor Data History)

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 66%" />
<col style="width: 14%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID</strong></th>
<th><strong>Mô tả</strong></th>
<th><strong>Priority</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>FR-SENS-01</td>
<td><p>Hiển thị bảng lịch sử: ID, Loại cảm biến, Giá trị,</p>
<p>Thời gian</p></td>
<td>High</td>
</tr>
<tr class="even">
<td>FR-SENS-02</td>
<td>Tìm kiếm theo ID hoặc giá trị</td>
<td>High</td>
</tr>
<tr class="odd">
<td>FR-SENS-03</td>
<td><p>Lọc theo loại cảm biến (Tất cả / Nhiệt độ / Độ</p>
<p>ẩm / Ánh sáng)</p></td>
<td>High</td>
</tr>
<tr class="even">
<td>FR-SENS-04</td>
<td><p>Lọc theo khoảng thời gian (DatePicker + Input</p>
<p>nhập giờ HH:mm)</p></td>
<td>High</td>
</tr>
<tr class="odd">
<td>FR-SENS-05</td>
<td>Quick range: 5 phút / 1 giờ / 24 giờ</td>
<td>Medium</td>
</tr>
<tr class="even">
<td>FR-SENS-06</td>
<td>Sắp xếp theo thời gian (Mới nhất / Cũ nhất)</td>
<td>High</td>
</tr>
<tr class="odd">
<td>FR-SENS-07</td>
<td>Phân trang với page, pageSize (xử lý Backend)</td>
<td>High</td>
</tr>
<tr class="even">
<td>FR-SENS-08</td>
<td>Hiển thị tổng số bản ghi và số trang</td>
<td>Medium</td>
</tr>
</tbody>
</table>

### Action History (Device Control History)

<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 66%" />
<col style="width: 14%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID</strong></th>
<th><strong>Mô tả</strong></th>
<th><blockquote>
<p><strong>Priority</strong></p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>FR-ACT-01</td>
<td><p>Hiển thị bảng lịch sử: ID, Thiết bị, Action, Status,</p>
<p>Thời gian</p></td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-ACT-02</td>
<td>Tìm kiếm theo ID, thiết bị, action, status</td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>FR-ACT-03</td>
<td>Lọc theo thiết bị (Tất cả / Đèn / Quạt / Điều hòa)</td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-ACT-04</td>
<td><p>Lọc theo trạng thái (Tất cả / WAITING /</p>
<p>SUCCESS / FAILED / TIMEOUT)</p></td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 66%" />
<col style="width: 14%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID</strong></th>
<th><strong>Mô tả</strong></th>
<th><blockquote>
<p><strong>Priority</strong></p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>FR-ACT-05</td>
<td><p>Lọc theo khoảng thời gian (DatePicker hoặc Input</p>
<p>chuỗi)</p></td>
<td><blockquote>
<p>Medium</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-ACT-06</td>
<td>Sắp xếp theo thời gian (Mới nhất / Cũ nhất)</td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>FR-ACT-07</td>
<td>Phân trang với page, pageSize (xử lý Backend)</td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-ACT-08</td>
<td>Nút Refresh để làm mới dữ liệu</td>
<td><blockquote>
<p>Low</p>
</blockquote></td>
</tr>
</tbody>
</table>

### Profile

<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 66%" />
<col style="width: 14%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID</strong></th>
<th><strong>Mô tả</strong></th>
<th><blockquote>
<p><strong>Priority</strong></p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>FR-PRO-01</td>
<td>Hiển thị ảnh đại diện</td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-PRO-02</td>
<td>Hiển thị thông tin: Họ tên, Lớp, MSSV</td>
<td><blockquote>
<p>High</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>FR-PRO-03</td>
<td>Hiển thị mô tả dự án</td>
<td><blockquote>
<p>Medium</p>
</blockquote></td>
</tr>
<tr class="even">
<td>FR-PRO-04</td>
<td>Hiển thị Tech Stack sử dụng</td>
<td><blockquote>
<p>Low</p>
</blockquote></td>
</tr>
</tbody>
</table>

## Non-Functional Requirements (NFR)

### Realtime & Performance {#realtime-performance}

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 84%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID</strong></th>
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>NFR-01</td>
<td>Dữ liệu cảm biến cập nhật mỗi 2 giây</td>
</tr>
<tr class="even">
<td>NFR-02</td>
<td>Biểu đồ realtime hiển thị tối đa 20 điểm dữ liệu gần nhất</td>
</tr>
<tr class="odd">
<td>NFR-03</td>
<td><p>Phân trang xử lý Backend (không load toàn bộ data lên</p>
<p>Frontend)</p></td>
</tr>
<tr class="even">
<td>NFR-04</td>
<td>Page size mặc định: 10 bản ghi/trang</td>
</tr>
</tbody>
</table>

### Reliability (ACK/Timeout/Retry)

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 84%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID</strong></th>
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>NFR-05</td>
<td>Timeout 10 giây nếu không nhận ACK từ hardware</td>
</tr>
<tr class="even">
<td>NFR-06</td>
<td>Hiển thị trạng thái FAILED + nút "Thử lại"khi timeout</td>
</tr>
<tr class="odd">
<td>NFR-07</td>
<td><p>Khi disconnect giữa chừng (đang WAITING) <em>→</em> chuyển</p>
<p>sang FAILED</p></td>
</tr>
<tr class="even">
<td>NFR-08</td>
<td><p>Lưu lịch sử action với status WAITING <em>→</em></p>
<p>SUCCESS/FAILED</p></td>
</tr>
</tbody>
</table>

### Security

| **ID** | **Mô tả**                                      |
|--------|------------------------------------------------|
| NFR-09 | Sử dụng username/password cho MQTT Broker      |
| NFR-10 | Thay đổi port mặc định (không dùng 1883)       |
| NFR-11 | Username đặt theo tên sinh viên (để nhận diện) |
| NFR-12 | Không commit credential lên Git (dùng .env)    |

### Persistence (Device state on reload)

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 84%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID</strong></th>
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>NFR-14</td>
<td><p>Giữ trạng thái thiết bị khi reload trang (đồng bộ từ</p>
<p>Database bảng devices)</p></td>
</tr>
<tr class="even">
<td>NFR-15</td>
<td><p>Lịch sử hành động được lưu trữ vĩnh viễn trong</p>
<p>Database</p></td>
</tr>
</tbody>
</table>

# SYSTEM DESIGN

## ERD

![](media/image1.png){width="6.406874453193351in" height="7.07625in"}

> Hình 1: Sơ đồ thực thể liên kết (ERD) - Cơ sở dữ liệu
>
> **Quan hệ:**

## Data Dictionary

### Bảng sensors

<table>
<colgroup>
<col style="width: 13%" />
<col style="width: 19%" />
<col style="width: 21%" />
<col style="width: 45%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Field</strong></th>
<th><strong>Type</strong></th>
<th><blockquote>
<p><strong>Constraint</strong></p>
</blockquote></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>id</td>
<td>VARCHAR(50)</td>
<td><blockquote>
<p>PK</p>
</blockquote></td>
<td>Mã cảm biến (dht_temp, dht_hum, light)</td>
</tr>
<tr class="even">
<td>name</td>
<td>VARCHAR(100)</td>
<td><blockquote>
<p>NOT NULL</p>
</blockquote></td>
<td>Tên hiển thị</td>
</tr>
<tr class="odd">
<td>topic</td>
<td>VARCHAR(255)</td>
<td><blockquote>
<p>NOT NULL</p>
</blockquote></td>
<td>Topic MQTT nhận dữ liệu</td>
</tr>
<tr class="even">
<td>created_at</td>
<td>DATETIME</td>
<td><blockquote>
<p>DEFAULT NOW()</p>
</blockquote></td>
<td>Thời gian tạo</td>
</tr>
</tbody>
</table>

### Bảng sensor_data

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 20%" />
<col style="width: 34%" />
<col style="width: 28%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Field</strong></th>
<th><strong>Type</strong></th>
<th><blockquote>
<p><strong>Constraint</strong></p>
</blockquote></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>id</td>
<td>BIGINT</td>
<td><blockquote>
<p>PK, AUTO_INCREMENT</p>
</blockquote></td>
<td>ID bản ghi</td>
</tr>
<tr class="even">
<td>sensor_id</td>
<td>VARCHAR(50)</td>
<td><blockquote>
<p>FK <em>→</em> sensors.id</p>
</blockquote></td>
<td>Mã cảm biến</td>
</tr>
<tr class="odd">
<td>value</td>
<td>FLOAT</td>
<td><blockquote>
<p>NOT NULL</p>
</blockquote></td>
<td>Giá trị đo được</td>
</tr>
<tr class="even">
<td>created_at</td>
<td>DATETIME</td>
<td><blockquote>
<p>NOT NULL</p>
</blockquote></td>
<td>Thời gian ghi nhận</td>
</tr>
</tbody>
</table>

> []{#_bookmark26 .anchor}**Index:** (sensor_id, created_at)

### Bảng devices

<table style="width:100%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 23%" />
<col style="width: 26%" />
<col style="width: 30%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Field</strong></th>
<th><strong>Type</strong></th>
<th><strong>Constraint</strong></th>
<th><blockquote>
<p><strong>Description</strong></p>
</blockquote></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>id</td>
<td>VARCHAR(50)</td>
<td>PK</td>
<td><blockquote>
<p>Mã thiết bị (led_01,</p>
<p>fan_01)</p>
</blockquote></td>
</tr>
<tr class="even">
<td>name</td>
<td>VARCHAR(100)</td>
<td>NOT NULL</td>
<td><blockquote>
<p>Tên thiết bị</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>topic</td>
<td>VARCHAR(255)</td>
<td>NOT NULL</td>
<td><blockquote>
<p>Topic MQTT điều</p>
<p>khiển</p>
</blockquote></td>
</tr>
<tr class="even">
<td>device_state</td>
<td>VARCHAR(20)</td>
<td>DEFAULT ’OFF’</td>
<td><blockquote>
<p>Trạng thái vật lý</p>
<p>(ON/OFF) - Dùng cho F5 Reload</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>created_at</td>
<td>DATETIME</td>
<td>DEFAULT NOW()</td>
<td><blockquote>
<p>Thời gian tạo</p>
</blockquote></td>
</tr>
</tbody>
</table>

### Bảng action_history

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 20%" />
<col style="width: 34%" />
<col style="width: 28%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Field</strong></th>
<th><strong>Type</strong></th>
<th><blockquote>
<p><strong>Constraint</strong></p>
</blockquote></th>
<th><strong>Description</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>id</td>
<td>BIGINT</td>
<td><blockquote>
<p>PK, AUTO_INCREMENT</p>
</blockquote></td>
<td>ID bản ghi</td>
</tr>
<tr class="even">
<td>request_id</td>
<td>VARCHAR(50)</td>
<td><blockquote>
<p>UNIQUE</p>
</blockquote></td>
<td><p>Mã định danh request (UUID) - Dùng để</p>
<p>map với ACK</p></td>
</tr>
<tr class="odd">
<td>device_id</td>
<td>VARCHAR(50)</td>
<td><blockquote>
<p>FK <em>→</em> devices.id</p>
</blockquote></td>
<td>Mã thiết bị</td>
</tr>
<tr class="even">
<td>action</td>
<td>VARCHAR(10)</td>
<td><blockquote>
<p>NOT NULL</p>
</blockquote></td>
<td>ON / OFF</td>
</tr>
<tr class="odd">
<td>status</td>
<td>VARCHAR(20)</td>
<td><blockquote>
<p>NOT NULL</p>
</blockquote></td>
<td><p>WAITING /</p>
<p>SUCCESS / FAILED</p>
<p>/ TIMEOUT</p></td>
</tr>
<tr class="even">
<td>created_at</td>
<td>DATETIME</td>
<td><blockquote>
<p>NOT NULL</p>
</blockquote></td>
<td>Thời gian thực hiện</td>
</tr>
</tbody>
</table>

> []{#_bookmark28 .anchor}**Index:** (device_id, created_at)

## Sample SQL Queries

> **Lọc theo thời gian (giờ/phút/giây) - Dùng Date Picker**
>
> **Tìm kiếm nhanh theo chuỗi thời gian**

# EXTERNAL INTERFACES

## User Interface Requirements

### Quy tắc màu sắc

| **Cảm biến** | **Màu chủ đạo** | **Hex**  |
|--------------|-----------------|----------|
| Nhiệt độ     | Đỏ/Cam          | \#EF4444 |
| Độ ẩm        | Xanh dương      | \#3B82F6 |
| Ánh sáng     | Vàng            | \#F59E0B |

### Trạng thái thiết bị (Mapping UI *↔* DB) {#trạng-thái-thiết-bị-mapping-ui-db}

| **DB Status** | **UI Text (Badge)** | **UI Color** | **Ý nghĩa**              |
|---------------|---------------------|--------------|--------------------------|
| WAITING       | Đang xử lý          | Vàng         | Chờ phản hồi từ Hardware |
| SUCCESS       | Thành công          | Xanh lục     | Đã bật/tắt thành công    |
| FAILED        | Thất bại            | Đỏ           | Lỗi phần cứng            |
| TIMEOUT       | Thất bại            | Đỏ           | Mất kết nối (Timeout)    |

## Communication Interface

1.  []{#_bookmark34 .anchor}**Topic 1: Dfi liệu cảm biến**

### Topic 2: Lệnh điều khiển thiết bị

2.  []{#_bookmark36 .anchor}**Topic 3: ACK phản hồi tfi hardware**

## API Endpoints

### Dashboard APIs

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 39%" />
<col style="width: 45%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Method</strong></th>
<th><strong>Endpoint</strong></th>
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>GET</td>
<td>/api/sensors/latest</td>
<td><p>Lấy 3 chỉ số môi trường mới nhất</p>
<p>(temp, hum, light)</p></td>
</tr>
<tr class="even">
<td>GET</td>
<td>/api/devices</td>
<td>Lấy danh sách thiết bị + Trạng thái hiện tại (device_state) <em>→ Dùng cho F5 Reload và Dropdown Filter</em></td>
</tr>
<tr class="odd">
<td>POST</td>
<td>/api/devices/control</td>
<td><p>Gửi lệnh điều khiển (Body: deviceId,</p>
<p>action). Backend tự sinh requestId.</p></td>
</tr>
</tbody>
</table>

> **Response mẫu (GET /api/devices):**

### Data Sensor APIs

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 39%" />
<col style="width: 45%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Method</strong></th>
<th><strong>Endpoint</strong></th>
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>GET</td>
<td>/api/sensors</td>
<td><p>Lấy danh sách các loại cảm biến</p>
<p>(dht_temp, light...) <em>→ Dùng cho Dropdown Filter</em></p></td>
</tr>
<tr class="even">
<td>GET</td>
<td><p>/api/sensor-data?sensor_id=</p>
<p>&amp;from=&amp;to=&amp;page= &amp;pageSize=&amp;sort=</p></td>
<td>Tìm kiếm và phân trang lịch sử cảm biến</td>
</tr>
</tbody>
</table>

> *\*Tham số: sensor_id (loại), from/to (khoảng thời gian), pageSize (số dòng/trang), sort (sắp* []{#_bookmark40 .anchor}*xếp).*

### Action History APIs

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 39%" />
<col style="width: 45%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Method</strong></th>
<th><strong>Endpoint</strong></th>
<th><strong>Mô tả</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>GET</td>
<td>/api/devices</td>
<td><p>(Tái sử dụng API Dashboard) Lấy danh</p>
<p>sách thiết bị cho bộ lọc</p></td>
</tr>
<tr class="even">
<td>GET</td>
<td><p>/api/action-history?device_id=</p>
<p>&amp;status=&amp;from=&amp;to= &amp;search=&amp;page=&amp;pageSize=</p></td>
<td><p>Tìm kiếm lịch sử điều khiển. <strong>search</strong>:</p>
<p>hỗ trợ nhập chuỗi giờ (VD: ’10:30’),</p>
<p><strong>from/to</strong>: lọc khoảng thời gian.</p></td>
</tr>
</tbody>
</table>

# APPENDICES

## Screenshots

### Dashboard

![](media/image2.jpeg){width="6.764582239720035in" height="4.876874453193351in"}

Hình 2: Giao diện Dashboard điều khiển và giám sát

### Data Sensor

![](media/image3.jpeg){width="6.764583333333333in" height="4.593541119860017in"}

> Hình 3: Giao diện xem lịch sử dữ liệu cảm biến

### Action History

![](media/image4.jpeg){width="6.764583333333333in" height="4.859166666666667in"}

> Hình 4: Giao diện lịch sử điều khiển thiết bị

### Profile

![](media/image5.jpeg){width="6.764582239720035in" height="4.416457786526684in"}

> Hình 5: Giao diện thông tin sinh viên

## Sequence Diagrams

3.  []{#_bookmark48 .anchor}**SD-01: Thu thập dfi liệu cảm biến**

![](media/image6.png){width="6.679061679790026in" height="4.334061679790026in"}

> Hình 6: SD1 - Luồng thu thập dữ liệu cảm biến
>
> **Mô tả các bước:**

### SD-02: Điều khiển thiết bị có ACK/Timeout

![](media/image7.png){width="6.59375in" height="6.86875in"}

> Hình 7: SD2 - Luồng điều khiển thiết bị (ON/OFF + ACK)
>
> **Luồng xfi lj (Success & Timeout):**

<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 22%" />
<col style="width: 19%" />
<col style="width: 46%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Bước</strong></th>
<th><strong>Actor</strong></th>
<th><strong>Action</strong></th>
<th><strong>Chi tiết</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>1</td>
<td>User</td>
<td>Click Toggle</td>
<td>Nhấn nút Bật/Tắt (ON/OFF)</td>
</tr>
<tr class="even">
<td>2</td>
<td>FE</td>
<td>UI Update</td>
<td><p>Hiển thị trạng thái WAITING</p>
<p>(Spinner)</p></td>
</tr>
<tr class="odd">
<td>3</td>
<td>FE <em>→</em> BE</td>
<td>POST API</td>
<td>/api/devices/control</td>
</tr>
</tbody>
</table>

[]{#_bookmark50 .anchor}

<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 22%" />
<col style="width: 19%" />
<col style="width: 46%" />
</colgroup>
<thead>
<tr class="header">
<th>4</th>
<th>BE</th>
<th>Generate</th>
<th>Sinh requestId định danh</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>5</td>
<td>BE <em>→</em> DB</td>
<td>INSERT</td>
<td><p>Lưu action_history</p>
<p>(status=WAITING)</p></td>
</tr>
<tr class="even">
<td>6</td>
<td>BE <em>→</em> MQTT</td>
<td>PUBLISH</td>
<td>Gửi lệnh xuống topic device/cmd</td>
</tr>
<tr class="odd">
<td>7</td>
<td>MQTT <em>→</em> HW</td>
<td>DELIVER</td>
<td>Thiết bị nhận lệnh</td>
</tr>
<tr class="even">
<td>8</td>
<td>HW</td>
<td>Execute</td>
<td>Thực thi GPIO (Bật/Tắt vật lý)</td>
</tr>
<tr class="odd">
<td colspan="4"><strong>Trường hợp 1: ACK SUCCESS (Thành công)</strong></td>
</tr>
<tr class="even">
<td>9</td>
<td>HW <em>→</em> MQTT</td>
<td>PUBLISH</td>
<td>Gửi ACK (result=SUCCESS)</td>
</tr>
<tr class="odd">
<td>10</td>
<td>MQTT <em>→</em> BE</td>
<td>DELIVER</td>
<td>Backend nhận ACK</td>
</tr>
<tr class="even">
<td>11</td>
<td>BE <em>→</em> DB</td>
<td>UPDATE</td>
<td><p>Cập nhật action_history</p>
<p>(status=SUCCESS)</p></td>
</tr>
<tr class="odd">
<td>12</td>
<td>BE <em>→</em> DB</td>
<td>UPDATE</td>
<td><p>Cập nhật devices</p>
<p>(device_state=ON/OFF)</p></td>
</tr>
<tr class="even">
<td>13</td>
<td>BE <em>→</em> FE</td>
<td>200 OK</td>
<td><p>Trả về</p>
<p>request_status=SUCCESS</p></td>
</tr>
<tr class="odd">
<td>14</td>
<td>FE</td>
<td>UI Update</td>
<td><p>Hiển thị nút trạng thái mới</p>
<p>(ON/OFF)</p></td>
</tr>
<tr class="even">
<td colspan="4"><strong>Trường hợp 2: ACK FAILED (Thiết bị báo lỗi)</strong></td>
</tr>
<tr class="odd">
<td>15-17</td>
<td>...</td>
<td>...</td>
<td><p>HW gửi ACK FAILED <em>→</em> BE cập</p>
<p>nhật DB (FAILED)</p></td>
</tr>
<tr class="even">
<td>18</td>
<td>BE <em>→</em> FE</td>
<td>200 OK</td>
<td>Trả về request_status=FAILED</td>
</tr>
<tr class="odd">
<td>19</td>
<td>FE</td>
<td>UI Update</td>
<td>Hiển thị lỗi + Nút thử lại</td>
</tr>
<tr class="even">
<td colspan="4"><strong>Trường hợp 3: TIMEOUT (Không phản hồi &gt; 10s)</strong></td>
</tr>
<tr class="odd">
<td>20</td>
<td>BE <em>→</em> DB</td>
<td>UPDATE</td>
<td><p>Cập nhật action_history</p>
<p>(status=TIMEOUT)</p></td>
</tr>
<tr class="even">
<td>21</td>
<td>BE <em>→</em> FE</td>
<td>504 Timeout</td>
<td>Trả về lỗi Timeout</td>
</tr>
<tr class="odd">
<td>22</td>
<td>FE</td>
<td>UI Update</td>
<td>Hiển thị trạng thái TIMEOUT</td>
</tr>
</tbody>
</table>

4.  **SD-03: Xem lịch sfi dfi liệu cảm biến**

![](media/image8.png){width="6.63875in" height="8.01937445319335in"}

> Hình 8: SD3 - Luồng xem lịch sử dữ liệu cảm biến
>
> **Mô tả chi tiết:**

[]{#_bookmark51 .anchor}

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 18%" />
<col style="width: 19%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Bước</strong></th>
<th><strong>Actor</strong></th>
<th><strong>Action</strong></th>
<th><strong>Chi tiết</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td colspan="4"><strong>Giai đoạn 1: Load Filters (Tải bộ lọc)</strong></td>
</tr>
<tr class="even">
<td>1</td>
<td>User</td>
<td>Open Page</td>
<td>Vào trang "Data Sensor"</td>
</tr>
<tr class="odd">
<td>2</td>
<td>FE <em>→</em> BE</td>
<td>GET API</td>
<td>/api/sensors</td>
</tr>
<tr class="even">
<td>3</td>
<td>BE <em>→</em> DB</td>
<td>Query</td>
<td>Lấy danh sách sensors</td>
</tr>
<tr class="odd">
<td>4-6</td>
<td>...</td>
<td>Populate</td>
<td><p>FE nhận danh sách và hiển thị</p>
<p>Dropdown</p></td>
</tr>
<tr class="even">
<td colspan="4"><strong>Giai đoạn 2: Fetch Table (Tải dfi liệu)</strong></td>
</tr>
<tr class="odd">
<td>7</td>
<td>User</td>
<td>Filter</td>
<td>Chọn bộ lọc + Nhấn tìm kiếm</td>
</tr>
<tr class="even">
<td>8</td>
<td>FE <em>→</em> BE</td>
<td>GET API</td>
<td>/api/sensor-data (kèm params)</td>
</tr>
<tr class="odd">
<td>9</td>
<td>BE <em>→</em> DB</td>
<td>Query</td>
<td><p>Query dữ liệu (WHERE, LIMIT,</p>
<p>OFFSET)</p></td>
</tr>
<tr class="even">
<td>10</td>
<td>DB <em>→</em> BE</td>
<td>Return</td>
<td>Trả về rows + total count</td>
</tr>
<tr class="odd">
<td>11</td>
<td>BE <em>→</em> FE</td>
<td>200 OK</td>
<td>Trả về items + pagination</td>
</tr>
<tr class="even">
<td>12</td>
<td>FE</td>
<td>Render</td>
<td>Hiển thị bảng dữ liệu</td>
</tr>
<tr class="odd">
<td>13-15</td>
<td>FE</td>
<td>Alt Cases</td>
<td><p>Xử lý khi không có dữ liệu hoặc</p>
<p>lỗi</p></td>
</tr>
</tbody>
</table>

5.  **SD-04: Xem lịch sfi hành động**

![](media/image9.png){width="6.622082239720035in" height="7.848748906386701in"}

> Hình 9: SD4 - Luồng xem lịch sử điều khiển thiết bị
>
> **Mô tả chi tiết:**

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 18%" />
<col style="width: 19%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>Bước</strong></th>
<th><strong>Actor</strong></th>
<th><strong>Action</strong></th>
<th><strong>Chi tiết</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td colspan="4"><strong>Giai đoạn 1: Load Filters (Tải bộ lọc)</strong></td>
</tr>
<tr class="even">
<td>1</td>
<td>User</td>
<td>Open Page</td>
<td>Vào trang "Action History"</td>
</tr>
<tr class="odd">
<td>2</td>
<td>FE <em>→</em> BE</td>
<td>GET API</td>
<td>/api/devices</td>
</tr>
<tr class="even">
<td>3</td>
<td>BE <em>→</em> DB</td>
<td>Query</td>
<td>Lấy danh sách devices</td>
</tr>
<tr class="odd">
<td>4-6</td>
<td>...</td>
<td>Populate</td>
<td>FE hiển thị Dropdown thiết bị</td>
</tr>
<tr class="even">
<td colspan="4"><strong>Giai đoạn 2: Fetch Table (Tải dfi liệu)</strong></td>
</tr>
<tr class="odd">
<td>7</td>
<td>User</td>
<td>Filter</td>
<td>Chọn Device, Status, Time</td>
</tr>
<tr class="even">
<td>8</td>
<td>FE <em>→</em> BE</td>
<td>GET API</td>
<td><p>/api/action-history (kèm</p>
<p>params)</p></td>
</tr>
<tr class="odd">
<td>9</td>
<td>BE <em>→</em> DB</td>
<td>Query</td>
<td>Query dữ liệu lịch sử</td>
</tr>
<tr class="even">
<td>10</td>
<td>DB <em>→</em> BE</td>
<td>Return</td>
<td>Trả về rows + total</td>
</tr>
<tr class="odd">
<td>11</td>
<td>BE <em>→</em> FE</td>
<td>200 OK</td>
<td>Trả về items + pagination</td>
</tr>
<tr class="even">
<td>12</td>
<td>FE</td>
<td>Render</td>
<td><p>Hiển thị bảng (kèm badges màu</p>
<p>trạng thái)</p></td>
</tr>
<tr class="odd">
<td>13-15</td>
<td>FE</td>
<td>Alt Cases</td>
<td><p>Xử lý trường hợp rỗng hoặc lỗi</p>
<p>Server</p></td>
</tr>
</tbody>
</table>

## Contact / Links {#contact-links}

| **Loại**   | **Link**                                                                                                                     |
|------------|------------------------------------------------------------------------------------------------------------------------------|
| Link Figma | [Xem bản thiết kế UI (Click here)](https://www.figma.com/design/tVUZvOTTFGZ0TLWJ14Nda6/IoT?node-id=0-1&t=3y2vRlVUDigeYt12-1) |

> *Báo cáo được viết bởi: Ngô Đức Anh Tuấn - B22DCPT248 Ngày: 20/01/2026*
