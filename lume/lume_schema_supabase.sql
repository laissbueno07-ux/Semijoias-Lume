-- ============================================================
-- Lume — Schema do banco de dados (PostgreSQL / Supabase)
-- ============================================================

-- ------------------------------------------------------------
-- Usuários (cadastro.html / login.html)
-- ------------------------------------------------------------
CREATE TABLE users (
  id              BIGSERIAL PRIMARY KEY,
  name            VARCHAR(150)  NOT NULL,
  email           VARCHAR(190)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NOT NULL,  -- nunca guarde a senha em texto puro
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Categorias de produtos
-- ------------------------------------------------------------
CREATE TABLE categories (
  id      BIGSERIAL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  slug    VARCHAR(100) NOT NULL UNIQUE
);

-- ------------------------------------------------------------
-- Produtos (peças de semijoia)
-- ------------------------------------------------------------
CREATE TABLE products (
  id            BIGSERIAL PRIMARY KEY,
  category_id   BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  name          VARCHAR(150)  NOT NULL,
  slug          VARCHAR(150)  NOT NULL UNIQUE,
  description   TEXT,
  price_cents   INTEGER       NOT NULL,          -- preço em centavos evita erro de arredondamento
  material      VARCHAR(100),                    -- ex: "banhado a ouro 18k"
  stock         INTEGER       NOT NULL DEFAULT 0,
  image_url     VARCHAR(255),
  active        BOOLEAN       NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category_id);

-- ------------------------------------------------------------
-- Favoritos (favoritos.html — ícone ♥)
-- ------------------------------------------------------------
CREATE TABLE favorites (
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id    BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

-- ------------------------------------------------------------
-- Pedidos (histórico de compras)
-- ------------------------------------------------------------
CREATE TYPE order_status AS ENUM ('pendente','pago','enviado','entregue','cancelado');

CREATE TABLE orders (
  id                BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status            order_status NOT NULL DEFAULT 'pendente',
  total_cents       INTEGER NOT NULL,
  shipping_address  VARCHAR(255),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id);

-- ------------------------------------------------------------
-- Itens de cada pedido
-- ------------------------------------------------------------
CREATE TABLE order_items (
  id                BIGSERIAL PRIMARY KEY,
  order_id          BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity          INTEGER NOT NULL DEFAULT 1,
  unit_price_cents  INTEGER NOT NULL  -- preço no momento da compra
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ------------------------------------------------------------
-- Row Level Security (Supabase liga RLS por padrão nas tabelas
-- expostas via API). Por enquanto deixamos travado — você libera
-- políticas específicas quando conectar o backend.
-- ------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Exemplo: permitir leitura pública dos produtos ativos (catálogo do site)
CREATE POLICY "Produtos ativos são públicos"
  ON products FOR SELECT
  USING (active = true);
