# Lume — Joias e Semijoias

<p align="center">
  <img src="https://shields.io" alt="Node.js">
  <img src="https://shields.io" alt="Express">
  <img src="https://shields.io" alt="JavaScript">
  <img src="https://shields.io" alt="Mercado Pago">
</p>

---

## Funcionalidades Principais

  **E-commerce Completo:** Fluxo de carrinho de compras, busca em tempo real e filtros por categoria.
   **Autenticação Segura:** Cadastro e login de usuários com criptografia de senhas e sessão persistente via Cookies (7 dias).
   **Checkout Transparente:** Integração homologada com Mercado Pago para pagamentos eficientes. 
   **Lista de Desejos:** Opção para favoritar produtos (salvos por usuário).
   **Área do Cliente:** Painel de perfil para gerenciamento de dados cadastrais e histórico de pedidos.
   **Design Customizável:** Identidade visual centralizada em variáveis CSS para fácil alteração de cores e fontes.

---

## Estrutura do Projeto

```text
lume/
├── data/
│   └── db.json                # Persistência de dados (usuários, pedidos e favoritos)
├── js/
│   ├── auth-ui.js             # Gerenciamento de interface baseado no status de login
│   ├── products.js            # Catálogo de produtos e dados estruturados
│   └── script.js              # Lógica comercial do front-end (filtros, carrinho, busca)
├── lib/
│   ├── auth.js                # Segurança (criptografia hash de senhas)
│   └── db.js                  # Engine de leitura/escrita do arquivo JSON
├── css/
│   └── style.css              # Estilização global, responsividade e tokens de design
├── index.html                 # Vitrine principal da loja
├── login.html                 # Tela de autenticação
├── cadastro.html              # Tela de registro de novos usuários
├── perfil.html                # Dashboard do cliente e histórico de compras
├── favoritos.html             # Painel de produtos favoritados
├── guia-de-cuidados.html      # Central de informações de conservação das peças
├── sucesso.html               # Callback de pagamento aprovado
├── erro.html                  # Callback de falha no pagamento
├── pendente.html              # Callback de processamento de pagamento
├── server.js                  # Servidor Node.js (API Express e Webhooks)
├── package.json               # Manifest de dependências e scripts do projeto
└── .env.example               # Modelo de configuração das variáveis de ambiente
```

---

## Arquitetura e Engenharia de Dados

### Banco de Dados Simulado (`JSON File System`)
Para simplificar o processo de deploy e execução local, o projeto utiliza um arquivo local estruturado em **`data/db.json`**. Ele atua como banco de dados NoSQL por meio do módulo centralizado `lib/db.js`. 
>  *Nota de Escalabilidade:* Se o volume de acessos crescer, a arquitetura está modularizada para que as funções `readDB()` e `writeDB()` sejam facilmente substituídas por drivers de bancos relacionais como **PostgreSQL, MySQL ou SQLite**.

### Segurança e Sessão
*   As senhas dos usuários passam por um processo de hash criptográfico antes de serem salvas, utilizando o módulo nativo `crypto` do Node.js.
*   O estado da sessão é protegido por criptografia de cookies e exige uma chave `SESSION_SECRET` robusta definida no ambiente.

---

## Pré-requisitos e Instalação

Antes de começar, certifique-se de ter o [Node.js (versão LTS)](https://nodejs.org) instalado em sua máquina.

### 1. Clonar e Acessar o Projeto
Abra a pasta do projeto no seu editor (recomendado: VS Code):
```bash
# Abra pelo menu do VS Code: Arquivo > Abrir Pasta... e selecione a pasta 'lume'
```

### 2. Instalar as Dependências
No terminal do seu editor, execute:
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Copie o arquivo de exemplo para criar o seu arquivo de configuração oficial:
```bash
cp .env.example .env
```
Abra o arquivo `.env` recém-criado e configure os seguintes campos:
*   `MERCADO_PAGO_ACCESS_TOKEN`: Insira o seu token de teste gerado no painel de desenvolvedor do Mercado Pago.
*   `SESSION_SECRET`: Digite uma frase longa e aleatória para garantir a segurança dos cookies.

### 4. Inicializar o Servidor
```bash
npm start
```
Se tudo estiver correto, a seguinte mensagem aparecerá no terminal:
> `✨ Lume rodando em http://localhost:3000`

*Importante:* Sempre acesse o projeto através da URL do servidor local. Não tente abrir o arquivo `index.html` diretamente clicando duas vezes nele.

---


## Próximos Passos & Evolução do Sistema

Esta aplicação foi desenhada de forma modular para permitir melhorias contínuas. Abaixo estão as implementações recomendadas para produção:

*  **Mídia Realista (Fotos):** Substitua os ícones SVG atuais por imagens reais. Em `js/products.js`, altere o campo `icon` para um array de caminhos de imagens e atualize a função `slideMarkup()` em `js/script.js` para ler tags `<img>`.
*  **Webhooks (IPN):** Implementar uma rota de escuta de notificações (Webhooks) do Mercado Pago no `server.js` para registrar as vendas mesmo que o cliente feche a janela antes do redirecionamento.
*  **Banco de Dados de Produção:** Migrar a persistência do arquivo JSON para uma instância gerenciada do PostgreSQL ou MySQL.
*   **Deploy e Produção:** Hospedar o back-end em plataformas como Render ou Railway, realizar o chaveamento do arquivo `.env` para as credenciais de produção do Mercado Pago e apontar para um domínio customizado com certificado SSL.

---

## Customização Visual

Toda a identidade visual do projeto pode ser modificada instantaneamente sem alterar a estrutura do código. As cores, tipografia e espaçamentos estão centralizados no topo do arquivo `css/style.css` dentro do escopo `:root`. 
```css
/* Exemplo de customização rápida */
:root {
  --primary-color: #seu-codigo-hex;
  --accent-color: #seu-codigo-hex;
}
```

---
<p align="center">Desenvolvido com foco em boas práticas de engenharia de software. 💎</p>
