import React, { Component } from 'react';
import {TaskListContainer} from "../containers/Containers";
import Container from "../components/Container";



const containerTaskListContainerStyles = {
    flex:"10",
    overflow: "auto"
}

const TaskListContainerStyles = {
  padding: "10px 20px",
  height: "calc(100% - 20px)"
}

const TaskList = () => {
  return (
  <Container vertical={true} style={{height:"100%"}} >
    <div containerStyle={containerTaskListContainerStyles} style={TaskListContainerStyles}>
      <TaskListContainer />
    </div>
  </Container>
  )
}

class Tasks extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }
  componentDidUpdate() {
    const type = this.props.params.type;
    this.props.route.loadRepo.setGlobalTaskType(type);
    const tabs = [
      {to: "/tasks/"+type+"/table", title: "Таблица"},
      {to: "/tasks/"+type+"/list", title: "Список"}
    ]
    this.props.route.loadRepo.tabs(tabs);
  }
  componentDidMount() {
    const type = this.props.params.type;
    this.props.route.loadRepo.setGlobalTaskType(type);
    const tabs = [
      {to: "/tasks/"+type+"/table", title: "Таблица"},
      {to: "/tasks/"+type+"/list", title: "Список"}
    ]
    this.props.route.loadRepo.tabs(tabs);
  }
  render() {
    return (
        <Container className="global-body-container" flex="8" container={{overflow:"auto"}}>
          {this.props.children}
        </Container>
    );
  }
}

export {Tasks,TaskList};
