import React from "react"
import Popover from 'material-ui/Popover';
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import "../styles/Modal.css";
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {debounce} from "../../helperFunctions";
import Select from 'react-select';
import close from "../../Icons/delete.svg"
import {
  browserHistory
} from "react-router";

function copyFilters(obj) {
  let newTaskFilters = {};
  const filters = obj;
  newTaskFilters.statuses = filters.statuses.slice();
  newTaskFilters.sub_ids = filters.sub_ids || filters.sub_ids;
  newTaskFilters.all_subs = filters.all_subs || filters.all_subs;
  return newTaskFilters;
}

const filterModal = class filter extends React.Component {
  constructor(props) {
    super(props);
    const filters = props.currentTaskFilters;
    this.state = {
      currentTaskFilters: filters,
      defaultFilters: props.defaultFilters,
      location: "",
      newFilters: false
    }
  }
  resetFilters(location) {
    const newFilters = copyFilters(this.props.defaultFilters);
    this.setState({
      currentTaskFilters: newFilters,
      selectedUsers: [],
      newFilters: false
    });
    this.applyFilters(location, newFilters);
  }
  toggleCheckedStatus(elem) {
    let newFilters = this.state.currentTaskFilters;
    if(!newFilters.statuses) {
      newFilters.statuses = ["3"];
    }
    if(!~newFilters.statuses.indexOf(elem.value)) {
      if(elem.value === "0,1,2,3,4") {
        newFilters.statuses=[ "0,1,2,3,4"];
      } else {
        const allIndex = newFilters.statuses.indexOf("0,1,2,3,4");
        if(~allIndex) {
          newFilters.statuses.splice(allIndex,1);
        }
        newFilters.statuses.push(elem.value);
      }
      this.setState({
        currentTaskFilters: newFilters,
        newFilters: false
      });
    } else {
      newFilters.statuses.splice(newFilters.statuses.indexOf(elem.value),1);
      this.setState({
        currentTaskFilters: newFilters,
        newFilters: false
      });
    }
  }
  radiogroupChanged(event, val) {
    if(val === "all_subs") {
      let newFilters = this.state.currentTaskFilters;
      newFilters.all_subs = 1;
      this.setState({
        currentTaskFilters: newFilters,
        newFilters: false
      })
    } else {
      let newFilters = this.state.currentTaskFilters;
      newFilters.all_subs = 0;
      this.setState({
        currentTaskFilters: newFilters,
        newFilters: false
      })
    }
  }
  handleSelectChange(vals) {
    let newFilters = this.state.currentTaskFilters;
    newFilters.sub_ids = vals.map(x => x.value);
    this.setState({
        selectedUsers: vals,
        currentTaskFilters: newFilters,
        newFilters: false
    })
  }
  applyFilters(currentLocation, filters) {
    const queryFilter = {};
    if(filters.statuses) {
      if(filters.sub_ids) {
        queryFilter.sub_ids = filters.sub_ids.join(",");
      }
      if(filters.statuses) {
        queryFilter.statuses = filters.statuses.join(",");
      }
      if(filters.all_subs) {
        queryFilter.all_subs = filters.all_subs;
      }
      this.props.applyFilters(filters, currentLocation);
    } else {
      const f =this.state.currentTaskFilters;
      if(f.sub_ids) {
        queryFilter.sub_ids = f.sub_ids.join(",");
      }
      if(f.statuses) {
        queryFilter.statuses = f.statuses.join(",");
      }
      if(f.all_subs) {
        queryFilter.all_subs = f.all_subs;
      }
      this.props.applyFilters(copyFilters(this.state.currentTaskFilters), currentLocation);
    }
    const location = browserHistory.getCurrentLocation().pathname;
    browserHistory.push({pathname: location, query: {...queryFilter}});
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.location !== this.state.location) {
      this.setState({
        newFilters: true
      })
    }
  }
  render() {
    const props = this.props;
    const checkBoxValues = props.filterValues;
    let checkBoxes = [];
    const debouncedFetch = debounce((query, callback) => {
      if(!query) {
        callback(null,{options: []});
      }
      fetch(`/data/searchusers?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: 'include'
        })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          if(!json.data) {
            callback(null,{options: []});
            return;
          }
          callback(null,{ options: json.data.users.map(x => ({value: x.id, label: x.name})) });
        });
    }, 500);
    let currentTaskFilters = {};
    if(this.state.newFilters) {
        currentTaskFilters = this.props.currentTaskFilters;
    } else {
        currentTaskFilters = this.state.currentTaskFilters;
    }
    if(currentTaskFilters.statuses === undefined) {
      currentTaskFilters.statuses = this.state.defaultFilters.statuses;
    }
    if(currentTaskFilters && currentTaskFilters.statuses) {
      if(currentTaskFilters.statuses.join(",") === "0,1,2,3,4") {
        currentTaskFilters.statuses = ["0,1,2,3,4"];
      }
    }
    for(var i = 0; i < checkBoxValues.length; i++) {
      let checked = false;
      if(currentTaskFilters.statuses) {
        if(~currentTaskFilters.statuses.indexOf(checkBoxValues[i].value)) {
          checked = true;
        }
      }
      checkBoxes[i] = (<Checkbox
      key={i}
      checked={checked}
      label={checkBoxValues[i].label}
      onCheck={this.toggleCheckedStatus.bind(this, checkBoxValues[i])}
      />);
    }
    let defaultValue="";
    if(currentTaskFilters.all_subs) {
      defaultValue = "all_subs";
    } else {
      defaultValue = "subs";
    }
    const subs_select = ( <div>
      { this.state.currentTaskFilters.all_subs ?
        <Select.Async multi={true} value={this.state.selectedUsers}
        onChange={this.handleSelectChange.bind(this)}
        searchPromptText="Введите имя пользователя"
          placeholder="Список выбранных сотрудников"
          backspaceRemoves={false}
          ignoreCase={true}
        loadOptions={debouncedFetch} />
            :
            <Select
                multi={true}
                placeholder="Список выбранных сотрудников"
                value={currentTaskFilters.sub_ids}
                onChange={this.handleSelectChange.bind(this)}
                options={
                    this.props.executors
                } // <-- Receive options from the form
                />
      } </div>
    )
    return (
      <Popover
      open={props.isModalOpen}
      onRequestClose={props.closeModal}
      anchorEl={props.anchorEl}
      style={{overlay: {zIndex: 7}}}
      className="filter-popover"
      >
      <Container vertical="true" style={{justifyContent: "spaceBetween"}} >
        <div className="close-container">
          <img role="presentation" className="clickable-image close-filter-panel" onClick={props.closeModal}  src={close}/>
        </div>
        <Container className="filter-modal-all-container">
          <div className="filter-modal-container" flex="4">
            <span className="modal-header">Задачи</span>
            <div className="filter-checkboxes-container">
              { checkBoxes}
            </div>
          </div>
          <div className="filter-modal-container" flex="7">
            <span className="modal-header">Сотрудники</span>
            <RadioButtonGroup className="subs-choose-radio" name="user_type" valueSelected={defaultValue} onChange={this.radiogroupChanged.bind(this)}>
              <RadioButton
                value="all_subs"
                label="Все сотрудники"
              />
              <RadioButton
                value="subs"
                label="Непосредственные подчиненные"
              />
            </RadioButtonGroup>
            {subs_select}
          </div>
        </Container>
        <div className="filter-button-container">
          <FlatButton style={{float:"right"}} className="addTrudButton apply" label="Применить" onClick={this.applyFilters.bind(this, props.currentLocation)} />
          <FlatButton style={{float:"left"}} className="addTrudButton reset" label="Сбросить" onClick={this.resetFilters.bind(this, props.currentLocation)} />

        </div>
      </Container>
      </Popover>
    )
  }
}

export default filterModal;