const fs = require("fs");

function analyzeCSharp() {

    const files = fs.readdirSync(process.cwd());

    const csproj = files.find(f => f.endsWith(".csproj"));

    let entry = "Program.cs";

    const csFiles = files.filter(f => f.endsWith(".cs"));

    if (csFiles.length === 1) {
        entry = csFiles[0];
    }

    const installCmd = csproj ? "dotnet restore" : null;

    const runCmd = csproj
        ? "dotnet run"
        : "csc Program.cs && Program.exe";

    return {
        entry,
        installCmd,
        runCmd,
        hasProjectFile: !!csproj
    };
}

module.exports = { analyzeCSharp };