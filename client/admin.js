console.log("admin.js loaded");
let editingProductId = null;
let productsList = [];
function editProduct(id) {

    editingProductId = id;
     const product = productsList.find(
        p => p._id === id
    );
    document.getElementById("name").value = product.name;

document.getElementById("brand").value = product.brand;

document.getElementById("category").value = product.category;

document.getElementById("price").value = product.price;

document.getElementById("stock").value = product.stock;

document.getElementById("description").value = product.description;

document.getElementById("submitBtn").textContent =
        "Update Product";
}
async function checkAdmin() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    try {

        const response = await fetch("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
console.log("checkAdmin started");
        if (!response.ok) {
            throw new Error("Unauthorized");
        }

        const user = await response.json();

        if (user.role !== "admin") {
            window.location.href = "/index.html";
            return;
        }
          await fetchProducts();
          await fetchOrders();

    } catch (err) {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
    }

}
async function saveProduct(e) {

    e.preventDefault();
    const token = localStorage.getItem("token");

   const formData = new FormData();

formData.append("name", document.getElementById("name").value);
formData.append("brand", document.getElementById("brand").value);
formData.append("category", document.getElementById("category").value);
formData.append("price", document.getElementById("price").value);
formData.append("stock", document.getElementById("stock").value);
formData.append("description", document.getElementById("description").value);

formData.append(
    "image",
    document.getElementById("image").files[0]
);
  
     const url = editingProductId
        ? `/api/products/${editingProductId}`
        : "/api/products";

    const method = editingProductId
        ? "PUT"
        : "POST";


    try {

        const response = await fetch(url, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body:formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert(data.message);
        
        
        document.getElementById("addProductForm").reset();

        editingProductId = null;

        document.getElementById("submitBtn").textContent = "Add Product";

        await fetchProducts();

    } catch (err) {

        alert(err.message);

    }


}
async function fetchProducts() {

    const response = await fetch("/api/products?limit=1000");
    const data = await response.json();
    productsList = data.products;

    renderProducts(data.products);

}
function renderProducts(products) {

    const tbody = document.getElementById("productsBody");

    tbody.innerHTML = "";

    products.forEach(product => {

        tbody.innerHTML += `
            <tr>

                <td>${product.name}</td>

                <td>${product.brand}</td>

                <td>₹${product.price}</td>

                <td>${product.stock}</td>

                <td>

                    <button onclick="editProduct('${product._id}')">
                        Edit
                    </button>

                    <button onclick="deleteProduct('${product._id}')">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    });

}
async function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`/api/products/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert(data.message);

        await fetchProducts();

    } catch (err) {

        alert(err.message);

    }

}

async function fetchOrders() {
  const token = localStorage.getItem("token");

    try {

        const response = await fetch("/api/orders/admin", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const orders = await response.json();

        renderOrders(orders);

    } catch (err) {

        alert(err.message);

    }

}

function renderOrders(orders) {

const tbody = document.getElementById("ordersBody");

    tbody.innerHTML = "";
     
if (orders.length === 0) {

    tbody.innerHTML = `
        <tr>
            <td colspan="4">No Orders Found</td>
        </tr>
    `;

    return;

}

    orders.forEach(order => {

        tbody.innerHTML += `
            <tr>

                <td>${order.user.name}</td>

                <td>${order.user.email}</td>

                <td>₹${order.total}</td>

                <td>${order.items.length}</td>

                <td>${order.status}</td>

<td>

    <select onchange="updateStatus('${order._id}', this.value)">

        <option value="Pending"
            ${order.status === "Pending" ? "selected" : ""}>
            Pending
        </option>

        <option value="Shipped"
            ${order.status === "Shipped" ? "selected" : ""}>
            Shipped
        </option>

        <option value="Delivered"
            ${order.status === "Delivered" ? "selected" : ""}>
            Delivered
        </option>

    </select>

</td>

            </tr>
        `;

    });


}

async function updateStatus(id, status) {

    const token = localStorage.getItem("token");

    try {

        
        const response = await fetch(`/api/orders/${id}/status`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({
                status
            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert(data.message);

        await fetchOrders();

    } catch (err) {

        alert(err.message);

    }

}

const form = document.getElementById("addProductForm");

form.addEventListener("submit", saveProduct);
checkAdmin();