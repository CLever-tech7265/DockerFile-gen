const fs = require("fs");

function analyzeNode() {

    const pkg = JSON.parse(
        fs.readFileSync("package.json", "utf-8")
    );

    // entry detection
    let entry = "index.js";

    if (pkg.main) {
        entry = pkg.main;
    }

    if (pkg.scripts && pkg.scripts.start) {
        const match = pkg.scripts.start.match(/node\s+(.+)/);
        if (match) entry = match[1];
    }

    // 🚀 FIX: smarter install logic
    const hasPackageJson = fs.existsSync("package.json");

    const hasDeps =
        pkg.dependencies && Object.keys(pkg.dependencies).length > 0;

    const hasDevDeps =
        pkg.devDependencies && Object.keys(pkg.devDependencies).length > 0;

    const installCmd =
        (hasPackageJson && (hasDeps || hasDevDeps || true))
            ? "npm install"
            : null;

    const runCmd =
        pkg.scripts && pkg.scripts.start
            ? "npm start"
            : `node ${entry}`;

    return {
        entry,
        installCmd,
        runCmd,
        hasDependencies: hasDeps || hasDevDeps
    };
}

module.exports = { analyzeNode };