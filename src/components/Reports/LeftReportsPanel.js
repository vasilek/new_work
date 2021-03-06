import React from "react";
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Select from 'react-select';
// import {Panel} from "../formComponents/ReusableComponents";
import moment from 'moment';
import calendar from "../../Icons/calendar.svg";
import DatePicker from 'react-datepicker';
import right from "../../Icons/right.svg";
import left from "../../Icons/left.svg";
import helpers from "../Table/tableHelpers";
import {debounce} from "../../helperFunctions";
import human from "../../Icons/human.svg";
import PersonModalContainer from "../../containers/ModalContainers/PersonModalContainer";
const datepickerStyles = {
    width: "100%",
    display: "flex",
    float: "right",
    flexDirection: "row",
    justifyContent: "center",
    background: "white",
    alignItems: "flex-end"
}


var CustomInput = React.createClass({
    render () {
        return (
            <div onClick={this.props.onClick} className="tableWeekContainer">
                <img className="tableCalendar" src={calendar} alt="logo"/>
                {this.props.visualized}
            </div>
        )
    }
});


const patePicker = (props, range, isMonth) => (
    <div style={datepickerStyles}>
        <img className="clickable-image left"
             onClick={isMonth ? props.handlePrevMonth.bind(this, props.currentWeek) : props.handlePrevWeek.bind(this, props.currentWeek)}
             src={left} alt="logo"/>
        <div className="dateContainer">
            <DatePicker customInput={<CustomInput visualized={<span className="weekVisualiser">{
                isMonth ?
                    moment(range.first).format("MMMM YYYY").toUpperCase()
                    :
                    ("Неделя " + helpers.getWeek(props.currentWeek) + " (" + moment(range.first).format("DD MMMM") + " - " + moment(range.last).format("DD MMMM") + ")" )}</span>}/>}
                        selected={props.currentWeek ? moment(props.currentWeek) : moment(new Date())}
                        onChange={isMonth ? props.onDateMonthSelect : props.onDateSelect}
            />
        </div>
        <img className="clickable-image right"
             onClick={isMonth ? props.handleNextMonth.bind(this, props.currentWeek) : props.handleNextWeek.bind(this, props.currentWeek)}
             src={right} alt="logo"/>
    </div>
)



const datePicker = (props, range, type,  selectDate, context,ref, dateClick, text)=> (

    <div style={datepickerStyles}>
        <div className="from-to">{text}</div>
        {/*<img className="clickable-image left" onClick={handlePrev.bind(context, type)}  src={left} alt="logo" />*/}
        <div className="dateContainer">
            <DatePicker
                ref={ref}
                selected={range.first ? moment(range.first) : moment(new Date())}
                onChange={selectDate.bind(context, type)}
            />
            <span className="weekVisualiser" onClick={dateClick}>{"День " + moment(range.first).format("DD MM YYYY")}</span>
        </div>
    </div>
)



function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function getPrevWeek(now) {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
}

function getNextWeek(now) {
    return  new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
}

export default class Labors extends React.Component {

    componentWillMount() {
        this.props.loadPeopleTree();
        this.props.loadDepTree();
        if (this.props.departments.treeNormalized) {
            this.props.loadDepartment(this.props.departments.treeNormalized.byId[this.props.Y.user.department][0]);
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: [],
            selectedTasks: [],
            selectedFinances: [],
            currentRadio: "tasks",
            task_ids: [],
            user_ids: [],
            finance_ids: [],
            currentUser: false,
            user_id: false,
            halfRadio: "month",
            // half: 0
        }
    }

    clickHandler() {
        this.setState({isModalOpen: true});
    }

    setExecutors(list) {
        this.handleSelectChange(list)
    }

    closeModal() {
        this.setState({isModalOpen: false});
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.initialValue !== this.props.initialValue) {
            this.setState({chosenUsers: nextProps.initialValue})
        }
    }

    createReport(radio) {
        if (radio === "tasks") {
            this.props.createTaskReport(this.state);
        } else if (radio === "finance") {
            this.props.createFinanceReport(this.state);
        } else if (radio === "table") {
            this.props.createUserReport(this.state, this.props.half);
        }
    }

    radiogroupChanged(event, val) {
        if (val === "tasks") {
            this.setState({
                currentRadio: val,
                finance_ids: [],
                selectedFinances: [],
                currentUser: false,
                user_id: false
            });
            this.props.setTaskReport();
        } else if (val === "finance") {
            this.setState({
                currentRadio: val,
                task_ids: [],
                selectedTasks: [],
                currentUser: false,
                user_id: false
            });
            this.props.setFinanceReport();
        } else {
            if (this.props.departments.treeNormalized) {
                this.props.loadDepartment(this.props.departments.treeNormalized.byId[this.props.Y.user.department][0]);
            }
            this.setState({
                currentRadio: val,
                task_ids: [],
                selectedTasks: [],
                finance_ids: [],
                selectedFinances: [],
            });
            this.props.setTableReport();
        }
        this.props.radioChanged();
    }

    halfRadioChanged(event, val) {
        if (val === "half-month") {
            this.setState({halfRadio: val});
            this.props.setHalf();
        } else {
            this.setState({halfRadio: val});
            this.props.setFull();
        }
        this.props.radioChanged();
    }

    handleSelectChange(vals) {
        const user_ids = vals.map(x => x.value);
        this.props.getTasksForUsers(user_ids);
        this.setState({
            user_ids: user_ids,
            selectedUsers: vals
        })
    }

    handleSingleSelectChange(val) {
        this.setState({
            user_id: val.value,
            currentUser: val
        })
    }

    handleTaskSelectChange(vals) {
        const task_ids = vals.map(x => x.value);
        this.setState({
            task_ids: task_ids,
            selectedTasks: vals
        })
    }

    disableClick(disable) {
        if (!disable) {
            setTimeout(() => this.setState({disableClick: disable}), 700);
        } else {
            this.setState({disableClick: disable});
        }
        return true;
    }

    handleFinanceSelectChange(vals) {
        const finance_ids = vals.map(x => x.value);
        this.setState({
            finance_ids: finance_ids,
            selectedFinances: vals
        })
    }

    startClick() {
        this.refs.start.deferFocusInput();
    }
    endClick() {
        this.refs.end.deferFocusInput();
    }

    handlePrev(type) {
        if(type === "start") {
            this.props.changeFirstWeek(getPrevWeek(this.props.chosenDays.first));
        } else {
            this.props.changeLastWeek(getPrevWeek(this.props.chosenDays.last));
        }

    }
    handleNext(type) {
        if(type === "start") {
            this.props.changeFirstWeek(getNextWeek(this.props.chosenDays.first));
        } else {
            this.props.changeLastWeek(getNextWeek(this.props.chosenDays.last));
        }

    }

    dateSelect(type, val) {
        if(type === "start") {
            this.props.changeFirstWeek(val.toDate());
        } else {
            this.props.changeLastWeek(val.toDate());
        }
        console.log(val.toDate());

    }

    render() {
        const props = this.props;
        let picker = <div className="noDisplay"/>;
        const range1 = helpers.getDateRange_(props.chosenDays.first);
        const range2 = helpers.getDateRange_(props.chosenDays.last);
        console.log("range1",range1)
        console.log("range2",range2)
        const debouncedFetch = debounce((query, callback) => {
            if (!query) {
                callback(null, {options: []});
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
                    if (!json.data) {
                        callback(null, {options: []});
                        return;
                    }
                    callback(null, {options: json.data.users.map(x => ({value: x.id, label: x.name}))});
                });
        }, 500);
        const radio = this.state.currentRadio;
        // const radio = this.props.typeReport;
        console.log(this.props)
        // const range = radio === "table" ? helpers.getDateMonthRange(props.currentWeek) : helpers.getDateRange(props.currentWeek);
        const range = radio === "table" ? helpers.getDateMonthRange(props.currentWeek) : helpers.getDateRange_(props.chosenDays);
        console.log("RANGE,", range );
        let reportSelector = <div/>;
        switch (radio) {
            case "tasks":
                reportSelector = (
                    <Select
                        multi={true}
                        placeholder="Задачи"
                        value={this.state.selectedTasks}
                        onChange={this.handleTaskSelectChange.bind(this)}
                        style={{display:'block', overflow:'auto'}}
                        options={this.props.currentTasks}
                    />
                )
                break;
            case "finance":
                reportSelector = (
                    <Select value={this.state.selectedFinances}
                            multi={true}
                            placeholder="Статьи финансирования"
                            // value={this.state.selectedFinances}
                            onChange={this.handleFinanceSelectChange.bind(this)}
                            style={{display:'block', overflow:'auto'}}
                            options={
                                this.props.finances
                            } // <-- Receive options from the form
                    />
                )
                break
            default:
                reportSelector = <div className="noDisplay"/>
        }

        picker = (
            <div className="weekPicker">
                <div>
                    {datePicker.call(this,props, range1, "start",  this.dateSelect, this, "start", this.startClick.bind(this), "От:")}
                </div>
                <div>
                    {datePicker.call(this,props, range2, "end",  this.dateSelect, this, "end", this.endClick.bind(this), "До:")}
                </div>
            </div>
        )
        var halfLabel  = "С 1 по 15 " + moment(range.first).format("MMMM YYYY")
        const monthButton = (
            <RadioButtonGroup
            // className={"report-type-choose-radio1"}
            name="month"
            onChange={this.halfRadioChanged.bind(this)}
            valueSelected={this.state.halfRadio}
            style={{marginLeft:20}}>
            <RadioButton
                value="month"
                label="Месяц"
            />
            <RadioButton
                value="half-month"
                // label="С 1 по 15"
                label={halfLabel}
            />
        </RadioButtonGroup>)

        return (
            <Container vertical={true}>

                <div
                    style={{display: "flex", flexDirection: "row"}}>
                    <div>
                        <img className="user" onClick={this.clickHandler.bind(this)} src={human} alt="logo"
                             style={{margin: 15}}/>
                        <PersonModalContainer isModalOpen={this.state.isModalOpen}
                                              closeModal={this.closeModal.bind(this)}
                                              setExecutors={(list) => {
                                                  this.setExecutors(list)
                                              }}/>
                    </div >
                    <h3 className="reports-header"> Сотрудник{radio !== "table" ? "и" : ""} </h3>
                </div>
                <div className="user-report-select" flex="2">
                    <Select.Async multi={true} value={this.state.selectedUsers}
                                  onChange={this.handleSelectChange.bind(this)}
                                  searchPromptText="Введите имя пользователя"
                                  placeholder={"Список выбранных сотрудников"}
                                  backspaceRemoves={false}
                                  ignoreCase={true}
                                  style={{display:'block', overflow:'auto'}}
                                  onFocus={this.disableClick.bind(this, true)}
                                  onBlur={this.disableClick.bind(this, false)}
                                  loadOptions={debouncedFetch}/>
                </div>
                <div className={"elements-report-select"} flex="4">
                    <RadioButtonGroup
                        className={"report-type-choose-radio " + (this.state.disableClick ? "no-events-tree" : "")}
                        name="user_type" valueSelected={this.state.currentRadio}
                        onChange={this.radiogroupChanged.bind(this)}>
                        <RadioButton
                            value="tasks"
                            label="Задачи"
                        />
                        <RadioButton
                            value="finance"
                            label="Статьи финансирования"
                        />
                        <RadioButton
                            value="table"
                            label="Табель"
                        />
                    </RadioButtonGroup>
                    {reportSelector}
                </div>

                {/*<RadioButtonGroup*/}
                    {/*// className={"report-type-choose-radio1"}*/}
                    {/*name="month"*/}
                    {/*style={{marginLeft:20}}>*/}
                    {/*<RadioButton*/}
                        {/*value="month"*/}
                        {/*label="Месяц"*/}
                    {/*/>*/}
                    {/*<RadioButton*/}
                        {/*value="half-month"*/}
                        {/*label="Пол месяца"*/}
                    {/*/>*/}
                {/*</RadioButtonGroup>*/}
                { radio === "table" ?
                    monthButton
                    :
                    (<div></div>)}
                { radio === "table" ?
                patePicker(props, range, radio==="table")
                :
                picker}


                <div className="button-report-create" flex="1">

                    <FlatButton style={{float: "right"}} onClick={this.createReport.bind(this, radio)}
                                label="Создать отчет"/>
                </div>
            </Container>
        )
    }
}