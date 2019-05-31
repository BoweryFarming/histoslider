"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _react3 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _ = require("..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stressTestData = function stressTestData(n) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var multiplier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var x = Array.from(Array(n)).map(function (d, i) {
    return {
      x0: (i + offset) * multiplier,
      x: (i + 1 + offset) * multiplier,
      y: (i % 5 + 1) * 10
    };
  });
  return x;
};

var buckets = [{ "x0": -45, "x": -40, "y": 424 }, { "x0": -40, "x": -30, "y": 0 }, { "x0": -30, "x": -20, "y": 0 }, { "x0": -20, "x": -10, "y": 0 }, { "x0": -10, "x": 0, "y": 0 }, { "x0": 0, "x": 10, "y": 0 }, { "x0": 10, "x": 20, "y": 20 }, { "x0": 20, "x": 30, "y": 544 }, { "x0": 30, "x": 31.94, "y": 3 }];
// const buckets = [{"x0":0.0,"x":0.2,"y":22},{"x0":0.2,"x":0.4,"y":0},{"x0":0.4,"x":0.6000000000000001,"y":0},{"x0":0.6000000000000001,"x":0.8,"y":0},{"x0":0.8,"x":1,"y":0},{"x0":1,"x":1.2000000000000002,"y":3},{"x0":1.2000000000000002,"x":1.4000000000000001,"y":3},{"x0":1.4000000000000001,"x":1.6,"y":9},{"x0":1.6,"x":1.8,"y":5},{"x0":1.8,"x":2,"y":0},{"x0":2,"x":2.2,"y":2},{"x0":2.2,"x":2.4000000000000004,"y":3},{"x0":2.4000000000000004,"x":2.6,"y":84},{"x0":2.6,"x":2.8000000000000003,"y":597},{"x0":2.8000000000000003,"x":3,"y":125},{"x0":3,"x":3.2,"y":61},{"x0":3.2,"x":3.4000000000000004,"y":8},{"x0":3.4000000000000004,"x":3.6,"y":1},{"x0":3.6,"x":3.8000000000000003,"y":0},{"x0":3.8000000000000003,"x":4,"y":0},{"x0":4,"x":4.2,"y":1},{"x0":4.2,"x":4.4,"y":2},{"x0":4.4,"x":4.6000000000000005,"y":1},{"x0":4.6000000000000005,"x":4.800000000000001,"y":0},{"x0":4.800000000000001,"x":5,"y":0},{"x0":5,"x":5.2,"y":0},{"x0":5.2,"x":5.4,"y":0},{"x0":5.4,"x":5.6000000000000005,"y":0},{"x0":5.6000000000000005,"x":5.800000000000001,"y":0},{"x0":5.800000000000001,"x":6,"y":0},{"x0":6,"x":6.2,"y":0},{"x0":6.2,"x":6.4,"y":0},{"x0":6.4,"x":6.6000000000000005,"y":0},{"x0":6.6000000000000005,"x":6.800000000000001,"y":0},{"x0":6.800000000000001,"x":7,"y":0},{"x0":7,"x":7.2,"y":0},{"x0":7.2,"x":7.4,"y":0},{"x0":7.4,"x":7.6000000000000005,"y":0},{"x0":7.6000000000000005,"x":7.66,"y":2}]

var buckets1 = [{ "x0": -45, "x": -40, "y": 424 }, { "x0": -40, "x": -30, "y": 0 }, { "x0": -30, "x": -20, "y": 0 }, { "x0": -20, "x": -10, "y": 0 }, { "x0": -10, "x": 0, "y": 0 }, { "x0": 0, "x": 10, "y": 0 }, { "x0": 10, "x": 20, "y": 20 }, { "x0": 20, "x": 30, "y": 544 }, { "x0": 30, "x": 31.94, "y": 3 }];
// Stateful container for testing interaction

var HistosliderContainer = function (_Component) {
  _inherits(HistosliderContainer, _Component);

  function HistosliderContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, HistosliderContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = HistosliderContainer.__proto__ || Object.getPrototypeOf(HistosliderContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      selection: []
    }, _this.setSelection = function (selection) {
      (0, _addonActions.action)("setSelection");
      _this.setState({ selection: selection });
    }, _this.render = function () {
      return _react2.default.createElement(_.Histoslider
      // An array of data to show on the slider
      , _extends({ data: buckets
        // A function to handle a change in the selection
        , selection: _this.state.selection,
        onChange: _this.setSelection
      }, _this.props));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return HistosliderContainer;
}(_react.Component);

(0, _react3.storiesOf)("Histogram", module);
(0, _react3.storiesOf)("Slider", module);
(0, _react3.storiesOf)("Histoslider", module).add("Open", function () {
  return _react2.default.createElement(HistosliderContainer, null);
}).add("Show on drag", function () {
  return _react2.default.createElement(HistosliderContainer, { showOnDrag: true });
}).add("Disable histogram", function () {
  return _react2.default.createElement(HistosliderContainer, { disableHistogram: true });
}).add("More data", function () {
  return _react2.default.createElement(HistosliderContainer, { data: stressTestData(50), width: 800 });
}).add("Non zero start", function () {
  return _react2.default.createElement(HistosliderContainer, { data: stressTestData(200, 2000, 10), width: 800 });
}).add("Stepping in lots of 100", function () {
  return _react2.default.createElement(HistosliderContainer, {
    data: buckets,
    width: 400,
    minHeight: 5,
    height: 200

  });
});