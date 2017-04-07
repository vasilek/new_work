export default function(json) {
  let newJson = Object.assign({}, json);
  newJson.code_id = json.code ? (json.code.id ? json.code.id : (json.code.value ? json.code.value : json.code)) : 0;
  newJson.finance_id = json.finance ? (json.finance.id ? json.finance.id : (json.finance.value ? json.finance.value : json.finance)) : 0;
  newJson.status = json.rawstatus ? json.rawstatus : 0;
  delete newJson.finance;
  delete newJson.status;
  delete newJson.rawstatus;
  newJson.executors = json.executors ? json.executors.map(x => x.id || x.value) : [];
  if(newJson.executors.length === 0) {
    delete newJson.executors;
  }
  return newJson;
}