document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    const cartItems = document.getElementById("cart-items");

    const totalPrice = document.getElementById("total-price");

    const response = await fetch("/api/cart", {

        headers: {
            Authorization: `Bearer ${token}`
        }

    });

    const cart = await response.json();

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

        cartItems.innerHTML += `
        <div class="bg-white rounded-3xl shadow p-6 flex justify-between">

            <div>

                <h2 class="text-2xl font-bold">${item.name}</h2>

                <p>₹${item.price}</p>

                <p>Qty : ${item.quantity}</p>

            </div>

            <button
            class="bg-red-500 text-white px-5 rounded-xl">

            Remove

            </button>

        </div>
        `;

    });

    totalPrice.textContent = total;

});