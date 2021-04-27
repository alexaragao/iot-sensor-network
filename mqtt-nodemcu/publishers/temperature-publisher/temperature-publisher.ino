#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include "./conf.h"

// You can use https://www.browserling.com/tools/random-hex to generate a random SENSOR_ID
#define SENSOR_ID "aa98a2482acebaf52b8848d6"

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
#define SENSOR_PIN A0

//Prototypes
void initSensor();
void initWiFi();
void initMQTT();

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

float readTemperature() {
  float steinhartHartCoficient_A = 9.017477479678323e-04;
  float steinhartHartCoficient_B = 2.4891903099470377e-04;
  float steinhartHartCoficient_C = 2.0432138570931753e-07;

  float voltageRead = analogRead(SENSOR_PIN);
  float R = 10000 * (1023.0 / (float) voltageRead - 1.0);
  float lnR = log(R);
  
  return 1.0f/(steinhartHartCoficient_A +steinhartHartCoficient_B * lnR + steinhartHartCoficient_C * lnR * lnR * lnR);
}

void publishSensorData() {
  Serial.println(readTemperature() - 273.15f);
  StaticJsonDocument<256> data;

  data["device_id"] = SENSOR_ID;
  data["device_local_ip"] = WiFi.localIP().toString();
  data["sensor"] = "Thermistor NTC 10k 103";
  data["timestamp"] = millis();

    JsonObject sensorObject = data.createNestedObject("data");
    sensorObject["temperature"] = readTemperature() - 273.15;

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
  pinMode(SENSOR_PIN, INPUT);
}
