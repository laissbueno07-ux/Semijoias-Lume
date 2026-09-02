// ---------------------------------------------------------------
// LUME — "banco de dados" simples baseado em arquivo JSON.
//
// Isso guarda usuários, pedidos e favoritos em data/db.json.
// É ótimo para aprender e rodar localmente, sem precisar instalar
// nenhum banco de dados de verdade. Quando o site crescer, dá pra
// trocar por um banco real (PostgreSQL, MySQL, SQLite) mantendo as
// mesmas funções (readDB/writeDB) como ponto de partida.
// ---------------------------------------------------------------

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function ensureDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(
      DB_PATH,
      JSON.stringify({ users: [], orders: [], favorites: [] }, null, 2)
    );
  }
}

function readDB() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
