const authRoutes = require("./authRoutes");
const becasRouthe = require("./becasRouthe");
const userRouthe = require("./userRouthe");
const solicitudBecaRouthes = require("./solicitudBecaRouthes");
const istlaRouthes = require("./istlaRouthes");
const documentacionBecaRouthes = require("./documentacionBecaRouter");

module.exports = {
  "/auth": authRoutes,
  "/tiposBecas": becasRouthe,
  "/user": userRouthe,
  "/solicitudBeca": solicitudBecaRouthes,
  "/istla": istlaRouthes,
  "/documentacionBeca": documentacionBecaRouthes,
};
