import React from "react";
import {RightPanelContainer} from "../../containers/Containers";
import UserInfoContainer from "../../containers/Admin/UserInfoContainer";
import NewUserInfoContainer from "../../containers/Admin/NewUserInfoContainer";

const fullSize = {
  width:"100%",
  height: "100%"
}


export default class RightDepartmentPanel extends React.Component {
  render() {
    let rightPanel = <div/>;
    const props = this.props;
      if(this.props.user && this.props.user.type==="new") {
        rightPanel = (
          <div className={"rightPanelContainer " + (props.rightPanelStatus ? "opened" : "closed")} style={fullSize}>
            <RightPanelContainer>
              <NewUserInfoContainer user={props.user} onSubmit={props.handleNewUserSubmit}/>
            </RightPanelContainer>
          </div>
        )
      } else if(this.props.user) {
        rightPanel = (
          <div className={"rightPanelContainer " + (props.rightPanelStatus ? "opened" : "closed")} style={fullSize}>
            <RightPanelContainer>
              <UserInfoContainer user={props.user} onSubmit={props.handleEditUserSubmit}/>
            </RightPanelContainer>
          </div>
        )
      }
    return rightPanel;
  }
}