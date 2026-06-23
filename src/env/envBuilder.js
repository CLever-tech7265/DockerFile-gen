function buildEnvModel(keysFromCode, envFile) {

    const result = {};

    for (const key of keysFromCode) {

        if (envFile[key]) {
            result[key] = envFile[key]; // יש ערך מוכן
        } else {
            result[key] = ""; // אין → המשתמש ימלא
        }
    }

    return result;
}

module.exports = { buildEnvModel };