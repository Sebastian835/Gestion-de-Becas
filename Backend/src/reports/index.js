const { generatePDF, generatePreliminarPDF } = require("./pdfGenerator");

async function handleReport(
  reportData,
  periodo,
  tipoBeca,
  carrera,
  graficosGenerales,
  conteoTotal
) {
  try {
    const pdfPath = await generatePDF(
      reportData,
      periodo,
      tipoBeca,
      carrera,
      graficosGenerales,
      conteoTotal
    );
    return pdfPath;
  } catch (error) {
    throw new Error("Error generando PDF");
  }
}

async function handleReportPreliminar(data) {
  try {
    const pdfPath = await generatePreliminarPDF(data);
    return pdfPath;
  } catch (error) {
    console.log(error)
    throw new Error("Error generando PDF");
  }
}

module.exports = { handleReport, handleReportPreliminar };
