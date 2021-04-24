### Mosquitto configuration guide

#### Install on Ubutu or Raspiberry Pi
sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
sudo apt update
sudo apt install mosquitto
sudo apt install mosquitto-clients

##### Install with Snap 
sudo snap install mosquitto

___

#### Publish message to url/topic 
mosquitto_pub -h **url/ip/hostname** -p **port** -t **topic** -m **'msg'**

#### Subscribe message to url/topic 
mosquitto_sub -h **url/ip/hostname** -p **port** -t **topic** 

##### Mosquito configuration file
sudo cp doc/mosquitto.conf.example /etc/mosquitto/mosquitto.conf

___

### Arduino configuration guide

Arduino library available on: https://github.com/knolleary/pubsubclient.git




