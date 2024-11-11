require("dotenv").config();

const fetch = require("node-fetch");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(cookieParser());
app.use(cors(corsOptions));

app.get("/proxy-pdf", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.istla.edu.ec/wp-content/uploads/2024/pdf/Bienestar-Estudiantil/Formulario-para-becas-actual.pdf"
    );
    const pdfBuffer = await response.arrayBuffer();

    // Configura las cabeceras para enviar el PDF
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    res.status(500).send("Error al obtener el PDF");
  }
});

const routes = require("./src/routes");

Object.entries(routes).forEach(([prefix, routeModule]) => {
  app.use(`/api${prefix}`, routeModule);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST, async () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
