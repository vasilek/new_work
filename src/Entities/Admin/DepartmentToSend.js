export default class DepartmentToSend {
  constructor(json) {
    Object.assign(this, json);
    if(this.parent) {
      if(this.parent.value) {
        this.parent_id = this.parent.value;
      } else if(!isNaN(this.parent)) {
        this.parent_id = this.parent;
      } else {
        delete this.parent_id;
      }
    }
  }
}