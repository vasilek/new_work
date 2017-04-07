import React from 'react';
import Select from 'react-select';
import {debounce} from "../../helperFunctions";

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
    componentWillMount() {
  this.isUnmounted = true;
    }
    componentDidMount() {
      this.isUnmounted = false;
    }
    componentWillUnmount() {
      this.isUnmounted = true;
    }
    render() {
        let val = this.props.input.value;
        const debouncedFetch = debounce((query, callback) => {
          if (this.isUnmounted) return;
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
        if(val.value) {
          val = val.value;
        }
        return (
          <Select.Async {...this.props} value={val || ''}
          onBlur={this.onBlur.bind(this)}
          onChange={this.onChange.bind(this)}
          searchPromptText="Введите имя пользователя"
            placeholder="Список выбранных сотрудников"
            backspaceRemoves={false}
            ignoreCase={true}
          loadOptions={debouncedFetch} />
        );
    }
}
