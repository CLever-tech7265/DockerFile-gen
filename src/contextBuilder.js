const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

function loadEnv() {
    const envPath = path.join(process.cwd(), ".env");

    if (fs.existsSync(envPath)) {
        const result = dotenv.config({ path: envPath });
        return result.parsed || {};
    }

    return {
        PORT: "3000",
        NODE_ENV: "production"
    };
}

function buildContext(type, analysis) {

    const env = loadEnv();

    const PORT = env.PORT;

    const base = {
        type,
        entry: analysis.entry,
        installCmd: analysis.installCmd,
        runCmd: analysis.runCmd
    };

    // 🟢 Node
    if (type === "node") {
        return {
            ...base,
            image: "node:18",
            workdir: "/app",
            port: PORT || 3000,
            expose: PORT || 3000,
            env: {
                NODE_ENV: env.NODE_ENV || "production",
                PORT: PORT || 3000
            }
        };
    }

    // 🟢 Python
    if (type === "python") {
        return {
            ...base,
            image: "python:3.11",
            workdir: "/app",
            port: PORT || 8000,
            expose: PORT || 8000,
            env: {
                PYTHONUNBUFFERED: "1",
                PORT: PORT || 8000
            }
        };
    }

    // 🟢 Go
    if (type === "go") {
        return {
            ...base,
            image: "golang:1.22",
            workdir: "/app",
            port: PORT || 8080,
            expose: PORT || 8080,
            env: {
                PORT: PORT || 8080
            }
        };
    }

    // 🟢 Java
    if (type === "java") {
        return {
            ...base,
            image: "openjdk:17",
            workdir: "/app",
            port: PORT || 8080,
            expose: PORT || 8080,
            env: {
                JAVA_ENV: env.JAVA_ENV || "production",
                PORT: PORT || 8080
            }
        };
    }

    // 🟢 C#
    if (type === "csharp") {
        return {
            ...base,
            image: "mcr.microsoft.com/dotnet/sdk:8.0",
            workdir: "/app",
            port: PORT || 5000,
            expose: PORT || 5000,
            env: {
                DOTNET_ENVIRONMENT: env.DOTNET_ENVIRONMENT || "Production",
                PORT: PORT || 5000
            }
        };
    }

    // fallback
    return {
        ...base,
        image: "node:18",
        workdir: "/app",
        port: PORT || null,
        env
    };
}

module.exports = { buildContext };

module.exports = { buildContext };