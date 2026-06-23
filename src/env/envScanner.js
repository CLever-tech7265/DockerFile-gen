const fs = require("fs");
const path = require("path");

function scanProjectEnv(dir = process.cwd()) {

    const vars = new Set();

    function walk(currentDir) {

        const files = fs.readdirSync(currentDir);

        for (const file of files) {

            const fullPath = path.join(currentDir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {

                if (file === "node_modules") continue;

                walk(fullPath);
                continue;
            }

            if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;

            const content = fs.readFileSync(fullPath, "utf-8");

            const matches = content.matchAll(/process\.env\.([A-Z0-9_]+)/g);

            for (const m of matches) {
                vars.add(m[1]);
            }
        }
    }

    walk(dir);

    return [...vars];
}

module.exports = { scanProjectEnv };