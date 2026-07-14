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

document.getElementById("image").value = product.image;

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

        if (!response.ok) {
            throw new Error("Unauthorized");
        }

        const user = await response.json();

        if (user.role !== "admin") {
            window.location.href = "/index.html";
            return;
        }
          await fetchProducts();


    } catch (err) {

        localStorage.removeItem("token");
        window.location.href = "/login.html";

    }

}
async function saveProduct(e) {

    e.preventDefault();
    const token = localStorage.getItem("token");

    const product = {
        name: document.getElementById("name").value,
        brand: document.getElementById("brand").value,
        category: document.getElementById("category").value,
        price: Number(document.getElementById("price").value),
        stock: Number(document.getElementById("stock").value),
        description: document.getElementById("description").value,
        image: document.getElementById("image").value
    };
  
     const url = editingProductId
        ? `/api/products/${editingProductId}`
        : "/api/products";

    const method = editingProductId
        ? "PUT"
        : "POST";


    try {

        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(product)
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

    const response = await fetch("/api/products");
    const products = await response.json();
    productsList = products;

    renderProducts(products);

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
const form = document.getElementById("addProductForm");

form.addEventListener("submit", saveProduct);
checkAdmin();