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
