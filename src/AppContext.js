import React from "react";

export const Context = React.createContext();
export const Provider = Context.Provider;
export const Consumer = Context.Consumer;

// 高阶组件
export const consumerHandle = (Comp) => (props) => {
  return <Consumer>{(val) => <Comp {...props} {...val} />}</Consumer>;
};