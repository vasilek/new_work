import React from "react";
import {RightPanelContainer} from "../../containers/Containers";
import DepartmentInfoContainer from "../../containers/Admin/DepartmentInfoContainer";
import NewDepartmentInfoContainer from "../../containers/Admin/NewDepartmentInfoContainer";

const fullSize = {
  width:"100%",
  height: "100%"
}


export default class RightDepartmentPanel extends React.Component {
  render() {
    let rightPanel = <div/>;
    const props = this.props;
      if(this.props.department && this.props.department.type==="new") {
        rightPanel = (
          <div className={"rightPanelContainer " + (props.rightPanelStatus ? "opened" : "closed")} style={fullSize}>
            <RightPanelContainer>
              <NewDepartmentInfoContainer department={props.department} onSubmit={props.handleDepartmentNewSubmit.bind(this)}/>
            </RightPanelContainer>
          </div>
        )
    } else if(this.props.department) {
      rightPanel = (
        <div className={"rightPanelContainer " + (props.rightPanelStatus ? "opened" : "closed")} style={fullSize}>
          <RightPanelContainer>
            <DepartmentInfoContainer department={props.department} onSubmit={props.handleDepartmentEditSubmit.bind(this)}/>
          </RightPanelContainer>
        </div>
      )
    }
    return rightPanel;
  }
}