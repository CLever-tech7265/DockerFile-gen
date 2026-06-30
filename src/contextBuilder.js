const { detectImageStrategy } = require("./imaiges/imageStrategyDetector");
const { resolveDockerImage } = require("./imaiges/imageResolver");
const { detectProjectVersion } = require("./projectVersionDetector");
const { updateImageWithDocker } = require("./imaiges/dockerLiveUpdater");

function buildContext(type, analysis, env) {

    const hasEnv = env && Object.keys(env).length > 0;

    const PORT = hasEnv ? env.PORT : null;

    const base = {
        type,
        entry: analysis.entry,
        installCmd: analysis.installCmd,
        runCmd: analysis.runCmd
    };

    // 🧠 1. strategy לפי פרויקט
    const strategy = detectImageStrategy(type);

    // 🧠 2. version אמיתי מהפרויקט (NEW)
    const version = detectProjectVersion(type);

    // 🧠 3. image מדויק לפי type + strategy + version
    const dockerImage = updateImageWithDocker(type, strategy, version);
    const image = dockerImage || resolveDockerImage(type, strategy, version);
    
    // ... המשך קוד כמו קודם ...
    
    console.log(`✅ image: ${image}`);

    // 🧠 4. פורטים ברירת מחדל לפי שפה
    const portDefaults = {
        node: 3000,
        python: 8000,
        go: 8080,
        java: 8080,
        csharp: 5000
    };

    const finalPort = PORT || portDefaults[type] || null;

    // 🧠 5. env final
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