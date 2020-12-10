import React, { PureComponent } from "react";
import store from "../store/reduxStore";

export default class ReduxPage extends PureComponent {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    console.log(store, store.getState());
    return (
      <div>
        <h1>ReduxPage</h1>
        <p>counter:{store.getState()}</p>
        <button onClick={() => store.dispatch({ type: "add" })}>add</button>
      </div>
    );
  }
}
