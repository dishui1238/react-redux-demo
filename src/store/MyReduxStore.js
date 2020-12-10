import { createStore, applyMiddleware } from "../sourceCode/redux";
// import logger from "redux-logger";
// import thunk from "redux-thunk";

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case "add":
      return state + 1;
    case "minus":
      return state - 1;

    default:
      return state;
  }
};

const store = createStore(counterReducer, applyMiddleware(logger, thunk));

export default store;

function logger({ dispatch, getState }) {
  return (dispatch) => (action) => {
    console.log(action.type + "执行了");
    return dispatch(action);
  };
}

function thunk({ dispatch, getState }) {
  return (dispatch) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState);
    }
    return dispatch(action);
  };
}
