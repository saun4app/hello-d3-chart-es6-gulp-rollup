import * as d3 from 'd3';

export class D3BarChart {
    constructor(param_obj = {}) {
        this._init_default();
    }

    show_chart(param_obj) {
        this._init_param(param_obj);
        this._render();
        this._init_event();
    }

    _render() {
        if (this.parent_id && this.item_array) {
            this._render_svg_object();
            this._render_content();
        } else {
            console.error('_render(): error');
        }
    }

    _render_svg_object() {
        let self = this;

        d3.select('#' + self.parent_id).selectAll('*').remove();
        self.parent_obj = d3.select('#' + self.parent_id)
            .styles(self.parent_style_obj);

        self.svg_obj = self.parent_obj.append('svg')
            .attr('width', self._get_width('outter '))
            .attr('height', self._get_height('outter '));

        this.svg_group = this.svg_obj.append('g')
            .attr('transform', 'translate(' + self.margin_obj.left + ',' + self.margin_obj.top + ')');
    }

    _update_d3_scale() {
        let self = this;

        if (this.parent_id && this.item_array) {
            self.d3_x_scale_band = d3.scaleBand()
                .rangeRound([0, self._get_width()]).padding(0.1);

            self.y_scale_linear = d3.scaleLinear()
                .rangeRound([self._get_height(), 0]);

            self.d3_x_scale_band.domain(self.item_array.map(function(d) {
                return d.letter;
            }));

            self.y_scale_linear.domain([0, d3.max(self.item_array, function(d) {
                return d.frequency;
            })]);
        }
    }

    _render_content() {
        let self = this;

        if (this.parent_id && this.item_array) {
            self._update_d3_scale();
            _show_axis();
            _show_bar();
        }

        function _show_axis() {
            self.svg_group.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + self._get_height() + ')')
                .call(d3.axisBottom(self.d3_x_scale_band));

            self.svg_group.append('g')
                .attr('class', 'axis axis--y')
                .call(d3.axisLeft(self.y_scale_linear).ticks(10, '%'))
                .append('text')
                .attrs(self.y_axis_config)
                .text('Frequency');
        }

        function _show_bar() {
            self.svg_group.selectAll('.bar')
                .data(self.item_array)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', function(d) {
                    return self.d3_x_scale_band(d.letter);
                })
                .attr('y', function(d) {
                    return self.y_scale_linear(d.frequency);
                })
                .attr('width', self.d3_x_scale_band.bandwidth())
                .attr('height', function(d) {
                    return self._get_height() - self.y_scale_linear(d.frequency);
                });
        }
    }

    ////
    _get_width(level = 'inner') {
        let offset = ('inner' == level) ? (this.margin_obj.left + this.margin_obj.right) : 0;
        return parseInt(this.parent_obj.node().clientWidth) - offset;;
    }

    _get_height(level = 'inner') {
        let offset = ('inner' == level) ? (this.margin_obj.top + this.margin_obj.bottom) : 0;
        return parseInt(this.parent_obj.node().clientHeight) - offset;
    }

    //// init
    _init_param(param_obj) {
        this.parent_id = param_obj.parent_id ? param_obj.parent_id : 'el_chart';
        this.margin_obj = param_obj.margin_obj ? param_obj.margin_obj : this.default_param_obj.margin_obj;
        this.size_obj = param_obj.size_obj ? param_obj.size_obj : this.default_param_obj.size_obj;
        this.y_axis_config = param_obj.y_axis_config ? param_obj.y_axis_config : this.default_param_obj.y_axis_config;
        this.parent_style_obj = param_obj.parent_style_obj ? param_obj.parent_style_obj : this.default_param_obj.parent_style_obj;

        this.item_array = param_obj.item_array ? param_obj.item_array : [];
    }

    _init_event() {
        let self = this;

        d3.select(window).on('resize', function() {
            self._render();
        });
    }

    _init_default() {
        this.default_param_obj = {
            "margin_obj": {
                "top": 20,
                "right": 20,
                "bottom": 30,
                "left": 40
            },
            "size_obj": {
                "width_obj": {
                    "initial": 960,
                    "max": 960,
                    "min": 480
                },
                "height_obj": {
                    "initial": 500,
                    "max": 500,
                    "min": 250
                }
            },
            "y_axis_config": {
                "transform": "rotate(-90)",
                "y": 6,
                "dy": ".71em",
                "text-anchor": "end"
            },
            "parent_style_obj": {
                "width": '100%',
                "min-width": '10em',
                "min-height": '14em'
            }
        };
    }
}
