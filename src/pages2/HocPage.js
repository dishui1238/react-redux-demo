import React, { Component } from "react";
import { Button } from "antd";

const foo = (Cmp) => (props) => {
  return (
    <div style={{ border: "1px solid #000" }}>
      <Cmp {...props} />
    </div>
  );
};

const foo2 = (Cmp) => (props) => {
  return (
    <div style={{ border: "1px solid red", padding: "20px" }}>
      <Cmp {...props} />
    </div>
  );
};

@foo2
@foo
class Child extends Component {
  render() {
    return (
      <div>
        <Button type="primary">Button</Button>
      </div>
    );
  }
}

class HocPage extends Component {
  render() {
    // const Foo = foo2(foo(Child));
    return (
      <div>
        111
        <Child />
      </div>
    );
  }
}

export default HocPage;
