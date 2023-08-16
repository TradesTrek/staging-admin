import React from 'react';
import { Chart as chartjs, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2';

chartjs.register(
    Tooltip,
    Legend,
    ArcElement
)

export default function SubscribeUser({userData}){
    let graphdata=userData || [1,2]
    const data = {
        labels: ['Subscribe', 'Unsubscribe'],
        datasets: [{
            label: '# of Votes',
            data: [...graphdata],
            backgroundColor: [
                
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
           
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
            <div style={{width: "300px", marginLeft: 'auto', marginRight: 'auto'}}>
                <Doughnut 
                    data={data}
                    height={200}
                    options={options}
                />
            </div>
        </>
    )
}
