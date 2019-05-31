"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapToKeyCode = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Format = require("d3-format");

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var handleStyle = {
  cursor: "move",
  userSelect: "none",
  MozUserSelect: "none",
  KhtmlUserSelect: "none",
  WebkitUserSelect: "none",
  OUserSelect: "none"
};

// Map keycodes to positive or negative values
var mapToKeyCode = exports.mapToKeyCode = function mapToKeyCode(code) {
  var codes = {
    37: -1,
    38: 1,
    39: 1,
    40: -1
  };
  return codes[code] || null;
};

var Slider = function (_Component) {
  _inherits(Slider, _Component);

  _createClass(Slider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener("mouseup", this.dragEnd, false);
      window.addEventListener("touchend", this.dragEnd, false);
      window.addEventListener("touchmove", this.touchMove, { passive: false });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener("mouseup", this.dragEnd, false);
      window.removeEventListener("touchend", this.dragEnd, false);
      window.removeEventListener("touchmove", this.touchMove, { passive: false });
    }
  }]);

  function Slider() {
    _classCallCheck(this, Slider);

    var _this = _possibleConstructorReturn(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this));

    _this.dragStart = function (index, e) {
      e.stopPropagation();
      if (!_this.state.dragging) {
        _this.setState({
          dragging: true,
          dragIndex: index
        }, function () {
          _this.props.dragChange(true);
        });
      }
    };

    _this.dragEnd = function (e) {
      e.stopPropagation();
      _this.setState({
        dragging: false,
        dragIndex: null
      }, function () {
        _this.props.dragChange(false);
      });
    };

    _this.dragFromSVG = function (e) {
      if (!_this.state.dragging) {
        var selection = [].concat(_toConsumableArray(_this.props.selection));
        var selected = _this.props.scale.invert(e.nativeEvent.offsetX);
        var dragIndex = void 0;

        if (Math.abs(selected - selection[0]) > Math.abs(selected - selection[1])) {
          selection[1] = selected;
          dragIndex = 0;
        } else {
          selection[0] = selected;
          dragIndex = 1;
        }

        _this.props.onChange(selection);
        _this.setState({
          dragging: true,
          dragIndex: dragIndex
        }, function () {
          _this.props.dragChange(true);
        });
      }
    };

    _this.mouseMove = function (e) {
      if (_this.state.dragging) {
        var selection = [].concat(_toConsumableArray(_this.props.selection));
        selection[_this.state.dragIndex] = _this.props.scale.invert(e.nativeEvent.offsetX);
        _this.props.onChange(selection);
      }
    };

    _this.touchMove = function (e) {

      if (_this.state.dragging) {
        e.preventDefault();
        var selection = [].concat(_toConsumableArray(_this.props.selection));
        if ((0, _lodash.some)(selection, isNaN)) {
          _this.props.onChange(selection.map(function (v) {
            return isNaN(v) ? 0 : v;
          }));return;
        }
        var rect = e.target.getBoundingClientRect();
        var offset = _this.props.vertical ? e.targetTouches[0].pageY - rect.left : e.targetTouches[0].pageX - rect.left;
        selection[_this.state.dragIndex] = _this.props.scale.invert(offset);
        _this.props.onChange(selection);
      }
    };

    _this.keyDown = function (index, e) {
      var direction = mapToKeyCode(e.keyCode);
      var keyboardStep = _this.props.keyboardStep;

      var selection = [].concat(_toConsumableArray(_this.props.selection));
      selection[index] = Math.round(selection[index] + direction * keyboardStep);
      _this.props.onChange(selection);
    };

    _this.state = {
      dragging: false
    };
    return _this;
  }

  _createClass(Slider, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          selection = _props.selection,
          scale = _props.scale,
          format = _props.format,
          handleLabelFormat = _props.handleLabelFormat,
          backgroundColorFunction = _props.backgroundColorFunction,
          width = _props.width,
          height = _props.height,
          reset = _props.reset,
          innerWidth = _props.innerWidth,
          selectedColor = _props.selectedColor,
          unselectedColor = _props.unselectedColor,
          sliderStyle = _props.sliderStyle,
          vertical = _props.vertical,
          extent = _props.extent;

      var selectionWidth = Math.abs(scale(selection[1]) - scale(selection[0]));
      var selectionSorted = Array.from(selection).sort(function (a, b) {
        return +a - +b;
      });
      var f = (0, _d3Format.format)(handleLabelFormat);
      return _react2.default.createElement(
        "svg",
        {
          style: Object.assign({}, sliderStyle, { touchAction: 'none' }),
          height: height,
          width: width,
          onMouseDown: this.dragFromSVG,
          onTouchStart: this.dragFromSVG,
          onDoubleClick: reset,
          onMouseMove: this.mouseMove
          // onTouchMove={this.touchMove}

        },
        _react2.default.createElement(
          "linearGradient",
          { id: "slider", x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
          _react2.default.createElement("stop", { offset: "0%", style: { stopColor: backgroundColorFunction(selectionSorted[0]) } }),
          _react2.default.createElement("stop", { offset: "25%", style: { stopColor: backgroundColorFunction(.75 * selectionSorted[0] + .25 * selectionSorted[1]) } }),
          _react2.default.createElement("stop", { offset: "50%", style: { stopColor: backgroundColorFunction(.5 * selectionSorted[0] + .5 * selectionSorted[1]) } }),
          _react2.default.createElement("stop", { offset: "75%", style: { stopColor: backgroundColorFunction(.25 * selectionSorted[0] + .75 * selectionSorted[1]) } }),
          _react2.default.createElement("stop", { offset: "100%", style: { stopColor: backgroundColorFunction(selection[1]) } })
        ),
        _react2.default.createElement("rect", { height: 4, fill: unselectedColor, x: 0, y: 10, width: width }),
        _react2.default.createElement("rect", {
          height: 4,
          fill: "url(#slider)",
          x: scale(selectionSorted[0]),
          y: 10,
          width: selectionWidth
        }),
        selection.map(function (m, i) {
          return _react2.default.createElement(
            "g",
            {
              tabIndex: 0,
              style: handleStyle,
              onKeyDown: _this2.keyDown.bind(_this2, i),
              transform: "translate(" + _this2.props.scale(m) + ", 0)",
              key: "handle-" + i
            },
            _react2.default.createElement("circle", {
              style: Object.assign({}, handleStyle, { touchAction: 'none' }),
              r: 10,
              cx: 0,
              cy: 12.5,
              fill: "#ddd",
              strokeWidth: "1"
            }),
            _react2.default.createElement("circle", {
              style: Object.assign({}, handleStyle, { touchAction: 'none' }),
              onMouseDown: _this2.dragStart.bind(_this2, i),
              onTouchStart: _this2.dragStart.bind(_this2, i),
              r: 9,
              cx: 0,
              cy: 12,
              fill: "white",
              stroke: "#ccc",
              strokeWidth: "1"
            }),
            _react2.default.createElement(
              "text",
              {
                style: vertical ? Object.assign({}, handleStyle, { transform: 'rotate(-90deg)' }) : handleStyle,
                textAnchor: "middle",
                x: vertical ? -40 : 0,
                y: vertical ? 0 : 36,
                fill: "#666",
                fontSize: 12
              },
              f(m)
            )
          );
        })
      );
    }
  }]);

  return Slider;
}(_react.Component);

Slider.propTypes = {
  data: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    x0: _propTypes2.default.number,
    x: _propTypes2.default.number,
    y: _propTypes2.default.number
  })).isRequired,
  selection: _propTypes2.default.arrayOf(_propTypes2.default.number).isRequired,
  height: _propTypes2.default.number,
  width: _propTypes2.default.number,
  innerWidth: _propTypes2.default.number,
  padding: _propTypes2.default.number,
  bucketSize: _propTypes2.default.number,
  selectionColor: _propTypes2.default.string,
  histogramPadding: _propTypes2.default.number,
  scale: _propTypes2.default.func,
  reset: _propTypes2.default.func,
  keyboardStep: _propTypes2.default.number,
  dragChange: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  handleLabelFormat: _propTypes2.default.string,
  sliderStyle: _propTypes2.default.object
};

Slider.defaultProps = {
  sliderStyle: {
    display: "block",
    paddingBottom: "8px",
    zIndex: 6,
    overflow: "visible"
  },
  keyboardStep: 1
};

exports.default = Slider;