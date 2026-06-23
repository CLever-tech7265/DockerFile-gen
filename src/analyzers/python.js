const fs = require("fs");

function analyzePython() {

    const files = fs.readdirSync(process.cwd());

    // 1. entry detection
    let entry = "main.py";

    if (files.includes("main.py")) {
        entry = "main.py";
    }
    else if (files.includes("app.py")) {
        entry = "app.py";
    }
    else if (files.includes("run.py")) {
        entry = "run.py";
    }
    else {
        const pyFiles = files.filter(f => f.endsWith(".py"));
        if (pyFiles.length === 1) {
            entry = pyFiles[0];
        }
    }

    // 2. dependencies detection (improved)
    const hasRequirements =
        files.includes("requirements.txt") ||
        files.includes("pyproject.toml") ||
        files.includes("setup.py");

    const installCmd = hasRequirements
        ? "pip install -r requirements.txt"
        : null;

    // 3. run command (basic now, upgrade later for frameworks)
    const runCmd = `python ${entry}`;

    return {
        entry,
        installCmd,
        runCmd,
        hasRequirements
    };
}

module.exports = { analyzePython };