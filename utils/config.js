const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env ") });
const { JWT_SECRET = "dev-secret" } = process.env;
module.exports = {
  JWT_SECRET,
};
