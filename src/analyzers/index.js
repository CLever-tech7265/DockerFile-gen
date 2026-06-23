const fs = require("fs");
const path = require("path");

const analyzers = {};

// טוען אוטומטית את כל ה-analyzers בתיקייה
const files = fs.readdirSync(__dirname);

for (const file of files) {

    if (file === "index.js") continue;
    if (!file.endsWith(".js")) continue;

    const modulePath = "./" + file;
    const mod = require(modulePath);

    // לוקח את הפונקציה הראשונה שמיוצאת מהקובץ
    const fn = Object.values(mod)[0];

    if (typeof fn === "function") {
        const name = file.replace(".js", "");
        analyzers[name] = fn;
    }
}

// שליפה לפי סוג שפה
function getAnalyzer(type) {
    return analyzers[type];
}

// אופציונלי: לראות אילו analyzers קיימים
function listAnalyzers() {
    return Object.keys(analyzers);
}

module.exports = {
    getAnalyzer,
    listAnalyzers
};