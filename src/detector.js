const fs = require("fs");

function detectLanguage() {

    const files = fs.readdirSync(process.cwd());

    const rules = [
        {
            name: "node",
            match: () => files.includes("package.json")
        },
        {
            name: "python",
            match: () =>
                files.includes("requirements.txt") ||
                files.includes("pyproject.toml") ||
                files.includes("setup.py")
        },
        {
            name: "csharp",
            match: () => files.some(f => f.endsWith(".csproj"))
        },
        {
            name: "go",
            match: () => files.includes("go.mod")
        },

        // 🟢 JAVA RULE
        {
            name: "java",
            match: () =>
                files.includes("pom.xml") ||          // Maven
                files.includes("build.gradle") ||     // Gradle
                files.some(f => f.endsWith(".java"))  // fallback
        }
    ];

    for (const rule of rules) {
        if (rule.match()) {
            return rule.name;
        }
    }

    return "unknown";
}

module.exports = { detectLanguage };