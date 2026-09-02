# Lume — loja de semijoias

Site de e-commerce com carrinho, busca, filtro por categoria, favoritos,
cadastro/login com histórico de compras, e pagamento via **Mercado Pago
(Checkout Pro)**.

## Estrutura do projeto

```
lume/
├── index.html              → página da loja (catálogo, busca, filtro, carrinho)
├── login.html               → entrar na conta
├── cadastro.html             → criar conta
├── perfil.html                → dados da conta + histórico de compras
├── favoritos.html              → peças favoritadas
├── guia-de-cuidados.html         → como cuidar das semijoias
├── sucesso.html / erro.html / pendente.html  → retorno do pagamento
├── css/style.css               → estilos
├── js/
│   ├── products.js              → catálogo de produtos (nome, preço, categoria)
│   ├── auth-ui.js                → mostra "Entrar" ou o nome do usuário no menu
│   └── script.js                  → busca, filtro, carrossel, favoritos, carrinho
├── lib/
│   ├── db.js                       → acesso ao "banco de dados" (arquivo JSON)
│   └── auth.js                      → hash/verificação de senha
├── data/db.json                      → onde usuários, pedidos e favoritos são salvos
├── server.js                          → backend Node/Express (API + pagamento)
├── package.json
└── .env.example                        → modelo das variáveis de ambiente
```

## O "banco de dados" deste projeto

Para manter o projeto simples de rodar (sem instalar PostgreSQL, MySQL etc.),
os dados ficam em **`data/db.json`** — um arquivo de texto que guarda usuários,
pedidos e favoritos. Você pode abrir esse arquivo no VS Code a qualquer momento
para ver os dados salvos.

Isso funciona bem para aprender e para uma loja pequena rodando localmente.
Quando o site crescer (mais gente comprando ao mesmo tempo, precisar de backup
automático, etc.), o caminho natural é trocar por um banco de verdade —
PostgreSQL, MySQL ou SQLite — reaproveitando as funções `readDB()`/`writeDB()`
de `lib/db.js` como ponto de partida.

## Como funciona o login

- Senhas nunca são salvas em texto puro — são criptografadas com o módulo
  `crypto` nativo do Node (`lib/auth.js`).
- O carrinho **exige login** para finalizar a compra (assim dá pra vincular
  cada pedido a uma conta e mostrar isso em "Meus pedidos").
- A sessão de login fica em um cookie, válido por 7 dias.

## Passo a passo para rodar no VS Code

### 1. Instale o Node.js
https://nodejs.org (versão LTS). Confirme no terminal:
```
node -v
```

### 2. Abra a pasta do projeto no VS Code
`Arquivo > Abrir Pasta...` e selecione a pasta `lume`.

### 3. Instale as dependências
```
npm install
```

### 4. Configure o `.env`
Copie `.env.example` para `.env`:
```
cp .env.example .env
```
Abra `.env` e:
- Cole seu **Access Token de TESTE** do Mercado Pago
  (painel: mercadopago.com.br/developers/panel)
- Troque `SESSION_SECRET` por qualquer frase aleatória

### 5. Rode o servidor
```
npm start
```
Você deve ver: `✨ Lume rodando em http://localhost:3000`

### 6. Abra no navegador
Acesse **http://localhost:3000** — não abra o `index.html` clicando duas
vezes, precisa passar pelo servidor.

### 7. Teste o fluxo completo
1. Crie uma conta em "Entrar" → "Cadastre-se"
2. Favorite algumas peças (ícone de coração)
3. Adicione peças à sacola e finalize a compra
4. Use um [cartão de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/test/cards)
5. Veja o pedido aparecer em "Perfil"

## Próximos passos (quando quiser evoluir)

- **Fotos reais**: hoje as peças usam ícones SVG desenhados à mão. Em
  `js/products.js`, troque o campo `icon` por um array `images` com os
  caminhos das fotos, e ajuste a função `slideMarkup()` em `js/script.js`
  para renderizar `<img>` em vez do ícone.
- **Banco de dados de verdade**: veja a seção acima sobre `data/db.json`.
- **Webhook do Mercado Pago**: a confirmação de pagamento hoje depende do
  cliente voltar para a página de sucesso. Para garantir a confirmação
  mesmo se ele fechar a aba, implemente um Webhook (IPN) do Mercado Pago.
- **Hospedagem**: para publicar de verdade, hospede o `server.js` em
  serviços como Render ou Railway, e aponte seu domínio para lá.
- **Credenciais de produção**: troque o Access Token de teste pelo de
  produção no `.env` quando estiver tudo validado.

## Personalizar a identidade visual

As cores e fontes estão centralizadas no topo do `css/style.css`, dentro de
`:root`. Trocar a paleta é só editar esses valores — todo o site se atualiza.
