const DB_KEY = "darkstorepro";

const DEFAULT_DATA = {
    nama: "DARK STORE",
    wa: "60194939829",
    user: "dark",
    pass: "dark123",
    kategori: ["Free Fire", "Mobile Legends", "Boost Service"],
    produk: [
        { id: 1, nama: "50 Diamond Free Fire", harga: "10000", stok: 999, kategori: "Free Fire", gambar: "", deskripsi: "Proses 1-5 Minit" },
        { id: 2, nama: "140 Diamond Free Fire", harga: "25000", stok: 999, kategori: "Free Fire", gambar: "", deskripsi: "Proses 1-5 Minit" },
        { id: 3, nama: "86 Diamonds Mobile Legends", harga: "20000", stok: 999, kategori: "Mobile Legends", gambar: "", deskripsi: "Proses 1-5 Minit" },
        { id: 4, nama: "Boost Channel WhatsApp", harga: "1000", stok: 999, kategori: "Boost Service", gambar: "", deskripsi: "100-1000 Followers" }
    ],
    order: [],
    banner: []
};

function initDB() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
    }
}

function getDB() {
    return JSON.parse(localStorage.getItem(DB_KEY));
}

function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function formatRupiah(angka) {
    const num = parseInt(angka);
    if (isNaN(num)) return "RM 0";
    return "RM " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function tutupSidebar() {
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function scrollToProduk() {
    document.getElementById('produkSection').scrollIntoView({ behavior: 'smooth' });
}

function loadBanner() {
    const db = getDB();
    const container = document.getElementById('banner-section');
    if (!container) return;
    container.innerHTML = '';
    if (db.banner.length === 0) return;
    db.banner.forEach(b => {
        container.innerHTML += `<img src="${b.gambar}" alt="${b.tajuk}" class="banner-img">`;
    });
}

let kategoriSemasa = 'all';

function pilihKategori(kategori, el) {
    kategoriSemasa = kategori;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    loadProduk();
}

function loadKategoriTabs() {
    const db = getDB();
    const container = document.getElementById('categoryTabs');
    if (!container) return;
    container.innerHTML = `<button class="tab active" onclick="pilihKategori('all', this)">Semua</button>`;
    db.kategori.forEach(k => {
        container.innerHTML += `<button class="tab" onclick="pilihKategori('${k}', this)">${k}</button>`;
    });
}

function loadProduk() {
    const db = getDB();
    const container = document.getElementById('produk-list');
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const waLink = document.getElementById('waLink');
    const sideWA = document.getElementById('sideWA');
    
    if (waLink) waLink.href = `https://wa.me/${db.wa}`;
    if (sideWA) sideWA.href = `https://wa.me/${db.wa}`;
    if (!container) return;
    
    let filtered = db.produk.filter(p => {
        const matchSearch = p.nama.toLowerCase().includes(search) || p.kategori.toLowerCase().includes(search);
        const matchKategori = kategoriSemasa === 'all' || p.kategori === kategoriSemasa;
        return matchSearch && matchKategori;
    });
    
    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state" style="grid-column: span 2;"><i class="fa-solid fa-box-open"></i><p>Tiada produk dijumpai</p></div>`;
        return;
    }
    
    filtered.forEach(p => {
        const gambar = p.gambar || "https://via.placeholder.com/70x70/161B22/FFC107?text=💎";
        container.innerHTML += `
            <div class="produk-card">
                <img src="${gambar}" alt="${p.nama}" class="produk-img" onerror="this.src='https://via.placeholder.com/70x70/161B22/FFC107?text=💎'">
                <div class="produk-nama">${p.nama}</div>
                <div class="produk-harga">${formatRupiah(p.harga)}</div>
                <div class="produk-stok">Stok: ${p.stok}</div>
                <button class="order-btn" onclick="order('${p.nama}')">Order WA</button>
            </div>
        `;
    });
}

function searchProduk() { loadProduk(); }

function order(namaProduk) {
    const db = getDB();
    const pesananBaru = {
        id: Date.now(),
        produk: namaProduk,
        tarikh: new Date().toLocaleString('ms-MY'),
        status: "Baru"
    };
    db.order.unshift(pesananBaru);
    saveDB(db);
    const mesej = encodeURIComponent(`Saya nak order ${namaProduk}`);
    window.open(`https://wa.me/${db.wa}?text=${mesej}`, '_blank');
}

function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const db = getDB();
    if (user === db.user && pass === db.pass) {
        localStorage.setItem('darkstorepro_login', 'ok');
        window.location.href = 'dashboard.html';
    } else {
        alert('❌ Login Gagal — Username atau Password salah!');
    }
}

function checkLogin() {
    if (localStorage.getItem('darkstorepro_login') !== 'ok') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('darkstorepro_login');
    window.location.href = 'login.html';
}

function loadAdminProduk() {
    const db = getDB();
    const container = document.getElementById('admin-produk');
    if (!container) return;
    container.innerHTML = '';
    if (db.produk.length === 0) {
        container.innerHTML = `<tr><td colspan="6" class="empty-state"><p>Tiada produk. <a href="tambah.html" style="color:var(--gold)">Tambah sekarang</a></p></td></tr>`;
        return;
    }
    db.produk.forEach(p => {
        const gambar = p.gambar ? `<img src="${p.gambar}" width="40" height="40" style="border-radius:4px;object-fit:cover">` : '💎';
        container.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${gambar}</td>
                <td>${p.nama}</td>
                <td>${formatRupiah(p.harga)}</td>
                <td>${p.kategori}</td>
                <td>
                    <button class="btn btn-sm btn-gold" onclick="editProduk(${p.id})">Edit</button>
                    <button class="btn btn-sm btn-red" onclick="padamProduk(${p.id})">Padam</button>
                </td>
            </tr>
        `;
    });
}

async function simpanProduk() {
    const db = getDB();
    const idEdit = document.getElementById('editId')?.value || '';
    const nama = document.getElementById('prodNama').value.trim();
    const harga = document.getElementById('prodHarga').value.trim();
    const stok = document.getElementById('prodStok').value.trim();
    const kategori = document.getElementById('prodKategori').value;
    const deskripsi = document.getElementById('prodDesc').value.trim();
    const gambarInput = document.getElementById('prodGambar');
    
    if (!nama || !harga || !stok || !kategori) {
        alert('⚠️ Semua medan wajib diisi!');
        return;
    }
    
    let gambarBase64 = '';
    if (gambarInput.files && gambarInput.files[0]) {
        gambarBase64 = await toBase64(gambarInput.files[0]);
    }
    
    if (idEdit) {
        const index = db.produk.findIndex(p => p.id === parseInt(idEdit));
        if (index !== -1) {
            db.produk[index] = {
                ...db.produk[index], nama, harga, stok: parseInt(stok), kategori, deskripsi,
                gambar: gambarBase64 || db.produk[index].gambar
            };
        }
        alert('✅ Produk dikemaskini!');
    } else {
        const idBaru = db.produk.length > 0 ? Math.max(...db.produk.map(p => p.id)) + 1 : 1;
        db.produk.push({ id: idBaru, nama, harga, stok: parseInt(stok), kategori, deskripsi, gambar: gambarBase64 });
        alert('✅ Produk berjaya ditambah!');
    }
    saveDB(db);
    window.location.href = 'produk.html';
}

function editProduk(id) {
    window.location.href = `tambah.html?edit=${id}`;
}

function padamProduk(id) {
    if (!confirm('⚠️ Pasti nak padam produk ini?')) return;
    const db = getDB();
    db.produk = db.produk.filter(p => p.id !== id);
    saveDB(db);
    loadAdminProduk();
}

function loadEditData() {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');
    if (!editId) return;
    const db = getDB();
    const produk = db.produk.find(p => p.id === parseInt(editId));
    if (!produk) return;
    
    document.getElementById('editId').value = produk.id;
    document.getElementById('prodNama').value = produk.nama;
    document.getElementById('prodHarga').value = produk.harga;
    document.getElementById('prodStok').value = produk.stok;
    document.getElementById('prodKategori').value = produk.kategori;
    document.getElementById('prodDesc').value = produk.deskripsi || '';
    
    if (produk.gambar) {
        const preview = document.getElementById('gambarPreview');
        if (preview) preview.innerHTML = `<img src="${produk.gambar}" class="preview-img">`;
    }
    const btn = document.querySelector('.btn-gold');
    if (btn) btn.innerHTML = '💾 KEMASKINI PRODUK';
}

function loadKategoriSelect() {
    const db = getDB();
    const select = document.getElementById('prodKategori');
    if (!select) return;
    select.innerHTML = '';
    db.kategori.forEach(k => {
        select.innerHTML += `<option value="${k}">${k}</option>`;
    });
}

function tambahKategori() {
    const db = getDB();
    const nama = document.getElementById('catName').value.trim();
    if (!nama) { alert('⚠️ Nama kategori wajib diisi!'); return; }
    if (db.kategori.includes(nama)) { alert('⚠️ Kategori sudah wujud!'); return; }
    db.kategori.push(nama);
    saveDB(db);
    alert('✅ Kategori ditambah!');
    loadKategori();
    document.getElementById('catName').value = '';
}

function loadKategori() {
    const db = getDB();
    const container = document.getElementById('kategori-list');
    if (!container) return;
    container.innerHTML = '';
    if (db.kategori.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>Belum ada kategori</p></div>`;
        return;
    }
    db.kategori.forEach((k, i) => {
        container.innerHTML += `
            <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-card);padding:14px 18px;border-radius:8px;border:1px solid var(--border);margin-bottom:10px">
                <span style="font-weight:600">📂 ${k}</span>
                <button class="btn btn-sm btn-red" onclick="padamKategori(${i})">Padam</button>
            </div>
        `;
    });
}

function padamKategori(index) {
    if (!confirm('⚠️ Pasti nak padam kategori ini?')) return;
    const db = getDB();
    db.kategori.splice(index, 1);
    saveDB(db);
    loadKategori();
}

function loadOrder() {
    const db = getDB();
    const container = document.getElementById('order-list');
    if (!container) return;
    container.innerHTML = '';
    if (db.order.length === 0) {
        container.innerHTML = `<tr><td colspan="5" class="empty-state"><p>Belum ada pesanan</p></td></tr>`;
        return;
    }
    db.order.forEach(o => {
        const statusColor = o.status === "Selesai" ? "var(--green)" : "var(--gold)";
        container.innerHTML += `
            <tr>
                <td>${o.id}</td>
                <td>${o.produk}</td>
                <td>${o.tarikh}</td>
                <td><span style="color:${statusColor};font-weight:600">${o.status}</span></td>
                <td>
                    ${o.status !== "Selesai" ? `<button class="btn btn-sm btn-green" onclick="updateOrderStatus(${o.id})">✅ Selesai</button>` : ''}
                    <button class="btn btn-sm btn-red" onclick="padamOrder(${o.id})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

function updateOrderStatus(id) {
    const db = getDB();
    const order = db.order.find(o => o.id === id);
    if (order) { order.status = "Selesai"; saveDB(db); loadOrder(); }
}

function padamOrder(id) {
    if (!confirm('⚠️ Padam pesanan ini?')) return;
    const db = getDB();
    db.order = db.order.filter(o => o.id !== id);
    saveDB(db);
    loadOrder();
}

async function tambahBanner() {
    const db = getDB();
    const tajuk = document.getElementById('bannerTajuk').value.trim();
    const gambarInput = document.getElementById('bannerGambar');
    if (!gambarInput.files || !gambarInput.files[0]) { alert('⚠️ Sila pilih gambar!'); return; }
    const gambarBase64 = await toBase64(gambarInput.files[0]);
    db.banner.push({ tajuk: tajuk || "", gambar: gambarBase64 });
    saveDB(db);
    alert('✅ Banner ditambah!');
    loadBannerAdmin();
    document.getElementById('bannerTajuk').value = '';
    gambarInput.value = '';
}

function loadBannerAdmin() {
    const db = getDB();
    const container = document.getElementById('banner-list');
    if (!container) return;
    container.innerHTML = '';
    if (db.banner.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>Belum ada banner</p></div>`;
        return;
    }
    db.banner.forEach((b, i) => {
        container.innerHTML += `
            <div style="background:var(--bg-card);padding:16px;border-radius:8px;border:1px solid var(--border);margin-bottom:12px">
                <img src="${b.gambar}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-weight:600">${b.tajuk || "Banner " + (i+1)}</span>
                    <button class="btn btn-sm btn-red" onclick="padamBanner(${i})">Padam</button>
                </div>
            </div>
        `;
    });
}

function padamBanner(index) {
    if (!confirm('⚠️ Padam banner ini?')) return;
    const db = getDB();
    db.banner.splice(index, 1);
    saveDB(db);
    loadBannerAdmin();
    loadBanner();
}

function loadSetting() {
    const db = getDB();
    const nama = document.getElementById('setNama');
    const wa = document.getElementById('setWA');
    const user = document.getElementById('setUser');
    if (nama) nama.value = db.nama;
    if (wa) wa.value = db.wa;
    if (user) user.value = db.user;
}

function simpanSetting() {
    const db = getDB();
    const nama = document.getElementById('setNama').value.trim();
    const wa = document.getElementById('setWA').value.trim();
    const user = document.getElementById('setUser').value.trim();
    const pass = document.getElementById('setPass').value.trim();
    if (!nama || !wa || !user) { alert('⚠️ Medan wajib diisi!'); return; }
    db.nama = nama;
    db.wa = wa;
    db.user = user;
    if (pass) db.pass = pass;
    saveDB(db);
    alert('✅ Tetapan disimpan!');
    loadSetting();
}

function exportData() {
    const db = getDB();
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-darkstore-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('✅ Backup berjaya dimuat turun!');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!confirm('⚠️ Ini akan menimpa semua data sedia ada! Pasti nak teruskan?')) {
        event.target.value = '';
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            saveDB(data);
            alert('✅ Data berjaya diimport! Halaman akan dimuat semula...');
            location.reload();
        } catch (err) {
            alert('❌ Fail tidak sah! Pastikan fail JSON yang betul.');
        }
    };
    reader.readAsText(file);
}

function loadDashboard() {
    const db = getDB();
    const produkEl = document.getElementById('stat-produk');
    const katEl = document.getElementById('stat-kategori');
    const orderEl = document.getElementById('stat-order');
    const baruEl = document.getElementById('stat-baru');
    if (produkEl) produkEl.textContent = db.produk.length;
    if (katEl) katEl.textContent = db.kategori.length;
    if (orderEl) orderEl.textContent = db.order.length;
    if (baruEl) baruEl.textContent = db.order.filter(o => o.status === "Baru").length;
}

document.addEventListener('DOMContentLoaded', function() {
    initDB();
    if (document.getElementById('produk-list')) { loadKategoriTabs(); loadProduk(); loadBanner(); }
    if (document.getElementById('stat-produk')) { checkLogin(); loadDashboard(); }
    if (document.getElementById('admin-produk')) { checkLogin(); loadAdminProduk(); }
    if (document.getElementById('prodKategori')) { checkLogin(); loadKategoriSelect(); loadEditData(); }
    if (document.getElementById('kategori-list')) { checkLogin(); loadKategori(); }
    if (document.getElementById('order-list')) { checkLogin(); loadOrder(); }
    if (document.getElementById('banner-list')) { checkLogin(); loadBannerAdmin(); }
    if (document.getElementById('setNama')) { checkLogin(); loadSetting(); }
});
      
