(function (exports,d3) {
'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var D3BarChart = function () {
    function D3BarChart() {
        var param_obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, D3BarChart);

        this._init_default();
    }

    createClass(D3BarChart, [{
        key: 'show_chart',
        value: function show_chart(param_obj) {
            this._init_param(param_obj);
            this._render();
            this._init_event();
        }
    }, {
        key: '_render',
        value: function _render() {
            if (this.parent_id && this.item_array) {
                this._render_svg_object();
                this._render_content();
            } else {
                console.error('_render(): error');
            }
        }
    }, {
        key: '_render_svg_object',
        value: function _render_svg_object() {
            var self = this;

            d3.select('#' + self.parent_id).selectAll('*').remove();
            self.parent_obj = d3.select('#' + self.parent_id).styles(self.parent_style_obj);

            self.svg_obj = self.parent_obj.append('svg').attr('width', self._get_width('outter ')).attr('height', self._get_height('outter '));

            this.svg_group = this.svg_obj.append('g').attr('transform', 'translate(' + self.margin_obj.left + ',' + self.margin_obj.top + ')');
        }
    }, {
        key: '_update_d3_scale',
        value: function _update_d3_scale() {
            var self = this;

            if (this.parent_id && this.item_array) {
                self.d3_x_scale_band = d3.scaleBand().rangeRound([0, self._get_width()]).padding(0.1);

                self.y_scale_linear = d3.scaleLinear().rangeRound([self._get_height(), 0]);

                self.d3_x_scale_band.domain(self.item_array.map(function (d) {
                    return d.letter;
                }));

                self.y_scale_linear.domain([0, d3.max(self.item_array, function (d) {
                    return d.frequency;
                })]);
            }
        }
    }, {
        key: '_render_content',
        value: function _render_content() {
            var self = this;

            if (this.parent_id && this.item_array) {
                self._update_d3_scale();
                _show_axis();
                _show_bar();
            }

            function _show_axis() {
                self.svg_group.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0,' + self._get_height() + ')').call(d3.axisBottom(self.d3_x_scale_band));

                self.svg_group.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(self.y_scale_linear).ticks(10, '%')).append('text').attrs(self.y_axis_config).text('Frequency');
            }

            function _show_bar() {
                self.svg_group.selectAll('.bar').data(self.item_array).enter().append('rect').attr('class', 'bar').attr('x', function (d) {
                    return self.d3_x_scale_band(d.letter);
                }).attr('y', function (d) {
                    return self.y_scale_linear(d.frequency);
                }).attr('width', self.d3_x_scale_band.bandwidth()).attr('height', function (d) {
                    return self._get_height() - self.y_scale_linear(d.frequency);
                });
            }
        }

        ////

    }, {
        key: '_get_width',
        value: function _get_width() {
            var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'inner';

            var offset = 'inner' == level ? this.margin_obj.left + this.margin_obj.right : 0;
            return parseInt(this.parent_obj.node().clientWidth) - offset;
        }
    }, {
        key: '_get_height',
        value: function _get_height() {
            var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'inner';

            var offset = 'inner' == level ? this.margin_obj.top + this.margin_obj.bottom : 0;
            return parseInt(this.parent_obj.node().clientHeight) - offset;
        }

        //// init

    }, {
        key: '_init_param',
        value: function _init_param(param_obj) {
            this.parent_id = param_obj.parent_id ? param_obj.parent_id : 'el_chart';
            this.margin_obj = param_obj.margin_obj ? param_obj.margin_obj : this.default_param_obj.margin_obj;
            this.size_obj = param_obj.size_obj ? param_obj.size_obj : this.default_param_obj.size_obj;
            this.y_axis_config = param_obj.y_axis_config ? param_obj.y_axis_config : this.default_param_obj.y_axis_config;
            this.parent_style_obj = param_obj.parent_style_obj ? param_obj.parent_style_obj : this.default_param_obj.parent_style_obj;

            this.item_array = param_obj.item_array ? param_obj.item_array : [];
        }
    }, {
        key: '_init_event',
        value: function _init_event() {
            var self = this;

            d3.select(window).on('resize', function () {
                self._render();
            });
        }
    }, {
        key: '_init_default',
        value: function _init_default() {
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
                    "width": "100%",
                    "min-width": "10em",
                    "min-height": "16em",
                    "max-height": "28em"
                }
            };
        }
    }]);
    return D3BarChart;
}();

// import item_array from '../data/letter_freq.js'

// show_chart();


d3.json("data/letter_freq.json", function (data) {
    show_chart$1(data);
});

function show_chart$1(item_array) {
    var param_obj = {};
    param_obj.parent_id = 'el_chart';
    param_obj.item_array = item_array;

    var chart_obj = new D3BarChart();
    chart_obj.show_chart(param_obj);
}

}((this.demo_app = this.demo_app || {}),d3));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qcy9saWIvRDNCYXJDaGFydC5qcyIsIi4uLy4uL3NyYy9qcy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcblxuZXhwb3J0IGNsYXNzIEQzQmFyQ2hhcnQge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtX29iaiA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2luaXRfZGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHNob3dfY2hhcnQocGFyYW1fb2JqKSB7XG4gICAgICAgIHRoaXMuX2luaXRfcGFyYW0ocGFyYW1fb2JqKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG4gICAgICAgIHRoaXMuX2luaXRfZXZlbnQoKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRfaWQgJiYgdGhpcy5pdGVtX2FycmF5KSB7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJfc3ZnX29iamVjdCgpO1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyX2NvbnRlbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ19yZW5kZXIoKTogZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9yZW5kZXJfc3ZnX29iamVjdCgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGQzLnNlbGVjdCgnIycgKyBzZWxmLnBhcmVudF9pZCkuc2VsZWN0QWxsKCcqJykucmVtb3ZlKCk7XG4gICAgICAgIHNlbGYucGFyZW50X29iaiA9IGQzLnNlbGVjdCgnIycgKyBzZWxmLnBhcmVudF9pZClcbiAgICAgICAgICAgIC5zdHlsZXMoc2VsZi5wYXJlbnRfc3R5bGVfb2JqKTtcblxuICAgICAgICBzZWxmLnN2Z19vYmogPSBzZWxmLnBhcmVudF9vYmouYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgc2VsZi5fZ2V0X3dpZHRoKCdvdXR0ZXIgJykpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0Jywgc2VsZi5fZ2V0X2hlaWdodCgnb3V0dGVyICcpKTtcblxuICAgICAgICB0aGlzLnN2Z19ncm91cCA9IHRoaXMuc3ZnX29iai5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHNlbGYubWFyZ2luX29iai5sZWZ0ICsgJywnICsgc2VsZi5tYXJnaW5fb2JqLnRvcCArICcpJyk7XG4gICAgfVxuXG4gICAgX3VwZGF0ZV9kM19zY2FsZSgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLnBhcmVudF9pZCAmJiB0aGlzLml0ZW1fYXJyYXkpIHtcbiAgICAgICAgICAgIHNlbGYuZDNfeF9zY2FsZV9iYW5kID0gZDMuc2NhbGVCYW5kKClcbiAgICAgICAgICAgICAgICAucmFuZ2VSb3VuZChbMCwgc2VsZi5fZ2V0X3dpZHRoKCldKS5wYWRkaW5nKDAuMSk7XG5cbiAgICAgICAgICAgIHNlbGYueV9zY2FsZV9saW5lYXIgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAgICAgLnJhbmdlUm91bmQoW3NlbGYuX2dldF9oZWlnaHQoKSwgMF0pO1xuXG4gICAgICAgICAgICBzZWxmLmQzX3hfc2NhbGVfYmFuZC5kb21haW4oc2VsZi5pdGVtX2FycmF5Lm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQubGV0dGVyO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBzZWxmLnlfc2NhbGVfbGluZWFyLmRvbWFpbihbMCwgZDMubWF4KHNlbGYuaXRlbV9hcnJheSwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkLmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIH0pXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcmVuZGVyX2NvbnRlbnQoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5wYXJlbnRfaWQgJiYgdGhpcy5pdGVtX2FycmF5KSB7XG4gICAgICAgICAgICBzZWxmLl91cGRhdGVfZDNfc2NhbGUoKTtcbiAgICAgICAgICAgIF9zaG93X2F4aXMoKTtcbiAgICAgICAgICAgIF9zaG93X2JhcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX3Nob3dfYXhpcygpIHtcbiAgICAgICAgICAgIHNlbGYuc3ZnX2dyb3VwLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy0teCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgc2VsZi5fZ2V0X2hlaWdodCgpICsgJyknKVxuICAgICAgICAgICAgICAgIC5jYWxsKGQzLmF4aXNCb3R0b20oc2VsZi5kM194X3NjYWxlX2JhbmQpKTtcblxuICAgICAgICAgICAgc2VsZi5zdmdfZ3JvdXAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLS15JylcbiAgICAgICAgICAgICAgICAuY2FsbChkMy5heGlzTGVmdChzZWxmLnlfc2NhbGVfbGluZWFyKS50aWNrcygxMCwgJyUnKSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cnMoc2VsZi55X2F4aXNfY29uZmlnKVxuICAgICAgICAgICAgICAgIC50ZXh0KCdGcmVxdWVuY3knKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93X2JhcigpIHtcbiAgICAgICAgICAgIHNlbGYuc3ZnX2dyb3VwLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgICAgICAgICAgLmRhdGEoc2VsZi5pdGVtX2FycmF5KVxuICAgICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmQzX3hfc2NhbGVfYmFuZChkLmxldHRlcik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYueV9zY2FsZV9saW5lYXIoZC5mcmVxdWVuY3kpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgc2VsZi5kM194X3NjYWxlX2JhbmQuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2dldF9oZWlnaHQoKSAtIHNlbGYueV9zY2FsZV9saW5lYXIoZC5mcmVxdWVuY3kpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8vL1xuICAgIF9nZXRfd2lkdGgobGV2ZWwgPSAnaW5uZXInKSB7XG4gICAgICAgIGxldCBvZmZzZXQgPSAoJ2lubmVyJyA9PSBsZXZlbCkgPyAodGhpcy5tYXJnaW5fb2JqLmxlZnQgKyB0aGlzLm1hcmdpbl9vYmoucmlnaHQpIDogMDtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMucGFyZW50X29iai5ub2RlKCkuY2xpZW50V2lkdGgpIC0gb2Zmc2V0OztcbiAgICB9XG5cbiAgICBfZ2V0X2hlaWdodChsZXZlbCA9ICdpbm5lcicpIHtcbiAgICAgICAgbGV0IG9mZnNldCA9ICgnaW5uZXInID09IGxldmVsKSA/ICh0aGlzLm1hcmdpbl9vYmoudG9wICsgdGhpcy5tYXJnaW5fb2JqLmJvdHRvbSkgOiAwO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5wYXJlbnRfb2JqLm5vZGUoKS5jbGllbnRIZWlnaHQpIC0gb2Zmc2V0O1xuICAgIH1cblxuICAgIC8vLy8gaW5pdFxuICAgIF9pbml0X3BhcmFtKHBhcmFtX29iaikge1xuICAgICAgICB0aGlzLnBhcmVudF9pZCA9IHBhcmFtX29iai5wYXJlbnRfaWQgPyBwYXJhbV9vYmoucGFyZW50X2lkIDogJ2VsX2NoYXJ0JztcbiAgICAgICAgdGhpcy5tYXJnaW5fb2JqID0gcGFyYW1fb2JqLm1hcmdpbl9vYmogPyBwYXJhbV9vYmoubWFyZ2luX29iaiA6IHRoaXMuZGVmYXVsdF9wYXJhbV9vYmoubWFyZ2luX29iajtcbiAgICAgICAgdGhpcy5zaXplX29iaiA9IHBhcmFtX29iai5zaXplX29iaiA/IHBhcmFtX29iai5zaXplX29iaiA6IHRoaXMuZGVmYXVsdF9wYXJhbV9vYmouc2l6ZV9vYmo7XG4gICAgICAgIHRoaXMueV9heGlzX2NvbmZpZyA9IHBhcmFtX29iai55X2F4aXNfY29uZmlnID8gcGFyYW1fb2JqLnlfYXhpc19jb25maWcgOiB0aGlzLmRlZmF1bHRfcGFyYW1fb2JqLnlfYXhpc19jb25maWc7XG4gICAgICAgIHRoaXMucGFyZW50X3N0eWxlX29iaiA9IHBhcmFtX29iai5wYXJlbnRfc3R5bGVfb2JqID8gcGFyYW1fb2JqLnBhcmVudF9zdHlsZV9vYmogOiB0aGlzLmRlZmF1bHRfcGFyYW1fb2JqLnBhcmVudF9zdHlsZV9vYmo7XG5cbiAgICAgICAgdGhpcy5pdGVtX2FycmF5ID0gcGFyYW1fb2JqLml0ZW1fYXJyYXkgPyBwYXJhbV9vYmouaXRlbV9hcnJheSA6IFtdO1xuICAgIH1cblxuICAgIF9pbml0X2V2ZW50KCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgZDMuc2VsZWN0KHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5fcmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9pbml0X2RlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdF9wYXJhbV9vYmogPSB7XG4gICAgICAgICAgICBcIm1hcmdpbl9vYmpcIjoge1xuICAgICAgICAgICAgICAgIFwidG9wXCI6IDIwLFxuICAgICAgICAgICAgICAgIFwicmlnaHRcIjogMjAsXG4gICAgICAgICAgICAgICAgXCJib3R0b21cIjogMzAsXG4gICAgICAgICAgICAgICAgXCJsZWZ0XCI6IDQwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzaXplX29ialwiOiB7XG4gICAgICAgICAgICAgICAgXCJ3aWR0aF9vYmpcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImluaXRpYWxcIjogOTYwLFxuICAgICAgICAgICAgICAgICAgICBcIm1heFwiOiA5NjAsXG4gICAgICAgICAgICAgICAgICAgIFwibWluXCI6IDQ4MFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJoZWlnaHRfb2JqXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJpbml0aWFsXCI6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgXCJtYXhcIjogNTAwLFxuICAgICAgICAgICAgICAgICAgICBcIm1pblwiOiAyNTBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ5X2F4aXNfY29uZmlnXCI6IHtcbiAgICAgICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInJvdGF0ZSgtOTApXCIsXG4gICAgICAgICAgICAgICAgXCJ5XCI6IDYsXG4gICAgICAgICAgICAgICAgXCJkeVwiOiBcIi43MWVtXCIsXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcImVuZFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJwYXJlbnRfc3R5bGVfb2JqXCI6IHtcbiAgICAgICAgICAgICAgICBcIndpZHRoXCI6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgIFwibWluLXdpZHRoXCI6IFwiMTBlbVwiLFxuICAgICAgICAgICAgICAgIFwibWluLWhlaWdodFwiOiBcIjE2ZW1cIixcbiAgICAgICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogXCIyOGVtXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XG5cbmltcG9ydCB7XG4gICAgRDNCYXJDaGFydFxufSBmcm9tICcuL2xpYi9EM0JhckNoYXJ0JztcblxuLy8gaW1wb3J0IGl0ZW1fYXJyYXkgZnJvbSAnLi4vZGF0YS9sZXR0ZXJfZnJlcS5qcydcblxuLy8gc2hvd19jaGFydCgpO1xuXG5cbmQzLmpzb24oXCJkYXRhL2xldHRlcl9mcmVxLmpzb25cIiwgZnVuY3Rpb24oZGF0YSkge1xuICAgIHNob3dfY2hhcnQoZGF0YSk7XG59KTtcblxuZnVuY3Rpb24gc2hvd19jaGFydChpdGVtX2FycmF5KSB7XG4gICAgbGV0IHBhcmFtX29iaiA9IHt9O1xuICAgIHBhcmFtX29iai5wYXJlbnRfaWQgPSAnZWxfY2hhcnQnO1xuICAgIHBhcmFtX29iai5pdGVtX2FycmF5ID0gaXRlbV9hcnJheTtcblxuICAgIGxldCBjaGFydF9vYmogPSBuZXcgRDNCYXJDaGFydCgpO1xuICAgIGNoYXJ0X29iai5zaG93X2NoYXJ0KHBhcmFtX29iaik7XG59XG4iXSwibmFtZXMiOlsiRDNCYXJDaGFydCIsInBhcmFtX29iaiIsIl9pbml0X2RlZmF1bHQiLCJfaW5pdF9wYXJhbSIsIl9yZW5kZXIiLCJfaW5pdF9ldmVudCIsInBhcmVudF9pZCIsIml0ZW1fYXJyYXkiLCJfcmVuZGVyX3N2Z19vYmplY3QiLCJfcmVuZGVyX2NvbnRlbnQiLCJlcnJvciIsInNlbGYiLCJzZWxlY3RBbGwiLCJyZW1vdmUiLCJwYXJlbnRfb2JqIiwiZDMiLCJzdHlsZXMiLCJwYXJlbnRfc3R5bGVfb2JqIiwic3ZnX29iaiIsImFwcGVuZCIsImF0dHIiLCJfZ2V0X3dpZHRoIiwiX2dldF9oZWlnaHQiLCJzdmdfZ3JvdXAiLCJtYXJnaW5fb2JqIiwibGVmdCIsInRvcCIsImQzX3hfc2NhbGVfYmFuZCIsInJhbmdlUm91bmQiLCJwYWRkaW5nIiwieV9zY2FsZV9saW5lYXIiLCJkb21haW4iLCJtYXAiLCJkIiwibGV0dGVyIiwiZnJlcXVlbmN5IiwiX3VwZGF0ZV9kM19zY2FsZSIsIl9zaG93X2F4aXMiLCJjYWxsIiwidGlja3MiLCJhdHRycyIsInlfYXhpc19jb25maWciLCJ0ZXh0IiwiX3Nob3dfYmFyIiwiZGF0YSIsImVudGVyIiwiYmFuZHdpZHRoIiwibGV2ZWwiLCJvZmZzZXQiLCJyaWdodCIsInBhcnNlSW50Iiwibm9kZSIsImNsaWVudFdpZHRoIiwiYm90dG9tIiwiY2xpZW50SGVpZ2h0IiwiZGVmYXVsdF9wYXJhbV9vYmoiLCJzaXplX29iaiIsIndpbmRvdyIsIm9uIiwic2hvd19jaGFydCIsImNoYXJ0X29iaiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFVBQWI7MEJBQ2dDO1lBQWhCQyxTQUFnQix1RUFBSixFQUFJOzs7YUFDbkJDLGFBQUw7Ozs7O21DQUdPRCxTQUxmLEVBSzBCO2lCQUNiRSxXQUFMLENBQWlCRixTQUFqQjtpQkFDS0csT0FBTDtpQkFDS0MsV0FBTDs7OztrQ0FHTTtnQkFDRixLQUFLQyxTQUFMLElBQWtCLEtBQUtDLFVBQTNCLEVBQXVDO3FCQUM5QkMsa0JBQUw7cUJBQ0tDLGVBQUw7YUFGSixNQUdPO3dCQUNLQyxLQUFSLENBQWMsa0JBQWQ7Ozs7OzZDQUlhO2dCQUNiQyxPQUFPLElBQVg7O3FCQUVBLENBQVUsTUFBTUEsS0FB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
