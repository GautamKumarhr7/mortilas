const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [regex, replacement] of replacements) {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

const crawlAndReplace = (dir, replacements) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      crawlAndReplace(fullPath, replacements);
    } else if (fullPath.endsWith('.ts')) {
      replaceInFile(fullPath, replacements);
    }
  }
};

const BD_REPLACEMENTS = [
  [/'\.\.\/services\/vendor/g, "'../../services/businessDevelopment/vendor"],
  [/'\.\.\/db/g, "'../../db"],
  [/'\.\.\/models\/vendor/g, "'../../models/businessDevelopment/vendor"],
  [/'\.\.\/models'/g, "'../../models'"],
  [/'\.\.\/models\/index\.js'/g, "'../../models/index.js'"],
  [/'\.\.\/controllers\/vendor/g, "'../../controllers/businessDevelopment/vendor"],
  [/'\.\.\/utils/g, "'../../utils"],
  [/'\.\.\/middlewares/g, "'../../middlewares"],
  [/'\.\.\/repositories\/vendor/g, "'../../repositories/businessDevelopment/vendor"],
  [/'\.\.\/helpers/g, "'../../helpers"],
];

const GLOBAL_REPLACEMENTS = [
  [/'\.\/vendor/g, "'./businessDevelopment/vendor"],
  [/'\.\.\/vendor/g, "'../businessDevelopment/vendor"],
  [/'\.\.\/models\/vendor/g, "'../models/businessDevelopment/vendor"],
];

console.log("Fixing BD files...");
crawlAndReplace(path.join(__dirname, 'src/controllers/businessDevelopment'), BD_REPLACEMENTS);
crawlAndReplace(path.join(__dirname, 'src/repositories/businessDevelopment'), BD_REPLACEMENTS);
crawlAndReplace(path.join(__dirname, 'src/routers/businessDevelopment'), BD_REPLACEMENTS);
crawlAndReplace(path.join(__dirname, 'src/services/businessDevelopment'), BD_REPLACEMENTS);

console.log("Fixing Global files...");
crawlAndReplace(path.join(__dirname, 'src/models'), GLOBAL_REPLACEMENTS);
crawlAndReplace(path.join(__dirname, 'src/routers'), GLOBAL_REPLACEMENTS);
crawlAndReplace(path.join(__dirname, 'src/repositories'), GLOBAL_REPLACEMENTS);
