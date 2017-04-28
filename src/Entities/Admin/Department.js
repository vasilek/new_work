import moment from "moment";

export default class Department {
  constructor(json) {
    Object.assign(this, json);
    this.parent = {};
    this.chiefs = json.chiefs;
    this.parent.value = json.parent_id;
  }
}