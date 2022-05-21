#define buzzerPin 13 //PIN D7
#define servoPin 0 //D3
//generales
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <LiquidCrystal_I2C.h>
#include <Arduino_JSON.h>
#include <Servo.h>
#include <time.h>

//importes mios
#include "alert_data.h"


const char *ssid = "INT_CASA", *password = "Internet170casa_321";
const int timezone = -6*3600;
int dst = 0;


//Request handlers
void handleRoot();
void handleServo();
void handle404();

//Objetos
ESP8266WebServer server(80);
LiquidCrystal_I2C lcd(0x27,16,2);
Servo servo;
//Objetos mios.
AlertData adata;

 
void setup() {
    pinMode(LED_BUILTIN, OUTPUT);
    Serial.begin(115200);
    setupLCD();
    setupHTTP();
    setupServo();
}

void loop() {
    server.handleClient();
//    Serial.print("Free:");
//    Serial.println(ESP.getFreeHeap());

    if(servoLogic()){
      // si la logica del servo esta corriendo
      //no mostraremos la hora.
      return;
    }
    char * data = getDateAndTime();
    //imprimir fecha.
    lcd.setCursor(0, 0);
    lcd.print(strtok(data, " "));
    //imprimir hora.
    lcd.setCursor(0, 1);
    lcd.print(strtok(NULL, " "));
    //liberamos la memoria.
    free(data);
}

char* getDateAndTime(){
    char * format = (char *) malloc(20);
    char aux[20];
    
    time_t now = time(nullptr);
    struct tm* p_tm  = localtime(&now);
    
    sprintf(aux, "%02d/%02d/%02d %02d:%02d:%02d", 
            p_tm->tm_year+1900, p_tm->tm_mon+1, p_tm->tm_mday,
            p_tm->tm_hour, p_tm->tm_min, p_tm->tm_sec
    );
    strcpy(format, aux);
    return format;
}

//SETUPS
void setupServo(){
    servo.attach(servoPin); 
    servo.write(0); 
}

void setupLCD(){
  //D1 SLC - D2 SDA
  lcd.init();
  lcd.backlight();
}

void setupHTTP(){
  Serial.printf("Conectando: %s\n", ssid);
  Serial.printf("Mac: %s\n", WiFi.macAddress().c_str());
  //lcd
  lcd.setCursor(0, 0);
  lcd.print("Conectando a..");
  lcd.setCursor(0, 1);
  lcd.print(ssid);

  WiFi.begin(ssid, password); 
  while (WiFi.status() != WL_CONNECTED) {
      Serial.print(".");
      delay(250);
  }

  //config time
  configTime(timezone, dst, "pool.ntp.org", "time.nist.gov");

  Serial.println("\nWiFi conectado, iniciando servidor...");
  server.on("/", HTTP_GET, handleRoot);
  server.on("/servo", HTTP_POST, handleServo);
  server.onNotFound(handle404);
  server.begin();
  Serial.printf("Servidor HTTP iniciado: http://%s/", WiFi.localIP().toString().c_str());

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Server iniciado");
  delay(1000);
  lcd.clear();
}

//REQUEST HANDLERS.
void handleRoot(){
   server.send(200, "text/plain", "Bienvenido");
}

void handle404(){
    server.send(404, "text/plain", "404: Page not found");
}

void handleServo(){
    if(!server.hasArg("plain")){
      server.send(400);
      return;
    }
    String resp = server.arg("plain");
    JSONVar json = JSON.parse(resp);
    
    if(!json.hasOwnProperty("nombre_persona") || !json.hasOwnProperty("nombre_alarma")){
      server.send(400);
      return;
    }
    
    const char * nombre = json["nombre_persona"];
    const char * n_alarma = json["nombre_alarma"];
    server.send(200, "text/plain", "Pastilla dispensada");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print(nombre);
    lcd.setCursor(0,1);
    lcd.print(n_alarma);
    adata.start();
}


bool servoLogic(){
    if(!adata.startAlert){
      return false;
    }

    unsigned long now = millis();
    //servo start.
    if(!adata.tasks[0]){
        adata.tasks[0] = true;
        servo.write(180);
    }

    //servo return.
    if(now-adata.times[0] > 1500 && !adata.tasks[1]){
        adata.tasks[1] = true;
        servo.write(0);
    }

    //buzzer task.
    if(!adata.tasks[2]){
        if(now - adata.times[1] > 250){
          adata.times[1] = millis();
          tone(buzzerPin, 1200, 150);

          if(adata.buzTimes++ >= 8){
            adata.tasks[2] = true;
          }
        }
    }

    if(adata.isComplete()){
        adata.reset();
        lcd.clear();
    }
    return true;
}
