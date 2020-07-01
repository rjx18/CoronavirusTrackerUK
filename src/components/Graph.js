import React from 'react';
import {Bar} from 'react-chartjs-2';
import { useEffect, useState} from 'react';
import seedrandom from 'seedrandom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import * as ChartAnnotation from 'chartjs-plugin-annotation'

const INITIAL_GRAPH_DATA = {
  labels: [],
  datasets: []
}

const plugins = [ChartAnnotation];

function Graph({data, showAverage}) {

  const [graphData, setGraphData] = useState(INITIAL_GRAPH_DATA);
//  const [height, setHeight] = useState(0);

  const smMedia = useMediaQuery('(max-width:1000px)');

  const getGraphProps = (seed) => {
    var rng = seedrandom(seed);
    const hue = Math.round(rng() * 380);

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
  }, [data, showAverage])

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
                yAxes: [{
                    stacked: true
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
