#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");

const { detectLanguage } = require("./src/detector");
const { getAnalyzer } = require("./src/analyzers");
const { buildContext } = require("./src/contextBuilder");
const { generateDockerfile } = require("./src/generator");

function main() {

    const type = detectLanguage();

    
    const analyzer = getAnalyzer(type);

    if (!analyzer) {
        console.log("❌ Unsupported project type:", type);
        return;
    }

    const analysis = analyzer();

    const context = buildContext(type, analysis);

    const dockerfile = generateDockerfile(context);

    fs.writeFileSync("Dockerfile", dockerfile);

    console.log("✅ Dockerfile created successfully for:", type);
}

main();