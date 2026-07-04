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
        const token=localStorage.getItem("token");//tells the browser to take my token out
        const response=await fetch("/api/cart",{
            headers:{
                "Authorization": `Bearer ${token}`//name of http header exaclty what middle ware read
            }//take the header out put it inside the req send it to the server the complete journey login server crreate jwt browser save jwt user click cart browser take jwt from locak storage browser attach jwt in auth header server recive request middleware read auth header middleware verifies jwt royte ec
        });
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
                "glass rounded-2xl p-5 flex justify-between items-center shadow-lg";

            productdiv.innerHTML = `

<div>

<h3 class="text-xl font-semibold">

${product.name}

</h3>

<p class="text-green-400 mt-2">

$${product.price.toFixed(2)}

</p>

</div>

<button
data-id="${product.id}"
class="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-xl">

Add To Cart

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
            const token=localStorage.getItem("token");
            const response=await fetch("/api/cart",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
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
            const token=localStorage.getItem("token");
            const response=await fetch(`/api/cart/${id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
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
                    <div class="glass rounded-xl p-4 flex justify-between items-center mb-4">

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
// your backend is the clg
//jwt is the identity card
//middleware is the security guard