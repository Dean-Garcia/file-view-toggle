const fs = require("fs");
const path = require("path");

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "config.json"), "utf8"),
);

let template = fs.readFileSync(
  path.join(__dirname, "package.template.json"),
  "utf8",
);

let finalizedManifest = template;

Object.entries(config).forEach(([key, value]) => {
  // Escapes special characters and creates a global regex for {{KEY}}
  const stringToReplace = new RegExp(`{{${key}}}`, "g");
  finalizedManifest = finalizedManifest.replace(stringToReplace, value);
});

// Output the static package.json VS Code requires
fs.writeFileSync(
  path.join(__dirname, "package.json"),
  finalizedManifest,
  "utf8",
);

console.log(
  `Successfully generated package.json with Extension ID: ${config.EXT_ID}`,
);
