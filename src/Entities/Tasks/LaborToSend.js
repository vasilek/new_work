export default function(json) {
  let newJson = Object.assign({}, json);
  newJson.description = json.comment;
  newJson.startDate = json.startLaborDate ? json.startLaborDate : json.startDate;
  newJson.task_id = json.task_id  ? json.task_id  : -1;
  newJson.code_id = json.code ? (json.code.id ? json.code.id : (json.code.value ? json.code.value : json.code)) : 0;
  newJson.value = json.hours ? json.hours : (json.value ? json.value : 0);
  newJson.status = json.rawstatus ? json.rawstatus : 0;
  return newJson;
}