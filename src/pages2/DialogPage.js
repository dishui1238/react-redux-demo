import React, { Component } from "react";
import { createPortal } from "react-dom";
import { Button } from "antd";

class Dialog extends Component {
  constructor(props) {
    super(props);
    this.node = document.createElement("p");
    document.body.appendChild(this.node);
  }

  componentWillUnmount() {
    document.body.removeChild(this.node);
  }
  render() {
    return createPortal(
      <div>
        <h1>Dialog</h1>
      </div>,
      this.node
    );
  }
}

class DialogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  onChange = () => {
    this.setState({ show: !this.state.show });
  };
  render() {
    const { show } = this.state;
    return (
      <div>
        <h1>DialogPage</h1>
        <Button onClick={this.onChange}>toggle</Button>
        {show && <Dialog />}
      </div>
    );
  }
}

export default DialogPage;
