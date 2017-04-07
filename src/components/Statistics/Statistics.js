import React from "react";
import "../styles/statistics.css";
import Container from "../Container";
import LeftStatisticsPanelContainer from "../../containers/Statistics/LeftStatisticsPanelContainer";
import {RightPanelContainer} from "../../containers/Containers";
import RightStatisticsPanelContainer from "../../containers/Statistics/RightStatisticsPanelContainer";




export default class Table extends React.Component {
  render() {
    return (
        <Container className="statistics-page">
          <RightPanelContainer flex="2">
            <LeftStatisticsPanelContainer />
          </RightPanelContainer>
          <div className={`splitter`}/>
          <RightPanelContainer flex="7" className="long-panel">
            <RightStatisticsPanelContainer />
          </RightPanelContainer>
        </Container>
    )
  }
}