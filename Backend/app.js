require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://tesis.apps-sebas.org',
      'https://becas.istla-sigala.edu.ec'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'), false);
    }
  },
  credentials: true
};

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(cookieParser());
app.use(cors(corsOptions));


const routes = require("./src/routes");
Object.entries(routes).forEach(([prefix, routeModule]) => {
  app.use(`/api${prefix}`, routeModule);
});

const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST, async () => {
  console.log(`http://${HOST}:${PORT}`);
});