const fs = require('fs');
const path = require('path');

const REPOS = {
  hr: ['applicant', 'attendance', 'employee', 'job-post', 'leave-request', 'leave', 'payroll', 'reimbursement', 'user'],
  authority: ['module', 'permission', 'role', 'role_permission', 'submodule'],
  operation: ['equipment', 'material-indent-item', 'material-indent', 'purchase-order', 'subcontractor-rate-contract', 'subcontractor', 'work-order'],
  projectMaster: ['project']
};

for (const [moduleName, files] of Object.entries(REPOS)) {
  const dirPath = path.join(__dirname, 'src', 'repositories', moduleName);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  for (const file of files) {
    const oldPath = path.join(__dirname, 'src', 'repositories', `${file}.repository.ts`);
    const newPath = path.join(dirPath, `${file}.repository.ts`);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Moved ${file}.repository.ts to ${moduleName}`);
    }
  }
}

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
    console.log(`Updated imports in ${filePath}`);
  }
};

const crawlAndReplace = (dir, replacements, ext = '.ts') => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      crawlAndReplace(fullPath, replacements, ext);
    } else if (fullPath.endsWith(ext)) {
      replaceInFile(fullPath, replacements);
    }
  }
};

const REPO_INTERNAL_REPLACEMENTS = [
  [/'\.\.\/db/g, "'../../db"],
  [/'\.\.\/models/g, "'../../models"],
];

for (const moduleName of Object.keys(REPOS)) {
  crawlAndReplace(path.join(__dirname, 'src', 'repositories', moduleName), REPO_INTERNAL_REPLACEMENTS);
}

const GLOBAL_REPLACEMENTS = [];
for (const [moduleName, files] of Object.entries(REPOS)) {
  for (const file of files) {
    GLOBAL_REPLACEMENTS.push([
      new RegExp(`'(\\.\\.?\\/)+repositories\\/${file}\\.repository\\.js'`, 'g'),
      (match) => match.replace(`repositories/${file}.repository.js`, `repositories/${moduleName}/${file}.repository.js`)
    ]);
  }
}

crawlAndReplace(path.join(__dirname, 'src', 'controllers'), GLOBAL_REPLACEMENTS);
crawlAndReplace(path.join(__dirname, 'src', 'services'), GLOBAL_REPLACEMENTS);
crawlAndReplace(path.join(__dirname, 'src', 'routers'), GLOBAL_REPLACEMENTS);
crawlAndReplace(path.join(__dirname, 'src', 'repositories'), GLOBAL_REPLACEMENTS);
