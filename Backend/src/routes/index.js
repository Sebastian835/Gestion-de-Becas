const authRoutes = require("./authRoutes");
const becasRouthe = require("./becasRouthe");
const userRouthe = require("./userRouthe");
const solicitudBecaRouthes= require("./solicitudBecaRouthes");

module.exports = {
  "/auth": authRoutes,
  "/tiposBecas": becasRouthe,
  "/user": userRouthe,
  "/solicitudBeca": solicitudBecaRouthes,
};
