function generateDockerfile(context) {

    let dockerfile = "";

    dockerfile += `FROM ${context.image}\n\n`;
    dockerfile += `WORKDIR ${context.workdir}\n\n`;

    // 🟢 ENV safe handling
    if (context.env && typeof context.env === "object") {
        Object.entries(context.env).forEach(([k, v]) => {
            dockerfile += `ENV ${k}=${v}\n`;
        });
        dockerfile += `\n`;
    }

    // 🟢 INSTALL
    if (context.installCmd) {
        dockerfile += `RUN ${context.installCmd}\n\n`;
    }

    dockerfile += `COPY . .\n\n`;

    // 🟢 FIX: use port instead of expose
    if (context.port) {
        dockerfile += `EXPOSE ${context.port}\n\n`;
    }

    // 🟢 safer CMD formatting
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