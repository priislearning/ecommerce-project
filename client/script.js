document.addEventListener("DOMContentLoaded", () => {
    let products = [];
    const cart = [];

    const productlist = document.getElementById("product-list");
    const cartitems = document.getElementById("cart-items");
    const emptycarmessage = document.getElementById("empty-cart");
    const carttotalmessage = document.getElementById("cart-total");
    const totalpricedisplay = document.getElementById("total-price");
    const checkoutbtn = document.getElementById("checkout-btn");

    // Fetch products from backend
    async function fetchProducts() {
        try {
            const response = await fetch("/api/products");

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            products = await response.json();
            renderProducts();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Display products
    function renderProducts() {
        productlist.innerHTML = "";

        products.forEach(product => {
            const productdiv = document.createElement("div");

            productdiv.className =
                "bg-zinc-800 p-2 rounded flex justify-between items-center mb-3 text-white";

            productdiv.innerHTML = `
                <span>${product.name} - $${product.price.toFixed(2)}</span>
                <button data-id="${product.id}" class="bg-blue-500 px-2 py-1 rounded">
                    Add to Cart
                </button>
            `;

            productlist.appendChild(productdiv);
        });
    }

    // Event delegation for Add to Cart buttons
    productlist.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const productId = Number(e.target.dataset.id);
            const product = products.find(p => p.id === productId);

            if (product) {
                addToCart(product);
            }
        }
    });

    // Add product to cart
    function addToCart(product) {
        cart.push(product);
        renderCart();
    }

    // Display cart
    function renderCart() {
        cartitems.innerHTML = "";

        let totalPrice = 0;

        if (cart.length > 0) {
            emptycarmessage.classList.add("hidden");
            carttotalmessage.classList.remove("hidden");

            cart.forEach(item => {
                totalPrice += item.price;

                const cartitem = document.createElement("div");

                cartitem.className = "text-white mb-2";

                cartitem.innerHTML = `
                    ${item.name} - $${item.price.toFixed(2)}
                `;

                cartitems.appendChild(cartitem);
            });

            totalpricedisplay.textContent = totalPrice.toFixed(2);

        } else {
            emptycarmessage.classList.remove("hidden");
            carttotalmessage.classList.add("hidden");
            totalpricedisplay.textContent = "0.00";
        }
    }

    // Checkout
    checkoutbtn.addEventListener("click", () => {
        cart.length = 0;
        alert("Checkout successful!");
        renderCart();
    });

    // Load products when page opens
    fetchProducts();
});