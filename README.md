# 🧪 SecangLab & E-LKPD Etnosains Kimia

<div align="center">

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-candzaki.github.io%2Fsecang--edu--app-8f1525?style=for-the-badge&logo=github)](https://candzaki.github.io/secang-edu-app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Kurikulum](https://img.shields.io/badge/Kurikulum-Merdeka%20Fase%20F%20%2F%20SMA%20%26%20PT-2e7d32?style=for-the-badge)](docs/LKPD_Ekstraksi_Kayu_Secang.md)
[![Institusi](https://img.shields.io/badge/Afiliasi-Universitas%20Negeri%20Semarang%20(UNNES)-ffb100?style=for-the-badge)](https://unnes.ac.id)

**Media Pembelajaran Kimia Interaktif & Lembar Kerja Peserta Didik (E-LKPD) Digital Berbasis Etnosains Pewarna Alami Batik Nusantara**  
*Riset Terstandar: Pengaruh Suhu Ekstraksi terhadap Intensitas Warna Ekstrak Kayu Secang (Caesalpinia sappan L.)*

[🌐 Buka Aplikasi Langsung](https://candzaki.github.io/secang-edu-app/) &nbsp;|&nbsp; [📖 E-LKPD Lengkap](docs/LKPD_Ekstraksi_Kayu_Secang.md) &nbsp;|&nbsp; [📋 Instrumen Evaluasi](docs/Instrumen_Evaluasi_Prototype_1.md)

</div>

---

## 📌 Ringkasan Proyek

**SecangLab** adalah platform media edukasi kimia berbasis web (*progressive web app*) yang mengintegrasikan kearifan lokal (*indigenous knowledge*) tradisi pewarnaan batik Nusantara dari kayu secang (*Caesalpinia sappan L.*) ke dalam sains ilmiah (*scientific knowledge*) kimia bahan alam.

Aplikasi ini mengadopsi model **Inkuiri Terbimbing (*Guided Inquiry*)** dan **Segitiga Representasi Johnstone (*Makroskopik, Submikroskopik, dan Simbolik*)** untuk memfasilitasi peserta didik dalam memahami:
1. **Termodinamika & Kinetika Ekstraksi:** Fenomena difusi termal, degradasi kromofor kuinon, dan penentuan suhu optimum ($60^\circ\text{C}$).
2. **Kimia Koordinasi & Mordan:** Pembentukan kompleks khelat antara brazilein dengan ion logam tawas ($\text{Al}^{3+}$), kapur tohor ($\text{Ca}^{2+}$), dan tunjung ($\text{Fe}^{2+}$).
3. **Spektroskopi UV-Vis & Hukum Beer-Lambert:** Analisis absorbansi ($A = \varepsilon \cdot b \cdot c$) pada panjang gelombang serapan maksimum ($\lambda_{\text{maks}}$ 443–458 nm).
4. **Sifat Optik Koloid:** Uji hamburan cahaya Efek Tyndall menggunakan sinar laser digital.

---

## 🎨 Desain & Pengalaman Pengguna (Motion & UI Atelier)

Aplikasi dirancang dengan estetika editorial akademik nusantara dan teknologi antarmuka modern:
* **Palet Warna Alami Secang & Batik:** *Secang Ruby Crimson* (`#8f1525`), *Amber Gold* (`#e6a15c`), kuali tembaga kuno, dan kain linen mori alami.
* **Modern Kinetic Motion:** Dynamic marquee banner, interactive cards hover-tilt, smooth accordion cards untuk 4 variasi mordan fiksasi, dan status badge bercahaya (*breathing glow*).
* **Representasi Molekuler 3D Real-Time:** Simulasi struktur molekul Brazilin ($\text{C}_{16}\text{H}_{14}\text{O}_5$) dan Brazilein ($\text{C}_{16}\text{H}_{12}\text{O}_5$) dengan kanvas partikel interaktif.
* **Taktil & Responsif:** Kompatibel penuh dari layar smartphone genggam (*mobile-first*), tablet, hingga layar desktop beresolusi tinggi.

---

## 🌟 Modul & Fitur Unggulan

### 1. 🧪 Virtual Lab Simulator Ekstraksi Termostatik
* Kontrol suhu ekstraksi presisi ($40^\circ\text{C}$ hingga $100^\circ\text{C}$) dengan *preset* cepat ($40^\circ\text{C}$, $50^\circ\text{C}$, $60^\circ\text{C}$ [Optimum], $70^\circ\text{C}$, $80^\circ\text{C}$, $100^\circ\text{C}$ [Degradasi Termal]).
* Beker kaca Pyrex bertekstur realistis dengan animasi partikel kayu secang (40 mesh) dan perubahan rona warna cairan fluida secara gradual.
* **Spektrofotometer UV-Vis Terintegrasi:** Menghitung absorbansi aktual, rendemen ekstrak (%), dan kurva spektrum Gauss serapan cahaya (380–620 nm).
* **Uji Hamburan Laser Tyndall:** Eksplorasi optik partikel koloid ekstrak secang vs larutan sejati.

### 2. 👘 Galeri Fiksasi 4 Mordan Batik (Accordion Motion)
* Eksplorasi perubahan rona warna kain mori batik berdasarkan ion logam mordan:
  * **Tanpa Mordan:** Jingga-merah alami (kontrol).
  * **Tawas / Alum ($\text{Al}^{3+}$):** Kompleks merah terang stabil tahan luntur.
  * **Kapur Sirih / Lime ($\text{Ca}^{2+}$):** Merah keunguan gelap karena suasana basa dan khelat kalsium.
  * **Tunjung / Iron ($\text{Fe}^{2+}$):** Ungu kehitaman pekat (*bathochromic shift*) khas kain batik sogan klasik.
* Dilengkapi visualisasi rumus struktur kompleks khelat koordinasi.

### 3. 📝 E-LKPD Interaktif & Cetak PDF Otomatis
* Lembar Kerja Peserta Didik digital lengkap dari Rumusan Masalah, Hipotesis, Tabel Data Percobaan, hingga Analisis Pertanyaan HOTS.
* **Auto-Save:** Semua jawaban siswa tersimpan aman secara otomatis di penyimpanan peramban (*localStorage*).
* **Ekspor PDF A4:** Tombol satu kali klik untuk mencetak hasil LKPD siswa dalam format PDF standar akademik siap kumpul.

### 4. 🧠 Kuis HOTS & Audio Narator
* 5 butir soal pilihan ganda berpikir kritis tingkat tinggi (*High-Order Thinking Skills*) dengan skor otomatis dan pembahasan konseptual komprehensif.
* Audio narator pengiring interaktif berbasis *Web Audio API Synthesizer*.

---

## 📂 Struktur Berkas Proyek

```
secang-edu-app/
├── index.html        # Kerangka utama aplikasi & E-LKPD terpadu
├── style.css         # Desain sistem, CSS motion tokens, layout responsive, & media cetak
├── app.js            # Engine simulasi termal, kanvas molekuler, kalkulasi UV-Vis, & state
├── package.json      # Metadata proyek, author, skrip, dan dependensi
├── LICENSE           # Lisensi Open-Source (MIT)
├── README.md         # Dokumentasi resmi proyek
├── assets/           # Gambar aset riset, logo UNNES, dokumentasi ekstraksi
│   ├── logo_unnes.png
│   ├── lambang_unnes.jpg
│   ├── bab1/         # Dokumentasi tradisi membatik
│   ├── bab2/         # Dokumentasi serutan kayu secang & struktur molekul
│   └── bab3/         # Dokumentasi ekstraksi laboratorium
└── docs/             # Berkas pendukung akademik & instrumen penelitian
    ├── LKPD_Ekstraksi_Kayu_Secang.md      # Lembar LKPD tertulis lengkap
    ├── Instrumen_Evaluasi_Prototype_1.md  # Instrumen uji validitas & kepraktisan
    └── Prototyping_1.md                   # Naskah perancangan prototipe awal
```

---

## 💻 Panduan Menjalankan Secara Lokal

Karena proyek ini dibangun menggunakan **Vanilla HTML5, Modern CSS, dan Vanilla JavaScript murni**, aplikasi ini tidak membutuhkan *node build runner* yang berat.

### Menjalankan Server Lokal:
```bash
# Clone repository
git clone https://github.com/candzaki/secang-edu-app.git

# Masuk ke direktori
cd secang-edu-app

# Jalankan server lokal (pilih salah satu)
# Opsi 1: Python 3
python3 -m http.server 3000

# Opsi 2: Node.js npx serve
npx serve .
```
Buka browser favorit Anda di: **`http://localhost:3000`**

---

## 👨‍💻 Pengembang & Hak Cipta

* **Penulis / Pengembang:** [candzaki](https://github.com/candzaki)
* **Afiliasi:** Program Studi Pendidikan Kimia / Laboratorium Kimia Bahan Alam, Universitas Negeri Semarang (UNNES)
* **Lisensi:** [MIT License](LICENSE) &copy; 2026 candzaki

---

<div align="center">
  <i>Dikembangkan dengan dedikasi untuk pelestarian etnosains Nusantara dan kemajuan pendidikan kimia berbasis teknologi digital interaktif.</i>
</div>
