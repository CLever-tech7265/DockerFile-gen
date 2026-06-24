const inquirer = require("inquirer").default;

async function promptEnv(env) {
  const result = {};
  const keys = Object.keys(env);

  for (const key of keys) {
    const includeAnswer = await inquirer.prompt([
      {
        type: "confirm",
        name: "include",
        message: `Include ${key}?`,
        default: false
      }
    ]);

    if (!includeAnswer.include) continue;

    const action = await inquirer.prompt([
      {
        type: "select",
        name: "mode",
        message: `${key} = ${env[key] ?? ""}`,
        choices: [
          { name: `Keep current value (${env[key] ?? ""})`, value: "keep" },
          { name: "Edit value", value: "edit" }
        ]
      }
    ]);

    if (action.mode === "keep") {
      result[key] = env[key] ?? "";
    }

    if (action.mode === "edit") {
      const newValue = await inquirer.prompt([
        {
          type: "input",
          name: "value",
          message: `New value for ${key}:`,
          default: env[key] ?? ""
        }
      ]);

      result[key] = newValue.value;
    }
  }

  return result;
}

module.exports = { promptEnv };