"use strict";


var yValues_ = [ 0.519, 0.5, 0.5, 0.47, 0.471, 0.46, 0.5, 0.5, 0.7, 0.5, 0.6, 0.55, 0.51, 0.505, 0.5, 0.5, 0.4, 0.99, 0.2, 0.5, 0.49, 0.51, 0.52, 0.5, 0.5, 0.5, 0.5, 0.51, 0.505, 0.5, 0.5, 0.51, 0.99, 0.99, 0.98, 0.95, 0.99, 0.6, 0.99, 0.7, 0.75, 0.51, 0.515, 0.5, 0.51, 0.5, 0.99, 0.5, 0.8, 0.75, 0.8, 0.75, 0.8, 0.75, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99, 0.99 ];
var yValues = [];

/*for(let i = 0; i < 2; i++) {
  yValues.push(null);
}*/

for(let i = 0; i < yValues_.length; i++) {
	yValues.push(yValues_[i]);
}

const Highcharts = require("Highcharts");

var hchart = Highcharts.chart('graph', {
    chart: {
        type: 'areaspline',
        backgroundColor: '#484845',
        spacing: [0, 0, 0, 0],
        margin: 0,
        reflow: true,
		animation: false,
		events: {
			click: function(event) { hub.winrate_click(event); 
				console.log(event.xAxis[0].value); }
		}
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
	tooltip: {
        crosshairs: true,
        backgroundColor: 'white',
		color: 'black',
		borderRadius: 2,
    	borderWidth: 2,
		followPointer: true,
		formatter: function() {
			return `<strong>${(this.y * 100).toFixed(1)} %</strong>`;
		},
		style:{
			cursor: 'default',
			fontSize:'20px',
		}
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
		animation: false,
        marker: {
        	enabled: true,
			radius: 0.1,
        },
		point: {
			events: {
				//click: function(event) { graphClick(event); }
		   }
	   }
    }]
});

function NewGrapher() {

	let grapher = Object.create(null);
	
	grapher.dragging = false;			// Used by the event handlers in start.js

	grapher.clear_graph = function() {

		let boundingrect = graph.getBoundingClientRect();
		let width = window.innerWidth - boundingrect.left - 16;
		let height = boundingrect.bottom - boundingrect.top;

		// This clears the canvas...

		graph.width = width;
		graph.height = height;
	};

	grapher.draw = function(node, force) {
		if (config.graph_height <= 0) {
			return;
		}
		this.draw_everything(node, force);
	};

	var lastMarkerIndex = -1;
	var lastEvalList = null;

	grapher.draw_everything = function(node, force) {

		let eval_list = node.future_eval_history();

		var yValues = [];

		let skip_draw = true;

		if(lastEvalList === null && eval_list !== null) {
			skip_draw = false;
		}

		if(lastEvalList !== null && eval_list !== null) {
			if(lastEvalList.length !== eval_list.length) {
				skip_draw = false;
			}
		}

		for(let i = 0; i < eval_list.length; i++) {
			if(lastEvalList !== null && eval_list !== null && eval_list[i] !== lastEvalList[i] && skip_draw) {
				if(Math.abs(eval_list[i] - lastEvalList[i]) >= 0.05) {
					skip_draw = false;
				}
			}

			//console.log(eval_list[i]);

			if(eval_list[i] !== null) {
				yValues.push(eval_list[i]);
			} else {
				yValues.push(null);
			}

			if(yValues[i] !== null) {
				if(hub.tree.node !== null && hub.tree.node !== undefined && hub.tree.node.depth === i) {
					if(lastMarkerIndex !== i) {
						yValues[i] = {y:yValues[i], marker: {radius:6,fillColor:"orange",lineColor:"orange",hover:null}};
					} else {
						lastMarkerIndex = i;
					}
				} else {
					yValues[i] = {y:yValues[i], marker: {radius:1,hover:null}};
				}
			}
		}

		if(yValues.length < 40) {
			for(let j = 0; j < (40 - yValues.length); j++) {
				yValues.push(null);
			}
		}

		if(force2) {
			hchart.series[0].setData(yValues, false, false, false);
			hchart.redraw(false);
			lastEvalList = eval_list;
			force2 = false;
		}

		//let runs = this.make_runs(eval_list, width, height, node.graph_length_knower.val);
		return;
		// Draw our normal runs...

		graphctx.strokeStyle = "white";
		graphctx.lineWidth = config.graph_line_width;
		graphctx.setLineDash([]);

		for (let run of runs.normal_runs) {
			graphctx.beginPath();
			graphctx.moveTo(run[0].x1, run[0].y1);
			for (let edge of run) {
				graphctx.lineTo(edge.x2, edge.y2);
			}
			graphctx.stroke();
		}

		// Draw our dashed runs...

		graphctx.strokeStyle = "#999999";
		graphctx.lineWidth = config.graph_line_width;
		graphctx.setLineDash([config.graph_line_width, config.graph_line_width]);

		for (let run of runs.dashed_runs) {
			graphctx.beginPath();
			graphctx.moveTo(run[0].x1, run[0].y1);
			for (let edge of run) {
				graphctx.lineTo(edge.x2, edge.y2);
			}
			graphctx.stroke();
		}
	};

	grapher.make_runs = function(eval_list, width, height, graph_length) {

		// Returns an object with 2 arrays (normal_runs and dashed_runs).
		// Each of those is an array of arrays of contiguous edges that can be drawn at once.

		let all_edges = [];

		let last_x = null;
		let last_y = null;
		let last_n = null;

		// This loop creates all edges that we are going to draw, and marks each
		// edge as dashed or not...

		for (let n = 0; n < eval_list.length; n++) {

			let e = eval_list[n];

			if (e !== null) {

				let x = width * n / graph_length;

				let y = (1 - e) * height;
				if (y < 1) y = 1;
				if (y > height - 2) y = height - 2;

				if (last_x !== null) {
					all_edges.push({
						x1: last_x,
						y1: last_y,
						x2: x,
						y2: y,
						dashed: n - last_n !== 1,
					});
				}

				last_x = x;
				last_y = y;
				last_n = n;
			}
		}

		// Now we make runs of contiguous edges that share a style...

		let normal_runs = [];
		let dashed_runs = [];

		let run = [];
		let current_meta_list = normal_runs;	// Will point at normal_runs or dashed_runs.

		for (let edge of all_edges) {
			if ((edge.dashed && current_meta_list !== dashed_runs) || (!edge.dashed && current_meta_list !== normal_runs)) {
				if (run.length > 0) {
					current_meta_list.push(run);
				}
				current_meta_list = edge.dashed ? dashed_runs : normal_runs;
				run = [];
			}
			run.push(edge);
		}
		if (run.length > 0) {
			current_meta_list.push(run);
		}

		return {normal_runs, dashed_runs};
	};

	grapher.draw_50_percent_line = function(width, height) {
		return;

		// Avoid anti-aliasing... (FIXME: we assumed graph size was even)
		let pixel_y_adjustment = config.graph_line_width % 2 === 0 ? 0 : -0.5;

		graphctx.strokeStyle = "#666666";
		graphctx.lineWidth = config.graph_line_width;
		graphctx.setLineDash([config.graph_line_width, config.graph_line_width]);
		graphctx.beginPath();
		graphctx.moveTo(0, height / 2 + pixel_y_adjustment);
		graphctx.lineTo(width, height / 2 + pixel_y_adjustment);
		graphctx.stroke();
	};

	grapher.draw_position_line = function(eval_list_length, node) {
		return;

		if (eval_list_length < 2) {
			return;
		}

		let width = graph.width;
		let height = graph.height;

		// Avoid anti-aliasing with x value, line up with 50 percent line (above) with y value...
		let pixel_x_adjustment = config.graph_line_width % 2 === 0 ? 0 : 0.5;
		let pixel_y_adjustment = config.graph_line_width % 2 === 0 ? 0 : -0.5;

		let x = Math.floor(width * node.depth / node.graph_length_knower.val) + pixel_x_adjustment;

		graphctx.strokeStyle = node.is_main_line() ? "#6cccee" : "#ffff00";
		graphctx.lineWidth = config.graph_line_width;
		graphctx.setLineDash([config.graph_line_width, config.graph_line_width]);

		graphctx.beginPath();
		graphctx.moveTo(x, height / 2 + pixel_y_adjustment - config.graph_line_width - 1);
		graphctx.lineTo(x, 0);
		graphctx.stroke();

		graphctx.beginPath();
		graphctx.moveTo(x, height / 2 + pixel_y_adjustment + config.graph_line_width + 1);
		graphctx.lineTo(x, height);
		graphctx.stroke();
	};

	grapher.node_from_click = function(node, event) {

		/*if (!event || config.graph_height <= 0) {
			return null;
		}

		let mousex = event.offsetX;
		if (typeof mousex !== "number") {
			return null;
		}

		let width = graph.width;
		if (typeof width !== "number" || width < 1) {
			return null;
		}*/

		let node_list = node.future_node_history();
		if (node_list.length === 0) {
			return null;
		}

		// OK, everything is valid...

		let click_depth = Math.round(event.xAxis[0].value);

		if (click_depth < 0) click_depth = 0;
		if (click_depth >= node_list.length) click_depth = node_list.length - 1;

		return node_list[click_depth];
	};

	return grapher;
}
