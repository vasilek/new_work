import React from "react";
import {RightPanelContainer} from "../../containers/Containers";
import TaskInfoContainer from "../../containers/Task/TaskInfoContainer";
import NewTaskInfoContainer from "../../containers/Task/NewTaskInfoContainer";
import LaborInfoContainer from "../../containers/LaborInfoContainer";

const fullSize = {
  width:"100%",
  height: "100%"
}


export default class RightTaskPanel extends React.Component {
  render() {
    let rightPanel = <div/>;
    if(this.props.laborView) {
      rightPanel = (
        <div className={"rightPanelContainer "} style={fullSize}>
          <RightPanelContainer>
            <LaborInfoContainer labor={this.props.laborView} onSubmit={this.props.handleEditLaborSubmit}/>
          </RightPanelContainer>
        </div>
      )
    } else if(this.props.taskView && this.props.taskView.type === "new") {
      rightPanel = (
        <div className={"rightPanelContainer "} style={fullSize}>
          <RightPanelContainer>
            <NewTaskInfoContainer task={this.props.taskView} onSubmit={this.props.handleNewTaskSubmit}/>
          </RightPanelContainer>
        </div>
      )
    } else if(this.props.taskView){
      rightPanel= (
        <div className={"rightPanelContainer "} style={fullSize}>
          <RightPanelContainer>
            <TaskInfoContainer task={this.props.taskView} onSubmit={this.props.handleEditTaskSubmit}/>
          </RightPanelContainer>
        </div>
      )
    }
    return rightPanel;
  }
}