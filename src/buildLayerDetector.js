const fs = require("fs");
const path = require("path");

function detectBuildFiles() {

    const cwd = process.cwd();

    const files = fs.readdirSync(cwd);

    const result = {
        node: files.includes("package.json"),
        python: files.includes("requirements.txt"),
        go: files.includes("go.mod"),
        java: files.some(f => f.endsWith(".pom.xml")) || files.includes("pom.xml"),
        csharp: files.some(f => f.endsWith(".csproj"))
    };

    return result;
}

module.exports = { detectBuildFiles };