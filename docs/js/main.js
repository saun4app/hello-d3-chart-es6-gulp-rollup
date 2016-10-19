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
                    "width": '100%',
                    "min-width": '10em',
                    "min-height": '14em'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qcy9saWIvRDNCYXJDaGFydC5qcyIsIi4uLy4uL3NyYy9qcy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcblxuZXhwb3J0IGNsYXNzIEQzQmFyQ2hhcnQge1xuICAgIGNvbnN0cnVjdG9yKHBhcmFtX29iaiA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2luaXRfZGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHNob3dfY2hhcnQocGFyYW1fb2JqKSB7XG4gICAgICAgIHRoaXMuX2luaXRfcGFyYW0ocGFyYW1fb2JqKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyKCk7XG4gICAgICAgIHRoaXMuX2luaXRfZXZlbnQoKTtcbiAgICB9XG5cbiAgICBfcmVuZGVyKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRfaWQgJiYgdGhpcy5pdGVtX2FycmF5KSB7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJfc3ZnX29iamVjdCgpO1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyX2NvbnRlbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ19yZW5kZXIoKTogZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9yZW5kZXJfc3ZnX29iamVjdCgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGQzLnNlbGVjdCgnIycgKyBzZWxmLnBhcmVudF9pZCkuc2VsZWN0QWxsKCcqJykucmVtb3ZlKCk7XG4gICAgICAgIHNlbGYucGFyZW50X29iaiA9IGQzLnNlbGVjdCgnIycgKyBzZWxmLnBhcmVudF9pZClcbiAgICAgICAgICAgIC5zdHlsZXMoc2VsZi5wYXJlbnRfc3R5bGVfb2JqKTtcblxuICAgICAgICBzZWxmLnN2Z19vYmogPSBzZWxmLnBhcmVudF9vYmouYXBwZW5kKCdzdmcnKVxuICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgc2VsZi5fZ2V0X3dpZHRoKCdvdXR0ZXIgJykpXG4gICAgICAgICAgICAuYXR0cignaGVpZ2h0Jywgc2VsZi5fZ2V0X2hlaWdodCgnb3V0dGVyICcpKTtcblxuICAgICAgICB0aGlzLnN2Z19ncm91cCA9IHRoaXMuc3ZnX29iai5hcHBlbmQoJ2cnKVxuICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHNlbGYubWFyZ2luX29iai5sZWZ0ICsgJywnICsgc2VsZi5tYXJnaW5fb2JqLnRvcCArICcpJyk7XG4gICAgfVxuXG4gICAgX3VwZGF0ZV9kM19zY2FsZSgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLnBhcmVudF9pZCAmJiB0aGlzLml0ZW1fYXJyYXkpIHtcbiAgICAgICAgICAgIHNlbGYuZDNfeF9zY2FsZV9iYW5kID0gZDMuc2NhbGVCYW5kKClcbiAgICAgICAgICAgICAgICAucmFuZ2VSb3VuZChbMCwgc2VsZi5fZ2V0X3dpZHRoKCldKS5wYWRkaW5nKDAuMSk7XG5cbiAgICAgICAgICAgIHNlbGYueV9zY2FsZV9saW5lYXIgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgICAgICAgLnJhbmdlUm91bmQoW3NlbGYuX2dldF9oZWlnaHQoKSwgMF0pO1xuXG4gICAgICAgICAgICBzZWxmLmQzX3hfc2NhbGVfYmFuZC5kb21haW4oc2VsZi5pdGVtX2FycmF5Lm1hcChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQubGV0dGVyO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBzZWxmLnlfc2NhbGVfbGluZWFyLmRvbWFpbihbMCwgZDMubWF4KHNlbGYuaXRlbV9hcnJheSwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkLmZyZXF1ZW5jeTtcbiAgICAgICAgICAgIH0pXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfcmVuZGVyX2NvbnRlbnQoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAodGhpcy5wYXJlbnRfaWQgJiYgdGhpcy5pdGVtX2FycmF5KSB7XG4gICAgICAgICAgICBzZWxmLl91cGRhdGVfZDNfc2NhbGUoKTtcbiAgICAgICAgICAgIF9zaG93X2F4aXMoKTtcbiAgICAgICAgICAgIF9zaG93X2JhcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX3Nob3dfYXhpcygpIHtcbiAgICAgICAgICAgIHNlbGYuc3ZnX2dyb3VwLmFwcGVuZCgnZycpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2F4aXMgYXhpcy0teCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwnICsgc2VsZi5fZ2V0X2hlaWdodCgpICsgJyknKVxuICAgICAgICAgICAgICAgIC5jYWxsKGQzLmF4aXNCb3R0b20oc2VsZi5kM194X3NjYWxlX2JhbmQpKTtcblxuICAgICAgICAgICAgc2VsZi5zdmdfZ3JvdXAuYXBwZW5kKCdnJylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYXhpcyBheGlzLS15JylcbiAgICAgICAgICAgICAgICAuY2FsbChkMy5heGlzTGVmdChzZWxmLnlfc2NhbGVfbGluZWFyKS50aWNrcygxMCwgJyUnKSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cnMoc2VsZi55X2F4aXNfY29uZmlnKVxuICAgICAgICAgICAgICAgIC50ZXh0KCdGcmVxdWVuY3knKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93X2JhcigpIHtcbiAgICAgICAgICAgIHNlbGYuc3ZnX2dyb3VwLnNlbGVjdEFsbCgnLmJhcicpXG4gICAgICAgICAgICAgICAgLmRhdGEoc2VsZi5pdGVtX2FycmF5KVxuICAgICAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZCgncmVjdCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JhcicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmQzX3hfc2NhbGVfYmFuZChkLmxldHRlcik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuYXR0cigneScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYueV9zY2FsZV9saW5lYXIoZC5mcmVxdWVuY3kpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgc2VsZi5kM194X3NjYWxlX2JhbmQuYmFuZHdpZHRoKCkpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2dldF9oZWlnaHQoKSAtIHNlbGYueV9zY2FsZV9saW5lYXIoZC5mcmVxdWVuY3kpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8vL1xuICAgIF9nZXRfd2lkdGgobGV2ZWwgPSAnaW5uZXInKSB7XG4gICAgICAgIGxldCBvZmZzZXQgPSAoJ2lubmVyJyA9PSBsZXZlbCkgPyAodGhpcy5tYXJnaW5fb2JqLmxlZnQgKyB0aGlzLm1hcmdpbl9vYmoucmlnaHQpIDogMDtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMucGFyZW50X29iai5ub2RlKCkuY2xpZW50V2lkdGgpIC0gb2Zmc2V0OztcbiAgICB9XG5cbiAgICBfZ2V0X2hlaWdodChsZXZlbCA9ICdpbm5lcicpIHtcbiAgICAgICAgbGV0IG9mZnNldCA9ICgnaW5uZXInID09IGxldmVsKSA/ICh0aGlzLm1hcmdpbl9vYmoudG9wICsgdGhpcy5tYXJnaW5fb2JqLmJvdHRvbSkgOiAwO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5wYXJlbnRfb2JqLm5vZGUoKS5jbGllbnRIZWlnaHQpIC0gb2Zmc2V0O1xuICAgIH1cblxuICAgIC8vLy8gaW5pdFxuICAgIF9pbml0X3BhcmFtKHBhcmFtX29iaikge1xuICAgICAgICB0aGlzLnBhcmVudF9pZCA9IHBhcmFtX29iai5wYXJlbnRfaWQgPyBwYXJhbV9vYmoucGFyZW50X2lkIDogJ2VsX2NoYXJ0JztcbiAgICAgICAgdGhpcy5tYXJnaW5fb2JqID0gcGFyYW1fb2JqLm1hcmdpbl9vYmogPyBwYXJhbV9vYmoubWFyZ2luX29iaiA6IHRoaXMuZGVmYXVsdF9wYXJhbV9vYmoubWFyZ2luX29iajtcbiAgICAgICAgdGhpcy5zaXplX29iaiA9IHBhcmFtX29iai5zaXplX29iaiA/IHBhcmFtX29iai5zaXplX29iaiA6IHRoaXMuZGVmYXVsdF9wYXJhbV9vYmouc2l6ZV9vYmo7XG4gICAgICAgIHRoaXMueV9heGlzX2NvbmZpZyA9IHBhcmFtX29iai55X2F4aXNfY29uZmlnID8gcGFyYW1fb2JqLnlfYXhpc19jb25maWcgOiB0aGlzLmRlZmF1bHRfcGFyYW1fb2JqLnlfYXhpc19jb25maWc7XG4gICAgICAgIHRoaXMucGFyZW50X3N0eWxlX29iaiA9IHBhcmFtX29iai5wYXJlbnRfc3R5bGVfb2JqID8gcGFyYW1fb2JqLnBhcmVudF9zdHlsZV9vYmogOiB0aGlzLmRlZmF1bHRfcGFyYW1fb2JqLnBhcmVudF9zdHlsZV9vYmo7XG5cbiAgICAgICAgdGhpcy5pdGVtX2FycmF5ID0gcGFyYW1fb2JqLml0ZW1fYXJyYXkgPyBwYXJhbV9vYmouaXRlbV9hcnJheSA6IFtdO1xuICAgIH1cblxuICAgIF9pbml0X2V2ZW50KCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgZDMuc2VsZWN0KHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi5fcmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9pbml0X2RlZmF1bHQoKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdF9wYXJhbV9vYmogPSB7XG4gICAgICAgICAgICBcIm1hcmdpbl9vYmpcIjoge1xuICAgICAgICAgICAgICAgIFwidG9wXCI6IDIwLFxuICAgICAgICAgICAgICAgIFwicmlnaHRcIjogMjAsXG4gICAgICAgICAgICAgICAgXCJib3R0b21cIjogMzAsXG4gICAgICAgICAgICAgICAgXCJsZWZ0XCI6IDQwXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzaXplX29ialwiOiB7XG4gICAgICAgICAgICAgICAgXCJ3aWR0aF9vYmpcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImluaXRpYWxcIjogOTYwLFxuICAgICAgICAgICAgICAgICAgICBcIm1heFwiOiA5NjAsXG4gICAgICAgICAgICAgICAgICAgIFwibWluXCI6IDQ4MFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJoZWlnaHRfb2JqXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJpbml0aWFsXCI6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgXCJtYXhcIjogNTAwLFxuICAgICAgICAgICAgICAgICAgICBcIm1pblwiOiAyNTBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ5X2F4aXNfY29uZmlnXCI6IHtcbiAgICAgICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBcInJvdGF0ZSgtOTApXCIsXG4gICAgICAgICAgICAgICAgXCJ5XCI6IDYsXG4gICAgICAgICAgICAgICAgXCJkeVwiOiBcIi43MWVtXCIsXG4gICAgICAgICAgICAgICAgXCJ0ZXh0LWFuY2hvclwiOiBcImVuZFwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJwYXJlbnRfc3R5bGVfb2JqXCI6IHtcbiAgICAgICAgICAgICAgICBcIndpZHRoXCI6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBcIm1pbi13aWR0aFwiOiAnMTBlbScsXG4gICAgICAgICAgICAgICAgXCJtaW4taGVpZ2h0XCI6ICcxNGVtJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcblxuaW1wb3J0IHtcbiAgICBEM0JhckNoYXJ0XG59IGZyb20gJy4vbGliL0QzQmFyQ2hhcnQnO1xuXG4vLyBpbXBvcnQgaXRlbV9hcnJheSBmcm9tICcuLi9kYXRhL2xldHRlcl9mcmVxLmpzJ1xuXG4vLyBzaG93X2NoYXJ0KCk7XG5cblxuZDMuanNvbihcImRhdGEvbGV0dGVyX2ZyZXEuanNvblwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgc2hvd19jaGFydChkYXRhKTtcbn0pO1xuXG5mdW5jdGlvbiBzaG93X2NoYXJ0KGl0ZW1fYXJyYXkpIHtcbiAgICBsZXQgcGFyYW1fb2JqID0ge307XG4gICAgcGFyYW1fb2JqLnBhcmVudF9pZCA9ICdlbF9jaGFydCc7XG4gICAgcGFyYW1fb2JqLml0ZW1fYXJyYXkgPSBpdGVtX2FycmF5O1xuXG4gICAgbGV0IGNoYXJ0X29iaiA9IG5ldyBEM0JhckNoYXJ0KCk7XG4gICAgY2hhcnRfb2JqLnNob3dfY2hhcnQocGFyYW1fb2JqKTtcbn1cbiJdLCJuYW1lcyI6WyJEM0JhckNoYXJ0IiwicGFyYW1fb2JqIiwiX2luaXRfZGVmYXVsdCIsIl9pbml0X3BhcmFtIiwiX3JlbmRlciIsIl9pbml0X2V2ZW50IiwicGFyZW50X2lkIiwiaXRlbV9hcnJheSIsIl9yZW5kZXJfc3ZnX29iamVjdCIsIl9yZW5kZXJfY29udGVudCIsImVycm9yIiwic2VsZiIsInNlbGVjdEFsbCIsInJlbW92ZSIsInBhcmVudF9vYmoiLCJkMyIsInN0eWxlcyIsInBhcmVudF9zdHlsZV9vYmoiLCJzdmdfb2JqIiwiYXBwZW5kIiwiYXR0ciIsIl9nZXRfd2lkdGgiLCJfZ2V0X2hlaWdodCIsInN2Z19ncm91cCIsIm1hcmdpbl9vYmoiLCJsZWZ0IiwidG9wIiwiZDNfeF9zY2FsZV9iYW5kIiwicmFuZ2VSb3VuZCIsInBhZGRpbmciLCJ5X3NjYWxlX2xpbmVhciIsImRvbWFpbiIsIm1hcCIsImQiLCJsZXR0ZXIiLCJmcmVxdWVuY3kiLCJfdXBkYXRlX2QzX3NjYWxlIiwiX3Nob3dfYXhpcyIsImNhbGwiLCJ0aWNrcyIsImF0dHJzIiwieV9heGlzX2NvbmZpZyIsInRleHQiLCJfc2hvd19iYXIiLCJkYXRhIiwiZW50ZXIiLCJiYW5kd2lkdGgiLCJsZXZlbCIsIm9mZnNldCIsInJpZ2h0IiwicGFyc2VJbnQiLCJub2RlIiwiY2xpZW50V2lkdGgiLCJib3R0b20iLCJjbGllbnRIZWlnaHQiLCJkZWZhdWx0X3BhcmFtX29iaiIsInNpemVfb2JqIiwid2luZG93Iiwib24iLCJzaG93X2NoYXJ0IiwiY2hhcnRfb2JqIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsVUFBYjswQkFDZ0M7WUFBaEJDLFNBQWdCLHVFQUFKLEVBQUk7OzthQUNuQkMsYUFBTDs7Ozs7bUNBR09ELFNBTGYsRUFLMEI7aUJBQ2JFLFdBQUwsQ0FBaUJGLFNBQWpCO2lCQUNLRyxPQUFMO2lCQUNLQyxXQUFMOzs7O2tDQUdNO2dCQUNGLEtBQUtDLFNBQUwsSUFBa0IsS0FBS0MsVUFBM0IsRUFBdUM7cUJBQzlCQyxrQkFBTDtxQkFDS0MsZUFBTDthQUZKLE1BR087d0JBQ0tDLEtBQVIsQ0FBYyxrQkFBZDs7Ozs7NkNBSWE7Z0JBQ2JDLE9BQU8sSUFBWDs7cUJBRUEsQ0FBVSxNQUFNQSxLQUFLTCxTQUFyQixFQUFnQ00sU0FBaEMsQ0FBMEMsR0FBMUMsRUFBK0NDLE1BQS9DO2lC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
