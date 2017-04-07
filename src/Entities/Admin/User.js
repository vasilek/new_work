import moment from "moment";

export default class User {
  constructor(json) {
    Object.assign(this, json);
    this.department_name = this.department ? this.department.name : "";
    this.department = this.department ? this.department.id : -1;
    this.is_chief = false;
    this.is_banned = false;
    this.is_admin = false;
    if(this.departments && this.departments.length > 0) {
      if(this.role === 1) {
        this.role = "-21";
      } else if(this.role === 2){
        this.role = "-22";
      } else {
        this.role = "-2";
      }
      this.is_chief = 1;
    }
    if(this.role === 1 || this.role === "-21") {
      this.is_admin = true;
    }
    if(this.role === 2 || this.role === "-22") {
        this.is_banned = true;
    }
  }
}