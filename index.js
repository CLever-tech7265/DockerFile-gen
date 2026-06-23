#!/usr/bin/env node

const fs = require("fs");

const { detectLanguage } = require("./src/detector");

const { analyzeNode } = require("./src/analyzers/node");
const { analyzePython } = require("./src/analyzers/python");

const { buildContext } = require("./src/contextBuilder");
const { generateDockerfile } = require("./src/generator");

function main() {

    const type = detectLanguage();

    let analysis;

    if (type === "node") {
        analysis = analyzeNode();
    }
    else if (type === "python") {
        analysis = analyzePython();
    }
    else {
        console.log("Unsupported project type:", type);
        return;
    }

    const context = buildContext(type, analysis);

    const dockerfile = generateDockerfile(context);

    fs.writeFileSync("Dockerfile", dockerfile);

    console.log("Dockerfile created successfully for:", type);
    console.log("CONTEXT:", context);

}
main();