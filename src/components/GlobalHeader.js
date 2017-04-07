import React from 'react';
import { Link } from 'react-router';
import "./styles/GlobalHeader.css";
import FilterModalContainer from "../containers/ModalContainers/FilterModalContainer";
import Icon from "../Icons/Icon";


const headerStyles = {
  display: "flex",
  flexDirection: "column"
}

const tabStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center"
}

const checkBoxValues=[
  {value: "0,1,2,3,4", label:"Все задачи"},
  {value: "3", label:"Подтвержденные задачи"},
  {value: "0", label:"Неподтвержденные задачи"},
  {value: "1", label:"Завершенные задачи"},
];

const filterContainerStyle = {
  display: "flex",
  flexDirection: "row"
}

const createTabs = function(tabs,query) {
  let tabElements = [];
  for(var i = 0; i < tabs.length; i++) {
    tabElements[i] = (
       <Link className="header-link" activeClassName="underlinedLink" to={tabs[i].to+query} key={tabs[i].to}>{tabs[i].title}</Link>
    )
  }
  return tabElements;
}

function compareFilters(filter1, filter2) {
  if(!filter1.statuses || !filter2.statuses) {
    return false;
  }
  if(!filter1.sub_ids || !filter2.sub_ids) {
    return false;
  }
  if(filter1.statuses.length !== filter2.statuses.length || filter1.sub_ids.length !== filter2.sub_ids.length
  || filter1.all_subs !== filter2.all_subs) {
    return true;
  }
  for(let i = 0; i < filter1.statuses.length; i++) {
    if(!~filter2.statuses.indexOf(filter1.statuses[i])) {
      return true;
    }
  }
  for(let i = 0; i < filter1.sub_ids.length; i++) {
    if(!~filter2.sub_ids.indexOf(filter1.sub_ids[i])) {
      return true;
    }
  }
  return false;
}

const filterNeeded = [
   "Нераспределенные задачи",
  "Мои задачи",
   "Задачи подчинённых",
   "Все задачи"
]

export default class GlobalHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFilterModalOpen: false
    }
  }
  handleTouchTap (event) {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      isFilterModalOpen: true,
      anchorEl: event.currentTarget,
    })
  }
  getFilterParent() {
    return document.querySelector('.tasksContainer');
  }
  closeFilter() {
    this.setState({isFilterModalOpen: false})
  }
  render() {
    let tabs = "";
    const props = this.props;
    const query = props.query;
    let filterChanged = compareFilters(props.defaultFilters, props.currentTaskFilters);
    const isFilterDisplayed = ~filterNeeded.indexOf(props.currentTitle);
    let lineHeight = 48;
    if(this.props.tabs) {
      tabs = (
        <div className="tabs-header-container" style={tabStyles} >
          {createTabs(this.props.tabs, query)}
        </div>
      )
      if(this.props.tabs.length > 0) {
        lineHeight = 59;
      }
    }
    if(!this.props.currentTitle) {
      return (
        <div style={{display: "none"}}/>
      )
    } else {
      return (
        <div style={headerStyles} className={"line-height-"+lineHeight}>
          <div className="header-filter-container">
            <h2 style={{textAlign: "center", marginBottom:"0px", marginTop: "5px"}}>{this.props.currentTitle}</h2>
            <div data-tip="Фильтры" className={isFilterDisplayed ? "" : "noDisplay"}>
              <Icon name="filter" onClick={this.handleTouchTap.bind(this)} className={`clickable-image clock filter-icon ${filterChanged ? "active-filter" : ""}`}/>
            </div>
          </div>
          {tabs}
          <FilterModalContainer  isModalOpen={this.state.isFilterModalOpen} check={()=>{}}
          anchorEl={this.state.anchorEl}
          filterValues={checkBoxValues} closeModal={this.closeFilter.bind(this)} containerStyle={{maxWidth: '0'}}/>
        </div>
      );
    }
  }
}