import React from 'react';

import Card from "../components/Card/index.jsx";

import classname from 'classname'
import ControlPanel from './_app'
import styles from '../styles/Home.module.css'

const data = {
  labels: ['Time'],
  datasets: [
    {
      label: '',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: []
    }
  ],

};


export default function Home() {

  React.useEffect(() => {

  }, []);


  return (
    <div className={classname(styles.container, styles['bg-dark-blue'])}>
      <div className='d-flex d-column p-2'>
        <Card title={'Temperature'} info={{ component:'Component Name', ip:'192.168.0.56' }} time={'12:00:00'} data={data} img={'/images/icons/thermometer.png'} />
        <Card title={'Humidity'} info={{ component:'Component Name', ip:'192.168.0.56' }} time={'12:00:00'} data={data} img={'/images/icons/humidity.png'} />
        <Card title={'Sound'} info={{ component:'Component Name', ip:'192.168.0.56' }} time={'12:00:00'} data={data} img={'/images/icons/sound.png'} />
      </div>

    </div>
  )
}
