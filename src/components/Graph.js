import React from 'react';
import {Bar} from 'react-chartjs-2';
import { useEffect, useState} from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import seedrandom from 'seedrandom';

const INITIAL_GRAPH_DATA = {
  labels: [],
  datasets: []
}

const plugins = [ChartAnnotation];

function Graph({data, showAverage, showLogarithmic}) {

  const [graphData, setGraphData] = useState(INITIAL_GRAPH_DATA);

  const smMedia = useMediaQuery('(max-width:1000px)');

  const getGraphProps = (seed) => {
    var rng = seedrandom(seed);
    const hue = Math.round(rng() * 359);
    // const slot = id % 10;
    // const variance = ((id / 10) * 5) % 36;
    // const hue = Math.round(slot * 36 + variance);

    return {
      backgroundColor: `hsla( ${hue}, 70%, 60%, 0.6)`,
      borderColor: `hsla( ${hue}, 70%, 60%, 1)`,
      hoverBackgroundColor: `hsla( ${hue}, 70%, 60%, 0.8)`,
      hoverBorderColor: `hsla( ${hue}, 70%, 60%, 1)`,
      borderWidth: 1,
    }
  }

  useEffect(() => {
    setGraphData({
      labels: data.labels,
      datasets: data.datasets.map((d, idx) => {
        if (d.isAverage) {
          return {...d, hidden: !showAverage};
        }
        return {...d, ...getGraphProps(d.regionCode)};
      })
    });
  }, [data, showAverage, showLogarithmic])

  return (
      <div>
        <Bar
          data={graphData}
          height={500}
          plugins={plugins}
          options={{
            maintainAspectRatio: false,
            //onResize: updateHeight,
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: showLogarithmic ? 
                [{
                  stacked: true,
                  type: 'logarithmic',
                  ticks: {
                      callback: (value, index, values) => {
                          if (value >= 100000 && value < 1000000 && value % 100000 === 0) return value / 100000 + "00K";
                          if (value >= 10000 && value < 100000 && value % 10000 === 0) return value / 10000 + "0K";
                          if (value >= 1000 && value < 10000 && value % 1000 === 0) return value / 1000 + "K";
                          if (value >= 100 && value < 1000 && value % 100 === 0) return value / 100;
                          if (value >= 10 && value < 100 && value % 10 === 0) return value / 10;
                          if (value >= 0 && value < 10) return value;
                          return null;
                      }
                  }
                }]
                : 
                [{
                    stacked: true,
                    type: 'linear',
                    ticks: {}
                }]
            },
            legend: {
              labels: {
                  filter: (item, chart) => {
                      // Logic to remove a particular legend item goes here
                      return !item.text.includes('average');
                  }
              }
            },
            annotation: {
              annotations: [{
                type: 'box',
                drawTime: 'beforeDatasetsDraw',
                // ID of the X scale to bind onto
	              xScaleID: 'x-axis-0',
                xMin: graphData.labels.length - 10,
                xMax: graphData.labels.length,
                backgroundColor: 'rgba(255, 50, 0, 0.1)',
              }, {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: graphData.labels.length - 10,
                borderColor: 'rgba(255, 50, 0, 0.3)',
                borderWidth: 1,
                label: {
                  backgroundColor: 'rgba(255, 50, 0, 0.6)',
                  content: ['Data likely', 'to change'],
                  position: "left",
                  xAdjust: smMedia ? -20 : 0,
                  enabled: true,
                },
              },]
           }
        }}
        />
      </div>
    );
}

export default Graph;
