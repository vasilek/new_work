import React from "react";
import {RightPanelContainer} from "../../containers/Containers";
// import DepartmentInfoContainer from "../../containers/Admin/DepartmentInfoContainer";
// import NewDepartmentInfoContainer from "../../containers/Admin/NewDepartmentInfoContainer";

const fullSize = {
    width:"100%",
    height: "100%"
}


export default class RightDepartmentPanel extends React.Component {
    render() {
        let rightPanel = <div/>;

        const props = this.props;

            rightPanel = (
                <div className={"rightPanelContainer " + (props.rightPanelStatus ? "opened" : "closed")} style={fullSize}>
                    <RightPanelContainer>
                        <div>
                            <h1>ПОПКА</h1>
                        </div>
                        {/*<DepartmentInfoContainer department={props.department} onSubmit={props.handleDepartmentEditSubmit.bind(this)}/>*/}
                    </RightPanelContainer>
                </div>
            )

        return rightPanel;
    }
}/**
 * Created by vasil_000 on 18.05.2017.
 */
