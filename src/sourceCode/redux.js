// 需要实现以下功能：
// 1. 存储状态state
// 2. 获取状态getState
// 3. 更新状态dispatch
// 4. 变更订阅subscribe: 通过subscribe在store上添加一个监听函数。每当调用dispatch方法时，会执行所有的监听函数
// 5. 应用中间件，即applyMiddleware()

// 返回 getState、dispatch、subscribe函数
export function createStore(reducer, enhancer) {
  let state = undefined;
  let listeners = [];

  // enhancer（可以叫做强化器）是一个函数，这个函数接受一个「普通createStore函数」作为参数，返回一个「加强后的createStore函数」。这个加强的过程中做的事情，其实就是改造dispatch，添加上中间件。
  // redux提供的applyMiddleware()方法返回的就是一个enhancer。

  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  function getState() {
    return state;
  }
  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((func) => func());
  }

  function subscribe(listener) {
    listeners.push(listener);
  }

  // dispatch一个用于初始化的action，相当于调用一次reducer
  dispatch({
    type: "@MYREDUX/SOURCECODE",
  });
  return {
    getState,
    dispatch,
    subscribe,
  };
}

// 改造store自带的dispatch方法。action发生后，先给中间件处理，最后再dispatch一个action交给reducer去改变状态。
// 输入为若干中间件，输出为enhancer

/**
 * 中间件函数形式为：
 *  const middleware = ({dispatch, getStore})=>(dispatch)=>(action)=>{
       //dosomething
   }
 * 
 */
/**
 * applyMiddleware(logger, thunk)(createStore)(reducer)
 * applyMiddleware(logger, thunk) 返回一个函数 A: (createStore) => {return (reducer) => {}}
 *                                函数 A 返回函数 B：(createStore) => (reducer) => {}
 * 
 */
export function applyMiddleware(...middlewares) {
  debugger;
  // applyMiddleware调用时，返回一个函数A。这个函数A接受一个函数形式的参数createStore，返回函数B。
  // 函数B可以调用createStore函数，生成store并且返回。
  return (createStore) => (...args) => {
    const store = createStore(...args);
    let dispatch = store.dispatch;

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    };

    // chain = [logger({getState, dispatch}), thunk({getState, dispatch})]
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    // dispatch = thunk({getState, dispatch})(logger({getState, dispatch})])(dispatch)
    dispatch = compose(...chain)(store.dispatch);
    return { ...store, dispatch };
  };
}

function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
