import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', ],
  datasets: [
    {
      label: 'My First dataset',
      regionCode: 'asda',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40, ]
    }, 
    {
        label: 'My First dataset',
        backgroundColor: 'rgba(29,102,203,0.2)',
        borderColor: 'rgba(29,102,203,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(29,102,203,0.4)',
        hoverBorderColor: 'rgba(29,102,203,1)',
        data: [65, 59, 80, 81, 56, 55, 40, ]
    }, 
    {
        label: 'My First dataset',
        backgroundColor: 'rgba(29,102,203,0.2)',
        borderColor: 'rgba(29,102,203,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(29,102,203,0.4)',
        hoverBorderColor: 'rgba(29,102,203,1)',
        data: [65, 59, 80, 81, 56, 55, 40, ],
        type: 'line'
    }, 
  ],
};

export class Graphdemo extends Component {

  render() {
    return (
      <div>
        <Bar
          data={data}
          options={{
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }}
        />
      </div>
    );
  }
}

export default Graphdemo