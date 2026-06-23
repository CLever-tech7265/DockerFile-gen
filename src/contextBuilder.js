function buildContext(type, analysis, env) {

    const hasEnv = env && Object.keys(env).length > 0;

    const PORT = hasEnv ? env.PORT : null;

    const base = {
        type,
        entry: analysis.entry,
        installCmd: analysis.installCmd,
        runCmd: analysis.runCmd
    };

    // 🧠 defaults לפי שפה
    const defaults = {
        node: { port: 3000, image: "node:18" },
        python: { port: 8000, image: "python:3.11" },
        go: { port: 8080, image: "golang:1.22" },
        java: { port: 8080, image: "openjdk:17" },
        csharp: { port: 5000, image: "mcr.microsoft.com/dotnet/sdk:8.0" }
    };

    const lang = defaults[type] || {
        port: null,
        image: "node:18"
    };

    const finalPort = PORT || lang.port;

    const finalEnv = hasEnv
        ? env
        : { PORT: String(lang.port) };

    // 🟢 Node
    if (type === "node") {
        return {
            ...base,
            image: lang.image,
            workdir: "/app",
            port: finalPort,
            expose: finalPort,
            env: {
                ...finalEnv
            }
        };
    }

    // 🟢 Python
    if (type === "python") {
        return {
            ...base,
            image: lang.image,
            workdir: "/app",
            port: finalPort,
            expose: finalPort,
            env: {
                ...finalEnv
            }
        };
    }

    // 🟢 Go
    if (type === "go") {
        return {
            ...base,
            image: lang.image,
            workdir: "/app",
            port: finalPort,
            expose: finalPort,
            env: {
                ...finalEnv
            }
        };
    }

    // 🟢 Java
    if (type === "java") {
        return {
            ...base,
            image: lang.image,
            workdir: "/app",
            port: finalPort,
            expose: finalPort,
            env: {
                ...finalEnv
            }
        };
    }

    // 🟢 C#
    if (type === "csharp") {
        return {
            ...base,
            image: lang.image,
            workdir: "/app",
            port: finalPort,
            expose: finalPort,
            env: {
                ...finalEnv
            }
        };
    }

    // fallback
    return {
        ...base,
        image: lang.image,
        workdir: "/app",
        port: finalPort,
        env: finalEnv
    };
}

module.exports = { buildContext };