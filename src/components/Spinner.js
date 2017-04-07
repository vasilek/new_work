import React from "react";
import MDSpinner from "react-md-spinner";

var spinnerStyles = {
  position: "absolute",
  marginLeft: "auto",
  marginRight: "auto",
  left: 0,
  right: 0,
  top: "50vh",
}

export default (props) => {
  if(props.isFetching) {
    spinnerStyles.display = "inline-block";
  } else {
    spinnerStyles.display = "none";
  }
  return <MDSpinner style={spinnerStyles} size={60}/>;
}