const fs = require("fs");

function detectImageStrategy(type, framework = "unknown") {

    const pkgPath = process.cwd() + "/package.json";

    let deps = {};

    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        deps = {
            ...pkg.dependencies,
            ...pkg.devDependencies
        };
    }

    // 🟢 default rules

    // Java / .NET → תמיד heavy
    if (type === "java" || type === "csharp") {
        return "HEAVY";
    }

    // Python
    if (type === "python") {

        const heavyDeps = ["numpy", "scipy", "pandas", "torch", "tensorflow"];

        const hasHeavy = heavyDeps.some(d => deps[d]);

        if (hasHeavy) return "HEAVY";

        return "LIGHT";
    }

    // Node
    if (type === "node") {

        const nativeDeps = ["bcrypt", "sharp", "sqlite3", "canvas"];

        const hasNative = nativeDeps.some(d => deps[d]);

        if (hasNative) return "STANDARD";

        return "LIGHT";
    }

    // Go
    if (type === "go") return "LIGHT";

    return "STANDARD";
}

module.exports = { detectImageStrategy };