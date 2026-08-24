const DB_KEY = "darkstore";
const OWNER_WA = "60194939829";

// DATA AWAL
const DEFAULT_DATA = {
    nama: "DARK STORE",
    user: "admin",
    pass: "admin123",
    produk: [
        { id:1, kategori:"Free Fire", nama:"50 Diamond FF", harga:"RM3.50", desc:"Proses 1-5 Minit", icon:"💎" },
        { id:2, kategori:"Free Fire", nama:"140 Diamond FF", harga:"RM8.50", desc:"Proses 1-5 Minit", icon:"💎" },
        { id:3, kategori:"Free Fire", nama:"355 Diamond FF", harga:"RM19.50", desc:"Proses 1-5 Minit", icon:"💎" },
        { id:4, kategori:"Mobile Legends", nama:"86 Diamond ML", harga:"RM5.50", desc:"Proses 1-5 Minit", icon:"💠" },
        { id:5, kategori:"Mobile Legends", nama:"257 Diamond ML", harga:"RM14.50", desc:"Proses 1-5 Minit", icon:"💠" },
        { id:6, kategori:"Boost Service", nama:"100 Followers WA", harga:"RM1.00", desc:"Siap dalam 1 jam", icon:"📈" },
        { id:7, kategori:"Boost Service", nama:"500 Followers WA", harga:"RM5.00", desc:"Siap dalam 2 jam", icon:"📈" },
        { id:8, kategori:"Promoter", nama:"Promote 119 Group", harga:"RM1.00", desc:"Promosi luas", icon:"📢" }
    ]
};

// INISIALISASI DATABASE
function initDB() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
    }
}

function getDB() { return JSON.parse(localStorage.getItem(DB_KEY)); }
function saveDB(data) { localStorage.setItem(DB_KEY, JSON.stringify(data)); }

// BUAT PESANAN WHATSAPP
function buatPesanan(namaProduk, harga) {
    const teks = `Hai DARK STORE! Saya nak order:\n\n📦 ${namaProduk}\n💰 Harga: ${harga}\n\nTerima kasih!`;
    const link = `https://wa.me/${OWNER_WA}?text=${encodeURIComponent(teks)}`;
    window.open(link, '_blank');
}

// LOAD PRODUK DI HALAMAN UTAMA
function loadProduk() {
    const db = getDB();
    const container = document.getElementById('productList');
    if (!container) return;
    
    container.innerHTML = '';
    db.produk.forEach(p => {
        container.innerHTML += `
            <div class="product-card">
                <div class="product-img">${p.icon}</div>
                <div class="product-name">${p.nama}</div>
                <div class="product-desc">${p.desc}</div>
                <div class="product-price">${p.harga}</div>
                <button class="buy-btn" onclick="buatPesanan('${p.nama}', '${p.harga}')">🛒 BELI SEKARANG</button>
            </div>
        `;
    });
}

// ========== ADMIN FUNCTIONS ==========
function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const db = getDB();
    if (user === db.user && pass === db.pass) {
        localStorage.setItem('darkstore_login', 'ok');
        window.location.href = 'dashboard.html';
    } else {
        alert('❌ Login gagal! Username atau password salah.');
    }
}

function checkLogin() {
    if (localStorage.getItem('darkstore_login') !== 'ok') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('darkstore_login');
    window.location.href = 'login.html';
}

function loadDashboard() {
    const db = getDB();
    document.getElementById('totalProduk').textContent = db.produk.length;
}

function loadProdukAdmin() {
    const db = getDB();
    const container = document.getElementById('produkList');
    if (!container) return;
    
    container.innerHTML = '';
    if (db.produk.length === 0) {
        container.innerHTML = `<tr><td colspan="6" class="empty-state"><i class="fa-solid fa-box"></i><p>Belum ada produk</p></td></tr>`;
        return;
    }
    
    db.produk.forEach((p, index) => {
        container.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${p.icon}</td>
                <td>${p.kategori}</td>
                <td>${p.nama}</td>
                <td>${p.harga}</td>
                <td>
                    <button class="btn btn-sm btn-red" onclick="padamProduk(${p.id})">🗑️ Hapus</button>
                </td>
            </tr>
        `;
    });
}

function tambahProduk() {
    const db = getDB();
    const kategori = document.getElementById('prodKategori').value.trim();
    const nama = document.getElementById('prodNama').value.trim();
    const harga = document.getElementById('prodHarga').value.trim();
    const desc = document.getElementById('prodDesc').value.trim();
    const icon = document.getElementById('prodIcon').value.trim() || '📦';
    
    if (!kategori || !nama || !harga) {
        alert('⚠️ Lengkapi nama, kategori & harga!');
        return;
    }
    
    db.produk.push({
        id: Date.now(),
        kategori: kategori,
        nama: nama,
        harga: harga,
        desc: desc || 'Proses 1-5 Minit',
        icon: icon
    });
    
    saveDB(db);
    alert('✅ Produk ditambah!');
    document.getElementById('prodForm').reset();
    loadProdukAdmin();
}

function padamProduk(id) {
    if (!confirm('⚠️ Pasti hapus produk ini?')) return;
    const db = getDB();
    db.produk = db.produk.filter(p => p.id !== id);
    saveDB(db);
    loadProdukAdmin();
}

// AUTO LOAD
document.addEventListener('DOMContentLoaded', function() {
    initDB();
    
    if (document.getElementById('productList')) loadProduk();
    if (document.getElementById('totalProduk')) loadDashboard();
    if (document.getElementById('produkList')) loadProdukAdmin();
});
         
