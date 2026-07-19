document.addEventListener("DOMContentLoaded", () => {
    let products = [];
    let cart = [];

    const productlist = document.getElementById("product-list");
    const sortSelect = document.getElementById("sort");
    const searchInput = document.getElementById("search");
    const cartCount = document.getElementById("cart-count");
    const cartitems = document.getElementById("cart-items");
    const emptycarmessage = document.getElementById("empty-cart");
    const carttotalmessage = document.getElementById("cart-total");
    const totalpricedisplay = document.getElementById("total-price");
    const checkoutbtn = document.getElementById("checkout-btn");
  
     let currentPage = 1;
    let totalPages = 1;
    const limit = 3;
    let selectedSort = "";
let searchQuery = "";
   searchInput.addEventListener("input", () => {

    searchQuery = searchInput.value.trim();
    console.log("Search Query:", searchQuery);   
    currentPage = 1;

    fetchProducts();

});
    sortSelect.addEventListener("change", () => {

    if (sortSelect.value === "low-high") {
        selectedSort = "price_asc";
    }

    else if (sortSelect.value === "high-low") {
        selectedSort = "price_desc";
    }

    else if (sortSelect.value === "rating") {
        selectedSort = "rating";
    }

    else {
        selectedSort = "";
    }

    currentPage = 1;
    fetchProducts();

});

   

    // Fetch products from backend
    async function fetchProducts() {
        try {
            const response = await fetch(`/api/products?page=${currentPage}&limit=${limit}&sort=${selectedSort}&search=${searchQuery}`);

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();
            currentPage = data.currentPage;
            totalPages = data.totalPages;
            products=data.products;
            console.log("Products length:", products.length);
console.log(products);
            renderProducts(data.products);
              updatePagination();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    function updatePagination() {

    document.getElementById("page-info").textContent =
        `Page ${currentPage} of ${totalPages}`;

    document.getElementById("prev-btn").disabled =
        currentPage === 1;

    document.getElementById("next-btn").disabled =
        currentPage === totalPages;

}

    async function fetchCart() {
        try {
            const token = localStorage.getItem("token");//tells the browser to take my token out
            const response = await fetch("/api/cart", {
                headers: {
                    "Authorization": `Bearer ${token}`//name of http header exaclty what middle ware read
                }//take the header out put it inside the req send it to the server the complete journey login server crreate jwt browser save jwt user click cart browser take jwt from locak storage browser attach jwt in auth header server recive request middleware read auth header middleware verifies jwt royte ec
            });
            if (!response.ok) {
                throw new Error("Failed to fetch cart");
            }
            const data = await response.json();
            cart = data;
            renderCart();
            updateCartCount();
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    }
    // Display products
    function renderProducts(productsToRender) {

        productlist.innerHTML = "";

        // If no products match the search
        if (productsToRender.length === 0) {

            productlist.innerHTML = `
            <div class="col-span-full text-center py-20">

                <h2 class="text-3xl font-bold">
                    😕 No Products Found
                </h2>

                <p class="text-gray-500 mt-4">
                    Try another search.
                </p>

            </div>
        `;

            return;
        }

        // Display all products
        productsToRender.forEach(product => {

            const productdiv = document.createElement("div");

            productdiv.className =
                "bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition duration-300 p-6 flex flex-col";

            productdiv.innerHTML = `

            <div class="bg-[#f5f5f7] rounded-3xl h-80 flex items-center justify-center p-8">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    class="max-h-full max-w-full h-64 object-contain"
                >

            </div>

            <h3 class="text-2xl font-semibold mt-6 text-gray-900">

                ${product.name}

            </h3>

            <p class="text-gray-500 mt-1">

                ${product.brand}

            </p>

            <div class="flex items-center mt-2">

                <span class="text-yellow-500 text-lg">
                    ★★★★★
                </span>

                <span class="ml-2 text-gray-500">
                    ${product.rating}
                </span>

            </div>

            <p class="text-3xl font-bold mt-4 text-black">

                ₹${product.price.toLocaleString("en-IN")}

            </p>

            <span class="inline-block mt-3 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm w-fit">

                In Stock (${product.stock})

            </span>

            <button
                data-id="${product._id}"
                class="mt-6 bg-black hover:bg-gray-800 text-white rounded-full py-4 font-semibold transition">

                Add to Cart

            </button>

        `;

            productdiv.addEventListener("click", (e) => {

                console.log("Card clicked");
                console.log("Target:", e.target);

                if (e.target.closest("button")) {
                    console.log("Button detected");
                    return;
                }
                console.log("Going to product page");
                window.location.href = `product.html?id=${product._id}`;

            });

            productlist.appendChild(productdiv);

        });

    }


    // Event delegation for Add to Cart buttons
    productlist.addEventListener("click", (e) => {
        console.log("Button clicked", e.target);
        if (e.target.tagName === "BUTTON") {
            e.stopPropagation();
            const productId = e.target.dataset.id;
            const product = products.find(p => p._id === productId);

            if (product) {
                addToCart(product);
            }
        }
    });
    if (cartitems) {
        cartitems.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            if (e.target.classList.contains("remove")) {
                removeFromCart(id);
            }

            if (e.target.classList.contains("increase")) {
                updateQuantity(id, "increase");
            }

            if (e.target.classList.contains("decrease")) {
                updateQuantity(id, "decrease");
            }
        });
    }

    // Add product to cart
    async function addToCart(product) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: product._id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            cart = data.cart;
            renderCart();
            updateCartCount();
            showToast("Product added to cart");
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    }
    async function updateQuantity(id, action) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/cart/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            cart = data.cart;
            renderCart();
            updateCartCount();
        } catch (error) {
            console.error("Error updating cart item:", error);
        }

    }
    async function removeFromCart(productId) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`/api/cart/${productId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            cart = data.cart;
            renderCart();
            updateCartCount();
            showToast("Item removed");
        } catch (error) {
            console.error("Error removing product from cart:", error);
        }
    }

    function updateCartCount() {

        if (!cartCount) return;

        let totalItems = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
        });

        if (totalItems === 0) {
            cartCount.textContent = "";
        } else {
            cartCount.textContent = `(${totalItems})`;
        }

    }
    // Display cart
    function renderCart() {

        if (!cartitems) return;

        cartitems.innerHTML = "";

        let totalPrice = 0;

        if (cart.length > 0) {

            emptycarmessage.classList.add("hidden");
            carttotalmessage.classList.remove("hidden");

            cart.forEach(item => {

                totalPrice += item.price * item.quantity;

                const cartitem = document.createElement("div");

                cartitem.className = "text-white mb-2";

                cartitem.innerHTML = `
                <div class="glass rounded-xl p-4 flex justify-between items-center mb-4">

                    <div>
                        <p>${item.name}</p>
                        <p>Qty: ${item.quantity}</p>
                        <p>₹${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    <div class="space-x-2">
                        <button class="decrease bg-yellow-500 px-2 rounded" data-id="${item.productId}">-</button>

                        <button class="increase bg-green-500 px-2 rounded" data-id="${item.productId}">+</button>

                        <button class="remove bg-red-500 px-2 rounded" data-id="${item.productId}">Remove</button>
                    </div>

                </div>
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
    if (checkoutbtn) {
        checkoutbtn.addEventListener("click", () => {
            cart.length = 0;
            showToast("Checkout successful!");
            renderCart();
        });
    }
    async function init() {
        await fetchProducts();

        if (cartitems) {
            await fetchCart();
        }
    }
    init();

document.getElementById("prev-btn").addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        fetchProducts();

    }

});

document.getElementById("next-btn").addEventListener("click", () => {

    if (currentPage < totalPages) {

        currentPage++;

        fetchProducts();

    }

});

});
// your backend is the clg
//jwt is the identity card
//middleware is the security guard