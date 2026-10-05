# SecangLab & E-LKPD Etnosains Kimia

Aplikasi Pembelajaran Kimia Interaktif & Lembar Kerja Peserta Didik (LKPD) Digital berbasis Etnosains Pewarna Alami Batik Nusantara dan Riset Laboratorium Terstandar (RAL Faktorial Universitas Negeri Semarang).

> **Judul Riset Rujukan:**
> *"Pengaruh Suhu Ekstraksi terhadap Intensitas Warna Ekstrak Kayu Secang (*Caesalpinia sappan L.*) sebagai Pewarna Alami"*
> *(Sumber: miniriset2 / Laboratorium Kimia Bahan Alam Universitas Negeri Semarang)*

---

## 🎨 Desain Sistem: *Atelier Etnosains & Laboratorium Riset Bahan Alam*
Aplikasi ini dirancang dengan estetika berkelas, humanis, dan bebas dari tampilan generik AI:
* **Palet Warna Alami Secang & Batik:** Paduan warna alami pigmen kayu secang (*brazilein ruby crimson*, *amber wood*, kuali kuningan antik, dan kertas linen/arsip hangat).
* **Tipografi Editorial Akademik:** Kombinasi *Playfair Display* untuk wibawa kop naskah resmi dan narasi etnografi, *Plus Jakarta Sans* untuk keterbacaan instruksi, dan *JetBrains Mono* untuk presisi instrumen spektroskopi digital.
* **Ikonografi Vektor Presisi:** Menggantikan emoji generik dengan ikon vektor garis tipis (*academic stroke icons*) yang elegan.
* **Aparatus Laboratorium Taktil:** Visualisasi *thermostatic waterbath* bertekstur baja polesan (*brushed stainless steel*), labu kaca Pyrex bergradasi volume nyata, serta spektrum serapan UV-Vis dinamis.
* **Dialog Interaktif & Toast:** Menggantikan pop-up bawaan browser (*window.alert*) dengan kartu modal interaktif untuk uji mordan dan notifikasi *toast* mengambang.

---

## 🌟 Fitur Utama Aplikasi

1. **E-LKPD Interaktif Berstandar Kurikulum Merdeka (Fase F / SMA & Universitas):**
   - Disusun menggunakan model **Inkuiri Terbimbing & Etnosains**.
   - Input langsung identitas siswa, rumusan masalah, hipotesis, tabel pengamatan laboratorium, analisis tiga level representasi, dan pertanyaan HOTS.
   - **Penyimpanan Otomatis (*Auto-save*):** Seluruh isian siswa tersimpan otomatis di *localStorage* peramban.
   - **Fitur Ekspor / Cetak PDF Resmi:** Dilengkapi tombol *Cetak LKPD (PDF)* dengan format A4 yang bersih dan rapi.

2. **Virtual Lab Simulator Ekstraksi Termostatik:**
   - Kontrol suhu ekstraksi interaktif ($40^\circ\text{C}$ hingga $100^\circ\text{C}$) dengan *preset* cepat ($40^\circ\text{C}$, $50^\circ\text{C}$, $60^\circ\text{C}$ [Optimum], $70^\circ\text{C}$, $80^\circ\text{C}$, $100^\circ\text{C}$ [Degradasi Termal]).
   - Pilihan pelarut ramah lingkungan: Akuades murni vs Bio-etanol 50%.
   - Animasi beker pemanas *thermostatic waterbath* dengan partikel simplisia 40-mesh melayang dan transisi rona warna fluida real-time.
   - **Spektrofotometer UV-Vis Interaktif:** Pembacaan panjang gelombang maksimum ($\lambda_{\text{maks}}$ 443–458 nm), nilai absorbansi ($A$), rendemen (%), dan koordinat warna CIE $a^*$.
   - **Grafik Spektrum Serapan Dinamis (Canvas Chart):** Visualisasi kurva serapan 380–620 nm berdasarkan formula Gaussian spektral riil.
   - **Simulasi Fiksasi Mordan Batik:** Uji kain mori tanpa mordan, mordan tawas ($\text{Al}^{3+}$), air kapur sirih ($\text{Ca}^{2+}$/basa), dan uji asam jeruk nipis.
   - **Tombol Sinkronisasi:** Sekali klik untuk menyalin data simulator ke tabel pengamatan E-LKPD siswa.

3. **3 Tingkat Representasi Kimia (Johnstone's Triangle):**
   - **Makroskopik:** Pengamatan fisik serutan kayu, perubahan rona larutan, kejernihan, dan stabilitas warna kain batik.
   - **Submikroskopik:** Mekanisme oksidasi molekul brazilin ($\text{C}_{16}\text{H}_{14}\text{O}_5$) menjadi brazilein ($\text{C}_{16}\text{H}_{12}\text{O}_5$), kromofor kuinon planar terkonjugasi $\pi \to \pi^*$, serta dekomposisi termolabil cincin piran pada suhu tinggi.
   - **Simbolik:** Persamaan stoikiometri redoks, Hukum Beer-Lambert ($A = \varepsilon b C$), formula rendemen gravimetri, dan persamaan kinetika degradasi Arrhenius ($k = A e^{-E_a/RT}$).

4. **Etnosains & Rekonstruksi Epistemologis:**
   - Profil dan transkrip wawancara otentik perajin batik tradisional (Bapak Mulyadi).
   - Matriks konversi pengetahuan asli masyarakat (*indigenous science*) menjadi sains ilmiah kimia (*scientific science*).
   - Galeri foto dokumentasi kayu secang dan tradisi membatik.

5. **Kuis Evaluasi Pemahaman HOTS:**
   - 5 butir soal pilihan ganda berpikir kritis tingkat tinggi dengan penilaian skor otomatis dan pembahasan konseptual mendalam.

6. **Panduan & Rubrik Guru:**
   - Pedoman penyelenggaraan praktikum kimia skala mikro hemat biaya (*green chemistry*) di sekolah.
   - Rubrik penilaian kinerja dan laporan lembar kerja 4 tingkatan skor.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dibangun menggunakan teknologi web murni (*Vanilla HTML5, CSS3, & Modern JavaScript*) tanpa ketergantungan *heavy framework*, sehingga sangat ringan, cepat, dan dapat langsung dibuka.

### Opsi 1: Menjalankan dengan Python Local Server
Buka terminal dan jalankan:
```bash
cd /Users/calvindzki/.gemini/antigravity-ide/scratch/secang-edu-app
python3 -m http.server 8080
```
Buka peramban di: `http://localhost:8080`

### Opsi 2: Membuka Langsung File HTML
Buka file `index.html` langsung dengan peramban favorit Anda (Chrome, Safari, Firefox, Edge).

---

## 🖨️ Cara Mencetak LKPD Menjadi PDF

1. Buka aplikasi di peramban.
2. Pastikan Anda berada pada tab **📖 E-LKPD Interaktif** (atau klik tombol **Cetak LKPD (PDF)** di pojok kanan atas).
3. Dialog cetak peramban (*Print Dialog*) akan otomatis terbuka.
4. Pada opsi *Destination / Tujuan*, pilih **Save as PDF / Simpan sebagai PDF**.
5. Kertas telah diformat khusus secara otomatis menjadi ukuran A4 dengan tata letak lembar kerja resmi yang rapi, bersih, dan siap dicetak/dikumpulkan.

---

## 📁 Struktur Berkas

```
secang-edu-app/
├── index.html                 # Halaman utama aplikasi dan shell E-LKPD
├── style.css                  # Sistem desain, variabel warna, responsive & print media
├── app.js                     # Simulasi termal, chart canvas, state manager, kuis HOTS
├── LKPD_Ekstraksi_Kayu_Secang.md # Dokumen LKPD teks lengkap siap salin / cetak
├── README.md                  # Panduan penggunaan dan dokumentasi fitur
└── assets/                    # Gambar asli dari riset miniriset2
    ├── logo_unnes.png
    ├── bab1/pewarnaan_batik_secang.jpg
    ├── bab2/secang_dan_ekstrak.jpg
    ├── bab2/struktur_brazilin_brazilein.jpg
    ├── bab2/4c.jpg
    └── bab3/ekstraksi_lab.jpg
```
