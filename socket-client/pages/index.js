import React from 'react';

import Card from "../components/Card/index.jsx";

import classname from 'classname';
import ControlPanel from './_app';
import styles from '../styles/Home.module.css';
import { COLORS } from '../constants/variables';

class SensorDataset {
  constructor({ id, localIP, sensor }) {
    this.MAX_SIZE = 1000;
    this.data = [];
    this.deviceId = id;
    this.sensor = sensor;
    this.localIP = localIP;
  }

  add(data) {
    if (this.data.length >= this.MAX_SIZE) {
      this.data = this.data.slice(1, this.MAX_SIZE);
    }
    this.data.push(data);
  }

  getDataSize() {
    return this.data.length;
  }
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.socket = null;
    this.state = {
      limits: {
        temperature: 0
      },
      temperature: [],
      humidity: [],
      sound: [],
      readings: 0
    };
  }

  startWebSocketConnection() {
    this.socket = new WebSocket(process.env.WS_URL);

    this.socket.onopen = () => {
      this.socket.onmessage = (message) => {
        var deviceDataMessage = JSON.parse(message.data);
        if (deviceDataMessage.device.data.temperature) {
          let deviceDataset = null;
          for (let device of this.state.temperature) {
            if (device.deviceId === deviceDataMessage.device.device_id) {
              deviceDataset = device;
              break;
            }
          }

          if (!deviceDataset) {
            deviceDataset = new SensorDataset({
              id: deviceDataMessage.device.device_id,
              sensor: deviceDataMessage.device.sensor,
              localIP: deviceDataMessage.device.device_local_ip
            });

            this.state.temperature.push(deviceDataset);
          }

          deviceDataset.add(deviceDataMessage.device.data.temperature);

          this.setState(old => ({ limits: { ...old.limits, temperature: ++old.limits.temperature } }));
        }

        if (deviceDataMessage.device.data.humidity) {
          // this.setState({
          //   humidity: [...(this.state.humidity.length >= 100 ? this.state.humidity.slice(0, 99) : this.state.humidity), deviceDataMessage.value.humidity],
          // });
        }
      };
    };

    this.socket.onerror = (event) => {
      console.log(event);
    };

    this.socket.onclose = () => {
      // Reconnect
      this.socket = null;

      this.startWebSocketConnection();
    };
  }

  componentDidMount() {
    this.startWebSocketConnection();
  }

  render() {
    const { temperature, limits } = this.state;
    return (
      <div className={classname(styles.container, styles['bg-dark-blue'])}>
        <div className='d-flex d-column p-2'>
          {temperature.map((device, key) => {
            console.log(device);
            return (
              <Card
                title={'Temperature'}
                info={{
                  component: `${device.sensor} (${device.deviceId})`,
                  ip: device.localIP
                }}
                time={'12:00:00'}
                data={{
                  labels: Array.from({ length: 100 }, (_, i) => i.toString()),
                  datasets: [{
                    label: 'Temperature',
                    borderColor: COLORS.temperature,
                    backgroundColor: COLORS.temperature + '8D',
                    fill: false,
                    lineTension: 0.1,
                    data: device.data
                  }],
                }}
                options={{
                  scales: {
                    y: {
                      suggestedMin: 5,
                      suggestedMax: 50
                    }
                  }
                }}
                img={'/images/icons/thermometer.png'}
                key={key}
              />
            );
          })}

          <Card
            title={'Humidity'} info={{ component: '---', ip: '---' }}
            time={'12:00:00'}
            data={{
              labels: this.state.humidity,
              datasets: [{
                label: 'Humidity',
                borderColor: COLORS.humidity,
                backgroundColor: COLORS.humidity + '8D',
                fill: false,
                lineTension: 0.1,
                data: this.state.humidity
              }]
            }}
            img={'/images/icons/humidity.png'}
          />

          <Card
            title={'Sound'} info={{ component: '---', ip: '---' }}
            time={'12:00:00'}
            data={{
              labels: this.state.sound,
              datasets: [{
                label: 'Sound',
                borderColor: COLORS.sound,
                backgroundColor: COLORS.sound + '8D',
                fill: false,
                lineTension: 0.1,
                data: this.state.sound
              }]
            }}
            img={'/images/icons/sound.png'}
          />
        </div>
      </div>
    )
  }
}
