import React from 'react';
import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

function searchForData(id, data) {
  const val = data.filter(x => x.value === id)[0];
  return val;
}

export default class SelectInput extends React.Component {
    onChange(event) {
        if (this.props.input.onChange) {
          if(event && event.value) {
            this.props.input.onChange(event.value);
            if(this.props.newOnChange) {
              this.props.newOnChange(event.value);
            }
          } else {
            this.props.input.onChange(event);
            if(this.props.newOnChange && event) {
              this.props.newOnChange(event);
            }
          } // <-- To be aligned with how redux-form publishes its CHANGE action payload. The event received is an object with 2 keys: "value" and "label"
        }
    }
    onBlur(event) {
      if(this.props.input.onBlur) {
        this.props.input.onBlur(this.props.input.value);
        if(this.props.newOnBlur) {
          this.props.newOnBlur(this.props.input.value);
        }
      }
    }
    render() {
        let val = this.props.input.value;
        if(val.value) {
          val = val.value;
        }
        return ( <Select {...this.props} value={val || ''}
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            options={
                this.props.options
            } // <-- Receive options from the form
            />
        );
    }
}
