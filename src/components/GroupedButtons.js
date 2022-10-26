import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

let slotvalue = 1;

class GroupedButtons extends React.Component {
  state = { counter: 1 };

  onChange = (e) => {
    if (parseInt(e.target.value) > 2) {
      e.target.value = 2;
    }
    this.setState((state) => ({ counter: parseInt(e.target.value) }));
  };

  handleIncrement = () => {
    this.setState((state) => ({ counter: Math.min(state.counter + 1, 15) }));
    // h = this.state.counter*0.1;
    console.log(this.state.counter);
  };

  handleDecrement = () => {
    this.setState((state) => ({ counter: Math.max(state.counter - 1, 1) }));
    console.log(this.state.counter);
  };
  render() {
    const displayCounter = this.state.counter > 0;
    slotvalue = this.state.counter;

    return (
      <div>
        <ButtonGroup
          size="small"
          aria-label="small outlined button group"
          className="borderColorBox"
        >
          <Button onClick={this.handleDecrement} className="add">
            -
          </Button>
          <Button className="numberQuantity">{this.state.counter}</Button>
          <Button onClick={this.handleIncrement} className="substract">
            +
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export { GroupedButtons, slotvalue };
