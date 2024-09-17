require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(express.json({ limit: '5mb' })); 
app.use(express.urlencoded({ limit: '5mb', extended: true })); 

app.use(cookieParser());
app.use(cors(corsOptions));

const routes = require('./src/routes');

Object.entries(routes).forEach(([prefix, routeModule]) => {
  app.use(`/api${prefix}`, routeModule);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

app.listen(PORT, HOST, async () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
