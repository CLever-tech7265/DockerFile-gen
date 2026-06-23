const fs = require("fs");

function detectLanguage() {

    const files = fs.readdirSync(process.cwd());

    if (files.includes("package.json")) return "node";

    if (files.includes("requirements.txt")) return "python";

    if (files.some(f => f.endsWith(".csproj"))) return "csharp";

    if (files.includes("go.mod")) return "go";

    return "unknown";
}

module.exports = { detectLanguage };