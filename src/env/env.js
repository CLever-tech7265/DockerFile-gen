const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    return {};
  }

  const result = dotenv.config({ path: envPath });

  return result.parsed || {};
}

module.exports = { loadEnv };