const fs = require("fs");

function analyzeJava() {

    const files = fs.readdirSync(process.cwd());

    const hasMaven = files.includes("pom.xml");
    const hasGradle = files.includes("build.gradle");

    // זיהוי entry בסיסי
    let entry = "Main.java";

    const javaFiles = files.filter(f => f.endsWith(".java"));
    if (javaFiles.length === 1) {
        entry = javaFiles[0];
    }

    let runCmd = "javac *.java && java Main";

    if (hasMaven) {
        runCmd = "mvn spring-boot:run";
    }

    if (hasGradle) {
        runCmd = "gradle run";
    }

    const installCmd = hasMaven
        ? "mvn install"
        : hasGradle
            ? "gradle build"
            : null;

    return {
        entry,
        installCmd,
        runCmd,
        hasMaven,
        hasGradle
    };
}

module.exports = { analyzeJava };