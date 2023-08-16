import React from 'react';
import { Chart as chartjs, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'react-chartjs-2';

chartjs.register(
    CategoryScale,
    LinearScale,
    BarElement
)

export default function BarChart({subData}){
    console.log(subData)
    const graphLable=subData?subData[0] : ['','','','','']
    const graphdata=subData?subData[1] : [1,2,3,4,5]

    var data = {
        labels: [...graphLable],
        datasets: [{
            label: 'Subscription',
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
        },
        legend: {
            labels: {
                fontSize: 26
            }
        }
    }

    return(
        <>
            <div style={{width: "400px", marginLeft: 'auto', marginRight: 'auto'}}>
               
                <Bar 
                    data={data}
                    height={200}
                    options={options}
                />
            </div>
        </>
    )
}
