const products = [
  {
    id: "sidr-dawani",
    name: "عسل سدر دوعني ملكي",
    category: "sider",
    tag: "ملكي",
    price: 430,
    weight: "500 جم",
    origin: "وادي دوعن",
    image: "assets/product-sidr.svg",
    desc: "كثافة عالية ونكهة عميقة لهدايا العملاء والضيافة الفاخرة."
  },
  {
    id: "sidr-shabwa",
    name: "عسل سدر شبوة فاخر",
    category: "sider",
    tag: "فاخر",
    price: 320,
    weight: "500 جم",
    origin: "شبوة",
    image: "assets/product-sidr.svg",
    desc: "سدر أصيل بطعم متوازن يناسب الاستخدام اليومي والضيافة."
  },
  {
    id: "sidr-osaimi",
    name: "عسل سدر عصيمي خاص",
    category: "sider",
    tag: "مميز",
    price: 250,
    weight: "250 جم",
    origin: "حجة",
    image: "assets/product-sidr.svg",
    desc: "اختيار ممتاز لمن يريد تجربة سدر قوية بسعر متوسط."
  },
  {
    id: "samar-hadrami",
    name: "عسل سمر حضرمي",
    category: "samar",
    tag: "داكن",
    price: 178,
    weight: "500 جم",
    origin: "حضرموت",
    image: "assets/product-samar.svg",
    desc: "لون داكن ورائحة قوية لمحبي العسل الثقيل والغني."
  },
  {
    id: "samar-abyan",
    name: "عسل سمر أبين",
    category: "samar",
    tag: "اقتصادي",
    price: 115,
    weight: "250 جم",
    origin: "أبين",
    image: "assets/product-samar.svg",
    desc: "مناسب للاستخدام المتكرر والتحلية الطبيعية اليومية."
  },
  {
    id: "white-oudi",
    name: "عسل أبيض عودي",
    category: "white",
    tag: "نادر",
    price: 358,
    weight: "250 جم",
    origin: "إب",
    image: "assets/product-white.svg",
    desc: "عسل أبيض بقوام ناعم ونكهة لطيفة، مثالي للهدايا."
  },
  {
    id: "mountain",
    name: "عسل مراعي جبلي",
    category: "white",
    tag: "خفيف",
    price: 85,
    weight: "250 جم",
    origin: "جبال اليمن",
    image: "assets/product-white.svg",
    desc: "خفيف ولذيذ ومناسب للشاي والفطور والاستخدام العائلي."
  },
  {
    id: "vip-box",
    name: "صندوق عسل VIP",
    category: "gift",
    tag: "هدية",
    price: 690,
    weight: "3 عبوات",
    origin: "تشكيلة مختارة",
    image: "assets/product-gift.svg",
    desc: "مجموعة فاخرة من السدر والسمر والعسل الأبيض بتغليف هدايا."
  }
];

const state = {
  filter: "all",
  query: "",
  cart: {}
};

const productGrid = document.querySelector("#productGrid");
const filters = document.querySelector("#filters");
const searchInput = document.querySelector("#searchInput");
const cartDrawer = document.querySelector("#cartDrawer");
const openCart = document.querySelector("#openCart");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const checkoutLink = document.querySelector("#checkoutLink");

function formatPrice(value) {
  return `${value.toLocaleString("ar-SA")} ر.س`;
}

function filteredProducts() {
  return products.filter((product) => {
    const matchesFilter = state.filter === "all" || product.category === state.filter;
    const text = `${product.name} ${product.origin} ${product.desc}`;
    const matchesQuery = text.includes(state.query.trim());
    return matchesFilter && matchesQuery;
  });
}

function renderProducts() {
  const list = filteredProducts();
  productGrid.innerHTML = list
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-media">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <span class="tag">${product.tag}</span>
          </div>
          <div class="product-body">
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <div class="product-meta">
              <span>${product.origin}</span>
              <span>${product.weight}</span>
            </div>
            <div class="product-buy">
              <strong class="price">${formatPrice(product.price)}</strong>
              <button class="add-button" type="button" data-add="${product.id}">أضف للسلة</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  if (!list.length) {
    productGrid.innerHTML = `<div class="empty">لا توجد منتجات مطابقة للبحث الحالي.</div>`;
  }
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
              <img src="${item.image}" alt="${item.name}" />
              <div>
                <strong>${item.name}</strong>
                <span>${formatPrice(item.price)} × ${item.qty}</span>
              </div>
              <div class="qty" aria-label="كمية ${item.name}">
                <button type="button" data-dec="${item.id}">-</button>
                <span>${item.qty}</span>
                <button type="button" data-inc="${item.id}">+</button>
              </div>
            </div>
          `
        )
        .join("")
    : `<div class="empty">السلة فارغة. أضف منتجاً واحداً على الأقل.</div>`;

  const orderText = list
    .map((item) => `${item.name} - الكمية ${item.qty} - ${formatPrice(item.price * item.qty)}`)
    .join("%0A");
  checkoutLink.href = list.length
    ? `https://wa.me/967779299051?text=مرحباً، أريد طلب:%0A${orderText}%0Aالإجمالي: ${formatPrice(total)}`
    : "#products";
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
  document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderProducts();
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const inc = event.target.closest("[data-inc]");
  const dec = event.target.closest("[data-dec]");

  if (inc) {
    state.cart[inc.dataset.inc] += 1;
  }

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
