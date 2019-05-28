import React, { Component } from "react";
import { storiesOf, linkTo } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Histogram, Histoslider, Slider } from "..";

const stressTestData = (n, offset = 0, multiplier = 1) =>
{  let x = Array.from(Array(n)).map((d, i) => ({
    x0: (i + offset) * multiplier,
    x: (i + 1 + offset) * multiplier,
    y: (i % 5 + 1) * 10
  }))
  console.log(x);
  return x;
};

const buckets = [{"x0":-45,"x":-40,"y":424},{"x0":-40,"x":-30,"y":0},{"x0":-30,"x":-20,"y":0},{"x0":-20,"x":-10,"y":0},{"x0":-10,"x":0,"y":0},{"x0":0,"x":10,"y":0},{"x0":10,"x":20,"y":20},{"x0":20,"x":30,"y":544},{"x0":30,"x":31.94,"y":3}];
// const buckets = [{"x0":0.0,"x":0.2,"y":22},{"x0":0.2,"x":0.4,"y":0},{"x0":0.4,"x":0.6000000000000001,"y":0},{"x0":0.6000000000000001,"x":0.8,"y":0},{"x0":0.8,"x":1,"y":0},{"x0":1,"x":1.2000000000000002,"y":3},{"x0":1.2000000000000002,"x":1.4000000000000001,"y":3},{"x0":1.4000000000000001,"x":1.6,"y":9},{"x0":1.6,"x":1.8,"y":5},{"x0":1.8,"x":2,"y":0},{"x0":2,"x":2.2,"y":2},{"x0":2.2,"x":2.4000000000000004,"y":3},{"x0":2.4000000000000004,"x":2.6,"y":84},{"x0":2.6,"x":2.8000000000000003,"y":597},{"x0":2.8000000000000003,"x":3,"y":125},{"x0":3,"x":3.2,"y":61},{"x0":3.2,"x":3.4000000000000004,"y":8},{"x0":3.4000000000000004,"x":3.6,"y":1},{"x0":3.6,"x":3.8000000000000003,"y":0},{"x0":3.8000000000000003,"x":4,"y":0},{"x0":4,"x":4.2,"y":1},{"x0":4.2,"x":4.4,"y":2},{"x0":4.4,"x":4.6000000000000005,"y":1},{"x0":4.6000000000000005,"x":4.800000000000001,"y":0},{"x0":4.800000000000001,"x":5,"y":0},{"x0":5,"x":5.2,"y":0},{"x0":5.2,"x":5.4,"y":0},{"x0":5.4,"x":5.6000000000000005,"y":0},{"x0":5.6000000000000005,"x":5.800000000000001,"y":0},{"x0":5.800000000000001,"x":6,"y":0},{"x0":6,"x":6.2,"y":0},{"x0":6.2,"x":6.4,"y":0},{"x0":6.4,"x":6.6000000000000005,"y":0},{"x0":6.6000000000000005,"x":6.800000000000001,"y":0},{"x0":6.800000000000001,"x":7,"y":0},{"x0":7,"x":7.2,"y":0},{"x0":7.2,"x":7.4,"y":0},{"x0":7.4,"x":7.6000000000000005,"y":0},{"x0":7.6000000000000005,"x":7.66,"y":2}]

const buckets1 = [{"x0":-45,"x":-40,"y":424},{"x0":-40,"x":-30,"y":0},{"x0":-30,"x":-20,"y":0},{"x0":-20,"x":-10,"y":0},{"x0":-10,"x":0,"y":0},{"x0":0,"x":10,"y":0},{"x0":10,"x":20,"y":20},{"x0":20,"x":30,"y":544},{"x0":30,"x":31.94,"y":3}]
// Stateful container for testing interaction
class HistosliderContainer extends Component {
  state = {
    selection: null
  };
  setSelection = selection => {
    action("setSelection");
    // this.setState({ selection });
    console.log('s',selection);
  };
  render = () =>
    <Histoslider
      // An array of data to show on the slider
      data={buckets}
      // A function to handle a change in the selection
      selection={this.state.selection}
      onChange={this.setSelection}
      {...this.props}
    />;
}
storiesOf("Histogram", module);
storiesOf("Slider", module);
storiesOf("Histoslider", module)
  .add("Open", () => <HistosliderContainer />)
  .add("Show on drag", () => <HistosliderContainer showOnDrag />)
  .add("Disable histogram", () => <HistosliderContainer disableHistogram />)
  .add("More data", () =>
    <HistosliderContainer data={stressTestData(50)} width={800} />
  )
  .add("Non zero start", () =>
    <HistosliderContainer data={stressTestData(200, 2000, 10)} width={800} />
  )
  .add("Stepping in lots of 100", () =>
    <HistosliderContainer
      data={buckets}
      width={400}
      minHeight={5}
      height={200}

    />
  );
