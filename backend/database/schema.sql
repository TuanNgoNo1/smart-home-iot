-- ============================================
-- IoT Smart Home - Database Schema
-- Bám sát SRS Report
-- ============================================

CREATE DATABASE IF NOT EXISTS iot_smart_home;
USE iot_smart_home;

-- 1. Bảng sensors (danh mục cảm biến)
CREATE TABLE IF NOT EXISTS sensors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT NOW()
);

-- 2. Bảng sensor_data (lịch sử dữ liệu cảm biến)
CREATE TABLE IF NOT EXISTS sensor_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sensor_id VARCHAR(50) NOT NULL,
    value FLOAT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (sensor_id) REFERENCES sensors(id)
);

CREATE INDEX idx_sensor_data ON sensor_data(sensor_id, created_at);

-- 3. Bảng devices (danh mục thiết bị + trạng thái vật lý)
CREATE TABLE IF NOT EXISTS devices (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    device_state VARCHAR(20) DEFAULT 'OFF',
    created_at DATETIME DEFAULT NOW()
);

-- 4. Bảng action_history (lịch sử điều khiển)
CREATE TABLE IF NOT EXISTS action_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(50) UNIQUE,
    device_id VARCHAR(50) NOT NULL,
    action VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING',
    created_at DATETIME NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE INDEX idx_action_history ON action_history(device_id, created_at);

-- ============================================
-- Seed Data
-- ============================================

INSERT INTO sensors (id, name, topic) VALUES
('dht_temp', 'Nhiệt độ', 'home/sensor/dht_temp'),
('dht_hum', 'Độ ẩm', 'home/sensor/dht_hum'),
('light', 'Ánh sáng', 'home/sensor/light');

INSERT INTO devices (id, name, topic) VALUES
('led_01', 'Đèn', 'home/device/led_01'),
('fan_01', 'Quạt', 'home/device/fan_01'),
('ac_01', 'Điều hòa', 'home/device/ac_01');
