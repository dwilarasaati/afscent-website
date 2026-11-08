window.addEventListener('DOMContentLoaded', () => {
    // Ambil ID produk dari URL query (?id=X)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Ambil data produk dari localStorage / data default di script.js
    loadFromLocalStorage();
    const product = products.find(p => p.id === productId);

    const container = document.getElementById('detail-container');

    if (!product) {
        container.innerHTML = `
            <div class="col-span-full py-20 text-center text-slate-400">
                <i class="fa-solid fa-circle-exclamation text-6xl mb-4 text-rose-500"></i>
                <h2 class="text-2xl font-bold text-white mb-2">Produk Tidak Ditemukan</h2>
                <p class="text-sm mb-6">Produk yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
                <a href="index.html" class="gold-button px-6 py-2.5 rounded-xl font-semibold text-sm">Kembali ke Katalog</a>
            </div>
        `;
        return;
    }

    // Default Varian jika produk lama belum ada variannya
    const variants = product.variants || [
        { size: "50ml", price: product.price },
        { size: "100ml", price: Math.round(product.price * 1.7) }
    ];

    const notes = product.notes || { top: "Citrus, Pear", middle: "Jasmine, Vanilla", base: "Amber, Musk" };
    const usageTime = product.usageTime || "Siang & Malam";
    const environment = product.environment || "Indoor & Outdoor";
    const longevity = product.longevity || "6 - 8 Jam";

    // Opsi Varian HTML
    const variantHTML = variants.map((v, index) => `
        <label class="cursor-pointer">
            <input type="radio" name="size-variant" value="${v.price}" ${index === 0 ? 'checked' : ''} onchange="updateSelectedPrice(this.value, ${product.discount})" class="peer hidden">
            <div class="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 peer-checked:border-amber-400 peer-checked:bg-amber-400/10 text-center transition-all">
                <p class="text-xs text-slate-400">Ukuran</p>
                <p class="text-sm font-bold text-white">${v.size}</p>
                <p class="text-xs font-semibold text-amber-400 mt-1">Rp ${(v.price - (v.price * (product.discount/100))).toLocaleString('id-ID')}</p>
            </div>
        </label>
    `).join('');

    const initialPrice = variants[0].price;
    const initialFinalPrice = initialPrice - (initialPrice * (product.discount / 100));

    container.innerHTML = `
        <!-- Left Column: Gambar -->
        <div class="glass-card rounded-3xl p-4 overflow-hidden flex items-center justify-center">
            <img src="${product.image || 'https://placehold.co/600x600/1e293b/d4af37?text=Perfume'}" 
                 alt="${product.name}" 
                 class="w-full max-h-[500px] object-cover rounded-2xl shadow-2xl">
        </div>

        <!-- Right Column: Informasi Detail -->
        <div class="space-y-6">
            <div>
                <span class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    ${product.brand}
                </span>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-white mt-3">${product.name}</h1>
                <p class="text-xs text-slate-400 mt-1">Status: <span class="font-semibold ${product.stock === 'Ready Stock' ? 'text-emerald-400' : 'text-rose-400'}">${product.stock}</span></p>
            </div>

            <!-- Harga & Diskon -->
            <div class="glass-card p-4 rounded-2xl flex items-baseline gap-3">
                <span id="display-final-price" class="text-3xl font-extrabold text-amber-400">
                    Rp ${initialFinalPrice.toLocaleString('id-ID')}
                </span>
                ${product.discount > 0 ? `
                    <span id="display-original-price" class="text-sm text-slate-500 line-through">
                        Rp ${initialPrice.toLocaleString('id-ID')}
                    </span>
                    <span class="px-2 py-0.5 text-xs font-bold rounded bg-rose-600 text-white">
                        -${product.discount}%
                    </span>
                ` : ''}
            </div>

            <!-- Varian Ukuran -->
            <div>
                <h3 class="text-xs font-semibold uppercase text-slate-400 mb-2">Pilih Varian Ukuran</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    ${variantHTML}
                </div>
            </div>

            <!-- Karakteristik Parfum (Grid 3 Kolom) -->
            <div class="grid grid-cols-3 gap-3">
                <div class="glass-card p-3.5 rounded-xl text-center">
                    <i class="fa-solid fa-clock text-purple-400 text-lg mb-1"></i>
                    <p class="text-[10px] text-slate-400 uppercase">Waktu Penggunaan</p>
                    <p class="text-xs font-bold text-white mt-0.5">${usageTime}</p>
                </div>
                <div class="glass-card p-3.5 rounded-xl text-center">
                    <i class="fa-solid fa-building-user text-amber-400 text-lg mb-1"></i>
                    <p class="text-[10px] text-slate-400 uppercase">Lingkungan</p>
                    <p class="text-xs font-bold text-white mt-0.5">${environment}</p>
                </div>
                <div class="glass-card p-3.5 rounded-xl text-center">
                    <i class="fa-solid fa-hourglass-half text-emerald-400 text-lg mb-1"></i>
                    <p class="text-[10px] text-slate-400 uppercase">Ketahanan</p>
                    <p class="text-xs font-bold text-white mt-0.5">${longevity}</p>
                </div>
            </div>

            <!-- Fragrance Notes -->
            <div class="glass-card p-5 rounded-2xl space-y-3">
                <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <i class="fa-solid fa-wind text-amber-400"></i> Fragrance Notes
                </h3>
                <div class="space-y-2 text-xs">
                    <div class="flex justify-between border-b border-slate-800 pb-1.5">
                        <span class="text-slate-400 font-medium">Top Notes:</span>
                        <span class="text-slate-200 font-semibold">${notes.top}</span>
                    </div>
                    <div class="flex justify-between border-b border-slate-800 pb-1.5">
                        <span class="text-slate-400 font-medium">Middle Notes:</span>
                        <span class="text-slate-200 font-semibold">${notes.middle}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400 font-medium">Base Notes:</span>
                        <span class="text-slate-200 font-semibold">${notes.base}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
});

// Function ubah harga saat varian diklik
function updateSelectedPrice(price, discount) {
    price = parseFloat(price);
    const finalPrice = price - (price * (discount / 100));
    
    document.getElementById('display-final-price').innerText = `Rp ${finalPrice.toLocaleString('id-ID')}`;
    const origPriceElem = document.getElementById('display-original-price');
    if (origPriceElem) {
        origPriceElem.innerText = `Rp ${price.toLocaleString('id-ID')}`;
    }
}