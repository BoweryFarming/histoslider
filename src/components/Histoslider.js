import React, { Component } from "react";
import PropTypes from "prop-types";
import { max, min } from "d3-array";
import { scaleLinear as linear } from "d3-scale";
import { debounce } from 'lodash';
import Histogram from "./Histogram";
import Slider from "./Slider";

const SLIDER_HEIGHT = 30;

class Histoslider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      selection: this.props.selection
    };

    this.debouncedChange = debounce(this.props.onChange, 300)
  }

  dragChange = dragging => {
    // TODO - debounce
    this.setState({ dragging });
  };

  componentDidUpdate(prevProps){
    if (prevProps.onChange !== this.props.onChange){
      this.debouncedChange.cancel();
      this.debouncedChange = debounce(this.props.onChange, 300)
    }
    if (this.props.selection && this.props.selection.length === 0) {
        const sortedData = this.props.data.sort((a, b) => +a.x0 - +b.x0);
        const extent = [
          min(sortedData, ({ x0 }) => +x0),
          max(sortedData, ({ x }) => +x)
        ];
        this.setState({selection: extent});
        this.props.onChange(extent)
      }
  }

  componentWillUnmount(){
    this.debouncedChange.cancel();
  }


  onChange = selection => {
    const { data, onChange } = this.props;
    const sortedData = data.sort((a, b) => +a.x0 - +b.x0);
    const extent = [
      min(sortedData, ({ x0 }) => +x0),
      max(sortedData, ({ x }) => +x)
    ];
    let values = selection.map(d => Math.max(extent[0], Math.min(extent[1], +d)));
    this.setState({selection:values})
    this.debouncedChange(values);

  };

  reset = () => {
    this.props.onChange(null);
  };


  render() {

    const {
      style,
      data,
      width,
      height,
      padding,
      sliderHeight,
      disableHistogram,
      vertical
    } = this.props;

    const innerHeight = height - padding * 2;
    const innerWidth = width - padding * 2;
    const histogramHeight = innerHeight - sliderHeight;

    const sortedData = data.sort((a, b) => +a.x0 - +b.x0);
    const extent = [
      min(sortedData, ({ x0 }) => +x0),
      max(sortedData, ({ x }) => +x)
    ];
    const maxValue = max(sortedData, ({ y }) => +y);
    const scale = linear().domain(extent).range([0, innerWidth]);
    scale.clamp(true);

    const selection = this.state.selection.length === 2 ? this.state.selection : extent;

    const overrides = {
      selection,
      data: sortedData,
      scale,
      max: maxValue,
      dragChange: this.dragChange,
      onChange: this.onChange,
      reset: this.reset,
      width: innerWidth,
      dragging: this.state.dragging
    };

    return (
      <div
        style={{
          width: vertical ? height : width,
          height: vertical ? width: height,
        }}
      >
      <div
        style={Object.assign({}, style, {
          width,
          padding,
          boxSizing: "border-box",
          position: "relative",
          transform: vertical ? `translate(${height}px, 0px) rotate(90deg)` : 'none',
          transformOrigin: 'top left'
        })}
        className="Histoslider Histoslider--wrapper"
      >
        {!disableHistogram &&
          <Histogram
            {...Object.assign({}, this.props, overrides, {
              height: histogramHeight
            })}
          />}
        <Slider
          {...Object.assign({}, this.props, overrides, {
            height: sliderHeight, extent
          })}
        />
      </div>
      </div>
    );
  }
}

Histoslider.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x0: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.string,
  unselectedColor: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  selection: PropTypes.arrayOf(PropTypes.number),
  barStyle: PropTypes.object,
  barBorderRadius: PropTypes.number,
  barPadding: PropTypes.number,
  histogramStyle: PropTypes.object,
  sliderStyle: PropTypes.object,
  showOnDrag: PropTypes.bool,
  style: PropTypes.object,
  minHeight: PropTypes.number,
  handleLabelFormat: PropTypes.string,
  disableHistogram: PropTypes.bool,
  vertical: PropTypes.bool,
  backgroundColorFunction: PropTypes.func
};

Histoslider.defaultProps = {
  selectedColor: "#0074D9",
  unselectedColor: "#DDDDDD",
  showOnDrag: false,
  width: 400,
  height: 200,
  minHeight: 5,
  barBorderRadius: 2,
  barPadding: 0,
  padding: 10,
  sliderHeight: 25,
  handleLabelFormat: "0.1f",
  vertical: true,
  backgroundColorFunction: (v) => v> 5 ? "#0074D9" : 'red'
};

export default Histoslider;
