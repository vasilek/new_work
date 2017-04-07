import React from "react";
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default ({
    input,
    label,
    meta: {
        touched,
        error
    },
    newOnChange
}) => {
    const selected = input.value ? moment(input.value) : null;
    const change = (event) => {
      if (input.onChange) {
        if(event.value) {
          input.onChange(event.value);
          if(newOnChange) {
            newOnChange(event.value);
          }
        } else {
          input.onChange(event);
          if(newOnChange) {
            newOnChange(event);
          }
        } // <-- To be aligned with how redux-form publishes its CHANGE action payload. The event received is an object with 2 keys: "value" and "label"
      }
    }
    return ( <DatePicker className="datePicker"
        selected={selected}
        onChange={change}
        popoverTargetAttachment="bottom left"
        />
    );
}
