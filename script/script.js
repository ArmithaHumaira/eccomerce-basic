// script.js
async function fetchProducts() {
    try {
      const res = await fetch("https://dummyjson.com/products");
      const products = await res.json();
  
      const grid = document.getElementById("product-grid");
  
      products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow hover:shadow-lg transition";
  
        card.innerHTML = ` <a href="detailproduk.html?id=${product.id}"> </a>
          <img src="${product.image}" alt="${product.title}" class="h-40 object-contain mx-auto mb-2" />
          <h3 class="text-sm font-semibold mb-1 truncate">${product.title}</h3>
          <p class="text-red-500 font-bold">$${product.price}</p>
        `;
  
        grid.appendChild(card);
      });
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
    }
  }
  
  window.onload = fetchProducts;

  