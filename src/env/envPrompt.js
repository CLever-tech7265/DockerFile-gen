const inquirer = require("inquirer").default;

async function promptEnv(env) {

    const result = {};

    const keys = Object.keys(env);

    for (const key of keys) {

        const includeAnswer = await inquirer.prompt([
            {
                type: "confirm",
                name: "include",
                message: `Include ${key}? (default: no)`,
                default: false
            }
        ]);

        // ❌ אם לא כולל בכלל → מדלגים
        if (!includeAnswer.include) {
            continue;
        }

        // 🟢 אם כן כולל → שואל אם לשמור או לשנות
        const action = await inquirer.prompt([
            {
                type: "select",
                name: "mode",
                message: `PORT = ${env[key]} → what do you want to do?`,
                choices: [
                    {
                        name: `✔ Keep current value (${env[key]})`,
                        value: "keep"
                    },
                    {
                        name: "✏ Edit value",
                        value: "edit"
                    }
                ],
                default: 0
            }
        ]);
        if (action.mode === "keep") {
            result[key] = env[key];
        }

        if (action.mode === "edit") {

            const newValue = await inquirer.prompt([
                {
                    type: "input",
                    name: "value",
                    message: `New value for ${key}:`,
                    default: env[key]
                }
            ]);

            result[key] = newValue.value;
        }
    }

    return result;
}

module.exports = { promptEnv };