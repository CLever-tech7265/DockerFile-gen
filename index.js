#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");

const { detectLanguage } = require("./src/detector");
const { getAnalyzer } = require("./src/analyzers");
const { buildContext } = require("./src/contextBuilder");
const { generateDockerfile } = require("./src/generator");

const { loadEnv } = require("./src/env");
const { promptEnv } = require("./src/envPrompt");
const { saveEnv } = require("./src/envWriter");

async function main() {

    const type = detectLanguage();

    const analyzer = getAnalyzer(type);

    if (!analyzer) {
        console.log("❌ Unsupported project type:", type);
        return;
    }

    const analysis = analyzer();

    // 🟢 ENV FLOW
    let env = loadEnv();
    env = await promptEnv(env);
    saveEnv(env);

    // 🟢 build context עם env
    const context = buildContext(type, analysis, env);

    const dockerfile = generateDockerfile(context);

    fs.writeFileSync("Dockerfile", dockerfile);

    console.log("✅ Dockerfile created successfully for:", type);
}

main();