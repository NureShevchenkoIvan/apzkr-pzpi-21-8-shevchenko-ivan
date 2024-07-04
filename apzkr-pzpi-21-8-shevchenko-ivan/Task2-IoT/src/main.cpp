#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

#define DHTPIN 21
#define DHTTYPE DHT22
#define NUTRIENT_PIN 35

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* serverUrl = "http://192.168.31.85:3000/api/sensors/data";

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void sendSensorData(const char* sensorType, float value) {
  StaticJsonDocument<200> doc;
  doc["sensorId"] = "esp32_001";
  doc["type"] = sensorType;
  doc["value"] = value;

  String postData;
  serializeJson(doc, postData);

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(postData);

  if (httpResponseCode >= 200 && httpResponseCode < 300) {
    Serial.printf("%s data sent successfully. Value: %.2f\n", sensorType, value);
  } else {
    Serial.printf("Error sending %s data: %d\n", sensorType, httpResponseCode);
  }

  http.end();
}

void sendNutrientData() {
  int nutrientValue = analogRead(NUTRIENT_PIN);
  
  // Масштабуємо значення до різних діапазонів для кожного елемента
  int nitrogen = map(nutrientValue, 0, 4095, 0, 400);
  int phosphorus = map(nutrientValue, 0, 4095, 0, 300);  // Менший діапазон для фосфору
  int potassium = map(nutrientValue, 0, 4095, 100, 400);  // Зміщений діапазон для калію

  // Додаємо невелику випадкову варіацію для кожного елемента
  nitrogen += random(-20, 21);  // +/- 20
  phosphorus += random(-15, 16);  // +/- 15
  potassium += random(-25, 26);  // +/- 25

  // Обмежуємо значення в межах допустимого діапазону
  nitrogen = constrain(nitrogen, 0, 400);
  phosphorus = constrain(phosphorus, 0, 400);
  potassium = constrain(potassium, 0, 400);

  StaticJsonDocument<200> doc;
  doc["sensorId"] = "esp32_001";
  doc["type"] = "nutrients";

  JsonObject value = doc.createNestedObject("value");
  value["nitrogen"] = nitrogen;
  value["phosphorus"] = phosphorus;
  value["potassium"] = potassium;

  String postData;
  serializeJson(doc, postData);

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(postData);

  if (httpResponseCode >= 200 && httpResponseCode < 300) {
    Serial.printf("Nutrient data sent successfully. N: %d, P: %d, K: %d\n", 
                  nitrogen, phosphorus, potassium);
  } else {
    Serial.printf("Error sending nutrient data: %d\n", httpResponseCode);
  }

  http.end();
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (!isnan(humidity)) {
    sendSensorData("soil_moisture", humidity);
  } else {
    Serial.println("Error reading humidity");
  }

  if (!isnan(temperature)) {
    sendSensorData("soil_temperature", temperature);
  } else {
    Serial.println("Error reading temperature");
  }

  sendNutrientData();

  Serial.println();
  delay(30000);  // Відправляємо дані кожні 30 секунд
}