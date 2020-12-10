import React, { useReducer, useEffect } from "react";
// import User from "./User";

function fruitsReducer(state, action) {
  switch (action.type) {
    case "init":
      return action.payload;
    default:
      return state;
  }
}

function HooksReducer(props) {
  const [fruits, dispatch] = useReducer(fruitsReducer, ["apple"]);

  useEffect(() => {
    setTimeout(() => {
      dispatch({ type: "init", payload: ["apple", "banana"] });
    }, 1000);
  }, []);
  return (
    <div>
      {fruits.map((i, index) => (
        <li key={index}>{i}</li>
      ))}
    </div>
  );
}

export default HooksReducer;
