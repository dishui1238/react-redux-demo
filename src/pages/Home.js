import React, { Component } from "react";
// import { consumerHandle } from "../AppContext";

// const consumerHandle = (Comp) => (props) => {
//   return <Consumer>{(val) => <Comp {...props} {...val} />}</Consumer>;
// };

// function HomeHandle(props) {
//   console.log("HomeProps:", props);
//   return <div>Home</div>;
// }
// export default consumerHandle(HomeHandle);

const HOC = (WrappedComponent) =>
  class extends WrappedComponent {
    render() {
      const elementsTree = super.render();
      // console.log('super:', elementsTree);
      let newProps = {};
      if (elementsTree && elementsTree.type === "input") {
        newProps = { value: "may the force be with you" };
      }
      const props = Object.assign({}, elementsTree.props, newProps);
      const newElementsTree = React.cloneElement(
        elementsTree,
        props,
        elementsTree.props.children
      );
      return newElementsTree;
    }
  };
class WrappedComponent extends Component {
  render() {
    return <input value={"Hello World"} readOnly />;
  }
}
export default HOC(WrappedComponent);
//实际显示的效果是input的值为"may the force be with you"
