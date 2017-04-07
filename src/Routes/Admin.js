import React, { Component } from 'react';
import {StateStructureContainer,UsersContainer, CodesContainer,FinancesContainer, CalendarContainer} from "../containers/Containers";
import Container from "../components/Container";


const containerTaskListContainerStyles = {
    flex:"10",
    overflow: "auto"
}

const TaskListContainerStyles = {
  padding: "10px 20px",
  height: "calc(100% - 20px)"
}

const StateStructureList = () => {
  return (
  <Container vertical={true} style={{height:"100%"}} >
    <div containerStyle={containerTaskListContainerStyles} style={TaskListContainerStyles}>
      <StateStructureContainer />
    </div>
  </Container>
  )
}

const UsersList = () => {
  return (
  <Container vertical={true} style={{height:"100%"}} >
    <div containerStyle={containerTaskListContainerStyles} style={TaskListContainerStyles}>
      <UsersContainer />
    </div>
  </Container>
  )
}


const CodesList = () => {
  return (
  <Container vertical={true} style={{height:"100%"}} >
    <div containerStyle={containerTaskListContainerStyles} style={TaskListContainerStyles}>
      <CodesContainer />
    </div>
  </Container>
  )
}


const FinancesList = () => {
  return (
  <Container vertical={true} style={{height:"100%"}} >
    <div containerStyle={containerTaskListContainerStyles} style={TaskListContainerStyles}>
      <FinancesContainer />
    </div>
  </Container>
  )
}


const Calendar = () => {
  return (
  <Container vertical={true} style={{height:"100%"}} >
    <div containerStyle={containerTaskListContainerStyles} style={TaskListContainerStyles}>
      <CalendarContainer />
    </div>
  </Container>
  )
}



export {StateStructureList,UsersList, CodesList, FinancesList,Calendar};
