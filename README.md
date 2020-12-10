# 一、 react

## 1. 类组件状态管理 setState

> `setState(nextState, callback)` UI 更新最常用的方法, 默认调用 setState 都会重新渲染视图

> nextState 也可以是一个 function，称为状态计算函数，结构为`function(state, props) => newState`。该函数接受两个参数: 更新前的 state 与当前的属性(props)，函数返回一个对象用于更新 state。这个函数会将每次更新加入队列中，执行时通过当前的 state 和 props 来获取新的 state。

### 1. class 中同步实现

```js
this.state = { counter: 0 };
// 1. 函数方式
onClick = () => {
  this.setState((nextState) => {
    //第一次执行 nextState = 0
    return { counter: nextState.counter + 1 };
  });

  this.setState((nextState) => {
    // 第一次执行 nextState = 1
    return { counter: nextState.counter + 2 };
  });
};
// 一次后 counter = 3， 每一次 counter 增加 3

// 2. setTimeout
setTimeout(() => {
  // setTimeout中调用
  this.setState({ count: this.state.count + 1 });
  console.log("setTimeout: " + this.state.count); // 可以立马获取到最新的state
}, 0);

// 3. 原生事件
```

每次更新时都会提取出当前的 state，进行运算得到新的 state，就保证了数据的同步更新。

总结：

1. `setState` 只在合成事件和钩子函数中是“异步”的，在原生事件(addEventListener 直接添加的事件处理函数)和 `setTimeout`和`setInterval` 中都是同步的 (react 为了解决跨平台，兼容性问题，自己封装了一套事件机制，代理了原生的事件，像在 jsx 中常见的 onClick、onChange 这些都是合成事件)。

2. `setState` 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和`setTimeout` 中不会批量更新，在“异步”中如果对同一个值进行多次 `setState` ， `setState` 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 `setState` 多个不同的值，在更新时会对其进行合并批量更新。

## 2. Hooks

> function 组件里。Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

## 3. 生命周期函数

<img src='./imgs/lifeCycle.png'>

1. **componentDidUpdate(prevProps, prevState, snapshot)**

   > 在更新后会被立即调用。首次渲染不会执行此方法。

2. **static getDerivedStateFromProps(props, state)**

   > getDerivedStateFromProps 会在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。

3. **getSnapshotBeforeUpdate(prevProps, prevState)**

   > getSnapshotBeforeUpdate() 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期的任何返回值将作为参数传递给 componentDidUpdate()。

## 4. 组件的跨层级通信 context

### 4.1 `React.createContext`

> 创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值

### 4.2 `Context.Provider`

> 当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 `shouldComponentUpdate` 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

> 因为 context 会使用参考标识（reference identity）来决定何时进行渲染，这里可能会有一些陷阱，当 provider 的父组件进行重渲染时，可能会在 consumers 组件中触发意外的渲染。举个例子，当每一次 Provider 重渲染时，以下的代码会重渲染所有下面的 consumers 组件，因为 value 属性总是被赋值为新的对象 `<MyContext.Provider value={{something: 'something'}}>`

### 4.3 `Context.Consumer`

```js
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

一个 React 组件可以订阅 context 的变更，这让你在函数式组件中可以订阅 context。需要一个函数作为子元素。

**例子：**

```js
// 父组件
export const Context = React.createContext();

const store = {
  home: {},
  user: {
    name: "zqq",
  },
};

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Context.Provider value={store}>
          <Context.Consumer>
            {(val) => <Home {...val} />} // val传递的即为Provider中的value
          </Context.Consumer>
        </Context.Provider>
      </div>
    );
  }
}
```

```js
// 子组件
export default class Home extends Component {
  render() {
    console.log(this.props);
    return <div>Home</div>;
  }
}
```

## 5.组件复合（Composition）

## 6. 高阶组件 HOC

> 高阶组件是一个工厂函数，它接收一个组件并返回另一个组件

例子：实现 antd 中的 Form.create()

```jsx
import React, { Component } from "react";

function FormCreate(Cmp) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.options = {};
      this.state = {};
    }

    handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
    };

    getFieldDecorator = (field, options) => {
      if (options && options.rules && options.rules.required) {
        this.options[field] = options;
      }
      return (InputCmp) => (
        <div>
          {React.cloneElement(InputCmp, {
            name: field,
            value: this.state[field] || "",
            onChange: this.handleChange,
          })}
        </div>
      );
    };
    getFieldsValue = () => {
      return { ...this.state };
    };
    getFieldValue = (field) => {
      return this.state[field];
    };

    validateFields = (callback) => {
      const temp = this.state;
      const err = [];
      for (let i in this.options) {
        if (temp[i] === undefined) {
          err.push({ [i]: "error" });
        }
      }
      if (err.length > 0) {
        callback(err, temp);
      } else {
        callback(null, temp);
      }
    };
    render() {
      return (
        <div>
          <Cmp
            {...this.props}
            getFieldDecorator={this.getFieldDecorator}
            getFieldsValue={this.getFieldsValue}
            getFieldValue={this.getFieldValue}
            validateFields={this.validateFields}
          />
        </div>
      );
    }
  };
}

class MyForm extends Component {
  submit = () => {
    const { getFieldsValue, validateFields } = this.props;
    validateFields((err, values) => {
      if (err) {
        console.log(err);
      } else {
        console.log("submit:", getFieldsValue());
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props;
    return (
      <div>
        <h1>MyForm</h1>
        {getFieldDecorator("name", {
          rules: {
            required: true,
          },
        })(<input type="text" />)}
        {getFieldDecorator("passward")(<input type="passward" />)}

        <button onClick={this.submit}>提交</button>
      </div>
    );
  }
}

export default FormCreate(MyForm);
```

## 7. Hooks

​ useState, useEffect, useRuducer & useContext

## 8. Portal

传送⻔，react v16 之后出现的 portal 可以实现内容传送功能。第一个参数是需要挂载的组件实例，而第二个参数则是要挂载到的 DOM 节点.
Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

```jsx
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
```

## 9. 手写 Tree 组件

递归调用自身

```js
import React, { Component, useState } from "react";
import { CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons";

const treeData = {
  key: 0, //标识唯⼀一性
  title: "全国", //节点名称显示
  children: [
    //⼦子节点数组
    {
      key: 6,
      title: "北方区域",
      children: [
        {
          key: 1,
          title: "⿊龙江省",
          children: [
            {
              key: 6,
              title: "哈尔滨",
            },
          ],
        },
        {
          key: 2,
          title: "北京",
        },
      ],
    },
    {
      key: 3,
      title: "南⽅区域",
      children: [
        {
          key: 4,
          title: "上海",
        },
        {
          key: 5,
          title: "深圳",
        },
      ],
    },
  ],
};

function TreeNode(props) {
  const [expanded, setExpanded] = useState(false);

  const hasChild =
    props.treeData.children && props.treeData.children.length > 0;
  const { title = "", children = [] } = props.treeData;

  const handleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ cursor: "pointer" }} onClick={handleExpanded}>
        {hasChild &&
          (expanded ? <CaretDownOutlined /> : <CaretRightOutlined />)}
        <span>{title}</span>
      </div>
      <div style={{ marginLeft: "30px" }}>
        {expanded &&
          hasChild &&
          children.map((item, index) => (
            <TreeNode key={index} treeData={item} />
          ))}
      </div>
    </div>
  );
}

class TreePage extends Component {
  render() {
    return <TreeNode treeData={treeData} />;
  }
}

export default TreePage;
```

## 10. 常见组件优化技术

- `shouldComponentUpdate`
- `PureComponent` 必须用 class 组件，浅比较
- `React.memo` 与 React.PureComponent 非常相似，但只适用于函数组件，而不适用 class 组件（v16.6 之后）

# 二、redux

## 1. Reducer

之所以将这样的函数称之为 reducer，是因为这种函数与被传⼊ Array.prototype.reduce(reducer, ?initialValue) 里的回调函数属于相同的类型。保持 reducer 纯净非常重要。永远不不要在 reducer 里做这
些操作：

- 修改传入参数；
- 执行有副作⽤用的操作，如 API 请求和路由跳转；
- 调用非纯函数，如 Date.now() 或 Math.random() 。

**Reduce**

```js
const array1 = [1, 2, 3, 4];
const reducer = (sum, currentValue) => sum + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

思考：有如下函数， 想要顺序输出 1 2 3，如何处理:

```js
function f1() {
  console.log("f1");
}
function f2() {
  console.log("f2");
}
function f3() {
  console.log("f3");
}
```

方法一： `f1();f2();f3();`
方法二：`f3(f2(f1()))`
方法三：

```js
// 聚合函数，return 一个函数
function compose(...funcs) {
  const len = funcs.length;
  if (len === 0) {
    return (arg) => arg;
  }
  if (len === 1) {
    return funcs[0];
  }
  return funcs.reduce((left, right) => (...args) => right(left(...args)));
}

compose(f1, f2, f3)();
```

## 2. Redux

> JavaScript 的应用状态容器

- 需要一个 store 来存储数据
- store 里的 reducer 初始化 state 并定义 state 修改规则
- 通过 dispatch 一个 action 来提交对数据的修改
- action 提交到 reducer 函数里，根据传⼊的 action 的 type，返回新的 state

应用中所有的 state 都以一个对象树的形式储存在一个单一的 store 中。 惟一改变 state 的办法是触发 action，一个描述发生什么的对象。 为了描述 action 如何改变 state 树，你需要编写 reducers。

强制使用 action 来描述所有变化带来的好处是可以清晰地知道应用中到底发生了什么。如果一些东西改变了，就可以知道为什么变。action 就像是描述发生了什么的指示器。最终，为了把 action 和 state 串起来，开发一些函数，这就是 reducer。再次地，没有任何魔法，reducer 只是一个接收 state 和 action，并返回新的 state 的函数。

Redux 没有 Dispatcher 且不支持多个 store。相反，只有一个单一的 store 和一个根级的 reduce 函数（reducer）

```js
import { createStore } from "redux";

/**
 * 这是一个 reducer，形式为 (state, action) => state 的纯函数。
 * 描述了 action 如何把 state 转变成下一个 state。
 *
 * state 的形式取决于你，可以是基本类型、数组、对象、
 * 甚至是 Immutable.js 生成的数据结构。惟一的要点是
 * 当 state 变化时需要返回全新的对象，而不是修改传入的参数。
 *
 * 下面例子使用 `switch` 语句和字符串来做判断，但你可以写帮助类(helper)
 * 根据不同的约定（如方法映射）来判断，只要适用你的项目即可。
 */
function counter(state = 0, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

// 创建 Redux store 来存放应用的状态。
// API 是 { subscribe, dispatch, getState }。
let store = createStore(counter);

// 可以手动订阅更新，也可以事件绑定到视图层。
store.subscribe(() => console.log(store.getState()));

// 改变内部 state 惟一方法是 dispatch 一个 action。
// action 可以被序列化，用日记记录和储存下来，后期还可以以回放的方式执行
store.dispatch({ type: "INCREMENT" });
// 1
store.dispatch({ type: "INCREMENT" });
// 2
store.dispatch({ type: "DECREMENT" });
// 1
```

**三大原则**

1. 单一数据源
   整个应用的 state 被储存在一棵 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。

2. State 是只读的
   唯一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

3. 使用纯函数来执行修改
   为了描述 action 如何改变 state tree ，你需要编写 reducers。

## 3. react-redux

这里需要再强调一下：Redux 和 React 之间没有关系。Redux 支持 React、Angular、Ember、jQuery 甚至纯 JavaScript。

### connect

```js
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter),
  };
};

// mapDispatchToProps 返回函数
const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}

// or 返回对象
const mapDispatchToProps = {
  onClick: (filter) => {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
}

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

connect 方法接受两个参数：mapStateToProps 和 mapDispatchToProps。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将 state 映射到 UI 组件的参数（props），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action。

### mapStateToProps()

mapStateToProps 的第一个参数总是 state 对象，还可以使用第二个参数，代表容器组件的 props 对象，容器组件的 props 参数发生变化，也会引发 UI 组件重新渲染。作为函数，mapStateToProps 执行后应该返回一个对象，里面的每一个键值对就是一个映射。

mapStateToProps 会订阅 Store，每当 state 更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。

### mapDispatchToProps()

定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。

### <Provider> 组件

为后代组件提供 store

**示例**

```js
// index.js
import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import store from "./store";
import page from "page";
import { Provider } from "react-redux";

ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
```

```js
// store.js
import { createStore } from "redux";

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

const store = createStore(counterReducer);
export default store;
```

```js
// page.js

import React, { Component } from "react";
import { connect } from "react-redux";

class Page extends Component {
  render() {
    const { num, add, minus } = this.props;
    return (
      <div>
        <p>{num}</p>
        <button onClick={add}>add</button>
        <button onClick={minus}>minus</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    num: state,
  };
};
const mapDispatchProps = {
  add: () => {
    return { type: "add" };
  },
  minus: () => {
    return { type: "minus" };
  },
};

export default connect(mapStateToProps, mapDispatchProps)(ReactReduxPage);
```

## 4. 中间件 redux-thunk

Redux 只是个纯粹的状态管理器，默认只支持同步，实现异步任务 比如延迟，网络请求，需要中间件的支持，比如最简单的 redux-thunk 和 redux-logger。

**中间件处理副作用的机制**

- 不用中间件时的 redux 工作流程：dispatch(action) ---> action ----> reducer ----> store

  1. dispatch 一个 action（纯对象格式）
  2. 这个 action 被 reducer 处理
  3. reducer 根据 action 更新 store（中的 state）

- 用了中间件之后的工作流程： dispatch(action) ---> action ----> middleware ---> reducer ----> store

  1. dispatch 一个“action”（不一定是标准的 action）
  2. 这个“action”先被中间件处理（比如在这里发送一个异步请求）
  3. 中间件处理结束后，再发送一个"action"（有可能是原来的 action，也可能是不同的 action 因中间件功能不同而不同）
  4. 中间件发出的"action"可能继续被另一个中间件处理，进行类似 3 的步骤。即中间件可以链式串联。
  5. 最后一个中间件处理完后，dispatch 一个符合 reducer 处理标准的 action（纯对象 action）
  6. 这个标准的 action 被 reducer 处理，
  7. reducer 根据 action 更新 store（中的 state）

  解决方法：只需要改造 store 自带的 dispatch 方法。action 发生后，先给中间件处理，最后再 dispatch 一个 action 交给 reducer 去改变状态。

  ```js
  // 手写 redux-thunk 中间件
  function thunk({ dispatch, getState }) {
    return (dispatch) => (action) => {
      if (typeof action === "function") {
        return action(diapatch, getState);
      }
      return dispatch(action);
    };
  }
  ```

## 5. redux 源码

```js
/**

需要实现以下功能：
1. 存储状态state
2. 获取状态getState
3. 更新状态dispatch
4. 变更订阅subscribe: 通过subscribe在store上添加一个监听函数。每当调用dispatch方法时，会执行所有的监听函数
5. 应用中间件，即applyMiddleware()

*/

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
 * applyMiddleware(logger, thunk) 返回一个函数 A: fnA(createStore) => {return (reducer) => {}}
 *                                函数 A 返回函数 B：fnB(createStore) => (reducer) => {}
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
```

## 6. react-redux 原理

**Provider**

**connect**

TODO: 有点小复杂，待我状态好些回过头来看 ^\_^

## 7. redux-saga

> redux-saga 是 redux 的一个中间件，使用了 ES6 的 Generator 功能

**计数器示例**

1. UI 组件 Counter

```js
import React, { Component, PropTypes } from "react";

const Counter = ({ value, onIncrement, onDecrement, onIncrementAsync }) => (
  <div>
    <button onClick={onIncrementAsync}>Increment after 1 second</button>
    <button onClick={onIncrement}>Increment</button> <button
      onClick={onDecrement}
    >
      Decrement
    </button>
    <hr />
    <div>Clicked: {value} times</div>
  </div>
);

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrementAsync: PropTypes.func.isRequired,
};

export default Counter;
```

2. main.js

```js
import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import Counter from "./Counter";
import reducer from "./reducers";
import rootSaga from "./models/saga";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

const action = (type) => store.dispatch({ type });

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => action("INCREMENT")}
      onDecrement={() => action("DECREMENT")}
      onIncrementAsync={() => action("INCREMENT_ASYNC")}
    />,
    document.getElementById("root")
  );
}

render();
store.subscribe(render);
```

3. saga.js

```js
import { delay } from "redux-saga";
import {
  put,
  takeEvery,
  takeLatest,
  all,
  call,
  select,
} from "redux-saga/effects";

export function* helloSaga() {
  console.log("Hello Sagas!");
}

// middleware 检查每个被 yield 的 Effect 的类型，然后决定如何实现哪个 Effect。如果 Effect 类型是 PUT 那 middleware 会 dispatch 一个 action 到 Store。 如果 Effect 类型是 CALL 那么它会调用给定的函数。
// put 和 call 返回 plain Object

/**
 * call(fn, ...args) 创建一个纯文本对象描述函数调用---声明式调用
 */

/**
 * put 用于创建 dispatch Effect
 */

export function* incrementAsync() {
  // 得到的是一个 Promise
  // yield delay(1000);
  //  call 返回一个 Effect，告诉 middleware 使用给定的参数调用给定的函数
  yield call(delay, 1000); // => { CALL: {fn: delay, args: [1000]}}
  yield put({ type: "INCREMENT" }); // => { PUT: {type: 'INCREMENT'} }
}

// takeEvery 允许多个 incrementAsync 实例同时启动。在某个特定时刻，尽管之前还有一个或多个 incrementAsync 尚未结束，我们还是可以启动一个新的 incrementAsync 任务
/**
 * 如果我们只想得到最新那个请求的响应（例如，始终显示最新版本的数据）。我们可以使用 takeLatest 辅助函数。
 *
 * function* watchIncrementAsync() {
 *  yield* takeLatest("INCREMENT_ASYNC", incrementAsync)
 * }
 *
 */

// export function* watchIncrementAsync() {
//   yield takeEvery("INCREMENT_ASYNC", incrementAsync);
// }

export function* watchIncrementAsync() {
  yield takeEvery("*", function* logger(action) {
    const state = yield select();
    console.log("action:", action);
    console.log("state:", state);
  });
}

export default function* rootSaga() {
  yield all([helloSaga(), watchIncrementAsync()]);
}
```

4. reducer.js

```js
export default function counter(state = 0, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "INCREMENT_IF_ODD":
      return state % 2 !== 0 ? state + 1 : state;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}
```
