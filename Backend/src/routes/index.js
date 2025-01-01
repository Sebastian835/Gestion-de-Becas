const authRoutes = require("./authRoutes");
const tiposBecasRouthe = require("./tiposBecasRouthe");
const userRouthe = require("./userRouthe");
const solicitudBecaRouthes = require("./solicitudBecaRouthes");
const istlaRouthes = require("./istlaRouthes");
const documentacionBecaRouthes = require("./documentacionBecaRouter");
const vigenciaBecasRouther = require("./vigenciaBecasRouther");


module.exports = {
  "/auth": authRoutes,
  "/tiposBecas": tiposBecasRouthe,
  "/user": userRouthe,
  "/solicitudBeca": solicitudBecaRouthes,
  "/istla": istlaRouthes,
  "/documentacionBeca": documentacionBecaRouthes,
  "/vigenciaBecas": vigenciaBecasRouther,
};
