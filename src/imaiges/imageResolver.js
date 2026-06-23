function resolveDockerImage(type, strategy) {

    // 🟢 Node.js
    if (type === "node") {

        if (strategy === "LIGHT") {
            return "node:18-alpine";
        }

        if (strategy === "STANDARD") {
            return "node:18-slim";
        }

        return "node:18";
    }

    // 🟢 Python
    if (type === "python") {

        if (strategy === "LIGHT") {
            return "python:3.11-alpine";
        }

        if (strategy === "HEAVY") {
            return "python:3.11";
        }

        return "python:3.11-slim";
    }

    // 🟢 Go
    if (type === "go") {

        if (strategy === "LIGHT") {
            return "golang:1.22-alpine";
        }

        return "golang:1.22";
    }

    // 🟢 Java
    if (type === "java") {

        return "eclipse-temurin:17";
    }

    // 🟢 C#
    if (type === "csharp") {

        return "mcr.microsoft.com/dotnet/sdk:8.0";
    }

    // fallback
    return "alpine";
}

module.exports = { resolveDockerImage };