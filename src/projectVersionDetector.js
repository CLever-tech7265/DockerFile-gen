const fs = require("fs");
const path = require("path");

function detectProjectVersion(type) {

    const cwd = process.cwd();

    // 🟢 NODE
    if (type === "node") {

        const pkgPath = path.join(cwd, "package.json");

        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

            if (pkg.engines && pkg.engines.node) {
                const match = pkg.engines.node.match(/\d+/);
                if (match) return Number(match[0]);
            }
        }

        return 18; // fallback חכם
    }

    // 🟢 DOTNET
    if (type === "csharp") {

        const files = fs.readdirSync(cwd);
        const csproj = files.find(f => f.endsWith(".csproj"));

        if (csproj) {
            const content = fs.readFileSync(path.join(cwd, csproj), "utf-8");

            const match = content.match(/net(\d+\.\d+)/i);

            if (match) return match[1];
        }

        return "8.0";
    }

    // 🟢 PYTHON
    if (type === "python") {

        const reqPath = path.join(cwd, "requirements.txt");

        if (fs.existsSync(reqPath)) {
            const content = fs.readFileSync(reqPath, "utf-8");

            if (content.includes("fastapi")) return "3.11";
            if (content.includes("django")) return "3.10";
        }

        return "3.11";
    }

    // 🟢 JAVA
    if (type === "java") {

        const pomPath = path.join(cwd, "pom.xml");

        if (fs.existsSync(pomPath)) {
            const content = fs.readFileSync(pomPath, "utf-8");

            const match =
                content.match(/<java.version>(.*?)<\/java.version>/) ||
                content.match(/<maven.compiler.source>(.*?)<\/maven.compiler.source>/);

            if (match) return Number(match[1]);
        }

        return 17;
    }

    // 🟢 GO
    if (type === "go") {

        const modPath = path.join(cwd, "go.mod");

        if (fs.existsSync(modPath)) {
            const content = fs.readFileSync(modPath, "utf-8");

            const match = content.match(/go\s+(\d+\.\d+)/);

            if (match) return match[1];
        }

        return "1.22";
    }

    // fallback כללי בטוח
    return 18;
}

module.exports = { detectProjectVersion };