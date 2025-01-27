const { generatePDF } = require("./pdfGenerator");

async function handleReport(reportData, periodo, tipoBeca, carrera, graficosGenerales) {
  try {
    const pdfPath = await generatePDF(reportData, periodo, tipoBeca, carrera, graficosGenerales);
    return pdfPath;
  } catch (error) {
    throw new Error("Error generando PDF");
  }
}

module.exports = { handleReport };
