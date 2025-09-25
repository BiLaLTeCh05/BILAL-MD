const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "commit.json");

function getCommitHash() {
    if (!fs.existsSync(dbPath)) return null;
    const data = JSON.parse(fs.readFileSync(dbPath));
    return data.hash || null;
}

function setCommitHash(hash) {
    fs.writeFileSync(dbPath, JSON.stringify({ hash }, null, 2));
}

module.exports = { getCommitHash, setCommitHash };
