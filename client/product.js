document.addEventListener("DOMContentLoaded", async () => {

    const params = new URLSearchParams(window.location.search);

    const productId = params.get("id");

    console.log(productId);

    try {

        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const product = await response.json();

         const container = document.getElementById("product-details");

container.innerHTML = `

<a
    href="index.html"
    class="inline-block mb-8 text-gray-500 hover:text-black transition">

    ← Back to Products

</a>

<div class="bg-white rounded-3xl shadow-lg p-10 grid md:grid-cols-2 gap-12">

    <div class="flex justify-center">

        <img
            src="${product.image}"
            alt="${product.name}"
            class="w-full max-w-md object-contain">

    </div>

    <div>

        <p class="text-gray-500 mb-2">

            ${product.brand}

        </p>

        <h1 class="text-5xl font-bold">

            ${product.name}

        </h1>

        <p class="text-4xl font-bold mt-8">

            ₹${product.price.toLocaleString("en-IN")}

        </p>

        <p class="text-gray-500 mt-6">

            Rating: ${product.rating} ★

        </p>

        <p class="text-gray-500 mt-2">

            Stock: ${product.stock}

        </p>

        <button
            class="mt-10 bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition">

            Add to Cart

        </button>

    </div>

</div>
`;


        console.log(product);

    } catch (err) {

        console.error(err);

    }

});