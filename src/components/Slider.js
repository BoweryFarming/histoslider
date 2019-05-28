import React, { Component } from "react";
import PropTypes from "prop-types";
import { format as d3Format } from "d3-format";
import {some} from 'lodash';

const handleStyle = {
  cursor: "move",
  userSelect: "none",
  MozUserSelect: "none",
  KhtmlUserSelect: "none",
  WebkitUserSelect: "none",
  OUserSelect: "none"
};

// Map keycodes to positive or negative values
export const mapToKeyCode = code => {
  const codes = {
    37: -1,
    38: 1,
    39: 1,
    40: -1
  };
  return codes[code] || null;
};

class Slider extends Component {
  componentDidMount() {
    window.addEventListener("mouseup", this.dragEnd, false);
    window.addEventListener("touchend", this.dragEnd, false);
    window.addEventListener("touchmove", this.touchMove, {passive: false});


  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.dragEnd, false);
    window.removeEventListener("touchend", this.dragEnd, false);
    window.removeEventListener("touchmove", this.touchMove, {passive: false});


  }

  constructor() {
    super();
    this.state = {
      dragging: false
    };
  }

  dragStart = (index, e) => {
    e.stopPropagation();
    if (!this.state.dragging) {
      this.setState(
        {
          dragging: true,
          dragIndex: index
        },
        () => {
          this.props.dragChange(true);
        }
      );
    }
  };

  dragEnd = e => {
    e.stopPropagation();
    this.setState(
      {
        dragging: false,
        dragIndex: null
      },
      () => {
        this.props.dragChange(false);
      }
    );
  };

  dragFromSVG = e => {
    if (!this.state.dragging) {
      let selection = [...this.props.selection];
      let selected = this.props.scale.invert(e.nativeEvent.offsetX);
      let dragIndex;

      if (
        Math.abs(selected - selection[0]) > Math.abs(selected - selection[1])
      ) {
        selection[1] = selected;
        dragIndex = 0;
      } else {
        selection[0] = selected;
        dragIndex = 1;
      }

      this.props.onChange(selection);
      this.setState(
        {
          dragging: true,
          dragIndex
        },
        () => {
          this.props.dragChange(true);
        }
      );
    }
  };

  mouseMove = e => {
    if (this.state.dragging) {
      let selection = [...this.props.selection];
      selection[this.state.dragIndex] = this.props.scale.invert(
        e.nativeEvent.offsetX
      );
      this.props.onChange(selection);
    }
  };

  touchMove = e => {

    if (this.state.dragging) {
      e.preventDefault();
      let selection = [...this.props.selection];
      console.log('t',selection);
      if (some(selection, isNaN)) {this.props.onChange(selection.map(v => isNaN(v)? 0 : v)); return}
      let rect = e.target.getBoundingClientRect();
      let offset = this.props.vertical ? e.targetTouches[0].pageY - rect.left : e.targetTouches[0].pageX - rect.left;
      selection[this.state.dragIndex] = this.props.scale.invert(
        offset
      );
      this.props.onChange(selection);
    }
  };

  keyDown = (index, e) => {
    const direction = mapToKeyCode(e.keyCode);
    const { keyboardStep } = this.props;
    let selection = [...this.props.selection];
    selection[index] = Math.round(selection[index] + direction * keyboardStep);
    this.props.onChange(selection);
  };

  render() {
    const {
      selection,
      scale,
      format,
      handleLabelFormat,
      backgroundColorFunction,
      width,
      height,
      reset,
      innerWidth,
      selectedColor,
      unselectedColor,
      sliderStyle,
      vertical,
      extent
    } = this.props;
    const selectionWidth = Math.abs(scale(selection[1]) - scale(selection[0]));
    const selectionSorted = Array.from(selection).sort((a, b) => +a - +b);
    const f = d3Format(handleLabelFormat);
    return (
      <svg
        style={Object.assign({},sliderStyle,{touchAction: 'none'})}
        height={height}
        width={width}
        onMouseDown={this.dragFromSVG}
        onTouchStart={this.dragFromSVG}
        onDoubleClick={reset}
        onMouseMove={this.mouseMove}
        // onTouchMove={this.touchMove}

      >
      <linearGradient id={`slider`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor: backgroundColorFunction(selectionSorted[0])}} />
        <stop offset="25%" style={{stopColor: backgroundColorFunction(.75*selectionSorted[0]+.25*selectionSorted[1])}}/>
        <stop offset="50%" style={{stopColor: backgroundColorFunction(.5*selectionSorted[0]+.5*selectionSorted[1])}}/>
        <stop offset="75%" style={{stopColor: backgroundColorFunction(.25*selectionSorted[0]+.75*selectionSorted[1])}}/>
        <stop offset="100%" style={{stopColor: backgroundColorFunction(selection[1])}} />
      </linearGradient>
        <rect height={4} fill={unselectedColor} x={0} y={10} width={width} />
        <rect
          height={4}
          fill="url(#slider)"
          x={scale(selectionSorted[0])}
          y={10}
          width={selectionWidth}
        />
        {selection.map((m, i) => {
          return (
            <g
              tabIndex={0}
              onKeyDown={this.keyDown.bind(this, i)}
              transform={`translate(${this.props.scale(m)}, 0)`}
              key={`handle-${i}`}
            >
              <circle
                style={Object.assign({},handleStyle, {touchAction: 'none'})}
                r={10}
                cx={0}
                cy={12.5}
                fill="#ddd"
                strokeWidth="1"
              />
              <circle
                style={Object.assign({},handleStyle, {touchAction: 'none'})}
                onMouseDown={this.dragStart.bind(this, i)}
                onTouchStart={this.dragStart.bind(this,i)}
                r={9}
                cx={0}
                cy={12}
                fill="white"
                stroke="#ccc"
                strokeWidth="1"
              />
              <text
                style={vertical ? Object.assign({},handleStyle,{transform: 'rotate(-90deg)'}) : handleStyle}
                textAnchor="middle"
                x={vertical ? -40 :0}
                y={vertical ? 0: 36}
                fill="#666"
                fontSize={12}
              >
                {f(m)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }
}

Slider.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x0: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number
    })
  ).isRequired,
  selection: PropTypes.arrayOf(PropTypes.number).isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  innerWidth: PropTypes.number,
  padding: PropTypes.number,
  bucketSize: PropTypes.number,
  selectionColor: PropTypes.string,
  histogramPadding: PropTypes.number,
  scale: PropTypes.func,
  reset: PropTypes.func,
  keyboardStep: PropTypes.number,
  dragChange: PropTypes.func,
  onChange: PropTypes.func,
  handleLabelFormat: PropTypes.string,
  sliderStyle: PropTypes.object
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

export default Slider;
