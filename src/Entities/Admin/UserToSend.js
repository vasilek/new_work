export default function(json) {
  let newJson = Object.assign({}, json);
  delete newJson.tasks;
  delete newJson.created_dt;
  delete newJson.subordinates;
  delete newJson.departments;
  delete newJson.rights;
  newJson.is_chief = json.is_chief ? 1 : 0;
  let dep = json.department;
  if(dep) {
    newJson.department_id = json.department.id || json.department ;
    delete newJson.department;
  }
  return newJson;
}