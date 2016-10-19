import * as d3 from 'd3';

import {
    D3BarChart
} from './lib/D3BarChart';

// import item_array from '../data/letter_freq.js'

// show_chart();


d3.json("data/letter_freq.json", function(data) {
    show_chart(data);
});

function show_chart(item_array) {
    let param_obj = {};
    param_obj.parent_id = 'el_chart';
    param_obj.item_array = item_array;

    let chart_obj = new D3BarChart();
    chart_obj.show_chart(param_obj);
}
