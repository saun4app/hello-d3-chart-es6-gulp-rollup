'use strict';

var rollup_babel = require('rollup-plugin-babel');
var rollup_commonjs = require('rollup-plugin-commonjs');
var rollup_json = require('rollup-plugin-json');
var rollup_multi_entry = require('rollup-plugin-multi-entry');
var rollup_globals = require('rollup-plugin-node-globals');
var rollup_resolve = require('rollup-plugin-node-resolve');
var rollup_replace = require('rollup-plugin-replace');

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get_plugin_array = get_plugin_array;

function get_plugin_array(is_ugly = false) {
    var plugin_array = [];

    plugin_array.push(rollup_multi_entry());

    plugin_array.push(rollup_resolve({
        jsnext: true,
        main: true,
        browser: true
    }));

    plugin_array.push(rollup_globals());


    plugin_array.push(rollup_commonjs({
      include: ['node_modules/d3/**','node_modules/d3kit/**'],
      namedExports: {
          'node_modules/d3/build/d3.min.js': [ 'd3' ],
          'node_modules/d3kit/dist/d3kit.min.js': [ 'd3kit' ]
      }
    }));

    plugin_array.push(rollup_json());
    plugin_array.push(rollup_babel({
        exclude: 'node_modules/**',
        presets: ['es2015-rollup']
    }));

    if (is_ugly) {
        rollup_replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
            plugin_array.push(rollup_uglify());
    }

    return plugin_array;
}
