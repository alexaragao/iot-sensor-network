#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#include "./conf.h"

#define DHT_PIN D1
#define DHT_TYPE DHT22

// You can use https://www.browserling.com/tools/random-hex to generate a random SENSOR_ID
#define SENSOR_ID "da99c6f89140fc97d5ef6aa9"

#define SUBSCRIBE_TOPIC "clock"
#define PUBLISH_TOPIC "sensors/status"

#define ID_MQTT "HomeAut"
#define PUBLISH_DELAY 1000 // 2 seconds

// Edit conf.h file with your WiFi and MQTT Broker information

// WiFi
const char *SSID = ENV::WIFI_SSID;
const char *PASSWORD = ENV::WIFI_PASSWORD;

// MQTT
const char *MQTT_BROKER = ENV::MQTT_BROKER;
const int BROKER_PORT = ENV::MQTT_BROKER_PORT;

// WiFi and MQTT variables
WiFiClient client;
PubSubClient MQTT(client);

// Program variables
DHT dht(DHT_PIN, DHT_TYPE);

//Prototypes
void initWiFi();
void initMQTT();
void initSensor();

void setup() {
  Serial.begin(115200);

  initSensor();

  initWiFi();
  initMQTT();
}

// WiFi Functions
void reconnectWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  WiFi.begin(SSID, PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("Successfully connected to WiFi.");
  Serial.print("Sensor local IP: ");
  Serial.println(WiFi.localIP());
}

void initWiFi() {
  Serial.print("Connecting to network: ");
  Serial.println(SSID);

  reconnectWiFi();
}

// MQTT Functions
void handleMQTTMessage(char *topic, byte *payload, unsigned int length) {
  String topicString = String(topic);
  String msg;

  for (int i = 0; i < length; i++) {
    char c = (char)payload[i];
    msg += c;
  }

  if (topicString.equals("TOPIC")) {
    if (msg.equals("MESSAGE")) {
      // DO SOMETHING
    }
  }
}

void reconnectMQTT() {
  while (!MQTT.connected()) {
    Serial.print("Connecting to MQTT Broker: ");
    Serial.println(MQTT_BROKER);

    if (MQTT.connect(ID_MQTT)) {
      Serial.println("Successfully connected to MQTT Broker.");
      MQTT.subscribe(SUBSCRIBE_TOPIC);
    } else {
      Serial.println("Falha ao reconnectar no broker.");
      Serial.println("Havera nova tentatica de conexao em 2s");
      delay(2000);
    }
  }
}

void initMQTT() {
  MQTT.setServer(MQTT_BROKER, BROKER_PORT);
  MQTT.setCallback(handleMQTTMessage);
}

// Program Functoins
void checkConnectionStatus() {
  if (!MQTT.connected()) {
    reconnectMQTT();
  }

  reconnectWiFi();
}

void publishSensorData() {
  StaticJsonDocument<256> data;
  
  data["device_id"] = SENSOR_ID;
  data["device_local_ip"] = WiFi.localIP().toString();
  data["sensor"] = "DHT11";
  data["timestamp"] = millis();
  
  JsonObject sensorObject = data.createNestedObject("data");
  sensorObject["temperature"] = (float) dht.readTemperature();
  sensorObject["humidity"] = (float) dht.readHumidity();

  char json[256];
  serializeJson(data, json);

  MQTT.publish(PUBLISH_TOPIC, json);

  delay(PUBLISH_DELAY);
}

void loop() {
  checkConnectionStatus();

  publishSensorData();

  // Keep alive MQTT connection
  MQTT.loop();
}

void initSensor() {
  dht.begin();
}
