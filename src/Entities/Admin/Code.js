import moment from "moment";

export default class Code {
  constructor(json) {
    Object.assign(this, json);
    this.label = json.value;
    this.value = json.id;
  }
}