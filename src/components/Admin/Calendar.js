import React from "react";
import moment from "moment";
import "../styles/calendar.css";
import {Calendar,Week, Month} from '../../react-calendar';
import legend from "../../Icons/calendar-legend.svg";

const buttonContainerStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between"
}

const fullSize = {
  width:"100%",
  height: "100%"
}


const PagingCalendar = React.createClass({
  getInitialState: function () {
    return {
      date: moment().startOf('year')
    };
  },

  handlePrevYear: function (e) {
    e.preventDefault();
    this.setState({
      date: this.state.date.clone().subtract(1, 'year')
    });
    this.props.loadYear(this.state.date.clone().subtract(1, 'year').toDate().getFullYear());
  },

  handleNextYear: function (e) {
    e.preventDefault();
    this.setState({
      date: this.state.date.clone().add(1, 'year')
    });
    this.props.loadYear( this.state.date.clone().add(1, 'year').toDate().getFullYear());
  },

  render: function () {
    const props = this.props;
    const calendar = this.props.calendar;
    let mods = [];
    for(let e in calendar) {
      mods.push(calendar[e]);
    }
    let curMods = mods.concat([
      {
        component: 'day',
        events: {
          onClick: (date, e) => {
                  let newStatus = (parseInt((calendar[moment(date).format("YYYY-MM-DD")].status)+2) % 3);
                  props.setDay(moment(date).format("YYYY-MM-DD"),newStatus);
                }
        }
      }
    ]);
    return (
      <div>
        <a href="#" className="prevYear" onClick={this.handlePrevYear}>
          Предыдущий год
        </a>
        <a href="#" className="nextYear" onClick={this.handleNextYear}>
          Следующий год
        </a>
        <Calendar weekNumbers={ true }
                  startDate={ this.state.date }
                  date={ this.state.date }
                  endDate={ this.state.date.clone().endOf('year') }
                  mods={curMods} />
      </div>
    );
  }
});

const legendBlock = (
    <div className="legend-block">
      <div className="single-block">
        <div className="holiday-day">

        </div>
        <span className="calendar-dash"> - </span>
        <span className="calendar-day-name">
          Выходной день
        </span>
      </div>
      <div className="single-block">
        <div className="short-day">

        </div>
        <span className="calendar-dash"> - </span>
        <span className="calendar-day-name">
          Укороченный день
        </span>
      </div>
      <div className="single-block">
        <div className="work-day">

        </div>
        <span className="calendar-dash"> - </span>
        <span className="calendar-day-name">
          Рабочий день
        </span>
      </div>
    </div>
  )

export default class CalendarContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const props = this.props;
    const calendar = props.calendar;
    const loadYear = props.loadYear;
    if(Object.keys(calendar).length > 0) {
      return (
        <div className="calendar-container">
         <PagingCalendar calendar={calendar} setDay={this.props.setDay} loadYear={props.loadYear}/>
         <div className="calendar-legend">
            {legendBlock}
          </div>
        </div>
      );
    } else {
      return <div/>
    }
  }
}