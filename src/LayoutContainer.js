import React from "react";
import {ToolbarContainer, SpinnerContainer,SideBarContainer,GlobalHeaderContainer}  from "./containers/Containers";
import Container from "./components/Container";
import ReactTooltip from 'react-tooltip';
import {
    closeErrorsModal
} from "./redux/actions/layoutActions";
import ValidationErrorsModalContainer from "./containers/ModalContainers/ValidationErrorsModalContainer";


const RouterCreator = function(name, to, fake, userType = 0) {
  return {name, to, fake, userType};
}

const sidenavRoutes = [
  {name: "Все задачи", to:"/tasks/all",
  children:[RouterCreator("Мои задачи", "/tasks/my"),
  RouterCreator("Нераспределенные задачи", "/tasks/nonDistributed")
  ,RouterCreator("Задачи подчиненных", "/tasks/subordinate",false, 1)]
  },
  RouterCreator("Мои сотрудники", '/subordinates',false, 1),
  RouterCreator("Мои отчеты", '/reports'),
  RouterCreator("Статистика", '/statistics'),
  {name: "Администрирование", to:"admin", fake:true, userType:2, children: [
    RouterCreator("Коды работ", "/admin/workCodes"),
    RouterCreator("Статьи финансирования", "/admin/finances"),
    RouterCreator("Штатная структура", "/admin/structure"),
    RouterCreator("Список сотрудников", "/admin/users"),
    RouterCreator("Производственный календарь", "/admin/calendar")
  ]},
  {name: "Выход", to: "logout"}
];
var containerStyles = {
  display: "flex",
  width: "100%",
  justifyContent: "center",
  flexDirection: "row"
}


class Layout extends React.Component {
  render() {
    let rendered = <div className="noDisplay"/>;
    if(this.props.pingedUser == "none") {
      return rendered
    }
    let maxHeight = this.props.tabs && this.props.tabs.length ?  "66.91px": "40.91px";
    let headerStyle = {
      background: "white",
      borderBottom:"1px solid black",
      maxHeight
    };
    if(!this.props.needHeader) {
      headerStyle.display = "none";
    }
    let toolBar = <div className="noDisplay"/>;
    let sideBar = <div className="noDisplay"/>;
    let containerStyle = Object.assign({},containerStyles,{height: "100%"});
    if(this.props.pingedUser !== null) {
      containerStyle = Object.assign({},containerStyles,{height: "calc(100% - 42px)"});
      rendered = (
      <div onClick={() => {ReactTooltip.hide()}}>
          <ToolbarContainer/>
          <div style={containerStyle}>
            <SpinnerContainer/>
            <SideBarContainer children={sidenavRoutes}/>
            <Container vertical="true" style={{background:"#f7f7f8"}}>
                <GlobalHeaderContainer containerStyle={headerStyle} flex="1"/>
                <div containerStyle={{overflow:"auto"}} style={{height: "100%"}}>
                  {this.props.children}
                  <ReactTooltip place="top" type="light" className="customTooltip" effect="float"/>
                </div>
            </Container>
        </div>
        <ValidationErrorsModalContainer containerStyle={{maxWidth: '0'}}/>
      </div>
      )
    } else {
      rendered = (
      <div>
          <div style={containerStyle}>
            <SpinnerContainer/>
            <Container vertical="true" style={{background:"#DDDDDD"}}>
                <div containerStyle={{overflow:"auto"}} style={{height: "100%"}}>
                  {this.props.children}
                </div>
            </Container>
        </div>
        <ValidationErrorsModalContainer containerStyle={{maxWidth: '0'}}/>
      </div>
      )
    }
    return rendered;
  }
}
import { connect } from 'react-redux';

const mapStateToProps = (state,ownProps) => {
  return {
    needHeader: state.currentTitle,
    children: ownProps.children,
    isErrorsModalOpen: state.isErrorsModalOpen,
    tabs: state.tabs,
    pingedUser: state.User.pingedUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
        dispatch(closeErrorsModal({}));
    }
  }
}


const Visible = connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout)

export default Visible;