const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

async function generatePDF(reportData, periodo, tipoBeca, carrera, graficosGenerales, graficosEspecificos) {

  const folderPath = path.join(__dirname, "../../reporteGenerado");
  const filePath = path.join(folderPath, "report.pdf");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Encabezado
  //--Franja superior
  doc.rect(0, 0, doc.page.width, 20).fill("#940f4b");
  //--Logo
  const logoPath = path.join(__dirname, "../../assets/logo_istla.png");
  doc.image(logoPath, 50, 30, { width: 75 });
  //--Insituto
  doc
    .font("Times-Bold")
    .fill("black")
    .fontSize(16)
    .text("INSTITUTO SUPERIOR TECNOLÓGICO LOS ANDES", 23, 50, {
      align: "center",
      width: doc.page.width,
    })
    .fill("black")
    .fontSize(15)
    .text("ISTLA", 23, 70, {
      align: "center",
      width: doc.page.width,
    });

  //--Línea separadora
  doc.moveTo(50, 110).lineTo(550, 110).stroke();

  // Título

  doc
    .font("Times-Bold")
    .fill("Reporte de becas")
    .fontSize(12)
    .text("INFORME DE CONCESIÓN DE BECAS", 0, 130, {
      align: "center",
      width: doc.page.width,
    });

  //--Fecha
  const fecha = new Date().toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.fontSize(10).font("Times-Roman").text(fecha, 260, 150);

  // Contenido
  const contenido = `El presente informe tiene como objetivo presentar un análisis detallado sobre la gestión de las becas en el Instituto Superior Tecnológico Los Andes, proporcionando información relevante sobre las solicitudes procesadas, los beneficiarios aprobados, no aprobados y los resultados obtenidos en el o los períodos correspondiente.`;
  doc.fontSize(12).font("Times-Roman").text(contenido, 50, 190, {
    align: "justify",
    lineGap: 8,
  });

  let currentY = 290;

  // Función para generar tabla de resumen
  const generateSummaryTable = (data, headers, y) => {
    const colWidths = {
      col1: 250,
      col2: 100,
    };

    let startX = 60;

    // Headers
    doc.font("Times-Bold").fontSize(10);
    Object.entries(headers).forEach(([header, width]) => {
      doc.rect(startX, y, width, 20).fillAndStroke("#7fbf1f", "#000000");
      doc.fillColor("black").text(header, startX + 2, y + 5, {
        width: width - 4,
        align: "center",
      });
      startX += width;
    });

    // Data
    doc.font("Times-Roman").fontSize(8);
    data.forEach((row, i) => {
      const rowY = y + 20 + i * 30;
      startX = 60;

      if (row.periodo) {
        doc.text(row.periodo, startX + 2, rowY + 5, {
          width: colWidths.col1 - 4,
        });
        doc.text(
          row.total_becas.toString(),
          startX + colWidths.col1 + 2,
          rowY + 5,
          { width: colWidths.col2 - 4, align: "center" }
        );
      } else if (row.TIPO_BECA) {
        doc.text(row.TIPO_BECA, startX + 2, rowY + 5, {
          width: colWidths.col1 - 4,
        });
        doc.text(row.Becas.toString(), startX + colWidths.col1 + 2, rowY + 5, {
          width: colWidths.col2 - 4,
          align: "center",
        });
      } else if (row.carrera) {
        doc.text(row.carrera, startX + 2, rowY + 5, {
          width: colWidths.col1 - 4,
        });
        doc.text(
          row.cantidadBecas.toString(),
          startX + colWidths.col1 + 2,
          rowY + 5,
          { width: colWidths.col2 - 4, align: "center" }
        );
      }

      // Línea separadora
      doc
        .moveTo(60, rowY + 30)
        .lineTo(60 + colWidths.col1 + colWidths.col2, rowY + 30)
        .stroke();
    });

    return y + 20 + data.length * 30 + 20; // Retorna siguiente Y
  };

  let periodoAumento = false;
  if (periodo) {
    periodoAumento = true;
    doc
      .font("Times-Bold")
      .fontSize(12)
      .text("Conteo de becas por periodo académico", 60, currentY);

    currentY += 20;
    currentY = generateSummaryTable(
      periodo,
      {
        Periodo: 250,
        "Total Becas": 100,
      },
      currentY
    );
  }

  let tipoBecaAumento = false;
  if (tipoBeca) {
    if (periodoAumento) currentY += 20;
    tipoBecaAumento = true;
    doc
      .font("Times-Bold")
      .fontSize(12)
      .text("Conteo de becas por tipo", 60, currentY);

    currentY += 20;
    currentY = generateSummaryTable(
      tipoBeca,
      {
        "Tipo de Beca": 250,
        Total: 100,
      },
      currentY
    );
  }

  if (carrera) {
    if (tipoBecaAumento) currentY += 20;
    doc
      .font("Times-Bold")
      .fontSize(12)
      .text("Conteo de becas por carrera", 60, currentY);

    currentY += 20;
    currentY = generateSummaryTable(
      carrera,
      {
        Carrera: 250,
        Total: 100,
      },
      currentY
    );
  }

  if (reportData !== false) {
    // Tabla
    // generateTable(doc, reportData);
    // Gráficos
    // generateCharts(doc, reportData);
  }

  doc.end();
  return filePath;
}

// function generateTable(doc, data) {
//   let startX = 70;
//   let startY = 300;
//   const rowHeight = 50;
//   const colWidths = {
//     CEDULA: 65,
//     NOMBRE: data[0].NOMBRE ? 120 : 0,
//     TIPO_BECA: 100,
//     PORCENTAJE: 40,
//     PERIODO: 85,
//     ESTADO: 55,
//     CARRERA: 110,
//   };
//   if (colWidths.NOMBRE) {
//     startX = 20;
//   }

//   // Encabezados con celdas
//   doc.font("Times-Bold").fontSize(10);
//   let currentX = startX;

//   Object.entries({
//     Cédula: colWidths.CEDULA,
//     Nombres: data[0].NOMBRE ? colWidths.NOMBRE : 0,
//     "Tipo Beca": colWidths.TIPO_BECA,
//     "%": colWidths.PORCENTAJE,
//     Periodo: colWidths.PERIODO,
//     Estado: colWidths.ESTADO,
//     Carrera: colWidths.CARRERA,
//   }).forEach(([header, width]) => {
//     if (width > 0) {
//       doc.rect(currentX, startY, width, 20).fillAndStroke("#7fbf1f", "#000000");
//       doc.fillColor("black").text(header, currentX + 2, startY + 5, {
//         width: width - 4,
//         align: "center",
//       });
//       doc.fillColor("black");
//       currentX += width;
//     }
//   });

//   // Datos
//   startY += 20;
//   doc.font("Times-Roman").fontSize(8).fill("black");

//   data.forEach((row, i) => {
//     let currentX = startX;
//     const y = startY + i * rowHeight;

//     // Función helper para texto con límite
//     const addText = (text, width, options = {}) => {
//       doc.text(text, currentX + 2, y + 5, {
//         width: width - 4,
//         height: rowHeight - 10,
//         ellipsis: true,
//         lineBreak: true,
//         ...options,
//       });
//       currentX += width;
//     };

//     // Dibuja cada celda
//     addText(row.CEDULA_ESTUDIANTE, colWidths.CEDULA);
//     if (row.NOMBRE) addText(row.NOMBRE, colWidths.NOMBRE);
//     addText(row.TIPO_BECA, colWidths.TIPO_BECA);
//     addText(`${row.PORCENTAJE}%`, colWidths.PORCENTAJE, { align: "center" });
//     addText(row.PERIODO, colWidths.PERIODO);
//     addText(row.ESTADO, colWidths.ESTADO);
//     addText(row.CARRERA, colWidths.CARRERA);

//     // Línea separadora
//     doc
//       .moveTo(startX, y + rowHeight)
//       .lineTo(
//         startX + Object.values(colWidths).reduce((a, b) => a + b, 0),
//         y + rowHeight
//       )
//       .stroke();
//   });
// }

function generateTable(doc, data) {
  let startX = 70;
  let startY = 300;
  const rowHeight = 50;
  const pageHeight = doc.page.height - 50;
  let currentPage = 1;

  const colWidths = {
    CEDULA: 65,
    NOMBRE: data[0].NOMBRE ? 120 : 0,
    TIPO_BECA: 100,
    PORCENTAJE: 40,
    PERIODO: 85,
    ESTADO: 55,
    CARRERA: 110,
  };

  if (colWidths.NOMBRE) startX = 20;

  const addHeaders = () => {
    doc.font("Times-Bold").fontSize(10);
    let currentX = startX;

    Object.entries({
      Cédula: colWidths.CEDULA,
      Nombres: data[0].NOMBRE ? colWidths.NOMBRE : 0,
      "Tipo Beca": colWidths.TIPO_BECA,
      "%": colWidths.PORCENTAJE,
      Periodo: colWidths.PERIODO,
      Estado: colWidths.ESTADO,
      Carrera: colWidths.CARRERA,
    }).forEach(([header, width]) => {
      if (width > 0) {
        doc
          .rect(currentX, startY, width, 20)
          .fillAndStroke("#7fbf1f", "#000000");
        doc.fillColor("black").text(header, currentX + 2, startY + 5, {
          width: width - 4,
          align: "center",
        });
        currentX += width;
      }
    });
    doc.fillColor("black");
    startY += 20;
  };

  addHeaders();
  doc.font("Times-Roman").fontSize(8);

  data.forEach((row, i) => {
    if (startY + rowHeight > pageHeight) {
      doc.addPage();
      startY = 50;
      addHeaders();
    }

    let currentX = startX;
    const y = startY;

    const addText = (text, width, options = {}) => {
      doc
        .font("Times-Roman")
        .fontSize(8)
        .text(text, currentX + 2, y + 5, {
          width: width - 4,
          height: rowHeight - 10,
          ellipsis: true,
          lineBreak: true,
          ...options,
        });
      currentX += width;
    };

    addText(row.CEDULA_ESTUDIANTE, colWidths.CEDULA);
    if (row.NOMBRE) addText(row.NOMBRE, colWidths.NOMBRE);
    addText(row.TIPO_BECA, colWidths.TIPO_BECA);
    addText(`${row.PORCENTAJE}%`, colWidths.PORCENTAJE, { align: "center" });
    addText(row.PERIODO, colWidths.PERIODO);
    addText(row.ESTADO, colWidths.ESTADO);
    addText(row.CARRERA, colWidths.CARRERA);

    doc
      .moveTo(startX, y + rowHeight)
      .lineTo(
        startX + Object.values(colWidths).reduce((a, b) => a + b, 0),
        y + rowHeight
      )
      .stroke();

    startY += rowHeight;
  });
}

function generateCharts(doc, data) {
  // Implementación gráficos
}

module.exports = { generatePDF };
