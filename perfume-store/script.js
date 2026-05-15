const products = [
  {
    id: "royal-oud",
    name: "Royal Oud 01",
    arName: "أثر العود الملكي",
    category: "evening",
    tag: "مسائي",
    price: 340,
    image: "assets/perfume-oud.svg",
    notes: ["عود", "عنبر", "جلد"],
    desc: "حضور رسمي عميق للمساء والمناسبات."
  },
  {
    id: "rose-noir",
    name: "Rose Noir 02",
    arName: "روز نوار",
    category: "soft",
    tag: "ناعم",
    price: 210,
    image: "assets/perfume-rose.svg",
    notes: ["ورد", "مسك", "فانيلا"],
    desc: "أناقة هادئة تصلح كهدية راقية."
  },
  {
    id: "citrus-veil",
    name: "Citrus Veil 03",
    arName: "سيتروس فيل",
    category: "daily",
    tag: "يومي",
    price: 165,
    image: "assets/perfume-fresh.svg",
    notes: ["حمضيات", "خشب", "نظافة"],
    desc: "انتعاش صباحي مناسب للعمل والاستخدام اليومي."
  },
  {
    id: "private-set",
    name: "Private Set",
    arName: "صندوق الأثر VIP",
    category: "gift",
    tag: "هدية",
    price: 520,
    image: "assets/perfume-gift.svg",
    notes: ["عطر", "مسك", "بخور"],
    desc: "باقة هدايا رسمية بتغليف فاخر."
  }
];

const recommendations = {
  evening: "نقترح: أثر العود الملكي. مناسب للحضور القوي والمناسبات المسائية.",
  soft: "نقترح: روز نوار. هدية أنيقة وناعمة بطابع ورد ومسك.",
  daily: "نقترح: سيتروس فيل. رائحة منعشة وخفيفة للاستخدام اليومي."
};

const state = {
  filter: "all",
  cart: {}
};

const productGrid = document.querySelector("#productGrid");
const filters = document.querySelector("#filters");
const cartDrawer = document.querySelector("#cartDrawer");
const openCart = document.querySelector("#openCart");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const checkoutLink = document.querySelector("#checkoutLink");
const advisorResult = document.querySelector("#advisorResult");

function formatPrice(value) {
  return `${value.toLocaleString("ar-SA")} ر.س`;
}

function visibleProducts() {
  return products.filter((product) => state.filter === "all" || product.category === state.filter);
}

function renderProducts() {
  productGrid.innerHTML = visibleProducts()
    .map(
      (product) => `
        <article class="scent-card">
          <figure>
            <img src="${product.image}" alt="${product.arName}" loading="lazy" />
            <span class="tag">${product.tag}</span>
          </figure>
          <div class="scent-info">
            <h3>${product.arName}</h3>
            <p>${product.desc}</p>
            <div class="notes">
              ${product.notes.map((note) => `<span>${note}</span>`).join("")}
            </div>
            <div class="scent-buy">
              <strong class="price">${formatPrice(product.price)}</strong>
              <button type="button" data-add="${product.id}">أضف للطلب</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function cartList() {
  return Object.entries(state.cart)
    .map(([id, qty]) => {
      const product = products.find((item) => item.id === id);
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);
}

function renderCart() {
  const list = cartList();
  const totalQty = list.reduce((sum, item) => sum + item.qty, 0);
  const total = list.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalQty;
  cartTotal.textContent = formatPrice(total);

  cartItems.innerHTML = list.length
    ? list
        .map(
          (item) => `
            <div class="cart-item">
              <img src="${item.image}" alt="${item.arName}" />
              <div>
                <strong>${item.arName}</strong>
                <span>${formatPrice(item.price)} × ${item.qty}</span>
              </div>
              <div class="qty" aria-label="كمية ${item.arName}">
                <button type="button" data-dec="${item.id}">-</button>
                <span>${item.qty}</span>
                <button type="button" data-inc="${item.id}">+</button>
              </div>
            </div>
          `
        )
        .join("")
    : `<div class="empty">لم تختر عطراً بعد.</div>`;

  const orderText = list
    .map((item) => `${item.arName} - الكمية ${item.qty} - ${formatPrice(item.price * item.qty)}`)
    .join("%0A");
  checkoutLink.href = list.length
    ? `https://wa.me/967779299051?text=مرحباً، أريد طلب عطور:%0A${orderText}%0Aالإجمالي: ${formatPrice(total)}`
    : "#scents";
}

function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  renderCart();
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  state.filter = button.dataset.filter;
  document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

document.querySelector(".advisor-options").addEventListener("click", (event) => {
  const button = event.target.closest("[data-mood]");
  if (!button) return;

  advisorResult.innerHTML = `
    <span>اقتراح المستشار</span>
    <strong>${recommendations[button.dataset.mood]}</strong>
  `;
});

cartItems.addEventListener("click", (event) => {
  const inc = event.target.closest("[data-inc]");
  const dec = event.target.closest("[data-dec]");

  if (inc) state.cart[inc.dataset.inc] += 1;

  if (dec) {
    const id = dec.dataset.dec;
    state.cart[id] -= 1;
    if (state.cart[id] <= 0) delete state.cart[id];
  }

  renderCart();
});

openCart.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
});

closeCart.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
});

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) {
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
  }
});

renderProducts();
renderCart();
