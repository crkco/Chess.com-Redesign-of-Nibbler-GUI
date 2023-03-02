

// Calculate the y-axis values using e^x function
var yValues_ = [ 0.519, 0.5, 0.5, 0.47, 0.471, 0.46, 0.5, 0.5, 0.7, 0.5, 0.6, 0.55, 0.51, 0.505, 0.5, 0.5, 0.4, 0.99, 0.2, 0.5, 0.49, 0.51, 0.52, 0.5, 0.5, 0.5, 0.5, 0.51, 0.505, 0.5, 0.5, 0.51, 0.99, 0.99, 0.98, 0.95, 0.99, 0.6, 0.99, 0.7, 0.75, 0.51, 0.515, 0.5, 0.51, 0.5, 0.99, 0.5, 0.8, 0.75, 0.8, 0.75, 0.8, 0.75, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99 ];
var yValues = [];

/*for(let i = 0; i < 2; i++) {
  yValues.push(null);
}*/

for(let i = 0; i < yValues_.length; i++) {
	yValues.push(yValues_[i]);
}

document.addEventListener('DOMContentLoaded', function () {
  Highcharts.chart('analysis-chart', {
    chart: {
        type: 'areaspline',
        backgroundColor: '#484845',
        spacing: [0, 0, 0, 0],
        margin: 0,
        reflow: true,
    },
    title: {
      text: ''
    },
    xAxis: {
      labels: {
        enabled: false
      },
      title: false,
      gridLineWidth: 0,
      minorGridLineWidth: 1,
      minorGridLineColor: '#4c4c49',
      minorTickInterval: 4,
      minorTicks: true,
      tickLength: 0,
      lineColor: '#ffffff00',
      endOnTick:false,
      startOnTick:false,
    },
    yAxis: {
      labels: {
        enabled: false
      },
      gridLineWidth: 0,
      minorGridLineWidth: 1,
      minorGridLineColor: '#4c4c49',
      minorTickInterval: 0.1,
      minorTicks: true,
      maxPadding: 0,
      title: false,
      max: 1.1,
      min: -0.1,
      tickLength: 0,
      endOnTick:false,
      startOnTick:false,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: false
        }
      },
      line: {
      	lineColor: 'white', // Change this value to the desired color
    	},
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    series: [{
        data: yValues,
        type: 'areaspline',
        color: '#cccccc',
        fillColor: '#999999',
        threshold: 0.5,
        negativeFillColor: '#666666',
        negativeColor: '#808080',
        marker: {
        	enabled: false,
        },
    }]
});
    });