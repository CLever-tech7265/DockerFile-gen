const fs = require("fs");

function escape(value) {
  if (value == null) return "";
  const str = String(value);

  if (/[ \n="]/.test(str)) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }

  return str;
}

function saveEnv(env) {
  let content = "";

  Object.keys(env)
    .sort()
    .forEach((key) => {
      content += `${key}=${escape(env[key])}\n`;
    });

  fs.writeFileSync(".env", content);
}

module.exports = { saveEnv };