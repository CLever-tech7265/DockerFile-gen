function generateDockerfile(context) {

    const {
        type,
        image,
        workdir,
        entry,
        installCmd,
        runCmd
    } = context;

    let dockerfile = "";

    // 🧱 בסיס
    dockerfile += `FROM ${image}\n\n`;
    dockerfile += `WORKDIR ${workdir}\n\n`;

    // 📦 התקנות (אם קיימות)
    if (installCmd) {
        dockerfile += `# install dependencies\n`;
        dockerfile += `RUN ${installCmd}\n\n`;
    }

    // 📁 העתקת קבצים
    dockerfile += `COPY . .\n\n`;

    // 🚀 הרצה
    dockerfile += `CMD ${formatCmd(runCmd)}\n`;

    return dockerfile;
}

// הופך פקודה לפורמט Docker תקני
function formatCmd(cmd) {

    // אם זה כבר array-style
    if (Array.isArray(cmd)) {
        return JSON.stringify(cmd);
    }

    // אם זה string → הופך ל-JSON array
    return JSON.stringify(cmd.split(" "));
}

module.exports = { generateDockerfile };