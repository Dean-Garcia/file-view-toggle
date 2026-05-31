const fs = require("fs");
const path = require("path");

// 1. Read your single source of truth config variable
const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config.json"), "utf8"),
);

// 2. Read your raw template manifest
let template = fs.readFileSync(
  path.join(__dirname, "package.template.json"),
  "utf8",
);

// 3. Swap every instance of your variable globally
let finalizedManifest = template.replace(/{{EXT_ID}}/g, config.EXT_ID);
finalizedManifest = finalizedManifest.replace(/{{VIEW_ID}}/g, config.VIEW_ID);

// 4. Output the static package.json VS Code requires
fs.writeFileSync(
  path.join(__dirname, "package.json"),
  finalizedManifest,
  "utf8",
);

console.log(
  `Successfully generated package.json with Extension ID: ${config.EXT_ID}`,
);
