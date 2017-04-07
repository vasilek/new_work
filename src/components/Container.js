import React from "react";

const Container = (props) => {
  let children = [];
  var propsChildren = [];
  const className = props.className || "";
  const styles = {...props.style, display: "flex", flexDirection: props.vertical ? "column" : "row", width: props.width || "100%", height: props.height || "100%" };
  if(!props.children) {
    propsChildren=[<h3>Empty!</h3>];
  } else if(!props.children.length) {
    propsChildren = [props.children];
  } else {
    propsChildren = props.children;
  }
  propsChildren.forEach((item,i) => {
    let child = Object.assign({},propsChildren[i]);
    child.props = Object.assign({}, propsChildren[i].props);
    let containerStyle = Object.assign({}, child.props.containerStyle);
    let flex = child.props.flex;
    let className = child.props.className;
    delete child.props.containerStyle;
    delete child.props.flex;
    delete child.props.className;
    flex = flex || 1;
    children[i] = (
      <div key={i} style={{...containerStyle, flex:flex}} className={className + " contained"}>
        {child}
      </div>
    );
  })
  return (
    <div style={styles} className={className} >
      {children}
    </div>
  )
}

export default Container;
