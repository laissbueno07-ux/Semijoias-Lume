// ---------------------------------------------------------------
// LUME — hash de senha usando o módulo "crypto" nativo do Node.
// Nada de senha em texto puro salva no banco de dados.
// ---------------------------------------------------------------

const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === check;
}

module.exports = { hashPassword, verifyPassword };
