import React from "react";

const Context = React.createContext();

export const Provider = (props) => {
  return (
    <Context.Provider value={props.store}>{props.children}</Context.Provider>
  );
};
