import {
  saveAs,
} from "file-saver";


// ======================================================
// CONVERT JSON TO CSV
// ======================================================

const convertToCSV =
  (data = []) => {

    if (!data.length)
      return "";

    // ==============================================
    // HEADERS
    // ==============================================

    const headers =
      Object.keys(data[0]);

    // ==============================================
    // ROWS
    // ==============================================

    const rows =
      data.map((item) =>

        headers.map((header) => {

          const value =
            item[header];

          // Escape commas/quotes
          return `"${String(value ?? "")
            .replace(/"/g, '""')}"`;

        }).join(",")
      );

    // ==============================================
    // FINAL CSV
    // ==============================================

    return [

      headers.join(","),

      ...rows,

    ].join("\n");
  };


// ======================================================
// EXPORT CSV FILE
// ======================================================

export const exportCSV =
  (
    data = [],

    filename = "report.csv"
  ) => {

    try {

      const csv =
        convertToCSV(data);

      const blob =
        new Blob(

          [csv],

          {
            type:
              "text/csv;charset=utf-8;",
          }
        );

      saveAs(
        blob,
        filename
      );

    } catch (error) {

      console.error(
        "CSV export error:",
        error
      );
    }
  };