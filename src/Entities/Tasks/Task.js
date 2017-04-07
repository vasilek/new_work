import moment from 'moment';
import Labor from "./Labor";
const statusDict = {
  0: "Новая",
  1: "Завершена",
  2: "Удалена",
  3: "Подтверждена",
  4: "Отклонена"
}

export default class Task {
    constructor(json) {
        const task = json;
        const rights = task.rights;
        this.rights = {
          update: ~rights.indexOf("update"),
          comment: ~rights.indexOf("comment"),
          time: ~rights.indexOf("time"),
          accept: ~rights.indexOf("accept"),
          reopen: ~rights.indexOf("reopen"),
          delete: ~rights.indexOf("delete")
        }
        this.title = task.name;
        this.name = task.name;
        this.id = task.id;
        this.description = task.description;
        this.shortDescription = task.description.slice(0, 400);
        this.descriptionOpen = false;
        this.rawstatus = task.status;
        this.status = statusDict[task.status];
        this.status = this.status=== undefined ? "Вычисляется" : this.status;
        this.children = task.children;
        this.opened = false;
        this.active = false;
        this.parent_id = task.parent_id;
        this.timings = task.timings ? task.timings.map(x => new Labor(x)) : [];
        this.author = task.author.name
        this.comments = task.comments;
        if(this.comments) {
          this.comments.forEach(x=>{x.date = moment(new Date(x.created_dt * 1000)).format("LT, DD MMMM YYYY")});
        }
        this.executors = task.executors;
        this.startDate = new Date(task.start_dt * 1000);
        this.code = {
            label: task.code.value,
            value: task.code.id
        };
        this.finance = {
          label: task.finance.value,
          value: task.finance.id
        };
        this.rawExecutors = this.executors ? this.executors.map(x => ({id: x.id, name: x.name})) : [];
        this.executors = this.executors ? this.executors.map(x => ({value: x.id, label: x.name})) : [];
    }
}
