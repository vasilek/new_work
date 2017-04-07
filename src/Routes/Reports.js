import React, { Component } from 'react';
import {ReportsTableContainer} from "../containers/Containers";
import Container from "../components/Container";


const containerTaskListContainerStyles = {
    flex:"10",
    overflow: "auto"
}

const TaskListContainerStyles = {
  padding: "10px 20px",
  height: "calc(100% - 20px)"
}

const ReportsTable = () => {
    return (
      <Container vertical={true} style={{height:"100%"}} >
        <div containerStyle={containerTaskListContainerStyles} style={TaskListContainerStyles}>
          <ReportsTableContainer  />
        </div>
      </Container>
    )
}

class Reports extends Component {
  render() {
    return (
        <Container className="global-body-container" flex="8" container={{overflow:"auto"}}>
          <ReportsTable/>
        </Container>
    );
  }
}

export {Reports};
