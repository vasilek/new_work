import TaskTable from "../../components/Table/TaskTable";
import {connect} from 'react-redux';
import {setAddingTrudTask, loadTask, editLabor, acceptAllTimings, activateTask} from "../../redux/actions/tasksActions";
import {openTrudModal, closeTrudModal, toggleRightPanel} from "../../redux/actions/layoutActions";
import {changeWeek, setCurrentWeek, setCurrentDay, loadTableData} from "../../redux/actions/tableActions";
import {reset} from 'redux-form';

import LaborToSend from "../../Entities/Tasks/LaborToSend";
import {
    setDay,
    loadCalendar
} from "../../redux/actions/Admin/calendarActions";
const mapStateToProps = (state, ownProps) => {
    return {
        tasks: state.tasks,
        rightPanelStatus: state.rightPanelStatus,
        tableData: state.Table.tableData,
        currentWeek: state.Table.currentWeek,
        isTrudModalOpen: state.isTrudModalOpen,
        activeIndexes: state.activeIndexes,
        currentDay: state.Table.currentDay,
        searchQuery: state.searchQuery,
        calendar: state.Admin.calendar
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        cellClickHandler: (data, id, date, val) => {
            dispatch(activateTask({
                taskId: id
            }));
            dispatch(setCurrentDay({day: date}));
            if (data && data.length) {
                dispatch(loadTask({id}));
                dispatch(toggleRightPanel({status: 1}));
            } else {
                if (val.rights && ~val.rights.indexOf("time")) {
                    dispatch(openTrudModal());
                    const taskCallback = (task) => {
                        dispatch(setAddingTrudTask({task}));
                    };
                    dispatch(loadTask({id}, taskCallback));
                } else {
                    dispatch(toggleRightPanel({status: 0}));
                }
            }
        },
        rowClickHandler: (data, id) => {
            if (data && data.length) {
                dispatch(activateTask({
                    taskId: id
                }));
                dispatch(setCurrentDay({day: false}));
                dispatch(loadTask({id}));
                dispatch(toggleRightPanel({status: 1}));
            }
        },
        onDateSelect: (day) => {
            dispatch(setCurrentWeek({day: day}));
            dispatch(changeWeek({day: day}));
        },
        openTrudModal: () => {
            dispatch(openTrudModal({}));
        },
        closeModal: () => {
            dispatch(closeTrudModal({}));
        },
        handlePrevWeek: (weekStart) => {
            const prev = new Date(weekStart.getTime() - 2 * 24 * 60 * 60 * 1000);
            dispatch(setCurrentWeek({day: prev}));
            dispatch(changeWeek({day: prev}));
        },
        handleNextWeek: (weekStart) => {
            const next = new Date(weekStart.getTime() + 9 * 24 * 60 * 60 * 1000);
            dispatch(setCurrentWeek({day: next}));
            dispatch(changeWeek({day: next}));
        },
        acceptAll: (timings) => {
            dispatch(acceptAllTimings(timings.map(x => x.id), null, true));
        },
        setDay: (day, status) => {
            dispatch(setDay(day, status));
        },
        loadYear: (year) => {
            dispatch(loadCalendar(year));
        }
    }
}


const Visible = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskTable)

export default Visible