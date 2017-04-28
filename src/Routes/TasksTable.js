import React, { Component } from 'react';
import {TaskTableContainer} from "../containers/Containers";
import Container from "../components/Container";



const containerTaskListContainerStyles = {
    flex:"10",
    overflow: "hidden"
}

const TaskListContainerStyles = {
  padding: "10px 20px",
  height: "calc(100% - 20px)"
}

const TasksTable = () => {
    return (
      <Container vertical={true} style={{height:"100%"}} >
        <div containerStyle={containerTaskListContainerStyles} style={TaskListContainerStyles}>
          <TaskTableContainer  top/>
          <TaskTableContainer  bottom/>
        </div>
      </Container>
    )
}

class Table extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {text: 'hui'};
  }

  render() {
    return (
        <Container className="global-body-container" flex="8" container={{overflow:"auto"}}>
          {this.props.children}
        </Container>
    );
  }
}

export {Table,TasksTable};
