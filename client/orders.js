document.addEventListener("DOMContentLoaded", fetchOrders);

async function fetchOrders() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch("/api/orders", {

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const orders = await response.json();

        renderOrders(orders);

    }

    catch (error) {

        console.log(error);

    }

}

function renderOrders(orders) {

    const ordersList = document.getElementById("orders-list");

    ordersList.innerHTML = "";

    if (orders.length === 0) {

        ordersList.innerHTML = `

        <div class="bg-white rounded-3xl shadow-xl p-8">

        No Orders Yet

        </div>

        `;

        return;

    }

    orders.forEach(order => {

        ordersList.innerHTML += `

        <div class="bg-white rounded-3xl shadow-xl p-8">

        <h2 class="text-2xl font-bold">

        Order ID

        </h2>

        <p class="text-gray-500 mb-5">

        #${order._id.slice(-6)}

        </p>
         
        <p class="text-gray-500">

Placed on

${new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })}

at

${new Date(order.createdAt).toLocaleTimeString("en-IN")}

</p>

        <h3 class="font-semibold mb-3">

        Products

        </h3>

        ${order.items.map(item => `

            <div class="flex justify-between mb-2">

                <span>

                ${item.name}

                ×

                ${item.quantity}

                </span>

                <span>

                ₹${item.price}

                </span>

            </div>

        `).join("")}

        <hr class="my-5">

        <div class="flex justify-between">

            <span class="font-bold">

            Total

            </span>

            <span class="font-bold">

            ₹${order.total}

            </span>

        </div>

        <div class="mt-4">

        Status :

        <span class="
px-4
py-1
rounded-full
font-semibold

${order.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"}

">

${order.status}

</span>

        </div>

        </div>

        `;

    });

}