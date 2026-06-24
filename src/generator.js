const { getCopyStrategy } = require("./copyStrategy");

function generateDockerfile(context) {

    let dockerfile = "";

    // 🟢 base
    dockerfile += `FROM ${context.image}\n\n`;
    dockerfile += `WORKDIR ${context.workdir}\n\n`;

    // 🟢 ENV safe handling
    if (context.env && typeof context.env === "object") {
        Object.entries(context.env).forEach(([k, v]) => {
            dockerfile += `ENV ${k}=${v}\n`;
        });
        dockerfile += `\n`;
    }

    // 🟢 COPY + RUN strategy (חדש!)
    const steps = getCopyStrategy(context.type);

    for (const step of steps) {
        dockerfile += `${step}\n\n`;
    }

    // 🟢 PORT
    if (context.port) {
        dockerfile += `EXPOSE ${context.port}\n\n`;
    }

    // 🟢 CMD safe formatting
    if (context.runCmd) {
        dockerfile += `CMD ${formatCmd(context.runCmd)}\n`;
    }

    return dockerfile;
}

function formatCmd(cmd) {

    if (Array.isArray(cmd)) {
        return JSON.stringify(cmd);
    }

    return JSON.stringify(cmd.split(" "));
}

module.exports = { generateDockerfile };