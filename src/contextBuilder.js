function buildContext(type, analysis, env) {

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
                ...env

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
                ...env
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
                ...env
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
                ...env
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
                ...env
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