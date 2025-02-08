const PDFDocument = require("pdfkit");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");
const path = require("path");

async function cleanOldPDFs(folderPath) {
  try {
    const files = await fs.promises.readdir(folderPath);
    for (const file of files) {
      if (file.startsWith("report_") && file.endsWith(".pdf")) {
        const filePath = path.join(folderPath, file);
        await fs.promises.unlink(filePath);
      }
    }
  } catch (error) {
    throw new Error("Error al limpiar PDFs antiguos: " + error.message);
  }
}

async function generatePDF(
  reportData,
  periodo,
  tipoBeca,
  carrera,
  graficosGenerales,
  conteoTotal
) {
  const folderPath = path.join(__dirname, "../../reporteGenerado");

  // Crear el directorio si no existe
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Limpiar PDFs antiguos antes de generar uno nuevo
  await cleanOldPDFs(folderPath);

  // Generar nuevo nombre con timestamp
  const timestamp = Date.now();
  const fileName = `report_${timestamp}.pdf`;
  const filePath = path.join(folderPath, fileName);
  const relativePath = fileName;

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
  // Título - Reducir espacio
  doc
    .font("Times-Bold")
    .fill("Reporte de becas")
    .fontSize(12)
    .text("REPORTE DE CONCESIÓN DE BECAS", 60, 120, {
      // Reducir Y
      align: "center",
    });

  //--Fecha
  const fecha = new Date().toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.fontSize(10).font("Times-Roman").text(fecha, 260, 140);
  // Contenido
  const contenido = `El presente reporte tiene como objetivo presentar un análisis detallado sobre la gestión de las becas en el Instituto Superior Tecnológico Los Andes, proporcionando información relevante sobre las solicitudes procesadas, los beneficiarios aprobados, no aprobados y los resultados obtenidos en el o los períodos correspondiente.`;
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
    currentY = 285;

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

    if (graficosGenerales) {
      currentY += 10;
      const chartImage = await graficoPeriodo(periodo, "periodo");
      doc.image(chartImage, 100, currentY, { width: 300 });
      currentY += 200;
    }
  }

  let tipoBecaAumento = false;
  if (tipoBeca) {
    tipoBecaAumento = true;
    if (periodoAumento) {
      if (graficosGenerales) {
        currentY = 625;
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
        doc.addPage();
        currentY = 50;
      } else {
        currentY = 405;
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
    } else {
      currentY = 285;
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

    if (graficosGenerales) {
      currentY += 10;
      const chartImage = await graficoTipoBeca(tipoBeca, "tipoBeca");
      doc.image(chartImage, 100, currentY, { width: 300 });
      currentY += 200;
    }
  }

  let carreraAumento = false;
  if (carrera) {
    carreraAumento = true;
    if (periodoAumento && tipoBecaAumento) {
      if (graficosGenerales) {
        currentY = 270;
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
      } else {
        currentY = 525;
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
    } else if (periodoAumento && !tipoBecaAumento) {
      if (graficosGenerales) {
        currentY = 625;
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
        doc.addPage();
        currentY = 50;
      } else {
        currentY = 405;
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
    } else if (!periodoAumento && tipoBecaAumento) {
      if (graficosGenerales) {
        currentY = 625;
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
        doc.addPage();
        currentY = 50;
      } else {
        currentY = 405;
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
    } else {
      currentY = 285;
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

    if (graficosGenerales) {
      currentY += 10;
      const chartImage = await graficoCarrera(carrera);
      doc.image(chartImage, 100, currentY, { width: 300 });
      currentY += 130;
    }
  }

  let enY = 0;
  if (reportData !== false) {
    enY = generateTable(
      doc,
      reportData,
      periodoAumento,
      tipoBecaAumento,
      carreraAumento,
      graficosGenerales,
      conteoTotal
    );
  }

  const final = `Este reporte permite consolidar información clave sobre la gestión y asignación de becas en el Instituto Superior Tecnológico Los Andes. Los datos presentados reflejan el compromiso institucional con la transparencia y eficiencia en los procesos. Se espera que estas estadísticas sirvan como base para la mejora continua y la toma de decisiones estratégicas en futuros períodos.
`;
  if (enY > 0) {
    doc
      .fontSize(12)
      .font("Times-Roman")
      .text(final, 50, enY + 100, {
        align: "justify",
        lineGap: 8,
      });
  } else {
    doc
      .fontSize(12)
      .font("Times-Roman")
      .text(final, 50, currentY + 20, {
        align: "justify",
        lineGap: 8,
      });
  }
  doc.end();
  return relativePath;
}

async function graficoPeriodo(data, type) {
  const width = 500;
  const height = 300;
  const chartCallback = (ChartJS) => {
    ChartJS.defaults.color = "#666";
    ChartJS.defaults.font.family = "Sans";
  };

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    chartCallback,
  });

  let labels, values;

  switch (type) {
    case "periodo":
      labels = data.map((d) => d.periodo);
      values = data.map((d) => d.total_becas);
      break;
    case "tipoBeca":
      labels = data.map((d) => d.TIPO_BECA);
      values = data.map((d) => d.Becas);
      break;
    case "carrera":
      labels = data.map((d) => d.carrera);
      values = data.map((d) => d.cantidadBecas);
      break;
  }

  const configuration = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Total de Becas",
          data: values,
          backgroundColor: "#3faafc",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  return image;
}

async function graficoTipoBeca(data, type) {
  const width = 500;
  const height = 300;
  const chartCallback = (ChartJS) => {
    ChartJS.defaults.color = "#666";
    ChartJS.defaults.font.family = "Sans";
  };

  const chartJSNodeCanvas = new ChartJSNodeCanvas({
    width,
    height,
    chartCallback,
  });

  let labels, values;

  switch (type) {
    case "periodo":
      labels = data.map((d) => d.periodo);
      values = data.map((d) => d.total_becas);
      break;
    case "tipoBeca":
      labels = data.map((d) => d.TIPO_BECA);
      values = data.map((d) => d.Becas);
      break;
    case "carrera":
      labels = data.map((d) => d.carrera);
      values = data.map((d) => d.cantidadBecas);
      break;
  }

  const configuration = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Total de Becas",
          data: values,
          backgroundColor: "#e874a6",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  return image;
}

async function graficoCarrera(data) {
  const width = 1000;
  const height = 400;

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const configuration = {
    type: "bar",
    data: {
      labels: data.map((d) => d.carrera),
      datasets: [
        {
          label: "Total de Becas",
          data: data.map((d) => d.cantidadBecas),
          backgroundColor: "#54b895",
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: { display: false },
      },
    },
  };

  return await chartJSNodeCanvas.renderToBuffer(configuration);
}

function generateTable(
  doc,
  data,
  periodo,
  tipoBeca,
  carrera,
  graficosGenerales,
  conteoTotal
) {
  let startX = 70;
  let startY = 310;

  if (periodo && tipoBeca && carrera) {
    if (graficosGenerales) {
      startY = 570;
    } else {
      startY = 660;
    }
  } else if (periodo && tipoBeca && !carrera) {
    if (graficosGenerales) {
      startY = 280;
    } else {
      startY = 555;
    }
  } else if (periodo && !tipoBeca && carrera) {
    if (graficosGenerales) {
      startY = 260;
    } else {
      startY = 555;
    }
  } else if (!periodo && tipoBeca && carrera) {
    if (graficosGenerales) {
      startY = 265;
    } else {
      startY = 555;
    }
  } else if (periodo && !tipoBeca && !carrera) {
    if (graficosGenerales) {
      startY = 640;
    } else {
      startY = 430;
    }
  } else if (!periodo && tipoBeca && !carrera) {
    if (graficosGenerales) {
      startY = 640;
    } else {
      startY = 430;
    }
  } else if (!periodo && !tipoBeca && carrera) {
    if (graficosGenerales) {
      startY = 600;
    } else {
      startY = 430;
    }
  }

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

  doc
    .font("Times-Bold")
    .fontSize(12)
    .text("Detalle de becas", 60, startY - 25);

  doc
    .font("Times-Roman")
    .fontSize(12)
    .text("Registros Totales: " + conteoTotal, 400, startY - 25);

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
    addText(
      row.PORCENTAJE === null ? "No otorgada" : `${row.PORCENTAJE}%`,
      colWidths.PORCENTAJE,
      { align: "center" }
    );
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
  return startY;
}

async function generatePreliminarPDF(data) {
  const folderPath = path.join(__dirname, "../../reporteGenerado");

  // Crear el directorio si no existe
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Limpiar PDFs antiguos antes de generar uno nuevo
  await cleanOldPDFs(folderPath);

  // Generar nuevo nombre con timestamp
  const timestamp = Date.now();
  const fileName = `report_${timestamp}.pdf`;
  const filePath = path.join(folderPath, fileName);
  const relativePath = fileName;

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
  // Título - Reducir espacio
  doc
    .font("Times-Bold")
    .fill("Reporte de becas")
    .fontSize(12)
    .text("REPORTE DE CONCESIÓN DE BECAS", 60, 120, {
      // Reducir Y
      align: "center",
    });

  //--Fecha
  const fecha = new Date().toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.fontSize(10).font("Times-Roman").text(fecha, 260, 140);

  // Contenido
  const contenido = `El presente informe preliminar detalla las solicitudes de becas que han completado satisfactoriamente la entrega de documentación requerida y tienen un porcentaje de beca propuesto, pendiente de aprobación por parte del comité del Instituto Superior Tecnológico Los Andes. Este documento servirá como base para la evaluación y validación final de las asignaciones de becas en la reunión del comité.`;
  doc.fontSize(12).font("Times-Roman").text(contenido, 50, 190, {
    align: "justify",
    lineGap: 8,
  });

  let currentY = 290;

  let enY = 0;
  enY = generateTablePreliminar(doc, data);

  const final = `Este informe preliminar presenta la propuesta de asignación de becas para los estudiantes que han completado satisfactoriamente la documentación requerida. Los datos incluyen la información académica relevante y el porcentaje de beca sugerido para cada caso. Este documento servirá como base para la evaluación y toma de decisiones en el comité de becas del Instituto Superior Tecnológico Los Andes.
`;
  if (enY > 0) {
    doc
      .fontSize(12)
      .font("Times-Roman")
      .text(final, 50, enY + 100, {
        align: "justify",
        lineGap: 8,
      });
  } else {
    doc
      .fontSize(12)
      .font("Times-Roman")
      .text(final, 50, currentY + 20, {
        align: "justify",
        lineGap: 8,
      });
  }
  doc.end();
  return relativePath;
}

function generateTablePreliminar(doc, data) {
  let startX = 65; // Aumentado de 50 a 65 para mover la tabla a la derecha
  let startY = 330;
  const conteoTotal = data.length;
  const rowHeight = 40; // Aumentado de 50 a 60 para dar más espacio vertical al encabezado
  const pageHeight = doc.page.height - 50;
  const colWidths = {
    CEDULA_ESTUDIANTE: 65,
    NOMBRE_ESTUDIANTE: 120,
    FECHA_SOLICITUD: 100,
    TIPO_BECA: 80,
    PROMEDIO: 85,
    PORCENTAJE_PROPUESTO: 100, // Aumentado de 90 a 100 para dar más espacio al texto
  };
  doc
    .font("Times-Bold")
    .fontSize(12)
    .text("Propuesta de Asignación de Becas", 60, startY - 25);
  doc
    .font("Times-Roman")
    .fontSize(12)
    .text("Registros Totales: " + conteoTotal, 400, startY - 25);
  if (colWidths.NOMBRE_ESTUDIANTE) startX = 35; // Ajustado de 20 a 35 para mover la tabla
  const addHeaders = () => {
    doc.font("Times-Bold").fontSize(10);
    let currentX = startX;
    Object.entries({
      Cédula: colWidths.CEDULA_ESTUDIANTE,
      Nombres: colWidths.NOMBRE_ESTUDIANTE,
      "Fecha de solicitud": colWidths.FECHA_SOLICITUD,
      "Tipo de beca": colWidths.TIPO_BECA,
      Promedio: colWidths.PROMEDIO,
      "Porcentaje propuesto": colWidths.PORCENTAJE_PROPUESTO,
    }).forEach(([header, width]) => {
      if (width > 0) {
        doc
          .rect(currentX, startY, width, 25) // Aumentado de 20 a 25 para dar más espacio vertical al encabezado
          .fillAndStroke("#7fbf1f", "#000000");
        doc.fillColor("black").text(header, currentX + 2, startY + 7, {
          // Ajustado el padding vertical de 5 a 7
          width: width - 4,
          align: "center",
        });
        currentX += width;
      }
    });
    doc.fillColor("black");
    startY += 25; // Ajustado de 20 a 25 para mantener consistencia con el nuevo alto del encabezado
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
    addText(row.CEDULA_ESTUDIANTE, colWidths.CEDULA_ESTUDIANTE);
    addText(row.NOMBRE_ESTUDIANTE, colWidths.NOMBRE_ESTUDIANTE);
    addText(
      new Date(new Date(row.FECHA_SOLICITUD).getTime() + (24 * 60 * 60 * 1000)).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      colWidths.FECHA_SOLICITUD
    );
    addText(row.TIPO_BECA, colWidths.TIPO_BECA);
    addText(row.PROMEDIO, colWidths.PROMEDIO, { align: "center" });
    addText(row.PORCENTAJE_PROPUESTO + "%", colWidths.PORCENTAJE_PROPUESTO, {
      align: "center",
    });
    doc
      .moveTo(startX, y + rowHeight)
      .lineTo(
        startX + Object.values(colWidths).reduce((a, b) => a + b, 0),
        y + rowHeight
      )
      .stroke();
    startY += rowHeight;
  });
  return startY;
}

module.exports = { generatePDF, generatePreliminarPDF };
