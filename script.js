const DB_KEY = "darkstore";
const OWNER_WA = "60194939829";
let PRODUK_DIPILIH = null;

// ==========================================
// 1. INISIALISASI DATA AWAL
// ==========================================
function initData() {
    if (!localStorage.getItem(DB_KEY)) {
        const dataAwal = {
            user: "admin",
            pass: "admin123",
            kategori: [
                { id: 1, nama: "Free Fire", icon: "🔥", jenis: "diamond" },
                { id: 2, nama: "Mobile Legends", icon: "⚔️", jenis: "diamond" },
                { id: 3, nama: "Boost Service", icon: "📈", jenis: "boost" },
                { id: 4, nama: "Promoter", icon: "📢", jenis: "boost" }
            ],
            produk: [
                { id: 1, kategori_id: 1, nama: "50 Diamond FF", harga: "RM3.50", proses: "Proses 1-5 Minit" },
                { id: 2, kategori_id: 1, nama: "140 Diamond FF", harga: "RM8.50", proses: "Proses 1-5 Minit" },
                { id: 3, kategori_id: 2, nama: "86 Diamond ML", harga: "RM5.50", proses: "Proses 1-5 Minit" },
                { id: 4, kategori_id: 3, nama: "100 Followers WA", harga: "RM1.00", proses: "Siap dalam 1 jam" },
                { id: 5, kategori_id: 3, nama: "500 Followers WA", harga: "RM5.00", proses: "Siap dalam 2 jam" },
                { id: 6, kategori_id: 4, nama: "Promote 119 Group", harga: "RM1.00", proses: "Promosi luas" }
            ]
        };
        localStorage.setItem(DB_KEY, JSON.stringify(dataAwal));
    }
}

function getDB() {
    return JSON.parse(localStorage.getItem(DB_KEY));
}

function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
}

// ==========================================
// 2. FUNGSI KATEGORI — SIMPAN, LOAD, EDIT, PADAM
// ==========================================
function simpanKategori() {
    const db = getDB();
    const nama = document.getElementById('namaKategori').value.trim();
    const icon = document.getElementById('ikonKategori').value.trim() || '📦';
    const jenis = document.getElementById('jenisKategori').value;
    const editId = document.getElementById('editKatId').value;

    if (!nama) {
        alert('⚠️ Sila isi nama kategori!');
        return;
    }

    if (editId) {
        // EDIT MODE
        const idx = db.kategori.findIndex(k => k.id === parseInt(editId));
        if (idx !== -1) {
            db.kategori[idx] = { id: parseInt(editId), nama, icon, jenis };
        }
        alert('✅ Kategori dikemaskini!');
        document.getElementById('editKatId').value = '';
        document.getElementById('katFormTitle').textContent = '➕ Tambah Kategori Baru';
        document.getElementById('katBtn').textContent = '💾 SIMPAN KATEGORI';
    } else {
        // TAMBAH BARU
        db.kategori.push({
            id: Date.now(),
            nama: nama,
            icon: icon,
            jenis: jenis
        });
        alert('✅ Kategori ditambah!');
    }

    saveDB(db);
    document.getElementById('formKategori').reset();
    loadTabelKategori();
    loadDropdownKategori();
}

function loadTabelKategori() {
    const db = getDB();
    const tbody = document.getElementById('tabel-kategori');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (db.kategori.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:#8B949E">
            <i class="fa-solid fa-tags" style="font-size:30px;opacity:0.3"></i>
            <p>Belum ada kategori</p>
        </td></tr>`;
        return;
    }

    db.kategori.forEach((k, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${k.icon}</td>
                <td>${k.nama}</td>
                <td><span style="background:${k.jenis==='diamond'?'rgba(255,193,7,0.2)':'rgba(34,197,94,0.2)'};padding:2px 8px;border-radius:4px;font-size:12px">${k.jenis==='diamond'?'💎 Diamond':'📈 Boost'}</span></td>
                <td>
                    <button class="btn btn-sm btn-gold" onclick="editKategori(${k.id})">Edit</button>
                    <button class="btn btn-sm btn-red" onclick="padamKategori(${k.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function editKategori(id) {
    const db = getDB();
    const kat = db.kategori.find(k => k.id === id);
    if (!kat) return;

    document.getElementById('editKatId').value = kat.id;
    document.getElementById('namaKategori').value = kat.nama;
    document.getElementById('ikonKategori').value = kat.icon;
    document.getElementById('jenisKategori').value = kat.jenis;
    document.getElementById('katFormTitle').textContent = '✏️ Edit Kategori';
    document.getElementById('katBtn').textContent = '🔄 UPDATE KATEGORI';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function padamKategori(id) {
    if (!confirm('⚠️ Pasti hapus kategori ini? Produk tak akan hilang.')) return;
    const db = getDB();
    db.kategori = db.kategori.filter(k => k.id !== id);
    saveDB(db);
    loadTabelKategori();
    loadDropdownKategori();
}

function resetKategoriForm() {
    document.getElementById('editKatId').value = '';
    document.getElementById('katFormTitle').textContent = '➕ Tambah Kategori Baru';
    document.getElementById('katBtn').textContent = '💾 SIMPAN KATEGORI';
    document.getElementById('formKategori').reset();
}

// ==========================================
// 3. FUNGSI PRODUK — SIMPAN, LOAD, EDIT, PADAM
// ==========================================
function loadDropdownKategori() {
    const db = getDB();
    const select = document.getElementById('selectKategori');
    if (!select) return;

    select.innerHTML = '';
    db.kategori.forEach(k => {
        select.innerHTML += `<option value="${k.id}">${k.icon} ${k.nama}</option>`;
    });
}

function simpanProduk() {
    const db = getDB();
    const kategori_id = parseInt(document.getElementById('selectKategori').value);
    const nama = document.getElementById('namaProduk').value.trim();
    const harga = document.getElementById('hargaProduk').value.trim();
    const proses = document.getElementById('prosesProduk').value.trim() || 'Proses 1-5 Minit';
    const editId = document.getElementById('editProdId').value;

    if (!kategori_id || !nama || !harga) {
        alert('⚠️ Sila lengkapi kategori, nama & harga!');
        return;
    }

    if (editId) {
        // EDIT MODE
        const idx = db.produk.findIndex(p => p.id === parseInt(editId));
        if (idx !== -1) {
            db.produk[idx] = { id: parseInt(editId), kategori_id, nama, harga, proses };
        }
        alert('✅ Produk dikemaskini!');
        document.getElementById('editProdId').value = '';
        document.getElementById('prodFormTitle').textContent = '➕ Tambah Produk Baru';
        document.getElementById('prodBtn').textContent = '💾 SIMPAN PRODUK';
    } else {
        // TAMBAH BARU
        db.produk.push({
            id: Date.now(),
            kategori_id: kategori_id,
            nama: nama,
            harga: harga,
            proses: proses
        });
        alert('✅ Produk ditambah!');
    }

    saveDB(db);
    document.getElementById('formProduk').reset();
    loadTabelProduk();
}

function loadTabelProduk() {
    const db = getDB();
    const tbody = document.getElementById('tabel-produk');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (db.produk.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#8B949E">
            <i class="fa-solid fa-box" style="font-size:30px;opacity:0.3"></i>
            <p>Belum ada produk</p>
        </td></tr>`;
        return;
    }

    db.produk.forEach((p, index) => {
        const kat = db.kategori.find(k => k.id === p.kategori_id);
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${kat ? kat.icon : '❓'}</td>
                <td>${kat ? kat.nama : 'Lain-lain'}</td>
                <td>${p.nama}</td>
                <td>${p.harga}</td>
                <td>
                    <button class="btn btn-sm btn-gold" onclick="editProduk(${p.id})">Edit</button>
                    <button class="btn btn-sm btn-red" onclick="padamProduk(${p.id})">Hapus</button>
                </td>
            </tr>
        `;
    });
}

function editProduk(id) {
    const db = getDB();
    const p = db.produk.find(x => x.id === id);
    if (!p) return;

    document.getElementById('editProdId').value = p.id;
    document.getElementById('selectKategori').value = p.kategori_id;
    document.getElementById('namaProduk').value = p.nama;
    document.getElementById('hargaProduk').value = p.harga;
    document.getElementById('prosesProduk').value = p.proses;
    document.getElementById('prodFormTitle').textContent = '✏️ Edit Produk';
    document.getElementById('prodBtn').textContent = '🔄 UPDATE PRODUK';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function padamProduk(id) {
    if (!confirm('⚠️ Pasti hapus produk ini?')) return;
    const db = getDB();
    db.produk = db.produk.filter(p => p.id !== id);
    saveDB(db);
    loadTabelProduk();
}

function resetProdukForm() {
    document.getElementById('editProdId').value = '';
    document.getElementById('prodFormTitle').textContent = '➕ Tambah Produk Baru';
    document.getElementById('prodBtn').textContent = '💾 SIMPAN PRODUK';
    document.getElementById('formProduk').reset();
}

// ==========================================
// 4. HALAMAN UTAMA — FILTER & PRODUK
// ==========================================
function bukaBorang(idProduk) {
    const db = getDB();
    PRODUK_DIPILIH = db.produk.find(p => p.id === idProduk);
    if (!PRODUK_DIPILIH) return;

    const kat = db.kategori.find(k => k.id === PRODUK_DIPILIH.kategori_id);
    const jenis = kat ? kat.jenis : "diamond";

    document.getElementById('modalProdukNama').textContent = `${PRODUK_DIPILIH.nama} — ${PRODUK_DIPILIH.harga}`;
    document.getElementById('borangDiamond').style.display = 'none';
    document.getElementById('borangBoost').style.display = 'none';

    if (jenis === "diamond") {
        document.getElementById('borangDiamond').style.display = 'block';
        document.getElementById('buyerNama').value = '';
        document.getElementById('buyerId').value = '';
        document.getElementById('buyerPhone').value = '';
        document.getElementById('buyerNote').value = 'Online';
    } else {
        document.getElementById('borangBoost').style.display = 'block';
        document.getElementById('buyerNama2').value = '';
        document.getElementById('buyerLink').value = '';
        document.getElementById('buyerPhone2').value = '';
        document.getElementById('buyerNote2').value = '';
    }

    document.getElementById('orderModal').style.display = 'flex';
}

function tutupModal() {
    document.getElementById('orderModal').style.display = 'none';
    PRODUK_DIPILIH = null;
}

function hantarPesanan() {
    if (!PRODUK_DIPILIH) return;
    const db = getDB();
    const kat = db.kategori.find(k => k.id === PRODUK_DIPILIH.kategori_id);
    const jenis = kat ? kat.jenis : "diamond";

    let teks = `🛒 PESANAN BARU — DARK STORE\n`;
    teks += `━━━━━━━━━━━━━━━━━━━━\n`;
    teks += `📦 SENARAI BARANG:\n`;
    teks += `✅ ${PRODUK_DIPILIH.nama} — ${PRODUK_DIPILIH.harga}\n`;
    teks += `━━━━━━━━━━━━━━━━━━━━\n`;

    if (jenis === "diamond") {
        const nama = document.getElementById('buyerNama').value.trim() || "Tidak Dinamakan";
        const id = document.getElementById('buyerId').value.trim();
        const phone = document.getElementById('buyerPhone').value.trim() || "Tiada";
        const note = document.getElementById('buyerNote').value.trim() || "Online";

        if (!id) { alert('⚠️ Sila masukkan Player ID!'); return; }

        teks += `👤 Nama: ${nama}\n`;
        teks += `🎮 Player ID: ${id}\n`;
        teks += `📱 No. Telefon: ${phone}\n`;
        teks += `📍 Alamat: ${note}\n`;
        teks += `💳 Cara Bayaran: QRIS / DuitNow\n`;
        teks += `━━━━━━━━━━━━━━━━━━━━\n`;
        teks += `💰 JUMLAH: ${PRODUK_DIPILIH.harga}\n`;
    } else {
        const nama = document.getElementById('buyerNama2').value.trim() || "Tidak Dinamakan";
        const link = document.getElementById('buyerLink').value.trim();
        const phone = document.getElementById('buyerPhone2').value.trim() || "Tiada";
        const note = document.getElementById('buyerNote2').value.trim() || "-";

        if (!link) { alert('⚠️ Sila masukkan link channel/group!'); return; }

        teks += `👤 Nama: ${nama}\n`;
        teks += `🔗 Link: ${link}\n`;
        teks += `📱 No. Telefon: ${phone}\n`;
        teks += `💬 Catatan: ${note}\n`;
        teks += `💳 Cara Bayaran: QRIS / DuitNow\n`;
        teks += `━━━━━━━━━━━━━━━━━━━━\n`;
        teks += `💰 JUMLAH: ${PRODUK_DIPILIH.harga}\n`;
    }

    teks += `\nTerima kasih kerana membeli di\n💎 DARK STORE!`;

    const linkWA = `https://wa.me/${OWNER_WA}?text=${encodeURIComponent(teks)}`;
    window.open(linkWA, '_blank');
    tutupModal();
}

function loadFilterKategori() {
    const db = getDB();
    const container = document.getElementById('filterBar');
    if (!container) return;

    let html = `<button class="filter-btn active" data-kategori="all">Semua</button>`;
    db.kategori.forEach(k => {
        html += `<button class="filter-btn" data-kategori="${k.id}">${k.icon} ${k.nama}</button>`;
    });
    container.innerHTML = html;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const katId = this.getAttribute('data-kategori');
            loadProdukByKategori(katId);
        });
    });
}

function loadProdukByKategori(kategoriId = 'all') {
    const db = getDB();
    const container = document.getElementById('productList');
    if (!container) return;

    let produkList = db.produk;
    if (kategoriId !== 'all') {
        produkList = db.produk.filter(p => p.kategori_id === parseInt(kategoriId));
    }

    container.innerHTML = '';
    if (produkList.length === 0) {
        container.innerHTML = `<div class="empty-state" style="grid-column:1/-1;padding:40px"><i class="fa-solid fa-box-open"></i><p>Tiada produk dalam kategori ini</p></div>`;
        return;
    }

    produkList.forEach(p => {
        const kat = db.kategori.find(k => k.id === p.kategori_id);
        container.innerHTML += `
            <div class="product-card">
                <div class="product-img">${kat ? kat.icon : '📦'}</div>
                <div class="product-name">${p.nama}</div>
                <div class="product-desc">${p.proses}</div>
                <div class="product-price">${p.harga}</div>
                <button class="buy-btn" onclick="bukaBorang(${p.id})">🛒 BELI SEKARANG</button>
            </div>
        `;
    });
}

// ==========================================
// 5. ADMIN: LOGIN & NAVIGASI
// ==========================================
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

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    document.querySelectorAll('.admin-sidebar nav a').forEach(a => a.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// ==========================================
// 6. AUTO LOAD SEMUA FUNGSI
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initData();

    // Halaman Utama
    if (document.getElementById('filterBar')) loadFilterKategori();
    if (document.getElementById('productList')) loadProdukByKategori('all');

    // Admin Dashboard
    if (document.getElementById('tabel-kategori')) loadTabelKategori();
    if (document.getElementById('selectKategori')) loadDropdownKategori();
    if (document.getElementById('tabel-produk')) loadTabelProduk();
});
            
