const fs = require("fs");

function analyzeGo() {

    const files = fs.readdirSync(process.cwd());

    const hasMod = files.includes("go.mod");

    let entry = "main.go";

    // אם יש רק קובץ אחד של go
    const goFiles = files.filter(f => f.endsWith(".go"));
    if (goFiles.length === 1) {
        entry = goFiles[0];
    }

    const installCmd = hasMod ? "go mod download" : null;

    const runCmd = `go run ${entry}`;

    return {
        entry,
        installCmd,
        runCmd,
        hasMod
    };
}

module.exports = { analyzeGo };