import Home from "./Home";
import {Tasks,TaskList} from "./Tasks";
import {Reports} from "./Reports";
import {Subordinates} from "./Subordinates";
import {TasksTable} from "./TasksTable";
import {Statistics} from "./Statistics"
import {StateStructureList,UsersList,CodesList, FinancesList, Calendar} from "./Admin";
import Login from "./Login";
import React from 'react';
import { Route, browserHistory, Redirect, IndexRoute} from 'react-router';

const TaskRoutes = (props) => {
  const taskEnter = () => {
    props.loadRepo.tasks();
  };
  const tableEnter = () => {
    props.loadRepo.tableData();
  };
  const mainTasksEnter = (ev) => {
    props.loadRepo.clearLayout();
    const location = browserHistory.getCurrentLocation();
    props.loadRepo.workCodes();
    props.loadRepo.finances();
    props.loadRepo.monday();
    props.loadRepo.subordinates();
    const type = ev.params.type;
    props.loadRepo.setGlobalTaskType(type);
    const query = location.query;
    if(query) {
      let obj = {};
      if(query.statuses) {
        obj.statuses = query.statuses.split(",");
      }
      if(query.sub_ids) {
        obj.sub_ids = query.sub_ids.split(",").map(x=>parseInt(x));
      }
      if(query.all_subs) {
        obj.all_subs = query.all_subs;
      }
      props.loadRepo.setFilters(obj);
    }
  }
  return (
  <Route path="tasks/:type" loadRepo={props.loadRepo} component={Tasks} onEnter={mainTasksEnter}>
    <IndexRoute onEnter={tableEnter} component={TasksTable} />
    <Route path="list" onEnter={taskEnter} component={TaskList}/>
    <Route path="table" onEnter={tableEnter} component={TasksTable}/>
  </Route>
  )
}

const StructureRoutes = (props) => {
  const structureEnter = () => {
    props.loadRepo.clearLayout();
    props.loadRepo.flatDepartments();
    props.loadRepo.departments();
    props.loadRepo.tabs([]);
    props.loadRepo.setCurrentTitle("Штатная структура");
    const location = browserHistory.getCurrentLocation()
    const query = location.query;
    if(query) {
      let obj = {};
      if(query.statuses) {
        obj.statuses = query.statuses.split(",");
      }
      if(query.sub_ids) {
        obj.sub_ids = query.sub_ids.split(",").map(x=>parseInt(x));
      }
      if(query.all_subs) {
        obj.all_subs = query.all_subs;
      }
      props.loadRepo.setFilters(obj);
    }
  }
  return (
    <Route path="admin/structure" components={StateStructureList} onEnter={structureEnter} />
  )
}

const UsersRoutes = (props) => {
  const usersEnter = () => {
    props.loadRepo.clearLayout();
    props.loadRepo.users();
    props.loadRepo.tabs([]);
    props.loadRepo.setCurrentTitle("Список сотрудников");
    props.loadRepo.flatDepartments();
    const location = browserHistory.getCurrentLocation()
    const query = location.query;
    if(query) {
      let obj = {};
      if(query.statuses) {
        obj.statuses = query.statuses.split(",");
      }
      if(query.sub_ids) {
        obj.sub_ids = query.sub_ids.split(",").map(x=>parseInt(x));
      }
      if(query.all_subs) {
        obj.all_subs = query.all_subs;
      }
      props.loadRepo.setFilters(obj);
    }
  }
  return (
    <Route path="admin/users" components={UsersList} onEnter={usersEnter} />
  )
}

const CodesRoutes = (props) => {
  const codesEnter = () => {
    props.loadRepo.clearLayout();
    props.loadRepo.codesTable();
    props.loadRepo.tabs([]);
    props.loadRepo.setCurrentTitle("Коды работ");
    const location = browserHistory.getCurrentLocation()
    const query = location.query;
    if(query) {
      let obj = {};
      if(query.statuses) {
        obj.statuses = query.statuses.split(",");
      }
      if(query.sub_ids) {
        obj.sub_ids = query.sub_ids.split(",").map(x=>parseInt(x));
      }
      if(query.all_subs) {
        obj.all_subs = query.all_subs;
      }
      props.loadRepo.setFilters(obj);
    }
  }
  return (
    <Route path="admin/workCodes" components={CodesList} onEnter={codesEnter} />
  )
}

const CalendarRoutes = (props) => {
  const calendarEnter = () => {
    props.loadRepo.clearLayout();
    props.loadRepo.tabs([]);
    props.loadRepo.setCurrentTitle("Производственный календарь");
    const curDate = new Date();
    props.loadRepo.calendar(curDate.getFullYear());
    const location = browserHistory.getCurrentLocation()
    const query = location.query;
    if(query) {
      let obj = {};
      if(query.statuses) {
        obj.statuses = query.statuses.split(",");
      }
      if(query.sub_ids) {
        obj.sub_ids = query.sub_ids.split(",").map(x=>parseInt(x));
      }
      if(query.all_subs) {
        obj.all_subs = query.all_subs;
      }
      props.loadRepo.setFilters(obj);
    }
  }
  return (
    <Route path="admin/calendar" components={Calendar} onEnter={calendarEnter} />
  )
}

const FinancesRoutes = (props) => {
  const financesEnter = () => {
    props.loadRepo.clearLayout();
    props.loadRepo.financesTable();
    props.loadRepo.tabs([]);
    props.loadRepo.setCurrentTitle("Статьи финансирования");
    const location = browserHistory.getCurrentLocation()
    const query = location.query;
    if(query) {
      let obj = {};
      if(query.statuses) {
        obj.statuses = query.statuses.split(",");
      }
      if(query.sub_ids) {
        obj.sub_ids = query.sub_ids.split(",").map(x=>parseInt(x));
      }
      if(query.all_subs) {
        obj.all_subs = query.all_subs;
      }
      props.loadRepo.setFilters(obj);
    }
  }
  return (
    <Route path="admin/finances" components={FinancesList} onEnter={financesEnter} />
  )
}


const ReportRoutes = (props) => {
  const reportsEnter = () => {
    props.loadRepo.clearLayout();
    props.loadRepo.tabs([]);
    props.loadRepo.setCurrentTitle("Мои отчеты");
    props.loadRepo.monday();
    props.loadRepo.finances();
    const location = browserHistory.getCurrentLocation()
    const query = location.query;
    if(query) {
      let obj = {};
      if(query.statuses) {
        obj.statuses = query.statuses.split(",");
      }
      if(query.sub_ids) {
        obj.sub_ids = query.sub_ids.split(",").map(x=>parseInt(x));
      }
      if(query.all_subs) {
        obj.all_subs = query.all_subs;
      }
      props.loadRepo.setFilters(obj);
    }
  }
  return (
    <Route path="reports" component={Reports}  onEnter={reportsEnter}/>
  )
}

const SubordinatesRoutes = (props) => {
  const subordinatesEnter = () => {
    props.loadRepo.clearLayout();
    props.loadRepo.setCurrentTitle("Мои сотрудники");
    props.loadRepo.peopleTree();
    const location = browserHistory.getCurrentLocation()
    const query = location.query;
    if(query) {
      let obj = {};
      if(query.statuses) {
        obj.statuses = query.statuses.split(",");
      }
      if(query.sub_ids) {
        obj.sub_ids = query.sub_ids.split(",").map(x=>parseInt(x));
      }
      if(query.all_subs) {
        obj.all_subs = query.all_subs;
      }
      props.loadRepo.setFilters(obj);
    }
  }
  return (
    <Route path="subordinates" component={Subordinates}  onEnter={subordinatesEnter}/>
  )
}

const LoginRoutes = (props) => {
  return (
    <Route path="login" component={Login}/>
  )
}

const LogoutRoutes = (props) => {
  return (
    <Route path="logout" onEnter={props.loadRepo.logout}/>
  )
}

const StatisticsRoutes = (props) => {
  const statisticsEnter = () => {
    props.loadRepo.clearLayout();
    props.loadRepo.tabs([]);
    props.loadRepo.workCodes();
    props.loadRepo.setCurrentTitle("Статистика");
    const location = browserHistory.getCurrentLocation()
    const query = location.query;
    if(query) {
      let obj = {};
      if(query.statuses) {
        obj.statuses = query.statuses.split(",");
      }
      if(query.sub_ids) {
        obj.sub_ids = query.sub_ids.split(",").map(x=>parseInt(x));
      }
      if(query.all_subs) {
        obj.all_subs = query.all_subs;
      }
      props.loadRepo.setFilters(obj);
    }
  }
  return (
    <Route path="statistics" component={Statistics}  onEnter={statisticsEnter}/>
  )
}

export {Home, TaskRoutes,ReportRoutes,SubordinatesRoutes,StatisticsRoutes, LoginRoutes,LogoutRoutes,StructureRoutes,
UsersRoutes, CodesRoutes, FinancesRoutes, CalendarRoutes};