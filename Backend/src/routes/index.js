const authRoutes = require("./authRoutes");
const tiposBecasRouthe = require("./tiposBecasRouthe");
const userRouthe = require("./userRouthe");
const solicitudBecaRouthes = require("./solicitudBecaRouthes");
const istlaRouthes = require("./istlaRouthes");
const documentacionBecaRouthes = require("./documentacionBecaRouter");
const vigenciaBecasRouther = require("./vigenciaBecasRouther");
const becas_Otorgadas = require("./becasOtorgadasRouther");

module.exports = {
  "/auth": authRoutes,
  "/tiposBecas": tiposBecasRouthe,
  "/user": userRouthe,
  "/solicitudBeca": solicitudBecaRouthes,
  "/istla": istlaRouthes,
  "/documentacionBeca": documentacionBecaRouthes,
  "/vigenciaBecas": vigenciaBecasRouther,
  "/becasOtorgadas": becas_Otorgadas,
};
