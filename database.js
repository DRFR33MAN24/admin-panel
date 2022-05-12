const { Sequelize } = require("sequelize");

module.exports = new Sequelize("reactadmin", "drfr33man24", "blackmesa-123", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});
