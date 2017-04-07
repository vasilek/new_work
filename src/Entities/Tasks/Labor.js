import moment from "moment";
const statusDict = {
  0: "Новая",
  1: "Подтверждена",
  2: "Отклонена"
}
export default class Labor {
  constructor(json) {
    Object.assign(this, json);
    this.startDate= new Date(json.date*1000);
    this.comments = json.comments;
    if(this.comments) {
      this.comments.forEach(x=>{x.date = moment(new Date(x.created_dt * 1000)).format("LT, DD MMMM YYYY")});
    }
    const rights = json.rights;
    this.rights = {
      update: ~rights.indexOf("update"),
      comment: ~rights.indexOf("comment"),
      accept: ~rights.indexOf("accept"),
      delete: ~rights.indexOf("delete")
    }
    this.commentsOpened = false;
    this.rawstatus = json.status;
    this.comment = json.description === "undefined" ? "" : json.description;
    this.date = moment(this.startDate).format('DD.MM');
    this.hours = json.value;
    this.task_name = "";
    if(json.task) {
      this.task_name = json.task.name;
    }
    this.status = statusDict[json.status];
    this.status = this.status=== undefined ? "Вычисляется" : this.status;
    this.code = {
        label: json.code.value,
        value: json.code.id,
        description: json.code.description
    };
  }
}