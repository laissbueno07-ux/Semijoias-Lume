// ---------------------------------------------------------------
// LUME — servidor (COM LOGS PARA DEBUG)
// ---------------------------------------------------------------

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const { readDB, writeDB } = require("./lib/db");
const { hashPassword, verifyPassword } = require("./lib/auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "troque-este-segredo-em-producao",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);
app.use(express.static(path.join(__dirname)));

// Middleware para logar requisições (debug)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ============================================================
function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }
  return res.status(401).json({ error: "Você precisa entrar na sua conta." });
}

// ============================================================
// ENDPOINTS DE AUTENTICAÇÃO
// ============================================================

app.post("/api/cadastro", (req, res) => {
  console.log("📝 Cadastro recebido:", req.body);
  
  const { name, email, password } = req.body;
  
  // Validações
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Preencha nome, e-mail e senha." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "A senha precisa ter pelo menos 6 caracteres." });
  }

  const db = readDB();
  
  // Verifica se email já existe
  if (db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: "Este e-mail já está cadastrado." });
  }

  // Cria usuário
  const user = {
    id: "user_" + Date.now(),
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDB(db);

  console.log("✅ Usuário criado:", user.id);

  // Cria sessão
  req.session.userId = user.id;
  req.session.save((err) => {
    if (err) {
      console.error("❌ Erro ao salvar sessão:", err);
      return res.status(500).json({ error: "Erro ao criar sessão." });
    }
    console.log("✅ Sessão criada para:", user.id);
    res.json({ id: user.id, name: user.name, email: user.email });
  });
});

app.post("/api/login", (req, res) => {
  console.log("🔑 Login recebido:", { email: req.body.email });
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Preencha e-mail e senha." });
  }

  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  console.log("👤 Usuário encontrado?", user ? "Sim" : "Não");

  if (!user) {
    return res.status(401).json({ error: "E-mail ou senha incorretos." });
  }

  const passwordValid = verifyPassword(password, user.passwordHash);
  console.log("🔐 Senha válida?", passwordValid ? "Sim" : "Não");

  if (!passwordValid) {
    return res.status(401).json({ error: "E-mail ou senha incorretos." });
  }

  // Cria sessão
  req.session.userId = user.id;
  req.session.save((err) => {
    if (err) {
      console.error("❌ Erro ao salvar sessão:", err);
      return res.status(500).json({ error: "Erro ao criar sessão." });
    }
    console.log("✅ Sessão criada para:", user.id);
    res.json({ id: user.id, name: user.name, email: user.email });
  });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Erro ao destruir sessão:", err);
      return res.status(500).json({ error: "Erro ao sair." });
    }
    res.json({ ok: true });
  });
});

app.get("/api/me", (req, res) => {
  console.log("👤 /api/me - Session ID:", req.session?.userId || "Nenhum");
  
  if (!req.session || !req.session.userId) {
    return res.json({ user: null });
  }
  
  const db = readDB();
  const user = db.users.find((u) => u.id === req.session.userId);
  
  if (!user) {
    req.session.destroy();
    return res.json({ user: null });
  }
  
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

// ============================================================
// FAVORITOS
// ============================================================

app.get("/api/favoritos", requireLogin, (req, res) => {
  const db = readDB();
  const favoritos = db.favorites
    .filter((f) => f.userId === req.userId)
    .map((f) => f.productId);
  res.json({ favoritos });
});

app.post("/api/favoritos/:id", requireLogin, (req, res) => {
  const db = readDB();
  const idx = db.favorites.findIndex(
    (f) => f.userId === req.userId && f.productId === req.params.id
  );

  let favorited;
  if (idx >= 0) {
    db.favorites.splice(idx, 1);
    favorited = false;
  } else {
    db.favorites.push({ userId: req.userId, productId: req.params.id });
    favorited = true;
  }
  writeDB(db);
  res.json({ favorited });
});

// ============================================================
// PEDIDOS
// ============================================================

app.get("/api/pedidos", requireLogin, (req, res) => {
  const db = readDB();
  const pedidos = db.orders
    .filter((o) => o.userId === req.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ pedidos });
});

app.post("/api/criar-pedido", requireLogin, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio." });
    }

    const total = items.reduce((sum, i) => sum + Number(i.price) * Number(i.qty), 0);

    const db = readDB();
    const orderId = "ord_" + Date.now();
    db.orders.push({
      id: orderId,
      userId: req.userId,
      items,
      total,
      status: "aprovado",
      createdAt: new Date().toISOString(),
    });
    writeDB(db);

    res.json({ 
      success: true, 
      orderId, 
      message: "Pedido realizado com sucesso!" 
    });
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    res.status(500).json({ error: "Erro ao criar pedido." });
  }
});

app.listen(PORT, () => {
  console.log(`✨ Lume rodando em http://localhost:${PORT}`);
  console.log(`📁 Banco de dados: ${path.join(__dirname, "data", "db.json")}`);
});