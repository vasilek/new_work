import moment from "moment";

export default class Department {
  constructor(json) {
    Object.assign(this, json);
    this.parent = {};
    this.parent.value = json.parent_id;
  }
}