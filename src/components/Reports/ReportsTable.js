import React from "react";
import "../styles/reportsTable.css";
import Container from "../Container";
import LeftReportsPanelContainer from "../../containers/Reports/LeftReportsPanelContainer";
import {RightPanelContainer} from "../../containers/Containers";
import RightReportsPanelContainer from "../../containers/Reports/RightReportsPanelContainer";



export default class Table extends React.Component {
  render() {
    return (
        <Container className="reports-page">
          <RightPanelContainer flex="2.2">
            <LeftReportsPanelContainer />
          </RightPanelContainer>
          <div className={`splitter`}/>
          <RightPanelContainer flex="7" className="long-panel">
            <RightReportsPanelContainer />
          </RightPanelContainer>
        </Container>
    )
  }
}