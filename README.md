# ESP8266 IOT Pill Dispenser
This project uses the NodeMCU8266 to receive http requests to control a servo motor that dispenses a pill.
# Used libraries
- [LiquidCrystal_I2C](https://github.com/johnrickman/LiquidCrystal_I2C)
- [Arduino_JSON](https://github.com/arduino-libraries/Arduino_JSON)
# Technologies used
 - React for the front end.
 - NodeJS for the back end.
 - PostgreSQL to store everything related to the app.
# Installation
## Back end
For the backend we need to set the following environment variables:   
- `DATABASE_URL` - The url of your postgres database with the credentials.
- `ESP8266_URL` - The url of your ESP8266.
