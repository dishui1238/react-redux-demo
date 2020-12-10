import React, { Component } from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

function HomePage(props) {
  console.log(props);
  return <h1>HomePage</h1>;
}
function UserPage({ match }) {
  return (
    <div>
      <h1>UserPage</h1>
      <nav>
        <Link to={`/user/detail/999`}>详情</Link>
      </nav>
      <Route path={`/user/detail/:id`} component={Detail} />
    </div>
  );
}
function Detail({ match }) {
  return <h1>Detail: {match.params.id}</h1>;
}
class RouterPage extends Component {
  render() {
    return (
      <div>
        <h1>RouterPage</h1>
        <BrowserRouter>
          <nav>
            <Link to="/">首⻚</Link>
            <Link to="/user">⽤户中心</Link>
          </nav>
          {/* 添加Switch表示仅匹配⼀个*/}
          <Switch>
            {/* 根路路由要添加exact，实现精确匹配 */}
            <Route exact path="/" component={HomePage} />
            <Route path="/user" component={UserPage} />
            <Route component={() => <h1>404</h1>} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default RouterPage;
