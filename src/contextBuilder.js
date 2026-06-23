const { detectImageStrategy } = require("./imaiges/imageStrategyDetector");
const { resolveDockerImage } = require("./imaiges/imageResolver");

function buildContext(type, analysis, env) {

    const hasEnv = env && Object.keys(env).length > 0;

    const PORT = hasEnv ? env.PORT : null;

    const base = {
        type,
        entry: analysis.entry,
        installCmd: analysis.installCmd,
        runCmd: analysis.runCmd
    };

    // 🧠 1. קביעת strategy לפי הפרויקט
    const strategy = detectImageStrategy(type);

    // 🧠 2. בחירת image מדויק לפי type + strategy
    const image = resolveDockerImage(type, strategy);

    // 🧠 3. פורטים ברירת מחדל לפי שפה בלבד
    const portDefaults = {
        node: 3000,
        python: 8000,
        go: 8080,
        java: 8080,
        csharp: 5000
    };

    const finalPort = PORT || portDefaults[type] || null;

    // 🧠 4. env final (לא מכריחים, רק אם קיים או מינימום PORT)
    const finalEnv = hasEnv
        ? env
        : finalPort
            ? { PORT: String(finalPort) }
            : {};

    return {
        ...base,
        image,
        workdir: "/app",
        port: finalPort,
        expose: finalPort,
        env: finalEnv
    };
}

module.exports = { buildContext };