import React from "react";
import { Button } from "antd";
import { consumerHandle } from "../AppContext";

function User(props) {
  // console.log("UserProps", props);
  return (
    <div>
      <Button>User</Button>
    </div>
  );
}

export default consumerHandle(User);
