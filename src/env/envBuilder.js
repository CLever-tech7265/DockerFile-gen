function buildEnvModel(keysFromCode, envFile) {
  const result = {};

  for (const key of keysFromCode) {
    result[key] = envFile[key] ?? undefined;
  }

  return result;
}

module.exports = { buildEnvModel };