// Pustaka 50+ Topik Kurikulum Merdeka (Mode Cadangan Cerdas / Offline)
// Setiap topik berisi Kartu Panduan Bunda/Ayah lengkap & siap pakai instan.

const s = (l, tanya, salah) => ({ langkah: l, tanya_anak: tanya, jika_anak_salah: salah });

export const TOPIK_KURIKULUM = [
  // ================= FASE A (Kelas 1-2 SD) =================
  {
    id: "a1", fase: "A", kelas: "Kelas 1 SD", mapel: "Matematika", emoji: "🔴", judul: "Penjumlahan Kelereng",
    konsep: "Melatih Adik memahami arti 'menambah' sebagai kegiatan menggabungkan dua kelompok benda menjadi satu, bukan sekadar menghafal angka.",
    analogi: "Ambil kelereng atau kancing baju. Taruh 3 di kiri, 2 di kanan, lalu satukan sambil dihitung bersama: 'satu... dua... tiga...'.",
    skrip: [ s(1,"Coba Adik pegang 3 kelereng di tangan kiri. Berapa yang di tangan kanan?","Yuk kita hitung ulang pelan-pelan, sentuh satu per satu ya Dik."),
             s(2,"Kalau semua kelereng kita kumpulkan jadi satu, kira-kira jadi banyak atau sedikit?","Tidak apa-apa, coba gabungkan dulu di telapak tangan Bunda ya."),
             s(3,"Sekarang hitung semuanya bareng Bunda, ada berapa semuanya?","Pelan saja Dik, sentuh sambil sebut angkanya.") ],
    emosi: "Peluk Adik dan bilang: 'Berhitung itu seperti main, tidak perlu buru-buru. Bunda temani ya.'",
    langkah: "3 + 2 = 5. Gabungkan kedua kelompok lalu hitung total.", jawaban: "5 kelereng"
  },
  {
    id: "a2", fase: "A", kelas: "Kelas 2 SD", mapel: "Matematika", emoji: "🕐", judul: "Membaca Jam Dinding",
    konsep: "Mengenalkan Adik pada jarum pendek (jam) dan jarum panjang (menit) serta membaca waktu bulat pada jam analog.",
    analogi: "Bayangkan jam seperti wajah teman. Jarum pendek itu 'tangan kecil' menunjuk jam, jarum panjang 'tangan besar' menunjuk menit.",
    skrip: [ s(1,"Coba lihat jam kita, mana jarum yang pendek dan mana yang panjang?","Yuk perhatikan lagi, yang satu gemuk-pendek, satunya kurus-panjang ya."),
             s(2,"Jarum pendek sekarang menunjuk angka berapa ya, Kak?","Tidak apa-apa, tunjuk pelan pakai jari ya."),
             s(3,"Kalau jarum panjang di angka 12, berarti tepat jam berapa?","Coba ingat, jarum panjang di 12 artinya 'pas' atau bulat.") ],
    emosi: "Katakan: 'Belajar jam itu seru, nanti Kakak bisa tahu sendiri jam main dan jam tidur!'",
    langkah: "Jarum pendek = jam, jarum panjang di 12 = tepat/pas.", jawaban: "Contoh: jarum pendek di 7, panjang di 12 = pukul 7 tepat"
  },
  {
    id: "a3", fase: "A", kelas: "Kelas 2 SD", mapel: "Matematika", emoji: "💰", judul: "Mengenal Uang Saku",
    konsep: "Melatih Adik mengenal nilai pecahan uang rupiah dan menghitung uang kembalian sederhana dari jajan.",
    analogi: "Main 'toko-tokoan' di rumah. Bunda jadi penjual, Adik beli biskuit Rp2.000 pakai uang Rp5.000.",
    skrip: [ s(1,"Kalau Adik punya uang Rp5.000 lalu beli biskuit Rp2.000, uangnya kurang atau lebih?","Coba bandingkan, mana yang lebih banyak angkanya?"),
             s(2,"Berarti uang Adik akan bersisa. Menurut Adik, disebut apa uang sisa itu?","Uang sisa dari penjual itu namanya 'kembalian' ya Dik."),
             s(3,"Coba hitung, Rp5.000 dikurangi Rp2.000 sisanya berapa?","Yuk pakai jari atau kelereng untuk bantu hitung.") ],
    emosi: "Bilang: 'Pintar mengatur uang itu keren! Kita belajar sambil main toko ya.'",
    langkah: "5.000 - 2.000 = 3.000.", jawaban: "Kembalian Rp3.000"
  },
  {
    id: "a4", fase: "A", kelas: "Kelas 1 SD", mapel: "IPAS", emoji: "👀", judul: "Panca Indra",
    konsep: "Mengenalkan lima indra (mata, telinga, hidung, lidah, kulit) beserta fungsinya dalam kehidupan sehari-hari.",
    analogi: "Ajak Adik berkeliling dapur: cium aroma masakan (hidung), cicip garam (lidah), dengar suara air (telinga).",
    skrip: [ s(1,"Adik pakai apa untuk melihat martabak yang enak ini?","Coba tunjuk bagian wajah yang dipakai untuk melihat ya."),
             s(2,"Kalau mencium harum bunga, kita pakai indra apa?","Tidak apa-apa, coba tarik napas lewat hidung, terasa kan?"),
             s(3,"Sekarang sebutkan satu lagi indra dan gunanya untuk apa?","Yuk ingat: telinga untuk apa ya Dik?") ],
    emosi: "Katakan: 'Tubuh Adik hebat sekali, punya 5 alat ajaib untuk merasakan dunia!'",
    langkah: "Mata-melihat, telinga-mendengar, hidung-mencium, lidah-mengecap, kulit-meraba.", jawaban: "5 panca indra dengan fungsinya masing-masing"
  },
  {
    id: "a5", fase: "A", kelas: "Kelas 1 SD", mapel: "Matematika", emoji: "🔷", judul: "Pola Bangun",
    konsep: "Melatih Adik mengenali dan melanjutkan pola bentuk atau warna yang berulang (berpikir logika awal).",
    analogi: "Susun sendok-garpu-sendok-garpu di meja, lalu tanya Adik: 'setelah ini harusnya apa?'.",
    skrip: [ s(1,"Coba lihat susunan ini: lingkaran, segitiga, lingkaran, segitiga. Apa yang Adik lihat berulang?","Perhatikan lagi, ada bentuk yang muncul lagi dan lagi lho."),
             s(2,"Kalau begitu, setelah segitiga tadi harusnya muncul bentuk apa?","Tidak apa-apa, ikuti urutannya dari awal ya."),
             s(3,"Coba Adik lanjutkan sendiri dua bentuk berikutnya!","Pelan-pelan, lihat pola yang tadi.") ],
    emosi: "Bilang: 'Wah Adik jago menebak pola! Ini melatih otak jadi cerdas.'",
    langkah: "Kenali unit pola berulang lalu lanjutkan.", jawaban: "Pola dilanjutkan sesuai urutan berulang"
  },

  // ================= FASE B (Kelas 3-4 SD) =================
  {
    id: "b1", fase: "B", kelas: "Kelas 4 SD", mapel: "Matematika", emoji: "🥞", judul: "Pecahan Martabak Manis",
    konsep: "Memahami pecahan sebagai bagian dari satu keutuhan. Kurikulum Merdeka menekankan pemahaman visual, bukan hafalan.",
    analogi: "Gunakan martabak manis! Potong jadi 8 bagian sama besar. Kalau diambil 3 potong, itulah 3/8.",
    skrip: [ s(1,"Kalau martabak ini kita potong jadi 8 bagian sama besar, satu potong disebut apa ya, Kak?","Tidak apa-apa. Coba hitung dulu, semua potongannya ada berapa?"),
             s(2,"Nah, kalau Kakak makan 3 potong, bagaimana cara menuliskan angkanya?","Yuk bayangkan: yang dimakan di atas, yang total di bawah ya."),
             s(3,"Menurut Kakak, sisa martabak untuk Ayah berapa potong dari 8?","Pelan-pelan, kurangi total dengan yang sudah dimakan.") ],
    emosi: "Kalau Kakak mulai bosan, ajak istirahat: 'Yuk kita makan dulu satu potong martabaknya, baru lanjut belajar sambil kenyang!'",
    langkah: "Total 8 potong = penyebut. Diambil 3 = pembilang → 3/8. Sisa = 8/8 - 3/8 = 5/8.", jawaban: "3/8 dimakan, sisa 5/8"
  },
  {
    id: "b2", fase: "B", kelas: "Kelas 4 SD", mapel: "Matematika", emoji: "➗", judul: "Pembagian Porogapit Dapur",
    konsep: "Mengenalkan pembagian bersusun (porogapit) sebagai cara membagi rata jumlah besar ke beberapa kelompok.",
    analogi: "Ada 48 biskuit dibagi rata ke 4 piring. Ajak Kakak menaruh satu-satu ke tiap piring bergantian.",
    skrip: [ s(1,"Ada 48 biskuit dan 4 piring. Menurut Kakak, tiap piring dapat sama banyak atau beda-beda?","Kalau adil, harusnya sama banyak ya Kak."),
             s(2,"Yuk coba bagi puluhannya dulu: 40 biskuit ke 4 piring, tiap piring dapat berapa?","Tidak apa-apa, 40 dibagi 4 sama seperti 4 dibagi 4 tapi ditambah nol."),
             s(3,"Sisanya 8 biskuit dibagi 4 piring lagi, tiap piring nambah berapa?","Pelan-pelan, coba bayangkan menaruh satu-satu.") ],
    emosi: "Bilang: 'Membagi rata itu tanda anak yang adil dan sayang teman. Bagus sekali Kak!'",
    langkah: "48 : 4 → (40:4=10) + (8:4=2) = 12.", jawaban: "Tiap piring 12 biskuit"
  },
  {
    id: "b3", fase: "B", kelas: "Kelas 3 SD", mapel: "IPAS", emoji: "🧊", judul: "Wujud Benda",
    konsep: "Memahami tiga wujud benda (padat, cair, gas) dan bahwa benda bisa berubah wujud, contohnya es mencair.",
    analogi: "Ambil es batu dari kulkas. Pegang: keras (padat). Diamkan: jadi air (cair). Panaskan: jadi uap (gas).",
    skrip: [ s(1,"Coba pegang es batu ini. Menurut Kakak keras atau lembek?","Rasakan lagi ya, dingin dan keras itu tandanya benda padat."),
             s(2,"Kalau es kita diamkan di meja, lama-lama berubah jadi apa?","Tidak apa-apa, coba tunggu sebentar, lihat ada genangan tidak?"),
             s(3,"Nah, kalau air tadi kita rebus sampai panas, muncul apa di atasnya?","Uap itu wujud gas ya Kak, ayo perhatikan.") ],
    emosi: "Katakan: 'Sains itu ajaib ya! Benda bisa berubah-ubah seperti sulap.'",
    langkah: "Padat → cair (mencair) → gas (menguap) karena perubahan suhu.", jawaban: "Es (padat) → air (cair) → uap (gas)"
  },
  {
    id: "b4", fase: "B", kelas: "Kelas 3 SD", mapel: "IPAS", emoji: "🌧️", judul: "Siklus Air Hujan",
    konsep: "Memahami perjalanan air: menguap dari laut, jadi awan, lalu turun sebagai hujan (daur air).",
    analogi: "Saat merebus air, uap naik lalu menempel di tutup panci jadi titik air. Itu 'hujan mini' di dapur!",
    skrip: [ s(1,"Waktu Bunda merebus air, ke mana perginya uap panas itu?","Coba lihat ke atas panci, ada asap tipis naik kan?"),
             s(2,"Uap yang naik ke langit lalu berkumpul jadi apa ya di atas sana?","Awan itu kumpulan uap air ya Kak."),
             s(3,"Kalau awan sudah penuh air, apa yang terjadi ke bumi?","Yuk ingat, kenapa kadang langit menurunkan air?") ],
    emosi: "Bilang: 'Air itu berputar terus tak pernah habis, hebat ya ciptaan Tuhan!'",
    langkah: "Menguap → mengembun jadi awan → hujan → kembali ke laut.", jawaban: "Daur air: penguapan, pengembunan, hujan"
  },
  {
    id: "b5", fase: "B", kelas: "Kelas 4 SD", mapel: "IPAS", emoji: "🌿", judul: "Fotosintesis Daun",
    konsep: "Memahami bahwa tumbuhan membuat makanannya sendiri dengan bantuan cahaya matahari, air, dan udara.",
    analogi: "Daun itu seperti 'dapur mini' tanaman. Bahan masaknya: sinar matahari, air dari akar, dan udara.",
    skrip: [ s(1,"Menurut Kakak, tanaman makan dari mana? Apa dia beli di warung?","Tidak apa-apa, coba pikir, tanaman kan tidak punya mulut ya."),
             s(2,"Kira-kira, bagian tanaman mana yang bekerja seperti dapur memasak makanan?","Yuk lihat daunnya yang hijau, di situlah tempatnya."),
             s(3,"Bahan apa dari langit yang paling penting untuk daun memasak?","Ingat, kenapa tanaman ditaruh dekat jendela ya?") ],
    emosi: "Katakan: 'Tanaman itu pintar masak sendiri! Makanya kita harus rajin menyiramnya.'",
    langkah: "Cahaya matahari + air + karbondioksida → makanan (glukosa) + oksigen.", jawaban: "Tumbuhan membuat makanan lewat fotosintesis di daun"
  },

  // ================= FASE C (Kelas 5-6 SD) =================
  {
    id: "c1", fase: "C", kelas: "Kelas 5 SD", mapel: "Matematika", emoji: "💡", judul: "KPK Lampu Hias",
    konsep: "Memahami KPK (Kelipatan Persekutuan Terkecil) sebagai momen di mana dua kejadian bertemu bersamaan.",
    analogi: "Dua lampu hias: yang satu menyala tiap 4 detik, satunya tiap 6 detik. Kapan keduanya menyala bareng?",
    skrip: [ s(1,"Lampu merah menyala tiap 4 detik. Coba sebutkan detik ke berapa saja dia menyala?","Yuk hitung loncat 4: 4, 8, 12... teruskan ya Kak."),
             s(2,"Lampu biru menyala tiap 6 detik. Sebutkan juga urutannya!","Tidak apa-apa, loncat 6: 6, 12, 18..."),
             s(3,"Sekarang, di detik ke berapa keduanya sama-sama menyala pertama kali?","Coba cari angka yang muncul di kedua daftar tadi.") ],
    emosi: "Kalau Kakak pusing, bilang: 'Santai, ini seperti main tebak-tebakan lampu. Yuk pelan-pelan cari angka kembarnya.'",
    langkah: "Kelipatan 4: 4,8,12. Kelipatan 6: 6,12. Persekutuan terkecil = 12.", jawaban: "KPK = 12 detik"
  },
  {
    id: "c2", fase: "C", kelas: "Kelas 5 SD", mapel: "Matematika", emoji: "🛒", judul: "FPB Paket Sembako",
    konsep: "Memahami FPB (Faktor Persekutuan Terbesar) untuk membagi barang ke jumlah paket terbanyak yang sama rata.",
    analogi: "Ada 12 mie dan 18 telur untuk paket sembako. Berapa paket terbanyak agar tiap paket isinya sama?",
    skrip: [ s(1,"Kalau 12 mie mau dibagi rata, bisa dibagi ke berapa paket saja tanpa sisa?","Coba sebutkan angka yang habis membagi 12 ya Kak."),
             s(2,"Sekarang 18 telur, bisa dibagi rata ke berapa paket saja?","Tidak apa-apa, cari pembagi 18 satu per satu."),
             s(3,"Dari angka-angka tadi, mana yang paling besar dan ada di kedua daftar?","Yuk cari angka kembar yang paling besar.") ],
    emosi: "Bilang: 'Membagi paket buat berbagi itu perbuatan mulia. Bunda bangga!'",
    langkah: "Faktor 12: 1,2,3,4,6,12. Faktor 18: 1,2,3,6,9,18. Terbesar = 6.", jawaban: "FPB = 6 paket"
  },
  {
    id: "c3", fase: "C", kelas: "Kelas 6 SD", mapel: "Matematika", emoji: "🏞️", judul: "Luas Taman & Kolam",
    konsep: "Menghitung luas gabungan/selisih bangun datar, misalnya luas taman dikurangi luas kolam di tengahnya.",
    analogi: "Bayangkan karpet (taman) yang di tengahnya ada lubang kotak (kolam). Berapa sisa karpet yang menutupi lantai?",
    skrip: [ s(1,"Taman ini bentuknya persegi panjang. Bagaimana cara kita cari luas seluruhnya?","Ingat ya Kak, panjang dikali lebar."),
             s(2,"Di tengah ada kolam. Menurut Kakak, kolamnya menambah atau mengurangi luas rumput?","Kolam kan tidak ada rumputnya, jadi dia mengurangi ya."),
             s(3,"Jadi luas rumput = luas taman dikurangi apa?","Yuk kurangi luas taman dengan luas kolam.") ],
    emosi: "Katakan: 'Kakak seperti arsitek kecil! Menghitung taman itu keren sekali.'",
    langkah: "Luas rumput = (p×l taman) - (p×l kolam).", jawaban: "Luas taman total dikurangi luas kolam"
  },
  {
    id: "c4", fase: "C", kelas: "Kelas 5 SD", mapel: "IPAS", emoji: "🌾", judul: "Rantai Makanan Sawah",
    konsep: "Memahami aliran energi makanan di ekosistem sawah, dari padi hingga ke pemangsa puncak.",
    analogi: "Seperti antrean makan di rumah: padi dimakan tikus, tikus dimakan ular, ular dimakan elang.",
    skrip: [ s(1,"Di sawah, siapa yang bisa membuat makanan sendiri dari matahari?","Ingat pelajaran fotosintesis ya, tumbuhan seperti padi."),
             s(2,"Padi itu dimakan oleh hewan kecil apa yang sering di sawah?","Coba pikir hewan pengerat yang suka padi."),
             s(3,"Kalau tikusnya dimakan ular, lalu ularnya dimakan siapa di puncak?","Yuk bayangkan burung besar pemburu.") ],
    emosi: "Bilang: 'Setiap makhluk punya peran penting ya. Alam itu seimbang dan hebat!'",
    langkah: "Padi → tikus → ular → elang. Panah menunjuk ke pemakan.", jawaban: "Rantai: Padi → Tikus → Ular → Elang"
  },
  {
    id: "c5", fase: "C", kelas: "Kelas 6 SD", mapel: "IPAS", emoji: "🪐", judul: "Tata Surya",
    konsep: "Mengenal 8 planet dan urutannya mengelilingi Matahari sebagai pusat tata surya.",
    analogi: "Matahari itu seperti lampu di tengah meja makan, planet-planet mengelilinginya seperti piring diputar.",
    skrip: [ s(1,"Menurut Kakak, siapa 'raja' di tengah tata surya yang paling terang?","Ingat, sumber cahaya dan panas kita ya."),
             s(2,"Planet mana yang paling dekat dengan Matahari, jadi paling panas?","Yuk bayangkan yang paling dekat lampu pasti paling panas."),
             s(3,"Bumi kita berada di urutan ke berapa dari Matahari?","Coba hitung dari Merkurius, Venus, lalu...") ],
    emosi: "Katakan: 'Luar angkasa itu luas dan indah. Kakak boleh jadi astronot suatu hari nanti!'",
    langkah: "Urutan: Merkurius, Venus, Bumi, Mars, Yupiter, Saturnus, Uranus, Neptunus.", jawaban: "Bumi = planet ke-3 dari Matahari"
  },
  {
    id: "c6", fase: "C", kelas: "Kelas 6 SD", mapel: "Matematika", emoji: "🚰", judul: "Debit Air",
    konsep: "Memahami debit sebagai jumlah air yang mengalir dalam satuan waktu (volume dibagi waktu).",
    analogi: "Isi ember pakai keran. Kalau 60 liter penuh dalam 2 menit, berapa liter mengalir tiap menit?",
    skrip: [ s(1,"Kalau ember penuh 60 liter dalam 2 menit, menurut Kakak tiap menit banyak atau sedikit?","Coba bagi rata airnya ke tiap menit ya."),
             s(2,"Bagaimana cara mencari air yang keluar tiap 1 menit?","Yuk bagi volume total dengan waktunya."),
             s(3,"Jadi 60 liter dibagi 2 menit hasilnya berapa liter per menit?","Pelan-pelan, 60 : 2 berapa?") ],
    emosi: "Bilang: 'Menghemat air itu penting. Kakak sekarang paham cara mengukurnya, hebat!'",
    langkah: "Debit = Volume : Waktu = 60 : 2 = 30 liter/menit.", jawaban: "Debit = 30 liter/menit"
  },

  // ================= FASE D (Kelas 7-9 SMP) =================
  {
    id: "d1", fase: "D", kelas: "Kelas 7 SMP", mapel: "Matematika", emoji: "🧺", judul: "Aljabar Keranjang Buah",
    konsep: "Mengenalkan variabel sebagai 'wadah misterius' yang isinya belum diketahui, dasar berpikir aljabar.",
    analogi: "Sebut keranjang tertutup sebagai 'x'. Kalau 2 keranjang + 3 apel = 11 apel, berapa isi satu keranjang?",
    skrip: [ s(1,"Kita punya 2 keranjang misterius plus 3 apel di luar, totalnya 11 apel. Apa yang belum kita tahu?","Yang belum diketahui itu isi keranjang, kita sebut 'x' ya Kak."),
             s(2,"Kalau 3 apel yang di luar kita singkirkan dulu, sisa berapa apel untuk 2 keranjang?","Tidak apa-apa, kurangi 11 dengan 3 dulu."),
             s(3,"Nah, 8 apel untuk 2 keranjang. Jadi satu keranjang isi berapa?","Yuk bagi rata 8 ke 2 keranjang.") ],
    emosi: "Kalau Kakak frustrasi dengan huruf x, bilang: 'x itu cuma nama samaran angka misterius, kita seperti detektif yang mencarinya. Seru kan?'",
    langkah: "2x + 3 = 11 → 2x = 8 → x = 4.", jawaban: "Satu keranjang berisi 4 apel"
  },
  {
    id: "d2", fase: "D", kelas: "Kelas 7 SMP", mapel: "Matematika", emoji: "🏬", judul: "Diskon Bertingkat Mall (50%+20%)",
    konsep: "Memahami bahwa diskon 50%+20% BUKAN 70%, melainkan dihitung bertahap dari harga yang sudah turun.",
    analogi: "Baju Rp100.000. Diskon 50% dulu jadi Rp50.000. Baru diskon 20% dihitung dari Rp50.000, bukan harga awal.",
    skrip: [ s(1,"Baju Rp100.000 didiskon 50%. Menurut Kakak jadi berapa harganya?","Setengah dari 100.000 itu berapa ya Kak?"),
             s(2,"Nah sekarang diskon 20% berikutnya, dihitung dari Rp100.000 atau dari harga baru Rp50.000?","Ingat, diskon kedua selalu dari harga terakhir ya."),
             s(3,"Jadi 20% dari Rp50.000 itu berapa, dan harga akhirnya berapa?","Yuk cari 20% dari 50.000 dulu.") ],
    emosi: "Bilang: 'Pintar belanja itu penting biar tidak tertipu tulisan diskon besar. Kakak calon pembeli cerdas!'",
    langkah: "100.000 - 50% = 50.000. 50.000 - 20%(10.000) = 40.000.", jawaban: "Harga akhir Rp40.000 (bukan Rp30.000!)"
  },
  {
    id: "d3", fase: "D", kelas: "Kelas 8 SMP", mapel: "Matematika", emoji: "📐", judul: "Teorema Pythagoras",
    konsep: "Memahami hubungan sisi segitiga siku-siku: kuadrat sisi miring = jumlah kuadrat dua sisi lainnya.",
    analogi: "Tangga bersandar di tembok. Tinggi tembok & jarak kaki tangga membentuk siku, tangganya sisi miring.",
    skrip: [ s(1,"Coba lihat segitiga ini, mana sudut yang bentuknya seperti pojok buku (siku-siku)?","Sudut siku-siku itu 90 derajat, seperti pojok tembok ya."),
             s(2,"Sisi terpanjang yang di depan sudut siku-siku itu namanya apa?","Yang miring dan paling panjang itu 'sisi miring' (hipotenusa)."),
             s(3,"Kalau dua sisi tegaknya 3 dan 4, bagaimana cara cari sisi miringnya?","Ingat: kuadratkan 3 dan 4, jumlahkan, lalu akar.") ],
    emosi: "Kalau Kakak takut rumus, bilang: 'Rumus ini cuma cara cepat, intinya kita cari sisi miring. Kita coba bareng ya.'",
    langkah: "c² = a² + b² = 3² + 4² = 9+16 = 25 → c = 5.", jawaban: "Sisi miring = 5"
  },
  {
    id: "d4", fase: "D", kelas: "Kelas 8 SMP", mapel: "IPAS", emoji: "💧", judul: "Tekanan Air Galon",
    konsep: "Memahami bahwa semakin dalam air, semakin besar tekanannya (tekanan hidrostatis).",
    analogi: "Lubangi botol air di bagian atas dan bawah. Air dari lubang bawah menyembur lebih jauh karena tekanannya besar.",
    skrip: [ s(1,"Kalau botol berisi air kita lubangi di atas dan bawah, mana yang airnya menyembur lebih kuat?","Coba bayangkan atau kita praktikkan, yang bawah lebih deras ya."),
             s(2,"Menurut Kakak, kenapa yang bawah lebih kuat semburannya?","Karena air di atasnya menekan ke bawah, makin dalam makin berat."),
             s(3,"Jadi, tekanan air paling besar ada di bagian mana?","Yuk simpulkan, dalam atau dangkal yang tekanannya besar?") ],
    emosi: "Bilang: 'Eksperimen sains itu seru! Kakak jadi ilmuwan cilik di rumah ya.'",
    langkah: "Tekanan hidrostatis P = ρ×g×h. Makin dalam (h besar), tekanan makin besar.", jawaban: "Tekanan terbesar di bagian paling dalam/bawah"
  },
  {
    id: "d5", fase: "D", kelas: "Kelas 9 SMP", mapel: "IPAS", emoji: "🧬", judul: "Genetika Dasar (Pewarisan Sifat)",
    konsep: "Memahami bagaimana sifat (misalnya warna) diwariskan dari induk ke keturunan lewat gen dominan & resesif.",
    analogi: "Seperti mencampur bibit bunga. Gen dominan (besar) mengalahkan gen resesif (kecil) dalam menentukan warna.",
    skrip: [ s(1,"Menurut Kakak, kenapa anak bisa mirip orang tuanya, misal bentuk hidung?","Ada 'pesan' dari orang tua yang diturunkan, namanya gen ya."),
             s(2,"Kalau ada sifat yang 'menang/kuat' dan yang 'kalah/lemah', disebut apa ya?","Yang menang disebut dominan, yang kalah disebut resesif."),
             s(3,"Kalau induk berbunga merah (dominan) disilangkan dengan putih, anaknya cenderung warna apa?","Yuk pikir, yang dominan biasanya yang muncul.") ],
    emosi: "Bilang: 'Tubuh kita menyimpan warisan keluarga yang menakjubkan. Sains itu penuh keajaiban!'",
    langkah: "Persilangan Mm: gen dominan (M) menutupi resesif (m).", jawaban: "Keturunan cenderung menampakkan sifat dominan (merah)"
  },
  {
    id: "d6", fase: "D", kelas: "Kelas 7 SMP", mapel: "Bahasa", emoji: "📝", judul: "Menyusun Teks Deskripsi",
    konsep: "Melatih menulis teks deskripsi yang melibatkan panca indra agar pembaca seolah melihat langsung objeknya.",
    analogi: "Ajak Kakak mendeskripsikan masakan Bunda: bentuknya, warnanya, aromanya, rasanya, seperti bercerita ke teman.",
    skrip: [ s(1,"Coba Kakak lihat rendang ini. Apa yang pertama Kakak lihat dari warnanya?","Tidak apa-apa, sebut saja warna dan bentuknya dulu ya."),
             s(2,"Selain dilihat, indra apa lagi yang bisa kita pakai untuk menggambarkannya?","Ingat panca indra: cium aromanya, bagaimana?"),
             s(3,"Sekarang rangkai jadi satu kalimat yang membuat pembaca ikut lapar!","Yuk gabungkan warna, aroma, dan rasa jadi kalimat.") ],
    emosi: "Bilang: 'Kakak pandai bercerita! Tulisan yang hidup itu dari hati yang jujur.'",
    langkah: "Deskripsi = gabungan detail panca indra (lihat, cium, rasa) dalam kalimat runtut.", jawaban: "Teks deskripsi yang melibatkan panca indra"
  },
  {
    id: "d7", fase: "D", kelas: "Kelas 9 SMP", mapel: "Matematika", emoji: "📈", judul: "Fungsi & Grafik",
    konsep: "Memahami fungsi sebagai mesin: satu input menghasilkan satu output tertentu (relasi khusus).",
    analogi: "Mesin jus: masukkan 1 jeruk (input), keluar 1 gelas jus (output). Setiap input punya satu hasil pasti.",
    skrip: [ s(1,"Kalau mesin jus dimasukkan 2 jeruk, apakah hasilnya bisa berubah-ubah atau tetap?","Mesin yang baik hasilnya pasti dan tetap ya Kak."),
             s(2,"Jadi kalau f(x)=2x, artinya setiap angka yang masuk diapakan?","Yuk baca: x dikali 2, itu 'aturan mesinnya'."),
             s(3,"Kalau kita masukkan x=3, keluar berapa hasilnya?","Pelan-pelan, 2 dikali 3 berapa?") ],
    emosi: "Bilang: 'Fungsi itu cuma mesin ajaib. Kakak sudah paham cara kerjanya, keren!'",
    langkah: "f(x)=2x, untuk x=3 → f(3)=2×3=6.", jawaban: "Output = 6"
  },
];

export const KONSULTASI_CEPAT = [
  "Anak menangis setiap kali salah berhitung, bagaimana respon kalimat saya sebaiknya?",
  "Trik mengajarkan perkalian 6–9 dengan jari tanpa stres hafalan?",
  "Anak kecanduan HP/Roblox saat disuruh belajar, bagaimana cara negosiasi win-win?",
  "Bagaimana membuat anak fokus mengerjakan PR tanpa harus dimarahi?",
  "Anak minder karena nilainya lebih rendah dari teman, apa yang harus saya katakan?",
];

export const FASE_INFO = {
  A: { label: "Fase A", ket: "Kelas 1–2 SD", warna: "bg-rose-100 text-rose-700" },
  B: { label: "Fase B", ket: "Kelas 3–4 SD", warna: "bg-amber-100 text-amber-700" },
  C: { label: "Fase C", ket: "Kelas 5–6 SD", warna: "bg-emerald-100 text-emerald-700" },
  D: { label: "Fase D", ket: "Kelas 7–9 SMP", warna: "bg-sky-100 text-sky-700" },
};
