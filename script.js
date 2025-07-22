document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const body = document.body;
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
    });
  }

  // Show welcome message if signed in
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData && userData.name) {
    const welcome = document.getElementById("welcome-user");
    if (welcome) {
      welcome.textContent = `Welcome ${userData.name}`;
    }
    const signInLink = document.getElementById("signin-link");
    if (signInLink) {
      signInLink.remove();
    }
    const navLinks = document.querySelector(".nav-links");
    if (navLinks && !document.getElementById("sign-out-link")) {
      const signOutBtn = document.createElement("a");
      signOutBtn.href = "#";
      signOutBtn.id = "sign-out-link";
      signOutBtn.textContent = "Sign Out";
      signOutBtn.onclick = () => {
        localStorage.removeItem("user");
        location.reload();
      };
      navLinks.appendChild(signOutBtn);
    }
  }

  // =========================
  // CART PAGE LOGIC
  // =========================
  if (window.location.pathname.includes("cart.html")) {
    const priceList = {
      "Air Conditioner": 24999,
      "Refrigerator": 19999,
      "PS5 Slim Digital": 44990,
      "PS5 Slim Disc": 49990
    };

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    const totalPriceDisplay = document.getElementById("total-price");
    const cartSummary = document.getElementById("cart-summary");

    const itemMap = {};
    cartItems.forEach(item => {
      itemMap[item] = (itemMap[item] || 0) + 1;
    });

    let total = 0;
    cartContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      cartSummary.style.display = "none";
    } else {
      cartSummary.style.display = "block";
      Object.keys(itemMap).forEach((item) => {
        const quantity = itemMap[item];
        const price = priceList[item] || 0;
        const subtotal = price * quantity;
        total += subtotal;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
          <p><strong>${item}</strong> (x${quantity}) - ₹${subtotal.toLocaleString()}</p>
          <button onclick="decreaseQuantity('${item}')">-</button>
          <button onclick="increaseQuantity('${item}')">+</button>
          <button onclick="removeItem('${item}')">Remove All</button>
        `;
        cartContainer.appendChild(div);
      });

      totalPriceDisplay.textContent = `Total: ₹${total.toLocaleString()}`;
    }

    window.decreaseQuantity = function (product) {
      let updated = JSON.parse(localStorage.getItem("cart")) || [];
      const index = updated.indexOf(product);
      if (index > -1) updated.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(updated));
      location.reload();
    };

    window.increaseQuantity = function (product) {
      let updated = JSON.parse(localStorage.getItem("cart")) || [];
      updated.push(product);
      localStorage.setItem("cart", JSON.stringify(updated));
      location.reload();
    };

    window.removeItem = function (product) {
      let updated = JSON.parse(localStorage.getItem("cart")) || [];
      updated = updated.filter(item => item !== product);
      localStorage.setItem("cart", JSON.stringify(updated));
      location.reload();
    };

    window.clearCart = function () {
      localStorage.removeItem("cart");
      location.reload();
    };
  }

  // =========================
  // CHECKOUT PAGE LOGIC
  // =========================
  if (window.location.pathname.includes("checkout.html")) {
    const form = document.querySelector(".checkout-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        document.getElementById("order-msg").textContent =
          "✅ Order placed successfully! Redirecting to Order History...";
        localStorage.removeItem("cart");
        setTimeout(() => {
          window.location.href = "order_history.html";
        }, 2000);
      });
    }
  }

  // =========================
  // INDEX PRODUCT CONTROL
  // =========================
  if (window.location.pathname.includes("index.html")) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemMap = {};
    cart.forEach((item) => {
      itemMap[item] = (itemMap[item] || 0) + 1;
    });

    const user = JSON.parse(localStorage.getItem("user"));

    document.querySelectorAll(".cart-control").forEach((control) => {
      const product = control.getAttribute("data-product");
      const qty = itemMap[product] || 0;

      if (!user) {
        control.innerHTML = `<button onclick="window.location.href='signin.html'">Sign In to Add</button>`;
        return;
      }

      if (qty === 0) {
        control.innerHTML = `<button onclick="addToCart('${product}')">Add to Cart</button>`;
      } else {
        control.innerHTML = `
          <button onclick="decreaseQuantity('${product}')">-</button>
          <span>${qty}</span>
          <button onclick="increaseQuantity('${product}')">+</button>`;
      }
    });

    window.addToCart = function (product) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    };

    window.increaseQuantity = function (product) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    };

    window.decreaseQuantity = function (product) {
      const index = cart.indexOf(product);
      if (index > -1) cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    };
  }
});
