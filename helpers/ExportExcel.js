import * as XLSX from "xlsx/xlsx";

const ExportExcel = (columns, data, filename) => {
  const compatibleData = data.map((row) => {
    const obj = {};
    columns.forEach((col, index) => {
      console.log(row[index]);
      obj[col.label] = row[col.key];
    });
    return obj;
  });

  let wb = XLSX.utils.book_new();
  let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
    columns,
  });
  XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
  XLSX.writeFile(wb, `${filename}-${Date.now()}.xlsx`);
};

export default ExportExcel
