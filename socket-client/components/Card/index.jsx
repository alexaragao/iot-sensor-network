import React from 'react';
import { Line } from 'react-chartjs-2'
import Image from 'next/image';
import classname from 'classname';
import styles from './Card.module.css';

export default function Card({ title, img, time, info, data }) {

    return (
        <>
            <div className={classname(styles['card'], 'd-flex flex-column  r-center p-2')}>
                <div className={classname('d-flex flex-row center m-2')}>
                    <div className={styles['circle']}>
                        <Image src={img} height={24} width={24} layout='fixed' className='center' />
                    </div>
                    <h5 className='ms-2'>{title}</h5>

                    <div className={classname(styles['time'], 'ms-auto  d-flex center p-1')}>
                        <Image src={'/images/icons/clock.png'} height={20} width={20} layout='fixed' className='' ></Image>
                        <p>{time}</p>
                    </div>
                </div>
                <p>{info.component}</p>
                <p>IP: {info.ip}</p>
                <div className={classname('mt-2 p-1 ')}>
                    <Line
                        borderColor={'#fff'}
                        data={data}
                        width={200}
                        height={150}
                    />
                </div>
            </div>

        </>
    );
}
