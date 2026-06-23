const inquirer = require("inquirer").default;
async function promptEnv(env) {

    const result = {};

    const keys = Object.keys(env);

    for (const key of keys) {

        const answer = await inquirer.prompt([
            {
                type: "confirm",
                name: "change",
                message: `Change ${key}? (current: ${env[key]})`,
                default: false
            },
            {
                type: "input",
                name: "value",
                message: `New value for ${key}:`,
                when: (answers) => answers.change
            }
        ]);

        result[key] = answer.change ? answer.value : env[key];
    }

    return result;
}

module.exports = { promptEnv };