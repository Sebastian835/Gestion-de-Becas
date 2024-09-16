const authRoutes = require("./authRoutes");
const becasRouthe = require("./becasRouthe");
const userRouthe = require("./userRouthe");

module.exports = {
  "/auth": authRoutes,
  "/tiposBecas": becasRouthe,
  "/user": userRouthe,
};
