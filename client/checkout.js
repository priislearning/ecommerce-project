document.addEventListener("DOMContentLoaded", () => {

    const placeOrderBtn = document.getElementById("place-order");

    placeOrderBtn.addEventListener("click", placeOrder);

});

async function placeOrder() {

    const token = localStorage.getItem("token");

    const orderData = {

        fullname: document.getElementById("fullname").value,

        phone: document.getElementById("phone").value,

        address: document.getElementById("address").value,

        city: document.getElementById("city").value,

        state: document.getElementById("state").value,

        pincode: document.getElementById("pincode").value

    };

    try {

        const response = await fetch("/api/orders", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify(orderData)

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert("Order placed successfully!");

        window.location.href = "orders.html";

    }

    catch (error) {

        alert(error.message);

    }

}