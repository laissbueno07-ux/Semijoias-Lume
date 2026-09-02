// ---------------------------------------------------------------
// LUME — catálogo, busca, filtro, carrossel, favoritos e checkout
// ---------------------------------------------------------------

let cart = [];
let favoriteIds = [];
let activeCategory = "todas";
let searchTerm = "";
const carouselIndex = {};

const formatBRL = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ---------- Filtragem ----------
function getFilteredProducts() {
  return PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === "todas" || p.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.desc.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
}

// ---------- Abas de categoria ----------
function renderCategoryTabs() {
  const el = document.getElementById("categoryTabs");
  if (!el) return;
  el.innerHTML = Object.entries(CATEGORY_LABELS)
    .map(
      ([key, label]) =>
        `<button class="tab ${key === activeCategory ? "active" : ""}" data-category="${key}">${label}</button>`
    )
    .join("");

  el.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.category;
      renderCategoryTabs();
      renderProducts();
    });
  });
}

// ---------- Carrossel de imagens ----------
function slideMarkup(product, index) {
  const imageUrl = product.images && product.images[index] ? product.images[index] : "";
  return `
    <div class="carousel-slide">
      <img src="${imageUrl}" alt="${product.name}" loading="lazy">
    </div>`;
}

function renderCarousel(product) {
  const imageList = product.images || [];
  const current = carouselIndex[product.id] || 0;

  let slides = "";
  if (imageList.length > 0) {
    slides = imageList.map((_, i) => slideMarkup(product, i)).join("");
  } else {
    const iconSvg = (typeof ICONS !== "undefined" && ICONS[product.icon]) || "";
    slides = `<div class="carousel-slide">${iconSvg}</div>`;
  }

  const showControls = imageList.length > 1;
  const dots = showControls
    ? imageList.map((_, i) => `<span class="dot ${i === current ? "active" : ""}" data-dot="${i}"></span>`).join("")
    : "";

  return `
    <div class="product-carousel" data-product="${product.id}">
      <div class="carousel-track" style="transform: translateX(-${current * 100}%)">${slides}</div>
      ${showControls ? `<button class="carousel-arrow prev" data-dir="-1" aria-label="Imagem anterior">‹</button>` : ""}
      ${showControls ? `<button class="carousel-arrow next" data-dir="1" aria-label="Próxima imagem">›</button>` : ""}
      ${showControls ? `<div class="carousel-dots">${dots}</div>` : ""}
    </div>`;
}

function moveCarousel(productId, dir) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const total = product && product.images ? product.images.length : 1;
  const current = carouselIndex[productId] || 0;
  const next = (current + dir + total) % total;
  carouselIndex[productId] = next;
  updateCarouselDOM(productId);
}

function setCarousel(productId, index) {
  carouselIndex[productId] = index;
  updateCarouselDOM(productId);
}

function updateCarouselDOM(productId) {
  const wrapper = document.querySelector(`.product-carousel[data-product="${productId}"]`);
  if (!wrapper) return;
  const index = carouselIndex[productId] || 0;
  const track = wrapper.querySelector(".carousel-track");
  if (track) track.style.transform = `translateX(-${index * 100}%)`;
  wrapper.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === index));
}

// ---------- Renderização do catálogo ----------
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");
  if (!grid) return;

  const list = getFilteredProducts();

  if (noResults) noResults.hidden = list.length > 0;

  grid.innerHTML = list
    .map((p) => {
      const isFav = favoriteIds.includes(p.id);
      return `
      <article class="product-card">
        ${renderCarousel(p)}
        <div class="product-info">
          <div class="product-title-row">
            <h3 class="product-name">${p.name}</h3>
            <button class="fav-btn ${isFav ? "active" : ""}" data-id="${p.id}" aria-label="Favoritar">♥</button>
          </div>
          <p class="product-desc">${p.desc}</p>
          <p class="product-price">${formatBRL(p.price)}</p>
          <button class="add-to-cart" data-id="${p.id}">Adicionar à sacola</button>
        </div>
      </article>`;
    })
    .join("");

  grid.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });

  grid.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleFavorite(btn.dataset.id));
  });

  grid.querySelectorAll(".carousel-arrow").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.closest(".product-carousel").dataset.product;
      moveCarousel(productId, Number(btn.dataset.dir));
    });
  });

  grid.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      const productId = dot.closest(".product-carousel").dataset.product;
      setCarousel(productId, Number(dot.dataset.dot));
    });
  });
}

// ============================================================
// FAVORITOS - VERSÃO SEM SUPABASE
// ============================================================

async function loadFavorites() {
  try {
    const res = await fetch("/api/favoritos");
    if (res.status === 401) {
      favoriteIds = [];
      return;
    }
    const data = await res.json();
    favoriteIds = data.favoritos || [];
  } catch (err) {
    console.error("Erro ao carregar favoritos:", err);
    favoriteIds = [];
  }
}

async function toggleFavorite(productId) {
  try {
    // Tenta favoritar/desfavoritar
    const res = await fetch(`/api/favoritos/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.status === 401) {
      // Não está logado
      if (confirm("Você precisa estar logado para favoritar. Ir para o login?")) {
        window.location.href = "login.html";
      }
      return;
    }

    const data = await res.json();
    
    // Atualiza a lista de favoritos
    if (data.favorited) {
      if (!favoriteIds.includes(productId)) {
        favoriteIds.push(productId);
      }
    } else {
      favoriteIds = favoriteIds.filter((id) => id !== productId);
    }
    
    // Re-renderiza
    renderProducts();
  } catch (err) {
    console.error("Erro ao favoritar:", err);
    alert("Erro ao favoritar. Tente novamente.");
  }
}

// ============================================================
// CARRINHO
// ============================================================

function addToCart(id) {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = PRODUCTS.find((p) => p.id === id);
    if (product) cart.push({ ...product, qty: 1 });
  }
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const countEl = document.getElementById("cartCount");
  const subtotalEl = document.getElementById("cartSubtotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!container) return;

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  if (countEl) countEl.textContent = totalItems;

  if (cart.length === 0) {
    container.innerHTML = `<p class="cart-empty">Sua sacola está vazia.</p>`;
    if (checkoutBtn) checkoutBtn.disabled = true;
  } else {
    container.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <div class="cart-item-icon">
            ${item.images && item.images[0] ? `<img src="${item.images[0]}" alt="${item.name}" class="cart-thumb">` : (ICONS[item.icon] || '')}
          </div>
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">${formatBRL(item.price)}</p>
            <div class="qty-controls">
              <button data-action="dec" data-id="${item.id}">−</button>
              <span>${item.qty}</span>
              <button data-action="inc" data-id="${item.id}">+</button>
              <button class="remove-item" data-action="remove" data-id="${item.id}">remover</button>
            </div>
          </div>
        </div>`
      )
      .join("");
    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  if (subtotalEl) subtotalEl.textContent = formatBRL(cartSubtotal());

  container.querySelectorAll("[data-action]").forEach((btn) => {
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    btn.addEventListener("click", () => {
      if (action === "inc") changeQty(id, 1);
      if (action === "dec") changeQty(id, -1);
      if (action === "remove") removeFromCart(id);
    });
  });
}

// ---------- Abrir/fechar carrinho ----------
function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.add("active");
  if (overlay) overlay.classList.add("active");
}
function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  if (drawer) drawer.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
}

// ============================================================
// CHECKOUT - SEM MERCADO PAGO
// ============================================================

async function handleCheckout() {
  const note = document.getElementById("checkoutNote");
  const checkoutBtn = document.getElementById("checkoutBtn");
  
  if (checkoutBtn) checkoutBtn.disabled = true;
  if (note) note.textContent = "Verificando autenticação...";

  try {
    // 1. Verifica se o usuário está logado
    const meRes = await fetch("/api/me");
    const meData = await meRes.json();

    if (!meData.user) {
      if (note) note.textContent = "Entre na sua conta para finalizar a compra.";
      setTimeout(() => {
        if (confirm("Você precisa estar logado para finalizar a compra. Ir para o login?")) {
          window.location.href = "login.html";
        }
      }, 1000);
      if (checkoutBtn) checkoutBtn.disabled = false;
      return;
    }

    if (note) note.textContent = "Finalizando pedido...";

    // 2. Envia os itens do carrinho
    const response = await fetch("/api/criar-pedido", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      }),
    });

    if (response.status === 401) {
      if (note) note.textContent = "Sessão expirada. Faça login novamente.";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      if (checkoutBtn) checkoutBtn.disabled = false;
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao criar pedido");
    }

    const data = await response.json();
    
    if (data.success) {
      // Limpa o carrinho
      cart = [];
      renderCart();
      
      // Mostra mensagem de sucesso
      alert("✅ Pedido realizado com sucesso! Obrigado por comprar na Lume.");
      
      // Fecha o carrinho
      closeCart();
      
      // Redireciona para a página de sucesso
      window.location.href = "sucesso.html";
    } else {
      throw new Error(data.message || "Erro ao finalizar pedido");
    }
    
    if (checkoutBtn) checkoutBtn.disabled = false;
  } catch (err) {
    console.error("Erro ao finalizar compra:", err);
    if (note) note.textContent = "Erro ao finalizar compra: " + err.message;
    if (checkoutBtn) checkoutBtn.disabled = false;
  }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  renderCategoryTabs();
  await loadFavorites();
  renderProducts();
  renderCart();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      renderProducts();
    });
  }

  const cartToggle = document.getElementById("cartToggle");
  if (cartToggle) cartToggle.addEventListener("click", openCart);

  const cartClose = document.getElementById("cartClose");
  if (cartClose) cartClose.addEventListener("click", closeCart);

  const cartOverlay = document.getElementById("cartOverlay");
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", handleCheckout);
});

// Expõe funções globalmente para outros scripts
window.addToCart = addToCart;
window.toggleFavorite = toggleFavorite;
window.loadFavorites = loadFavorites;