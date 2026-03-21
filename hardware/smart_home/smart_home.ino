#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// ===== THÔNG TIN MẠNG (giữ nguyên từ P3) =====
const char* SSID = "putin888";
const char* PASS = "Dung4gde";

// ===== MQTT BROKER (giữ nguyên từ P3) =====
const char* MQTT_HOST = "172.20.10.4";  // IP laptop chạy Mosquitto
const int   MQTT_PORT = 1884;           // Port != 1883 (yêu cầu bắt buộc)
const char* MQTT_USER = "NgoDucAnhTuan";
const char* MQTT_PASS = "123456";

// ===== TOPICS (ĐỔI cho P4) =====
const char* T_SENSOR    = "data_sensor";   // HW → BE: dữ liệu cảm biến
const char* T_DEVICE_CMD = "device/cmd";   // BE → HW: lệnh điều khiển (đổi từ device_control)
const char* T_DEVICE_ACK = "device/ack";   // HW → BE: phản hồi ACK (đổi từ device_status)

// ===== PINS (giữ nguyên từ P3) =====
#define DHT_PIN 4       // D2 = GPIO4
#define DHTTYPE DHT11
#define LDR_PIN A0
#define LED1 14          // D5 = GPIO14 → led_01 (Đèn)
#define LED2 12          // D6 = GPIO12 → fan_01 (Quạt)
#define LED3 13          // D7 = GPIO13 → ac_01  (Điều hòa)
#define LED_ON  HIGH
#define LED_OFF LOW

DHT dht(DHT_PIN, DHTTYPE);
WiFiClient esp;
PubSubClient mqtt(esp);
unsigned long lastMs = 0;

// ========================================
// MAP device_id (string) → GPIO pin
// P3 dùng int (1,2,3), P4 dùng string
// ========================================
int getPin(const String& deviceId) {
  if (deviceId == "led_01") return LED1;
  if (deviceId == "fan_01") return LED2;
  if (deviceId == "ac_01")  return LED3;
  return -1;
}

// ========================================
// PARSE JSON đơn giản (không cần thư viện)
// Lấy giá trị string từ key
// ========================================
String getJsonString(const String& json, const String& key) {
  String searchKey = "\"" + key + "\"";
  int keyPos = json.indexOf(searchKey);
  if (keyPos < 0) return "";
  
  int colonPos = json.indexOf(":", keyPos);
  if (colonPos < 0) return "";
  
  // Tìm dấu " mở
  int startQuote = json.indexOf("\"", colonPos + 1);
  if (startQuote < 0) return "";
  
  // Tìm dấu " đóng
  int endQuote = json.indexOf("\"", startQuote + 1);
  if (endQuote < 0) return "";
  
  return json.substring(startQuote + 1, endQuote);
}

// ========================================
// WiFi
// ========================================
void wifiConnect() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASS);
  Serial.print("WiFi connecting");
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500); 
    Serial.print("."); 
  }
  Serial.println("\nWiFi OK, IP: " + WiFi.localIP().toString());
}

// ========================================
// MQTT Connect
// ========================================
void mqttConnect() {
  while (!mqtt.connected()) {
    String id = "esp8266-" + String(ESP.getChipId(), HEX);
    Serial.print("MQTT connecting... ");
    if (mqtt.connect(id.c_str(), MQTT_USER, MQTT_PASS)) {
      Serial.println("OK");
      // Subscribe topic điều khiển (đổi từ device_control → device/cmd)
      mqtt.subscribe(T_DEVICE_CMD);
      Serial.println("Subscribed: " + String(T_DEVICE_CMD));
    } else {
      Serial.print("FAIL rc="); 
      Serial.println(mqtt.state());
      delay(2000);
    }
  }
}

// ========================================
// MQTT CALLBACK - Nhận lệnh từ Backend
// ========================================
// Payload nhận: {"requestId":"uuid-xxx","deviceId":"led_01","action":"ON"}
// Payload gửi:  {"requestId":"uuid-xxx","result":"SUCCESS"} hoặc "FAILED"

void onMessage(char* topic, byte* payload, unsigned int len) {
  if (String(topic) != T_DEVICE_CMD) return;

  // Parse payload
  String s; s.reserve(len);
  for (unsigned int i = 0; i < len; i++) s += (char)payload[i];
  Serial.println("📨 RX [" + String(topic) + "] -> " + s);

  // Lấy các field từ JSON
  String requestId = getJsonString(s, "requestId");
  String deviceId  = getJsonString(s, "deviceId");
  String action    = getJsonString(s, "action");

  Serial.println("  requestId: " + requestId);
  Serial.println("  deviceId:  " + deviceId);
  Serial.println("  action:    " + action);

  // Validate
  if (requestId.length() == 0 || deviceId.length() == 0) {
    Serial.println("❌ Invalid payload!");
    // Gửi ACK FAILED
    String ack = "{\"requestId\":\"" + requestId + "\",\"result\":\"FAILED\"}";
    mqtt.publish(T_DEVICE_ACK, ack.c_str());
    return;
  }

  int pin = getPin(deviceId);
  if (pin < 0) {
    Serial.println("❌ Unknown device: " + deviceId);
    String ack = "{\"requestId\":\"" + requestId + "\",\"result\":\"FAILED\"}";
    mqtt.publish(T_DEVICE_ACK, ack.c_str());
    return;
  }

  // Thực thi GPIO
  bool turnOn = (action == "ON");
  digitalWrite(pin, turnOn ? LED_ON : LED_OFF);
  Serial.println(turnOn ? "💡 " + deviceId + " → ON" : "⬛ " + deviceId + " → OFF");

  // Gửi ACK SUCCESS (kèm requestId để Backend map)
  String ack = "{\"requestId\":\"" + requestId + "\",\"result\":\"SUCCESS\"}";
  mqtt.publish(T_DEVICE_ACK, ack.c_str());
  Serial.println("📤 ACK: " + ack);
}

// ========================================
// SETUP
// ========================================
void setup() {
  Serial.begin(115200);
  Serial.println("╔══════════════════════════════════════╗");
  Serial.println("║   🏠 IoT Smart Home - Project 4     ║");
  Serial.println("║   Ngô Đức Anh Tuấn - B22DCPT248    ║");
  Serial.println("╚══════════════════════════════════════╝");

  pinMode(LED1, OUTPUT); 
  pinMode(LED2, OUTPUT); 
  pinMode(LED3, OUTPUT);
  digitalWrite(LED1, LED_OFF); 
  digitalWrite(LED2, LED_OFF); 
  digitalWrite(LED3, LED_OFF);

  dht.begin();
  wifiConnect();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  mqtt.setCallback(onMessage);
  mqtt.setBufferSize(512);  // Tăng buffer cho JSON dài
}

// ========================================
// LOOP
// ========================================
void loop() {
  if (WiFi.status() != WL_CONNECTED) wifiConnect();
  if (!mqtt.connected()) mqttConnect();
  mqtt.loop();

  // Gửi dữ liệu cảm biến mỗi 2 giây
  if (millis() - lastMs >= 2000) {
    lastMs = millis();

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int ldr_raw = analogRead(LDR_PIN);
    int ldr = 1023 - ldr_raw;

    if (isnan(t) || isnan(h)) {
      Serial.println("⚠️ DHT read failed!");
      return;
    }

    // Payload sensor (giữ format tương thích P3, backend đọc được)
    String msg = "{\"temp\":" + String(t, 1) + 
                 ",\"humidity\":" + String(h, 1) + 
                 ",\"light\":" + String(ldr) + "}";
    
    mqtt.publish(T_SENSOR, msg.c_str());
    Serial.println("📤 Sensor: " + msg);
  }
}
