import React from "react";
import Container from "../Container";
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Select from 'react-select';
import {Panel} from "../formComponents/ReusableComponents";
import moment from 'moment';
import calendar from "../../Icons/calendar.svg";
import human from "../../Icons/human.svg";
import DatePicker from 'react-datepicker';
import right from "../../Icons/right.svg";
import left from "../../Icons/left.svg";
import helpers from "../Table/tableHelpers";
import {debounce} from "../../helperFunctions";
import {AppRegistry, Text, StyleSheet} from 'react-native';
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

const datePicker = (props, range, type, handlePrev, handleNext, selectDate, context, ref, dateClick, text) => (
    <div style={datepickerStyles}>
        <div className="from-to">{text}</div>
        <img className="clickable-image left" onClick={handlePrev.bind(context, type)} src={left} alt="logo"/>
        <div className="dateContainer">
            <DatePicker
                ref={ref}
                selected={range.first ? moment(range.first) : moment(new Date())}
                onChange={selectDate.bind(context, type)}
            />
            <span className="weekVisualiser"
                  onClick={dateClick}>{"Неделя " + helpers.getWeek(range.first) + " (" + moment(range.first).format("DD MMMM") + " - " + moment(range.last).format("DD MMMM") + ")" }</span>
        </div>
        <img className="clickable-image right" onClick={handleNext.bind(context, type)} src={right} alt="logo"/>
    </div>
)


function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function getPrevWeek(now) {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
}

function getNextWeek(now) {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
}

export default class Labors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: [],
            selectedTasks: [],
            selectedCodes: [],
            currentRadio: "tasks",
            task_ids: [],
            user_ids: [],
            code_ids: [],
            currentUser: false,
            user_id: false,
            type: 1,
            currentType: null,
            currentPanel: 1,
            currentStatisticsTypeRadio: "diagram"
        }
    }

    clickHandler() {
        this.props.loadPeopleTree();
        this.props.loadDepTree();
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

    add2Obj(first, second) {
        var third = [];
        var temp = [...new Set(first.concat(second.map(x => ({value: x.id, label: x.name}))).map(x => x.label))];
        for (var i in temp) {
            third.push({label: temp[i]})
        }
        console.log(third);
        return third;
    }

    loadPie() {
        this.setState({
            currentType: 1
        })
        this.props.loadPie(this.state);
    }

    loadHisto() {
        this.setState({
            currentType: 2
        })
        this.props.loadHisto(this.state);
    }

    radiogroupChanged(event, val) {
        if (val === "tasks") {
            this.setState({
                currentRadio: val,
                code_ids: [],
                selectedCodes: [],
                currentUser: false,
                user_id: false,
                type: 1
            });
        } else if (val === "code") {
            this.setState({
                currentRadio: val,
                task_ids: [],
                selectedTasks: [],
                currentUser: false,
                user_id: false,
                type: 2
            });
        }
        this.props.radioChanged();
    }

    radiogroupStatisticTypeChanged(event, val) {
        if (val === "diagram") {
            this.setState({
                currentStatisticsTypeRadio: "diagram"
            });
            this.openTrud.call(this);
        } else if (val === "histogram") {
            this.setState({
                currentStatisticsTypeRadio: "histogram"
            });
            this.openTrud.call(this);
        } else if (val === "normatives") {
            this.setState({
                currentStatisticsTypeRadio: "normatives"
            });
            this.openNormatives.call(this);
        }
    }

    handleSelectChange(vals) {
        console.log(vals);
        const user_ids = vals.map(x => x.value);
        this.props.getTasksForUsers(user_ids);
        this.setState({
            user_ids: user_ids,
            selectedUsers: vals
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

    handleCodesSelectChange(vals) {
        const code_ids = vals.map(x => x.value);
        this.setState({
            code_ids: code_ids,
            selectedCodes: vals
        })
    }

    handlePrev(type) {
        if (type == "start") {
            this.props.changeFirstWeek(getPrevWeek(this.props.weekPeriod.first));
        } else {
            this.props.changeLastWeek(getPrevWeek(this.props.weekPeriod.last));
        }
        if (this.state.currentType === 1) {
            this.loadPie();
        } else if (this.state.currentType === 2) {
            this.loadHisto();
        }
    }

    handleNext(type) {
        if (type == "start") {
            this.props.changeFirstWeek(getNextWeek(this.props.weekPeriod.first));
        } else {
            this.props.changeLastWeek(getNextWeek(this.props.weekPeriod.last));
        }
        if (this.state.currentType === 1) {
            this.loadPie();
        } else if (this.state.currentType === 2) {
            this.loadHisto();
        }
    }

    dateSelect(type, val) {
        if (type == "start") {
            this.props.changeFirstWeek(getMonday(val.toDate()));
        } else {
            this.props.changeLastWeek(getMonday(val.toDate()));
        }
        if (this.state.currentType === 1) {
            this.loadPie();
        } else if (this.state.currentType === 2) {
            this.loadHisto();
        }
    }

    openTrud() {
        this.setState({
            currentPanel: 1,
            currentType: 1
        })
    }

    openNormatives() {
        this.setState({
            currentPanel: 2,
            currentType: 3
        })
    }

    loadNormatives() {
        this.props.loadNormatives(this.state);
    }

    startClick() {
        this.refs.start.deferFocusInput();
    }

    endClick() {
        this.refs.end.deferFocusInput();
    }

    loadCurrentGraph() {
        switch (this.state.currentStatisticsTypeRadio) {
            case "diagram":
                this.loadPie.call(this);
                break;
            case "histogram":
                this.loadHisto.call(this);
                break;
            case "normatives":
                this.loadNormatives.call(this);
                break;
        }
    }

    render() {
        const props = this.props;
        const radio = this.state.currentRadio;
        const range1 = helpers.getDateRange(props.weekPeriod.first);
        const range2 = helpers.getDateRange(props.weekPeriod.last);
        let reportSelector = <div/>;
        switch (radio) {
            case "tasks":
                reportSelector = (
                    <Select
                        multi={true}
                        placeholder="Задачи"
                        value={this.state.selectedTasks}
                        onChange={this.handleTaskSelectChange.bind(this)}
                        options={this.props.currentTasks}
                    />
                )
                break;
            case "code":
                reportSelector = (
                    <Select value={this.state.selectedCodes}
                            multi={true}
                            placeholder="Коды работ"
                            value={this.state.selectedCodes}
                            onChange={this.handleCodesSelectChange.bind(this)}
                            options={
                                this.props.codes
                            } // <-- Receive options from the form
                    />
                )
                break
            default:
                reportSelector = <div className="noDisplay"/>
        }
        const bar = props.bar;
        let picker = <div className="noDisplay"/>;
        let secondPanelHeader = null;
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
        let bottomPanelButtons = null;
        if (this.state.currentPanel === 1) {
            secondPanelHeader = (
                <RadioButtonGroup
                    className={"report-type-choose-radio " + (this.state.disableClick ? "no-events-tree" : "")}
                    name="user_type" valueSelected={this.state.currentRadio}
                    onChange={this.radiogroupChanged.bind(this)}>
                    <RadioButton
                        value="tasks"
                        label="Задачи"
                    />
                    <RadioButton
                        value="code"
                        label="Коды работ"
                    />
                </RadioButtonGroup>
            );
        } else {
            secondPanelHeader = <h3 className="reports-header" style={{margin: "5px 0"}}>Задачи</h3>
            reportSelector = (
                <Select
                    multi={true}
                    placeholder="Задачи"
                    value={this.state.selectedTasks}
                    onChange={this.handleTaskSelectChange.bind(this)}
                    options={this.props.currentTasks}
                />
            )
        }
        const period = props.period;
        picker = (
            <div className="weekPicker">
                <div>
                    {datePicker.call(this, props, range1, "start", this.handlePrev, this.handleNext, this.dateSelect, this, "start", this.startClick.bind(this), "От:")}
                </div>
                <div>
                    {datePicker.call(this, props, range2, "end", this.handlePrev, this.handleNext, this.dateSelect, this, "end", this.endClick.bind(this), "До:")}
                </div>
            </div>
        )

        console.log("props",props)

        return (
            <Container vertical={true}>
                <div className="top-statistics-buttons-container">
                    <RadioButtonGroup className={"statistics-type-choose-radio "} name="user_type"
                                      valueSelected={this.state.currentStatisticsTypeRadio}
                                      onChange={this.radiogroupStatisticTypeChanged.bind(this)}>
                        <RadioButton
                            value="diagram"
                            label="Диаграмма"
                        />
                        <RadioButton
                            value="histogram"
                            label="Гистограмма"
                        />
                        <RadioButton
                            value="normatives"
                            label="Нормативы"
                        />
                    </RadioButtonGroup>
                </div>

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
                    <h3 className="reports-header"> Сотрудники</h3>
                </div>
                <div className="user-report-select" flex="2">

                    <Select.Async multi={radio === "table" ? false : true} value={this.state.selectedUsers}
                                  onChange={this.handleSelectChange.bind(this)}
                                  searchPromptText="Введите имя пользователя"
                                  placeholder={radio === "table" ? "Сотрудник" : "Список выбранных сотрудников"}
                                  backspaceRemoves={false}
                                  ignoreCase={true}
                                  onFocus={this.disableClick.bind(this, true)}
                                  onBlur={this.disableClick.bind(this, false)}
                                  loadOptions={debouncedFetch}/>
                </div>


                <div className={"elements-report-select"} flex="4">
                    {secondPanelHeader}
                    {reportSelector}
                </div>
                {picker}
                <div className="button-statistics-create" flex="1">
                    <FlatButton style={{float: "right"}} label="Построить график"
                                onClick={this.loadCurrentGraph.bind(this, radio)}/>
                </div>
            </Container>
        )
    }
}