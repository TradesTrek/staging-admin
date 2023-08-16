import React from 'react';
import { Chart as chartjs, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
import { Line } from 'react-chartjs-2';

chartjs.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement
)

export default function LineChart({subData}){
   
    const graphLable=subData?.time?.length>0? subData?.time : ["00 AM", "01 AM", "02 AM", "03 AM", "04 AM", "05 AM", "06 AM", "07 AM", "08 AM", "09 AM", "10 AM","11 AM","12 AM","01 PM","02 PM","03 PM","04 PM","05 PM","06 PM","07 PM","08 PM","09 PM","10 PM","11PM"]
    const graphdata=subData?.count?.length>0? subData?.count : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
 
    const data = {
        labels: [...graphLable],
        datasets: [{
            label: '# Users',
            data: [...graphdata],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
    var options = {
        maintainAspectRation: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }

    return(
        <>
            <div style={{width: '71vw', marginLeft: 'auto', marginRight: 'auto'}}>
                <Line 
                    data={data}
                    height={100}
                    options={options}
                />
            </div>
        </>
    )
}
