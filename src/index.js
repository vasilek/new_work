import "babel-polyfill";
require('isomorphic-fetch');
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose  } from 'redux'
import thunk  from 'redux-thunk';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';
import { Router, Route, browserHistory, IndexRedirect  } from 'react-router';

import Reducers from './redux/reducers';
let store = createStore(Reducers,composeEnhancers(applyMiddleware(thunk)));
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
import {TaskRoutes,ReportRoutes,SubordinatesRoutes,StatisticsRoutes, LoginRoutes,LogoutRoutes,
StructureRoutes, UsersRoutes, CodesRoutes,FinancesRoutes, CalendarRoutes} from "./Routes/routes";

import {getCurrentUser,getSubordinates, pingLogin,logout} from "./redux/actions/userActions";
import {setTabs, setCurrentTitle, clearLayout, setLocation, setFilters, setQuery} from "./redux/actions/layoutActions";
import {loadDepTree,loadFlatDepartments} from "./redux/actions/Admin/departmentActions";
import {getUsers} from "./redux/actions/Admin/usersActions";
import {loadCodes} from "./redux/actions/Admin/codesActions";
import {loadCalendar} from "./redux/actions/Admin/calendarActions";
import {loadFinancesTable} from "./redux/actions/Admin/financesActions";
import {loadTasks,loadWorkCodes, loadFinances, setGlobalTaskType} from "./redux/actions/tasksActions";
import {loadTableData, setMonday} from "./redux/actions/tableActions";
import {loadPeopleTree} from "./redux/actions/subordinateActions";
import LayoutContainer from "./LayoutContainer";

var loadRepo = {
  user: (user) => store.dispatch(getCurrentUser({})),
  tasks: ()=>store.dispatch(loadTasks()),
  tabs: (tabs)=>store.dispatch(setTabs({tabs})),
  tableData: ()=>store.dispatch(loadTableData({day: store.getState().Table.currentWeek})),
  tableDataBig: ()=>store.dispatch(loadTableData({day: store.getState().Table.chosenDays})),
  setCurrentTitle: (title) => store.dispatch(setCurrentTitle({title:title})),
  workCodes: () => store.dispatch(loadWorkCodes()),
  finances: () => store.dispatch(loadFinances()),
  // financesDesc: () => store.dispatch(loadFinancesDesc()),
  subordinates: () => store.dispatch(getSubordinates({})),
  setGlobalTaskType: (type) => store.dispatch(setGlobalTaskType({routeType: type})),
  clearLayout: () => store.dispatch(clearLayout()),
  pingLogin: (renderFunc) => store.dispatch(pingLogin(renderFunc)),
  logout: () => store.dispatch(logout()),
  departments: () => store.dispatch(loadDepTree()),
  flatDepartments: () => store.dispatch(loadFlatDepartments()),
  users: () => store.dispatch(getUsers()),
  codesTable: () => store.dispatch(loadCodes()),
  financesTable: () => store.dispatch(loadFinancesTable()),
  setLocation: (location) => store.dispatch(setLocation({location})),
  monday: () => store.dispatch(setMonday()),
  setFilters: (filters) => store.dispatch(setFilters({filters})),
  setQuery:(query) => store.dispatch(setQuery({query})),
  calendar: (year) => store.dispatch(loadCalendar(year)),
  peopleTree: () => store.dispatch(loadPeopleTree())
}

browserHistory.listen(function(ev) {
  if(ev.search) {
    loadRepo.setQuery(ev.search);
  }
  loadRepo.setLocation(ev.pathname);
});


const TasksRouter = TaskRoutes({loadRepo:loadRepo});
const ReportRouter = ReportRoutes({loadRepo:loadRepo});
const SubordinatesRouter = SubordinatesRoutes({loadRepo:loadRepo});
const StatisticsRouter = StatisticsRoutes({loadRepo:loadRepo});
const LoginRouter = LoginRoutes({loadRepo:loadRepo})
const LogoutRouter = LogoutRoutes({loadRepo: loadRepo});
const StructureRouter = StructureRoutes({loadRepo: loadRepo});
const UsersRouter = UsersRoutes({loadRepo: loadRepo});
const CodesRouter = CodesRoutes({loadRepo: loadRepo});
const FinancesRouter = FinancesRoutes({loadRepo: loadRepo});
const CalendarRouter = CalendarRoutes({loadRepo: loadRepo});


const renderFunc = () => {
  const Root = () => (
      <Provider store={store}>
        <MuiThemeProvider>
          <Router history={browserHistory}>
            <Route path="/" component={LayoutContainer}>
              {TasksRouter}
              {ReportRouter}
              {SubordinatesRouter}
              {StatisticsRouter}
              {LoginRouter}
              {LogoutRouter}
              {StructureRouter}
              {UsersRouter}
              {CodesRouter}
              {FinancesRouter}
              {CalendarRouter}
            </Route>
        </Router>
        </MuiThemeProvider>
      </Provider>
  );

  ReactDOM.render(
    <Root />,
    document.getElementById('root')
  );
}

const checkLogin = loadRepo.pingLogin.call(this, renderFunc);

