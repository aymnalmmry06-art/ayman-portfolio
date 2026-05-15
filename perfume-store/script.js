const products = [
  {
    id: "royal-oud",
    name: "أثر العود الملكي",
    category: "oud",
    tag: "فاخر",
    price: 340,
    size: "100 مل",
    mood: "عود وعنبر",
    image: "assets/perfume-oud.svg",
    desc: "عطر شرقي عميق بطابع ملكي مناسب للمساء والمناسبات."
  },
  {
    id: "velvet-oud",
    name: "عود فيلفت",
    category: "oud",
    tag: "مميز",
    price: 260,
    size: "75 مل",
    mood: "عود ناعم",
    image: "assets/perfume-oud.svg",
    desc: "مزيج عود ناعم مع لمسة جلدية هادئة وثبات طويل."
  },
  {
    id: "rose-noir",
    name: "روز نوار",
    category: "floral",
    tag: "زهري",
    price: 210,
    size: "100 مل",
    mood: "ورد ومسك",
    image: "assets/perfume-rose.svg",
    desc: "ورد فاخر مع مسك أبيض، مناسب للهدايا والاستخدام اليومي."
  },
  {
    id: "musk-pearl",
    name: "مسك بيرل",
    category: "floral",
    tag: "ناعم",
    price: 145,
    size: "50 مل",
    mood: "مسك نظيف",
    image: "assets/perfume-rose.svg",
    desc: "رائحة نظيفة وناعمة تناسب الذوق الهادئ والمكتب."
  },
  {
    id: "citrus-mood",
    name: "سيتروس مود",
    category: "fresh",
    tag: "منعش",
    price: 165,
    size: "100 مل",
    mood: "حمضيات وخشب",
    image: "assets/perfume-fresh.svg",
    desc: "افتتاحية منعشة مع قاعدة خشبية، مثالي للصباح."
  },
  {
    id: "blue-mist",
    name: "بلو ميست",
    category: "fresh",
    tag: "يومي",
    price: 120,
    size: "50 مل",
    mood: "نظيف ومنعش",
    image: "assets/perfume-fresh.svg",
    desc: "عطر يومي خفيف يعطي إحساس النظافة والانتعاش."
  },
  {
    id: "attar-set",
    name: "صندوق الأثر VIP",
    category: "gift",
    tag: "هدية",
    price: 520,
    size: "3 قطع",
    mood: "عطر ومسك وبخور",
    image: "assets/perfume-gift.svg",
    desc: "باقة هدايا فاخرة تجمع العطر والمسك والبخور."
  },
  {
    id: "mini-set",
    name: "مجموعة التجربة",
    category: "gift",
    tag: "باقة",
    price: 180,
    size: "4 عينات",
    mood: "تشكيلة مختارة",
    image: "assets/perfume-gift.svg",
    desc: "مجموعة صغيرة لتجربة الروائح قبل اختيار العطر الكامل."
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
    const text = `${product.name} ${product.mood} ${product.desc}`;
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
              <span>${product.mood}</span>
              <span>${product.size}</span>
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
    productGrid.innerHTML = `<div class="empty">لا توجد عطور مطابقة للبحث الحالي.</div>`;
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
    : `<div class="empty">السلة فارغة. أضف عطراً واحداً على الأقل.</div>`;

  const orderText = list
    .map((item) => `${item.name} - الكمية ${item.qty} - ${formatPrice(item.price * item.qty)}`)
    .join("%0A");
  checkoutLink.href = list.length
    ? `https://wa.me/967779299051?text=مرحباً، أريد طلب عطور:%0A${orderText}%0Aالإجمالي: ${formatPrice(total)}`
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
