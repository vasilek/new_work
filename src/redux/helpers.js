export function searchTable(tableData, query) {
  let filteredData = {};
  for(var e in tableData) {
    if(~(e.toUpperCase().indexOf(query.toUpperCase()))) {
      filteredData[e] = tableData[e];
    }
  }
  return filteredData;
}