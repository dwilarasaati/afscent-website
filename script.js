// Tailwind Custom Configuration
tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    500: '#a855f7',
                    600: '#9333ea',
                    800: '#6b21a8',
                    900: '#581c87',
                    gold: '#d4af37',
                    dark: '#0f172a'
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            }
        }
    }
};

// ==========================================
// KONFIGURASI TOKO
// ==========================================
// Ganti nomor ini dengan nomor WhatsApp toko Anda (gunakan awalan 62)
const STORE_WA_NUMBER = "6285151223430"; 

let currentSelectedProduct = null;
let currentSelectedVariant = null;

// Initial Mock Data dengan Detail Spesifikasi
let products = [
    {
        id: 1,
        name: "Mykonos Vanilla Clouds EDP 50ml",
        brand: "Mykonos",
        price: 189000,
        discount: 15,
        stock: "Ready Stock",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400",
        variants: [
            { size: "50ml", price: 189000 },
            { size: "100ml", price: 320000 }
        ],
        notes: { top: "Vanilla, Marshmallow", middle: "Freesia, Coconut", base: "Sweet Amber, Musk" },
        usageTime: "Siang & Malam",
        environment: "Indoor & Outdoor",
        longevity: "6 - 8 Jam"
    },
    {
        id: 2,
        name: "Velixir Extrait de Parfum - Velvet Oud",
        brand: "Velixir",
        price: 249000,
        discount: 20,
        stock: "Ready Stock",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=400",
        variants: [
            { size: "30ml", price: 249000 },
            { size: "50ml", price: 380000 }
        ],
        notes: { top: "Agarwood, Saffron", middle: "Rose, Patchouli", base: "Amber, Dark Oud" },
        usageTime: "Malam Hari",
        environment: "Indoor / Formal",
        longevity: "8 - 12 Jam"
    },
    {
        id: 3,
        name: "Mykonos Slow Living EDP",
        brand: "Mykonos",
        price: 179000,
        discount: 0,
        stock: "Out of Stock",
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=400",
        variants: [
            { size: "50ml", price: 179000 }
        ],
        notes: { top: "Bergamot, Fresh Lemon", middle: "Green Tea, Rose", base: "White Cedar, Musk" },
        usageTime: "Siang Hari",
        environment: "Outdoor & Casual",
        longevity: "4 - 6 Jam"
    },
    {
        id: 4,
        name: "Velixir Midnight Amber 100ml",
        brand: "Velixir",
        price: 299000,
        discount: 10,
        stock: "Ready Stock",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400",
        variants: [
            { size: "50ml", price: 299000 },
            { size: "100ml", price: 499000 }
        ],
        notes: { top: "Black Pepper, Spices", middle: "Amber, Incense", base: "Smokey Leather, Wood" },
        usageTime: "Malam Hari",
        environment: "Indoor",
        longevity: "8 - 10 Jam"
    }
];

let finances = [
    { id: 1, type: "income", desc: "Penjualan 2x Mykonos Vanilla Clouds", amount: 321300, date: "2026-11-01" },
    { id: 2, type: "expense", desc: "Restock Stok Velixir 10 Botol", amount: 1500000, date: "2026-11-02" },
    { id: 3, type: "income", desc: "Penjualan 1x Velixir Velvet Oud", amount: 199200, date: "2026-11-03" }
];

let selectedBrandFilter = 'ALL';
let chartInstance = null;

// Initialize App
window.onload = function() {
    loadFromLocalStorage();
    renderCustomerCatalog();
    renderAdminProducts();
    renderFinances();
    initChart();
};

// Local Storage Helpers
function saveToLocalStorage() {
    localStorage.setItem('perfume_products', JSON.stringify(products));
    localStorage.setItem('perfume_finances', JSON.stringify(finances));
}

function loadFromLocalStorage() {
    const storedProd = localStorage.getItem('perfume_products');
    const storedFin = localStorage.getItem('perfume_finances');
    if(storedProd) products = JSON.parse(storedProd);
    if(storedFin) finances = JSON.parse(storedFin);
}

// Tab Switching Logic
function switchTab(tab) {
    const custView = document.getElementById('customer-view');
    const adminView = document.getElementById('admin-view');
    const custBtn = document.getElementById('tab-customer');
    const adminBtn = document.getElementById('tab-admin');

    if(tab === 'customer') {
        custView.classList.remove('hidden');
        adminView.classList.add('hidden');
        if(custBtn) custBtn.className = "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-purple-600 text-white shadow-md";
        if(adminBtn) adminBtn.className = "px-5 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all duration-300";
    } else {
        custView.classList.add('hidden');
        adminView.classList.remove('hidden');
        if(adminBtn) adminBtn.className = "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-purple-600 text-white shadow-md";
        if(custBtn) custBtn.className = "px-5 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all duration-300";
        
        setTimeout(() => { if (chartInstance) chartInstance.update(); }, 100);
    }
}

// Filter Brand Handler
function setBrandFilter(brand) {
    selectedBrandFilter = brand;
    const buttons = document.querySelectorAll('#brand-filters button');
    buttons.forEach(btn => {
        if(btn.innerText.toUpperCase() === brand.toUpperCase() || (brand === 'ALL' && btn.innerText === 'Semua')) {
            btn.className = "brand-btn bg-amber-500 text-slate-950 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md";
        } else {
            btn.className = "brand-btn bg-slate-800 text-slate-300 hover:bg-slate-700 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all";
        }
    });
    renderCustomerCatalog();
}

// Render Customer Catalog Grid
function renderCustomerCatalog() {
    const grid = document.getElementById('customer-products-grid');
    if(!grid) return;
    const searchInput = document.getElementById('catalog-search').value.toLowerCase();

    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchInput) || p.brand.toLowerCase().includes(searchInput);
        const matchesBrand = (selectedBrandFilter === 'ALL') || (p.brand.toLowerCase() === selectedBrandFilter.toLowerCase());
        return matchesSearch && matchesBrand;
    });

    if(filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center text-slate-500">
                <i class="fa-solid fa-box-open text-5xl mb-3 text-slate-600"></i>
                <p class="text-sm">Tidak ada parfum yang ditemukan.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const finalPrice = p.price - (p.price * (p.discount / 100));
        const isReady = p.stock === "Ready Stock";

        return `
            <div onclick="openDetailModal(${p.id})" class="glass-card rounded-2xl overflow-hidden group hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer">
                <div class="relative aspect-square overflow-hidden bg-slate-900">
                    <img src="${p.image || 'https://placehold.co/400x400/1e293b/d4af37?text=Perfume'}" 
                         alt="${p.name}" 
                         onerror="this.src='https://placehold.co/400x400/1e293b/d4af37?text=Perfume'"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    
                    <!-- Badges -->
                    <div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-slate-900/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                            ${p.brand}
                        </span>
                        ${p.discount > 0 ? `
                            <span class="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg bg-rose-600 text-white shadow-md">
                                PROMO ${p.discount}%
                            </span>
                        ` : ''}
                    </div>

                    <!-- Stock Status Badge -->
                    <div class="absolute bottom-3 right-3">
                        <span class="px-2.5 py-1 text-[11px] font-semibold rounded-lg backdrop-blur-md border ${
                            isReady 
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' 
                            : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                        }">
                            <i class="fa-solid fa-circle text-[8px] mr-1 ${isReady ? 'text-emerald-400 animate-pulse' : 'text-rose-400'}"></i>
                            ${p.stock}
                        </span>
                    </div>
                </div>

                <div class="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                        <h4 class="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-2">${p.name}</h4>
                    </div>

                    <div class="flex items-baseline gap-2">
                        <span class="text-lg font-extrabold text-amber-400">
                            Rp ${finalPrice.toLocaleString('id-ID')}
                        </span>
                        ${p.discount > 0 ? `
                            <span class="text-xs text-slate-500 line-through">
                                Rp ${p.price.toLocaleString('id-ID')}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Admin Table
function renderAdminProducts() {
    const tbody = document.getElementById('admin-product-table-body');
    if(!tbody) return;
    document.getElementById('kpi-items').innerText = `${products.length} Item`;

    if(products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500">Belum ada data produk.</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(p => {
        const finalPrice = p.price - (p.price * (p.discount / 100));
        const isReady = p.stock === "Ready Stock";

        return `
            <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="py-3.5 px-4 font-semibold text-white flex items-center gap-3">
                    <img src="${p.image || 'https://placehold.co/100x100/1e293b/d4af37?text=P'}" class="w-9 h-9 rounded-lg object-cover bg-slate-900 border border-slate-700">
                    <span class="truncate max-w-[200px]">${p.name}</span>
                </td>
                <td class="py-3.5 px-4"><span class="px-2 py-0.5 rounded text-xs bg-slate-800 text-amber-300 border border-slate-700">${p.brand}</span></td>
                <td class="py-3.5 px-4 text-slate-400">Rp ${p.price.toLocaleString('id-ID')}</td>
                <td class="py-3.5 px-4">
                    ${p.discount > 0 ? `<span class="text-rose-400 font-bold">${p.discount}%</span>` : `<span class="text-slate-600">0%</span>`}
                </td>
                <td class="py-3.5 px-4 font-bold text-emerald-400">Rp ${finalPrice.toLocaleString('id-ID')}</td>
                <td class="py-3.5 px-4">
                    <span class="px-2.5 py-1 text-[11px] font-semibold rounded-lg ${isReady ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}">
                        ${p.stock}
                    </span>
                </td>
                <td class="py-3.5 px-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="editProduct(${p.id})" class="p-1.5 text-slate-400 hover:text-amber-400 transition-colors" title="Edit">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button onclick="deleteProduct(${p.id})" class="p-1.5 text-slate-400 hover:text-rose-400 transition-colors" title="Hapus">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Add / Edit Modal Logic
function openProductModal(id = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('modal-title');

    form.reset();
    document.getElementById('prod-id').value = '';

    if(id) {
        title.innerText = "Edit Produk Parfum";
        const item = products.find(p => p.id === id);
        if(item) {
            document.getElementById('prod-id').value = item.id;
            document.getElementById('prod-name').value = item.name;
            document.getElementById('prod-brand').value = item.brand;
            document.getElementById('prod-stock').value = item.stock;
            document.getElementById('prod-price').value = item.price;
            document.getElementById('prod-discount').value = item.discount;
            document.getElementById('prod-image').value = item.image || '';
        }
    } else {
        title.innerText = "Tambah Produk Parfum Baru";
    }

    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

function handleSaveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    const name = document.getElementById('prod-name').value;
    const brand = document.getElementById('prod-brand').value;
    const stock = document.getElementById('prod-stock').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const discount = parseFloat(document.getElementById('prod-discount').value) || 0;
    const image = document.getElementById('prod-image').value;

    if(id) {
        const idx = products.findIndex(p => p.id == id);
        if(idx !== -1) {
            products[idx] = { ...products[idx], name, brand, stock, price, discount, image };
            showToast("Produk berhasil diperbarui!");
        }
    } else {
        const newProd = {
            id: Date.now(),
            name,
            brand,
            stock,
            price,
            discount,
            image,
            variants: [{ size: "50ml", price: price }],
            notes: { top: "Citrus", middle: "Floral", base: "Woody" },
            usageTime: "Siang & Malam",
            environment: "Indoor & Outdoor",
            longevity: "6 - 8 Jam"
        };
        products.push(newProd);
        showToast("Produk baru berhasil ditambahkan!");
    }

    saveToLocalStorage();
    renderAdminProducts();
    renderCustomerCatalog();
    closeProductModal();
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    if(confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        products = products.filter(p => p.id !== id);
        saveToLocalStorage();
        renderAdminProducts();
        renderCustomerCatalog();
        showToast("Produk berhasil dihapus!");
    }
}

// Finance Tracker Logic
function handleAddFinance(e) {
    e.preventDefault();
    const type = document.getElementById('fin-type').value;
    const desc = document.getElementById('fin-desc').value;
    const amount = parseFloat(document.getElementById('fin-amount').value);

    const newFin = {
        id: Date.now(),
        type,
        desc,
        amount,
        date: new Date().toISOString().split('T')[0]
    };

    finances.unshift(newFin);
    saveToLocalStorage();
    renderFinances();
    document.getElementById('finance-form').reset();
    showToast("Catatan keuangan disimpan!");
}

function renderFinances() {
    let totalIncome = 0;
    let totalExpense = 0;

    finances.forEach(f => {
        if(f.type === 'income') totalIncome += f.amount;
        else totalExpense += f.amount;
    });

    const netProfit = totalIncome - totalExpense;

    if(document.getElementById('kpi-income')) document.getElementById('kpi-income').innerText = `Rp ${totalIncome.toLocaleString('id-ID')}`;
    if(document.getElementById('kpi-expense')) document.getElementById('kpi-expense').innerText = `Rp ${totalExpense.toLocaleString('id-ID')}`;
    if(document.getElementById('kpi-profit')) document.getElementById('kpi-profit').innerText = `Rp ${netProfit.toLocaleString('id-ID')}`;

    const list = document.getElementById('finance-history-list');
    if(list) {
        if(finances.length === 0) {
            list.innerHTML = `<p class="text-xs text-slate-500 py-2">Belum ada transaksi recorded.</p>`;
        } else {
            list.innerHTML = finances.slice(0, 5).map(f => `
                <div class="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div class="flex items-center gap-2.5">
                        <i class="fa-solid ${f.type === 'income' ? 'fa-arrow-down text-emerald-400' : 'fa-arrow-up text-rose-400'}"></i>
                        <div>
                            <p class="font-semibold text-slate-200">${f.desc}</p>
                            <p class="text-[10px] text-slate-500">${f.date}</p>
                        </div>
                    </div>
                    <span class="font-bold ${f.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}">
                        ${f.type === 'income' ? '+' : '-'} Rp ${f.amount.toLocaleString('id-ID')}
                    </span>
                </div>
            `).join('');
        }
    }

    if(chartInstance) {
        chartInstance.data.datasets[0].data = [totalIncome, totalExpense];
        chartInstance.update();
    }
}

// Chart.js Setup
function initChart() {
    const elem = document.getElementById('financeChart');
    if(!elem) return;
    const ctx = elem.getContext('2d');
    
    let totalIncome = finances.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    let totalExpense = finances.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pemasukan', 'Pengeluaran'],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: ['#10b981', '#f43f5e'],
                borderColor: '#0f172a',
                borderWidth: 4,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: {
                            family: 'Plus Jakarta Sans',
                            size: 12
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Toast Helper
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    if(!toast || !msg) return;
    msg.innerText = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Function Buka Modal Detail Produk
function openDetailModal(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;

    currentSelectedProduct = p;

    const variants = p.variants || [
        { size: "50ml", price: p.price },
        { size: "100ml", price: Math.round(p.price * 1.7) }
    ];
    currentSelectedVariant = variants[0];

    const notes = p.notes || { top: "Citrus, Pear", middle: "Jasmine, Vanilla", base: "Amber, Musk" };
    const usageTime = p.usageTime || "Siang & Malam";
    const environment = p.environment || "Indoor & Outdoor";
    const longevity = p.longevity || "6 - 8 Jam";

    const initialPrice = variants[0].price;
    const initialFinalPrice = initialPrice - (initialPrice * (p.discount / 100));

    const variantHTML = variants.map((v, index) => `
        <label class="cursor-pointer">
            <input type="radio" name="modal-size" value="${v.price}" data-size="${v.size}" ${index === 0 ? 'checked' : ''} onchange="updateModalPrice(this.value, '${v.size}', ${p.discount})" class="peer hidden">
            <div class="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 peer-checked:border-amber-400 peer-checked:bg-amber-400/10 text-center transition-all">
                <p class="text-[10px] text-slate-400">Ukuran</p>
                <p class="text-xs font-bold text-white">${v.size}</p>
                <p class="text-[10px] font-semibold text-amber-400">Rp ${(v.price - (v.price * (p.discount/100))).toLocaleString('id-ID')}</p>
            </div>
        </label>
    `).join('');

    const modalBody = document.getElementById('detail-modal-body');
    modalBody.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Gambar Produk -->
            <div class="glass-card p-2 rounded-xl overflow-hidden flex items-center justify-center bg-slate-900">
                <img src="${p.image || 'https://placehold.co/400x400'}" alt="${p.name}" class="w-full aspect-square object-cover rounded-lg">
            </div>

            <!-- Detail Info -->
            <div class="space-y-4">
                <div>
                    <span class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">${p.brand}</span>
                    <h2 class="text-xl font-bold text-white mt-2">${p.name}</h2>
                    <p class="text-xs text-slate-400 mt-0.5">Status: <span class="${p.stock === 'Ready Stock' ? 'text-emerald-400' : 'text-rose-400'} font-semibold">${p.stock}</span></p>
                </div>

                <!-- Harga -->
                <div class="glass-card p-3 rounded-xl flex items-baseline gap-2">
                    <span id="modal-final-price" class="text-2xl font-extrabold text-amber-400">Rp ${initialFinalPrice.toLocaleString('id-ID')}</span>
                    ${p.discount > 0 ? `<span id="modal-orig-price" class="text-xs text-slate-500 line-through">Rp ${initialPrice.toLocaleString('id-ID')}</span>` : ''}
                </div>

                <!-- Varian Ukuran -->
                <div>
                    <p class="text-xs font-semibold text-slate-400 uppercase mb-2">Pilih Varian Ukuran</p>
                    <div class="grid grid-cols-2 gap-2">${variantHTML}</div>
                </div>

                <!-- Characteristics Grid -->
                <div class="grid grid-cols-3 gap-2 text-center">
                    <div class="glass-card p-2 rounded-lg">
                        <i class="fa-solid fa-clock text-purple-400 text-xs"></i>
                        <p class="text-[9px] text-slate-400 uppercase mt-1">Waktu</p>
                        <p class="text-xs font-bold text-white">${usageTime}</p>
                    </div>
                    <div class="glass-card p-2 rounded-lg">
                        <i class="fa-solid fa-building-user text-amber-400 text-xs"></i>
                        <p class="text-[9px] text-slate-400 uppercase mt-1">Tempat</p>
                        <p class="text-xs font-bold text-white">${environment}</p>
                    </div>
                    <div class="glass-card p-2 rounded-lg">
                        <i class="fa-solid fa-hourglass-half text-emerald-400 text-xs"></i>
                        <p class="text-[9px] text-slate-400 uppercase mt-1">Ketahanan</p>
                        <p class="text-xs font-bold text-white">${longevity}</p>
                    </div>
                </div>

                <!-- Notes -->
                <div class="glass-card p-3 rounded-xl text-xs space-y-1">
                    <p class="font-bold text-amber-400 uppercase text-[10px] tracking-wider mb-1">Fragrance Notes</p>
                    <p class="text-slate-300"><span class="text-slate-500">Top:</span> ${notes.top}</p>
                    <p class="text-slate-300"><span class="text-slate-500">Middle:</span> ${notes.middle}</p>
                    <p class="text-slate-300"><span class="text-slate-500">Base:</span> ${notes.base}</p>
                </div>

                <!-- Tombol Pesan via WhatsApp -->
                <div class="pt-2">
                    <a id="wa-order-btn" 
                       href="${generateWALink(p, variants[0].size, initialFinalPrice)}" 
                       target="_blank" 
                       class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${p.stock !== 'Ready Stock' ? 'opacity-50 pointer-events-none' : ''}">
                        <i class="fa-brands fa-whatsapp text-lg"></i>
                        ${p.stock === 'Ready Stock' ? 'Pesan Sekarang via WhatsApp' : 'Stok Habis'}
                    </a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('detail-modal').classList.remove('hidden');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.add('hidden');
}

function updateModalPrice(price, size, discount) {
    price = parseFloat(price);
    const finalPrice = price - (price * (discount / 100));
    
    currentSelectedVariant = { size, price };

    document.getElementById('modal-final-price').innerText = `Rp ${finalPrice.toLocaleString('id-ID')}`;
    const origElem = document.getElementById('modal-orig-price');
    if (origElem) origElem.innerText = `Rp ${price.toLocaleString('id-ID')}`;

    const waBtn = document.getElementById('wa-order-btn');
    if (waBtn && currentSelectedProduct) {
        waBtn.href = generateWALink(currentSelectedProduct, size, finalPrice);
    }
}

function generateWALink(product, size, price) {
    const textMessage = `Halo Afscent Sangatta, saya mau pesan parfum ini:\n\n` +
                        `*Nama Produk:* ${product.name}\n` +
                        `*Brand:* ${product.brand}\n` +
                        `*Ukuran:* ${size}\n` +
                        `*Harga:* Rp ${price.toLocaleString('id-ID')}\n\n` +
                        `Apakah produk ini masih ready stok?`;

    return `https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(textMessage)}`;
}