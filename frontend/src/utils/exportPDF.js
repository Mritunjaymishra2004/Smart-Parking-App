import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";


// ======================================================
// EXPORT PDF
// ======================================================

export const exportPDF =
  (

    title = "Report",

    columns = [],

    data = [],

    filename = "report.pdf"

  ) => {

    try {

      const doc =
        new jsPDF();

      // ============================================
      // TITLE
      // ============================================

      doc.setFontSize(18);

      doc.text(
        title,
        14,
        20
      );

      // ============================================
      // TABLE
      // ============================================

      autoTable(doc, {

        startY: 30,

        head: [columns],

        body: data,

        styles: {

          fontSize: 10,

          cellPadding: 3,
        },

        headStyles: {

          fillColor: [15, 23, 42],
        },

        alternateRowStyles: {

          fillColor: [248, 250, 252],
        },
      });

      // ============================================
      // SAVE
      // ============================================

      doc.save(filename);

    } catch (error) {

      console.error(
        "PDF export error:",
        error
      );
    }
  };