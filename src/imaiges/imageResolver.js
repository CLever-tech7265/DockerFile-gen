function resolveDockerImage(type, strategy, version) {

    // 🟢 Node.js
    if (type === "node") {

        const v = version || 18;

        if (strategy === "LIGHT") {
            return `node:${v}-alpine`;
        }

        if (strategy === "STANDARD") {
            return `node:${v}-slim`;
        }

        return `node:${v}`;
    }

    // 🟢 Python
    if (type === "python") {

        const v = version || "3.11";

        if (strategy === "LIGHT") {
            return `python:${v}-alpine`;
        }

        if (strategy === "HEAVY") {
            return `python:${v}`;
        }

        return `python:${v}-slim`;
    }

    // 🟢 Go
    if (type === "go") {

        const v = version || "1.22";

        if (strategy === "LIGHT") {
            return `golang:${v}-alpine`;
        }

        return `golang:${v}`;
    }

    // 🟢 Java
    if (type === "java") {

        const v = version || 17;

        if (v >= 21) {
            return "eclipse-temurin:21";
        }

        return "eclipse-temurin:17";
    }

    // 🟢 C#
    if (type === "csharp") {

        const v = version || "8.0";

        return `mcr.microsoft.com/dotnet/sdk:${v}`;
    }

    // fallback
    return "alpine";
}

module.exports = { resolveDockerImage };