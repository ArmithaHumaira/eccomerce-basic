const API_URL = 'https://dummyjson.com/products';
let keranjang = [];
let produkSekarang = null;

function muatDariLocalStorage() {
  const data = localStorage.getItem("keranjang");
  if (data) keranjang = JSON.parse(data);
}

function simpanKeLocalStorage() {
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
}

function tambahKeKeranjang(item) {
  const existing = keranjang.find((produk) => produk.id === item.id);
  if (existing) {
    existing.jumlah += 1;
  } else {
    keranjang.push({ ...item, jumlah: 1 });
  }
  simpanKeLocalStorage();
  updateJumlahItem();
  tampilkanNotifikasi();
}

function updateJumlahItem() {
  const total = keranjang.reduce((sum, item) => sum + item.jumlah, 0);
  const badge = document.getElementById("jumlah-item");
  if (!badge) return;
  badge.textContent = total;
  badge.classList.toggle("hidden", total === 0);
}

function renderKeranjang() {
  const keranjangContainer = document.getElementById("keranjang-list");
  keranjangContainer.innerHTML = "";
  if (keranjang.length === 0) {
    keranjangContainer.innerHTML = "<p class='text-center text-gray-500'>Keranjang kosong.</p>";
    return;
  }

  keranjang.forEach((item) => {
    const itemEl = document.createElement("div");
    itemEl.className = "flex gap-4 p-4 bg-gray-50 border rounded-lg shadow-sm items-center mb-2";
    itemEl.innerHTML = `
      <img src="${item.thumbnail || item.image}" alt="${item.title}" class="w-16 h-16 object-contain border rounded" />
      <div class="flex-1">
        <h3 class="font-medium text-sm text-gray-800 line-clamp-2">${item.title}</h3>
        <p class="text-sm text-blue-600 font-semibold mt-1">
          Rp ${(item.price * 16000 * item.jumlah).toLocaleString('id-ID')}
          <span class="text-gray-500">(${item.jumlah}x)</span>
        </p>
      </div>`;
    keranjangContainer.appendChild(itemEl);
  });
}

function tampilkanNotifikasi() {
  const toast = document.getElementById("toast");
  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");
  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2000);
}

function tampilkanDetailProduk(product) {
  produkSekarang = product;

  document.getElementById('product-img').src = product.thumbnail || product.image || '';
  document.getElementById('product-title').textContent = product.title || '';
  document.getElementById('product-price').textContent = `Rp ${(product.price * 16000).toLocaleString('id-ID')}`;
  document.getElementById('product-category').textContent = `warna : ${product.category || '-'}`;

  // Ganti onclick tombol
  document.getElementById('add-to-cart').onclick = () => tambahKeKeranjang(produkSekarang);
}

function acakArray(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

function beliSekarang() {
  if (!produkSekarang) {
    alert("Produk tidak tersedia.");
    return;
  }

  const produkUntukCheckout = [{ ...produkSekarang, jumlah: 1 }];
  localStorage.setItem("pembayaranProduk", JSON.stringify(produkUntukCheckout));
  window.location.href = "pembayaran.html";
}

async function tampilkanProdukDariLocalStorage() {
  const produkStr = localStorage.getItem("produkTerpilih");
  if (!produkStr) {
    alert("Tidak ada produk yang dipilih.");
    return;
  }

  const product = JSON.parse(produkStr);
  tampilkanDetailProduk(product);

  try {
    const response = await fetch(API_URL);
    const all = await response.json();

    let similar = all.products.filter(
      p => p.id !== product.id && p.category === product.category
    );

    if (similar.length < 4) {
      const tambahan = all.products.filter(
        p => p.id !== product.id && !similar.some(s => s.id === p.id)
      );
      similar = similar.concat(acakArray(tambahan).slice(0, 4 - similar.length));
    }
    similar = acakArray(similar).slice(0, 4);

    const container = document.getElementById('similar-products');
    container.innerHTML = '';

    similar.forEach(item => {
      const div = document.createElement('div');
      div.className = "bg-white p-4 rounded-lg border border-gray-300 hover:shadow-md transition cursor-pointer";
      div.innerHTML = `
        <img src="${item.thumbnail || item.image}" alt="${item.title}" class="h-36 w-full object-contain mb-2" />
        <h4 class="font-semibold text-sm line-clamp-3 mb-1">${item.title}</h4>
        <p class="text-blue-600 font-bold">Rp ${(item.price * 16000).toLocaleString('id-ID')}</p>
      `;
      div.onclick = () => {
        localStorage.setItem("produkTerpilih", JSON.stringify(item));
        tampilkanDetailProduk(item);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
      container.appendChild(div);
    });
  } catch (e) {
    console.error("Gagal memuat produk mirip", e);
  }
}

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
  muatDariLocalStorage();
  updateJumlahItem();
  tampilkanProdukDariLocalStorage();
});


