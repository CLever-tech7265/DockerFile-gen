#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");

const { detectLanguage } = require("./src/detector");
const { getAnalyzer } = require("./src/analyzers");
const { buildContext } = require("./src/contextBuilder");
const { generateDockerfile } = require("./src/generator");

// 🟢 NEW
const { scanProjectEnv } = require("./src/env/envScanner");
const { loadEnv } = require("./src/env/env");
const { buildEnvModel } = require("./src/env/envBuilder");
const { promptEnv } = require("./src/env/envPrompt");

async function main() {

    const type = detectLanguage();

    const analyzer = getAnalyzer(type);

    if (!analyzer) {
        console.log("❌ Unsupported project type:", type);
        return;
    }

    const analysis = analyzer();

    // 🟢 1. סורק מה הקוד צריך
    const keysFromCode = scanProjectEnv();

    // 🟢 2. טוען .env אם קיים
    const envFile = loadEnv();

    // 🟢 3. בונה מודל מאוחד
    let envModel = buildEnvModel(keysFromCode, envFile);

    // 🟢 4. נותן למשתמש לבחור/לשנות
    const env = await promptEnv(envModel);

    // 🟢 5. בונה Docker context
    const context = buildContext(type, analysis, env);

    const dockerfile = generateDockerfile(context);

    fs.writeFileSync("Dockerfile", dockerfile);

    console.log("✅ Dockerfile created successfully for:", type);
}

main();