const fs = require("fs");

function saveEnv(env) {

    let content = "";

    for (const [key, value] of Object.entries(env)) {
        content += `${key}=${value}\n`;
    }

    fs.writeFileSync(".env", content);
}

module.exports = { saveEnv };