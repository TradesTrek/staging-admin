import JsPDF from "jspdf";
import "jspdf-autotable";
const ExportPdf = (col, data, filename) => {
  let header = [];
  col.map((item, i) => {
    header.push({ dataKey: item["key"], header: item.label });
  });

  const doc = new JsPDF();
  doc.autoTable({
    columns: header,
    body: data,
    styles: {
      minCellHeight: 6,
      halign: "left",
      valign: "center",
      fontSize: 5,
    },
  });
  doc.save(`${filename}-${Date.now()}.pdf`);
};
export default ExportPdf;
