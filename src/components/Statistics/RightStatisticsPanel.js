import React from "react";
import * as helpers from "../../helperFunctions";
import Icon from "../../Icons/Icon";
import Container from "../Container";
import moment from "moment";
import thelpers from "../Table/tableHelpers";
import { Pie, Bar } from 'react-chartjs-2';
import * as shelpers from "./statisticsHelpers";
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import ReactTooltip from 'react-tooltip';

const constColors = ["#22B808","#8A6CA7","#EA2DA4","#BDFA6D","#4F4A22","#70E9D1","#F94D8D","#D49160","#A7F74A","#D2257B","#88FC24","#48DA32","#E46B3E","#24D11C","#AAD04F","#A689ED","#8B5F32","#12797F","#E65181","#AC7711","#F9CD57","#85ECD2","#67E77F","#5BDEAA","#B7B41F","#19F04D","#B725C8","#A06933","#F42DB3","#3963A2","#8DF8D2","#642240","#11759A","#5B48E8","#F5DB3F","#6869B3","#CD74D5","#978748","#117D6A","#FAAA1A","#D96341","#AD085C","#3D0B42","#545B47","#64C4B9","#CB840F","#E451D8","#F05AA8","#B267A6","#56F700","#C2B095","#A18A2D","#BB985B","#A86E12","#40C63C","#DBA89D","#959DFE","#73029A","#99DF9C","#39C6E5","#43CC7C","#DFC540","#25682E","#984943","#74DFD0","#805B49","#5B602B","#8710F8","#E82FD3","#DFA424","#ACE6B6","#D51EC3","#4C0C2F","#4D62A6","#D7D798","#7F4F37","#51E3F2","#756E88","#9C224E","#4B3510","#63A79A","#BD94B2","#8FA208","#90F99F","#E07BA3","#C6202D","#385138","#FD347E","#A01CD8","#75BADF"];

let periodDict = {
  "day":1,
  "week": 2,
  "month": 3
}

export default class RightTaskPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRadio: "week"
    }
  }
  radiogroupChanged(event, val) {
    this.props.setGlobalPeriod(periodDict[val]);
    this.props.setPeriodType(val, this.state);
    this.setState({
      currentRadio: val
    })
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  render() {
    const props = this.props;
    const pie = props.pie;
    const histo = props.histo;
    const obj = props.normatives;
    if(obj.normatives) {
      let containers = shelpers.createTaskBlocks(obj);
      return (
        <div className="workChartContainer">
          {containers}
        </div>
      )
    } else if(pie.length) {
      var pieData = {};
      let labels = [];
      let data = [];
      let colors =[];
      for(let i = 0; i < pie.length; i++) {
        var rgb = [];
          colors.push(constColors[i%98]);

        data.push( parseFloat(pie[i].percent.toString().slice(0,5)));
        labels.push(pie[i].name)
      }
      pieData.datasets = [{data: data, backgroundColor: colors}];
      pieData.labels = labels;
      const chartOptions = {};
      return (
        <Container vertical={true}>
          <div flex="1" className="reportHeaderContainer">
              <h4 className="reports-header-right"><span>{"Диаграма загрузки специалистов"}</span></h4>
          </div>
          <div flex="11">
            <Pie data={pieData}/>
          </div>
        </Container>)
    } else if(histo.length) {
      let labels = [];
      let datasets = [];
      for(let i = 0; i < histo.length; i++) {
        labels.push(histo[i].date);
        for(let j = 0; j < histo[i].data.length; j++) {
          if(!datasets[j]) {
            datasets[j] = {data: []};
          }
          datasets[j].label = histo[i].data[j].name;
          datasets[j].backgroundColor = constColors[j];
          datasets[j].data.push(histo[i].data[j].value);
        }
      }
      const data = {
  labels: labels,
  datasets: datasets
};
  return (
    <Container vertical={true}>
      <div flex="1" className="reportHeaderContainer">
        <RadioButtonGroup className={"period-type-choose-radio"} name="period_type" valueSelected={this.state.currentRadio}
           onChange={this.radiogroupChanged.bind(this)}>
          <RadioButton
            value="day"
            label="День"
          />
          <RadioButton
            value="week"
            label="Неделя"
          />
          <RadioButton
            value="month"
            label="Месяц"
          />
        </RadioButtonGroup>
          <h4 className="reports-header-right"><span>{"Гистограмма загрузки специалистов"}</span></h4>
      </div>
      <div flex="11">
        <Bar data={data}/>
      </div>
   </Container>
  )
    }
    return <div/>;
  }
}