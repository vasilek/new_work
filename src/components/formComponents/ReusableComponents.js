import React from 'react';
import SelectInput from "./SelectInput";
import SelectAsyncInput from "./SelectAsyncInput";
import { Field } from 'redux-form';
import right from "../../Icons/right.svg";
import left from "../../Icons/left.svg";

export const WorkCodeField = ({codes,debouncedUpdate}) => (
  <Field
      name="code"
      newOnChange={debouncedUpdate}
      component={prp =>
          <SelectInput
              {...prp}
              placeholder="Код работ"
              options={codes}
          />
      }/>
);

export const FinancesField = ({finances,debouncedUpdate}) => (
  <Field
      name="finance"
      newOnChange={debouncedUpdate}
      component={prp =>
          <SelectInput
              {...prp}
              placeholder="Статья финансирования"
              options={finances}
          />
      }/>
);

const datepickerStyles = {
  width: "100%",
  display: "flex",
  float: "right",
  flexDirection: "row",
  justifyContent: "space-between",
  background: "white"
}

export const PagesPicker = (props)=> {
  return (
    <div style={datepickerStyles}>
      <img className="clickable-image left" onClick={props.prevPage.bind(this)}  src={left} alt="logo" />
      <div className="dateContainer">
        <span className="page-number">{props.pageNumber}</span>
      </div>
      <img className="clickable-image right" onClick={props.nextPage.bind(this)}  src={right} alt="logo" />
    </div>
  )
}

export const DepartmentParentField = ({departments,debouncedUpdate}) => (
  <Field
      name="parent"
      newOnChange={debouncedUpdate}
      component={prp =>
          <SelectInput
              {...prp}
              placeholder="Родительский узел"
              options={departments}
          />
      }/>
);


export const DepartmentField = ({departments,debouncedUpdate}) => (
  <Field
      name="department"
      newOnChange={debouncedUpdate}
      component={prp =>
          <SelectInput
              {...prp}
              placeholder="Отделение штатной структуры"
              options={departments}
          />
      }/>
);

export const ExecutorsSelectField = ({executors, deactivateExecutorsField,debouncedUpdate}) => (
  <Field
  name="executors"
  newOnBlur={deactivateExecutorsField}
  newOnChange={debouncedUpdate}
  component={prp =>
      <SelectInput
          multi={true}
          {...prp}
          placeholder="Исполнители"
          options={executors}
          autofocus={true}
      />
  }/>
);

export const ExecutorsAsyncSelectField = ({executors, deactivateExecutorsField,debouncedUpdate}) => (
  <Field
  name="executors"
  newOnBlur={deactivateExecutorsField}
  newOnChange={debouncedUpdate}
  component={prp =>
      <SelectAsyncInput
          multi={true}
          {...prp}
          placeholder="Исполнители"
          autofocus={true}
      />
  }/>
);

export function onChangeSubmit(onChange, handleSubmit) {
  return (event) => {
    onChange(event);
    setTimeout(() => handleSubmit(), 0);
  };
}

export const NameField = ({input, placeholder,handleChange}) => {
    return (<textarea {...input} onChange={handleChange ? onChangeSubmit(input.onChange, handleChange) : input.onChange}    className="fieldValue taskHeader" placeholder={placeholder ? placeholder : "Название задачи"} />);
  }

  export const StandardField = ({input, placeholder}) => {
      return (<input {...input} placeholder= {placeholder ? placeholder : ""}   className="fieldValue standard-field"/>);
    }
export const DescriptionField = ({input, placeholder,handleChange}) => {
    return (<textarea  {...input} onChange={handleChange ? onChangeSubmit(input.onChange, handleChange) : input.onChange}    style={{minHeight:"100px", minWidth:"98%"}}/>);
}

export const HoursField = ({input, handleChange}) => {
    return (<input {...input} onChange={handleChange ? onChangeSubmit(input.onChange, handleChange) : input.onChange}  className="formInput"/>);
  }

export const Panel = ({children , label, disabled}) => {
  return (
  <div className={(disabled ? "noEvents " : "") + " taskPanel"}>
    <span className="panelLabel"> {label} </span>
    {children}
  </div>
  )
}


