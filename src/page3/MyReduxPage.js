import React, { PureComponent } from "react";
import store from "../store/MyReduxStore";

export default class MyReduxPage extends PureComponent {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  asyncAdd = () => {
    store.dispatch((dispatch) => {
      setTimeout(() => {
        store.dispatch({ type: "add" });
      }, 1000);
    });
  };
  render() {
    return (
      <div>
        <h1>MyReduxPage</h1>
        <p>counter:{store.getState()}</p>
        <button onClick={() => store.dispatch({ type: "add" })}>add</button>
        <button onClick={() => this.asyncAdd()}>asyncAdd</button>
      </div>
    );
  }
}
