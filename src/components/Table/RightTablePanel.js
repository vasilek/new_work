import React from "react";
import {RightPanelContainer} from "../../containers/Containers";
import TaskInfoContainer from "../../containers/Task/TaskInfoContainer";
import NewTaskInfoContainer from "../../containers/Task/NewTaskInfoContainer";
import LaborInfoContainer from "../../containers/LaborInfoContainer";
import LaborListContainer from "../../containers/Table/LaborListContainer";

const fullSize = {
  width:"100%",
  height: "100%"
}


export default class RightTaskPanel extends React.Component {
  render() {
    let rightPanel = <div/>;
    const props = this.props;
      if(this.props.laborView) {
        rightPanel = (
          <div className={"rightPanelContainer " + (props.rightPanelStatus ? "opened" : "closed")} style={fullSize}>
            <RightPanelContainer>
              <LaborInfoContainer labor={props.laborView}  onSubmit={props.handleEditLaborSubmit}/>
            </RightPanelContainer>
          </div>
        )
      } else if(this.props.taskView) {
        rightPanel = (
          <div className={"rightPanelContainer " + (props.rightPanelStatus ? "opened" : "closed")} style={fullSize}>
            <RightPanelContainer>
              <LaborListContainer  task={props.taskView} />
            </RightPanelContainer>
          </div>
        )
      }
    return rightPanel;
  }
}