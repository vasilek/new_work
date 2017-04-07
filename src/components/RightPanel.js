import "./styles/RightPanel.css";
import React from "react";
import close from "../Icons/delete.svg"
export default (props) => (
      <div className="rightPanel">
        <img role="presentation" className="clickable-image close-right-panel" onClick={() => {props.closePanel.bind(this)(); props.onClose();}}  src={close}/>
        <div style={{height: "100%"}}>
          {props.children}
        </div>
      </div>
    )