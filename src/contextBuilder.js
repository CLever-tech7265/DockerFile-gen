function buildContext(type, analysis) {

    // בסיס משותף לכל פרויקט
    const base = {
        type,
        entry: analysis.entry,
        installCmd: analysis.installCmd,
        runCmd: analysis.runCmd
    };

    // 🟢 Node.js context
    if (type === "node") {
        return {
            ...base,
            image: "node:18",
            workdir: "/app",
            copyStrategy: "node",
            port: 3000,
            hasLockFile: true
        };
    }

    // 🟡 Python context
    if (type === "python") {
        return {
            ...base,
            image: "python:3.11",
            workdir: "/app",
            copyStrategy: "python",
            port: 8000,
            hasRequirements: analysis.hasRequirements || false
        };
    }

    // 🟣 C# (עתידי)
    if (type === "csharp") {
        return {
            ...base,
            image: "mcr.microsoft.com/dotnet/sdk:8.0",
            workdir: "/src",
            copyStrategy: "dotnet",
            runtimeImage: "mcr.microsoft.com/dotnet/aspnet:8.0"
        };
    }

    // 🟠 Go (עתידי)
    if (type === "go") {
        return {
            ...base,
            image: "golang:1.21",
            workdir: "/app",
            copyStrategy: "go",
            binaryName: "app"
        };
    }

    // fallback
    return {
        ...base,
        image: "alpine",
        workdir: "/app",
        runCmd: "echo 'unknown project'",
        copyStrategy: "basic"
    };
}

module.exports = { buildContext };