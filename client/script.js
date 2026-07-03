document.addEventListener("DOMContentLoaded", () => {
    let products = [];
    let cart = [];

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
   async function fetchCart() {
    try{
        const response=await fetch("/api/cart");
        if(!response.ok){
            throw new Error("Failed to fetch cart");
        }
        const data=await response.json();
        cart=data;
        renderCart();
    } catch (error) {
        console.error("Error fetching cart:", error);
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
    cartitems.addEventListener("click", (e) => {
        const id=Number(e.target.dataset.id);
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

    // Add product to cart
    async function addToCart(product) {
        try{
            const response=await fetch("/api/cart",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({ id: product.id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            cart = data.cart;
            renderCart();
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    }
    async function updateQuantity(id, action){
        try{
            const response=await fetch(`/api/cart/${id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({ action })
            });
            const data=await response.json();
            if(!response.ok){
                throw new Error(data.message);
            }
              cart=data.cart;
        renderCart();
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
      
    }
    async function removeFromCart(productId) {
        try {
            const response = await fetch(`/api/cart/${productId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            cart = data.cart;
            renderCart();
        } catch (error) {
            console.error("Error removing product from cart:", error);
        }
    }
    // Display cart
    function renderCart() {
        cartitems.innerHTML = "";

        let totalPrice = 0;

        if (cart.length > 0) {
            emptycarmessage.classList.add("hidden");
            carttotalmessage.classList.remove("hidden");

            cart.forEach(item => {
                totalPrice += item.price*item.quantity;

                const cartitem = document.createElement("div");

                cartitem.className = "text-white mb-2";

                cartitem.innerHTML = `
                    <div class="flex justify-between items-center bg-zinc-800 p-2 rounded mb-2">

    <div>
        <p>${item.name}</p>
        <p>Qty: ${item.quantity}</p>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
    </div>

    <div class="space-x-2">
        <button class="decrease bg-yellow-500 px-2 rounded" data-id="${item.id}">-</button>

        <button class="increase bg-green-500 px-2 rounded" data-id="${item.id}">+</button>

        <button class="remove bg-red-500 px-2 rounded" data-id="${item.id}">Remove</button>
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
    checkoutbtn.addEventListener("click", () => {
        cart.length = 0;
        alert("Checkout successful!");
        renderCart();
    });
   async function init() {
    await fetchProducts();
    await fetchCart();
   }
   init();
});