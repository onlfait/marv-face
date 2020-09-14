const fs = require("fs-extra");

module.exports = async function makePackage({ from, to }) {
  const pkg = await fs.readJson(from);
  const data = {
    license: pkg.license,
    version: pkg.version,
    name: pkg.name,
    description: pkg.description,
    author: pkg.author,
    repository: pkg.repository,
    main: "main/index.js",
    dependencies: pkg.dependencies
  };
  await fs.writeJson(to, data, { spaces: 2 });
};
