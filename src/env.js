const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

function loadEnv() {

    const envPath = path.join(process.cwd(), ".env");

    if (fs.existsSync(envPath)) {

        const result = dotenv.config({
            path: envPath
        });

        return result.parsed || {};
    }

    return {
        PORT: "3000",
        NODE_ENV: "production"
    };
}

module.exports = { loadEnv };