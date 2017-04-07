import moment from "moment";

export default class Finance {
  constructor(json) {
    Object.assign(this, json);
    this.label = json.value;
    this.value = json.id;
  }
}