// lib/questions/tetrads.ts
// 33 Most-Least Tetrads — Mixed Keying
// 23 All-Positive | 8 All-Negative (L1 focus) | 2 Mixed (consistency check)
//
// Keying:
//   'P' = Positive item (high score = good)
//   'N' = Negative item (high score = bad — scoring is REVERSED)
//
// Dimension frequency target: ~10x per dimension across 33 tetrads
// L1 dims get extra exposure via all-negative tetrads

import type { DimensionKey } from '@/lib/scoring'

export type ItemKeying = 'P' | 'N'
export type TetradType = 'all-positive' | 'all-negative' | 'mixed'

export interface TetradItem {
  dim: DimensionKey
  keying: ItemKeying
  text: string
}

export interface Tetrad {
  id: number
  type: TetradType
  items: [TetradItem, TetradItem, TetradItem, TetradItem]
}

// ─── SECTION 1: ALL-POSITIVE TETRADS (T01–T23) ───────────────────────────
// All items sound positive — forced tradeoff reveals priorities

export const TETRADS: Tetrad[] = [

  // ── T01 ──────────────────────────────────────────────────────────────────
  {
    id: 1, type: 'all-positive',
    items: [
      { dim: 'ownership', keying: 'P', text: 'Saya mengambil tanggung jawab penuh atas hasil pekerjaan — baik saat berhasil maupun saat gagal' },
      { dim: 'standarPribadi', keying: 'P', text: 'Standar yang saya terapkan pada diri sendiri pada umumnya lebih tinggi dari yang diminta atasan' },
      { dim: 'caraBerpikir', keying: 'P', text: 'Saya hampir selalu mempertimbangkan dampak jangka panjang sebelum mengambil keputusan penting' },
      { dim: 'responsFeedback', keying: 'P', text: 'Saya secara aktif meminta feedback kritis bahkan ketika tidak ada yang mewajibkannya' },
    ]
  },

  // ── T02 ──────────────────────────────────────────────────────────────────
  {
    id: 2, type: 'all-positive',
    items: [
      { dim: 'growthMindset', keying: 'P', text: 'Saya mencari peluang belajar hal baru yang relevan tanpa menunggu diminta' },
      { dim: 'dampakTim', keying: 'P', text: 'Kehadiran saya secara nyata mendorong orang lain meningkatkan standar kerja mereka' },
      { dim: 'decisive', keying: 'P', text: 'Saya mampu mengambil keputusan tegas bahkan di situasi yang ambigu dan penuh ketidakpastian' },
      { dim: 'innovative', keying: 'P', text: 'Saya secara aktif mengusulkan cara baru yang lebih baik meski cara lama masih berjalan' },
    ]
  },

  // ── T03 ──────────────────────────────────────────────────────────────────
  {
    id: 3, type: 'all-positive',
    items: [
      { dim: 'conscientious', keying: 'P', text: 'Saya sangat menjaga komitmen yang saya buat dan jarang membiarkan satu pun terlewat begitu saja' },
      { dim: 'emotionallyControlled', keying: 'P', text: 'Saya tetap tenang dan fokus bahkan ketika tekanan di sekitar saya sangat tinggi' },
      { dim: 'integritas', keying: 'P', text: 'Kata-kata dan tindakan saya umumnya konsisten — orang bisa memegang apa yang saya ucapkan' },
      { dim: 'resiliensi', keying: 'P', text: 'Saya terbiasa bangkit dan mengambil pelajaran konkret dari setiap kegagalan besar yang saya hadapi' },
    ]
  },

  // ── T04 ──────────────────────────────────────────────────────────────────
  {
    id: 4, type: 'all-positive',
    items: [
      { dim: 'communicationClarity', keying: 'P', text: 'Saya bisa menjelaskan ide yang kompleks dengan cara yang mudah dipahami oleh siapapun' },
      { dim: 'ownership', keying: 'P', text: 'Saya mengambil alih masalah yang tidak ada yang mau menangani tanpa menunggu diminta' },
      { dim: 'growthMindset', keying: 'P', text: 'Saya secara konsisten menginvestasikan waktu pribadi untuk mengembangkan kapasitas diri' },
      { dim: 'dampakTim', keying: 'P', text: 'Standar yang saya bangun tetap terasa di tim bahkan setelah saya tidak ada di sana' },
    ]
  },

  // ── T05 ──────────────────────────────────────────────────────────────────
  {
    id: 5, type: 'all-positive',
    items: [
      { dim: 'standarPribadi', keying: 'P', text: 'Saya merasa tidak nyaman ketika hasil kerja saya hanya "cukup" — selalu ingin lebih baik' },
      { dim: 'caraBerpikir', keying: 'P', text: 'Saya melihat pola dan koneksi antar masalah yang sering tidak terlihat orang lain' },
      { dim: 'decisive', keying: 'P', text: 'Saya tidak menunggu informasi sempurna untuk bergerak — saya memutuskan dengan data yang ada' },
      { dim: 'innovative', keying: 'P', text: 'Saya sering mempertanyakan asumsi yang sudah lama diterima begitu saja di tempat kerja' },
    ]
  },

  // ── T06 ──────────────────────────────────────────────────────────────────
  {
    id: 6, type: 'all-positive',
    items: [
      { dim: 'responsFeedback', keying: 'P', text: 'Saya menyampaikan pendapat berbeda secara langsung bahkan ketika saya tahu tidak populer' },
      { dim: 'conscientious', keying: 'P', text: 'Saya sangat teliti dalam detail dan jarang membuat kesalahan yang sama dua kali' },
      { dim: 'emotionallyControlled', keying: 'P', text: 'Saya tidak membawa masalah emosional pribadi ke dalam dinamika tim' },
      { dim: 'integritas', keying: 'P', text: 'Saya mengakui kesalahan saya secara terbuka tanpa mencari pembenaran atau kambing hitam' },
    ]
  },

  // ── T07 ──────────────────────────────────────────────────────────────────
  {
    id: 7, type: 'all-positive',
    items: [
      { dim: 'resiliensi', keying: 'P', text: 'Kegagalan besar tidak membuat saya berhenti — justru menjadi bahan bakar untuk tindakan berikutnya' },
      { dim: 'communicationClarity', keying: 'P', text: 'Saya menyesuaikan cara penyampaian saya dengan audiens tanpa mengorbankan substansi' },
      { dim: 'ownership', keying: 'P', text: 'Saya menyelesaikan masalah sebelum berkembang menjadi krisis bagi tim atau organisasi' },
      { dim: 'standarPribadi', keying: 'P', text: 'Saya memeriksa ulang pekerjaan bahkan ketika orang lain sudah menganggapnya selesai' },
    ]
  },

  // ── T08 ──────────────────────────────────────────────────────────────────
  {
    id: 8, type: 'all-positive',
    items: [
      { dim: 'growthMindset', keying: 'P', text: 'Saya aktif mencari pengetahuan baru di luar tugas formal yang diberikan kepada saya' },
      { dim: 'caraBerpikir', keying: 'P', text: 'Saya terbiasa menganalisis akar masalah, bukan hanya menyelesaikan gejalanya' },
      { dim: 'responsFeedback', keying: 'P', text: 'Saya mengubah cara kerja secara nyata dan konsisten setiap kali mendapat feedback valid' },
      { dim: 'decisive', keying: 'P', text: 'Saya tidak menunda keputusan hanya karena ada ketidaknyamanan atau potensi konflik' },
    ]
  },

  // ── T09 ──────────────────────────────────────────────────────────────────
  {
    id: 9, type: 'all-positive',
    items: [
      { dim: 'innovative', keying: 'P', text: 'Saya senang bereksperimen dengan pendekatan baru meski hasilnya belum terbukti sebelumnya' },
      { dim: 'conscientious', keying: 'P', text: 'Saya sangat terstruktur dalam merencanakan pekerjaan dan jarang melewatkan satu deadline' },
      { dim: 'emotionallyControlled', keying: 'P', text: 'Saya bisa memisahkan emosi dari penilaian saat menghadapi situasi yang menekan' },
      { dim: 'integritas', keying: 'P', text: 'Saya terbuka menyampaikan informasi penting yang perlu diketahui orang lain, meski tidak selalu mudah' },
    ]
  },

  // ── T10 ──────────────────────────────────────────────────────────────────
  {
    id: 10, type: 'all-positive',
    items: [
      { dim: 'resiliensi', keying: 'P', text: 'Saya mempertahankan produktivitas bahkan di tengah situasi yang penuh ketidakpastian berkepanjangan' },
      { dim: 'dampakTim', keying: 'P', text: 'Saya aktif membantu rekan berkembang, tidak hanya fokus pada pekerjaan dan target saya sendiri' },
      { dim: 'communicationClarity', keying: 'P', text: 'Pesan yang saya sampaikan umumnya tepat sasaran — saya berusaha meminimalkan kebingungan atau multitafsir' },
      { dim: 'ownership', keying: 'P', text: 'Saya menjaga standar kerja tetap tinggi bahkan ketika tidak ada yang mengawasi' },
    ]
  },

  // ── T11 ──────────────────────────────────────────────────────────────────
  {
    id: 11, type: 'all-positive',
    items: [
      { dim: 'standarPribadi', keying: 'P', text: 'Saya jarang benar-benar puas dengan hasil kerja saya — hampir selalu ada yang bisa ditingkatkan' },
      { dim: 'growthMindset', keying: 'P', text: 'Saya mengevaluasi diri sendiri secara jujur dan mendalam tanpa harus diminta atau dipaksa' },
      { dim: 'innovative', keying: 'P', text: 'Saya tidak nyaman melakukan sesuatu dengan cara yang sama berulang-ulang tanpa inovasi' },
      { dim: 'integritas', keying: 'P', text: 'Perilaku saya tidak berubah tergantung siapa yang melihat — konsisten di depan dan di belakang' },
    ]
  },

  // ── T12 ──────────────────────────────────────────────────────────────────
  {
    id: 12, type: 'all-positive',
    items: [
      { dim: 'caraBerpikir', keying: 'P', text: 'Saya mempertimbangkan berbagai perspektif sebelum menyimpulkan atau mengambil posisi' },
      { dim: 'responsFeedback', keying: 'P', text: 'Saya tidak defensif ketika pendapat saya dikritik — saya memisahkan identitas dari argumen' },
      { dim: 'decisive', keying: 'P', text: 'Saya lebih memilih keputusan cepat yang bisa dikoreksi daripada keputusan lambat yang "sempurna"' },
      { dim: 'conscientious', keying: 'P', text: 'Saya mendokumentasikan pekerjaan dengan rapi sehingga orang lain bisa melanjutkan tanpa kebingungan' },
    ]
  },

  // ── T13 ──────────────────────────────────────────────────────────────────
  {
    id: 13, type: 'all-positive',
    items: [
      { dim: 'emotionallyControlled', keying: 'P', text: 'Saya tidak bereaksi berlebihan terhadap masalah kecil yang bisa diselesaikan dengan tenang' },
      { dim: 'resiliensi', keying: 'P', text: 'Saya belajar lebih banyak dari kegagalan daripada dari kesuksesan — dan saya menerapkannya' },
      { dim: 'dampakTim', keying: 'P', text: 'Saya menciptakan lingkungan kerja yang mendorong kejujuran dan standar tinggi di sekitar saya' },
      { dim: 'communicationClarity', keying: 'P', text: 'Saya mempersiapkan penyampaian dengan matang sehingga audiens langsung memahami inti pesan' },
    ]
  },

  // ── T14 ──────────────────────────────────────────────────────────────────
  {
    id: 14, type: 'all-positive',
    items: [
      { dim: 'ownership', keying: 'P', text: 'Saya bertanggung jawab atas hasil tim secara keseluruhan, bukan hanya porsi yang menjadi bagian saya' },
      { dim: 'standarPribadi', keying: 'P', text: 'Saya terdorong memperbaiki sesuatu ketika tahu bisa lebih baik, meski tidak ada yang meminta' },
      { dim: 'innovative', keying: 'P', text: 'Saya mendorong tim untuk mencoba pendekatan yang berbeda dari yang sudah ada dan terbukti aman' },
      { dim: 'emotionallyControlled', keying: 'P', text: 'Saya tetap stabil dan tidak panik bahkan menghadapi berita buruk yang datang mendadak' },
    ]
  },

  // ── T15 ──────────────────────────────────────────────────────────────────
  {
    id: 15, type: 'all-positive',
    items: [
      { dim: 'growthMindset', keying: 'P', text: 'Saya senang mendapat tantangan yang memaksa keluar dari zona nyaman saya saat ini' },
      { dim: 'caraBerpikir', keying: 'P', text: 'Saya memikirkan implikasi keputusan saya terhadap sistem dan orang-orang yang lebih luas' },
      { dim: 'conscientious', keying: 'P', text: 'Saya bekerja dengan standar konsisten — kualitas tidak berubah tergantung siapa yang melihat' },
      { dim: 'resiliensi', keying: 'P', text: 'Saya membangun kembali kepercayaan diri dengan cepat setelah mengalami kegagalan yang signifikan' },
    ]
  },

  // ── T16 ──────────────────────────────────────────────────────────────────
  {
    id: 16, type: 'all-positive',
    items: [
      { dim: 'responsFeedback', keying: 'P', text: 'Saya mencari perspektif yang bertentangan dengan pandangan saya untuk menguji kekuatan argumen' },
      { dim: 'decisive', keying: 'P', text: 'Saya berani mengambil posisi yang jelas dan tegas bahkan ketika semua orang masih ragu-ragu' },
      { dim: 'dampakTim', keying: 'P', text: 'Saya menengahi konflik tim secara konstruktif bahkan ketika bukan peran formal saya untuk itu' },
      { dim: 'integritas', keying: 'P', text: 'Saya menyampaikan kebenaran yang tidak nyaman ketika itu memang perlu disampaikan' },
    ]
  },

  // ── T17 ──────────────────────────────────────────────────────────────────
  {
    id: 17, type: 'all-positive',
    items: [
      { dim: 'communicationClarity', keying: 'P', text: 'Saya menyederhanakan informasi yang kompleks tanpa kehilangan akurasi atau nuansi pentingnya' },
      { dim: 'ownership', keying: 'P', text: 'Ketika gagal, saya langsung menganalisis kontribusi saya sendiri — bukan mencari faktor eksternal' },
      { dim: 'growthMindset', keying: 'P', text: 'Saya mengubah pola kerja secara nyata setelah menyadari ada kebiasaan yang perlu diperbaiki' },
      { dim: 'conscientious', keying: 'P', text: 'Saya menjaga komitmen dengan serius dan berusaha tidak membiarkan satu pun terlewat begitu saja' },
    ]
  },

  // ── T18 ──────────────────────────────────────────────────────────────────
  {
    id: 18, type: 'all-positive',
    items: [
      { dim: 'standarPribadi', keying: 'P', text: 'Saya memiliki tolok ukur internal yang tidak tergantung pada penilaian atau persetujuan orang lain' },
      { dim: 'caraBerpikir', keying: 'P', text: 'Saya mengidentifikasi akar masalah sistemik yang sering diabaikan atau tidak terlihat orang lain' },
      { dim: 'integritas', keying: 'P', text: 'Saya mempertahankan nilai dan prinsip saya bahkan di situasi yang memberi keuntungan untuk berkompromi' },
      { dim: 'resiliensi', keying: 'P', text: 'Saya tidak membiarkan satu kegagalan mendefinisikan cara saya melihat kemampuan diri saya' },
    ]
  },

  // ── T19 ──────────────────────────────────────────────────────────────────
  {
    id: 19, type: 'all-positive',
    items: [
      { dim: 'responsFeedback', keying: 'P', text: 'Saya meminta orang lain menunjukkan kelemahan saya secara spesifik, bukan pujian yang umum' },
      { dim: 'decisive', keying: 'P', text: 'Saya membuat keputusan berdasarkan prinsip yang jelas, bukan sekadar mengikuti arus atau tekanan' },
      { dim: 'innovative', keying: 'P', text: 'Saya secara konsisten mengusulkan ide yang menantang cara kerja yang sudah ada dan mapan' },
      { dim: 'dampakTim', keying: 'P', text: 'Saya memastikan rekan yang kesulitan mendapat dukungan yang dibutuhkan, bukan dibiarkan sendiri' },
    ]
  },

  // ── T20 ──────────────────────────────────────────────────────────────────
  {
    id: 20, type: 'all-positive',
    items: [
      { dim: 'emotionallyControlled', keying: 'P', text: 'Saya mengelola tekanan dengan baik dan tidak membiarkannya memengaruhi kualitas keputusan' },
      { dim: 'communicationClarity', keying: 'P', text: 'Saya memastikan pesan saya dipahami — bukan hanya didengar — oleh audiens yang beragam' },
      { dim: 'ownership', keying: 'P', text: 'Saya tidak menunggu instruksi untuk mengambil tindakan yang saya tahu memang perlu dilakukan' },
      { dim: 'integritas', keying: 'P', text: 'Saya bersikap sama terhadap semua orang tanpa memandang jabatan, posisi, atau pengaruh mereka' },
    ]
  },

  // ── T21 ──────────────────────────────────────────────────────────────────
  {
    id: 21, type: 'all-positive',
    items: [
      { dim: 'standarPribadi', keying: 'P', text: 'Saya secara aktif mencari cara lebih baik bahkan untuk pekerjaan rutin yang sudah berjalan lancar' },
      { dim: 'growthMindset', keying: 'P', text: 'Saya aktif mencari mentor atau referensi yang mendorong saya ke level kemampuan berikutnya' },
      { dim: 'conscientious', keying: 'P', text: 'Saya sangat detail dalam pekerjaan dan terbiasa memeriksa ulang sebelum menyerahkan hasilnya' },
      { dim: 'decisive', keying: 'P', text: 'Saya tidak menghindari keputusan sulit hanya karena ada risiko sosial atau ketidaknyamanan personal' },
    ]
  },

  // ── T22 ──────────────────────────────────────────────────────────────────
  {
    id: 22, type: 'all-positive',
    items: [
      { dim: 'caraBerpikir', keying: 'P', text: 'Saya mempertanyakan asumsi dasar sebelum menerima suatu keputusan atau pendekatan sebagai benar' },
      { dim: 'innovative', keying: 'P', text: 'Saya tidak puas hanya menjalankan apa yang sudah ada — saya aktif mencari celah untuk berinovasi' },
      { dim: 'resiliensi', keying: 'P', text: 'Saya tetap fokus pada solusi bahkan ketika situasi terasa sangat berat dan tidak ada kepastian' },
      { dim: 'dampakTim', keying: 'P', text: 'Cara kerja saya secara tidak langsung menaikkan standar ekspektasi orang-orang di sekitar saya' },
    ]
  },

  // ── T23 ──────────────────────────────────────────────────────────────────
  {
    id: 23, type: 'all-positive',
    items: [
      { dim: 'ownership', keying: 'P', text: 'Saya mengambil inisiatif memperbaiki sesuatu yang salah bahkan ketika itu bukan kesalahan saya' },
      { dim: 'responsFeedback', keying: 'P', text: 'Saya terbuka terhadap koreksi dari siapapun — atasan, rekan, maupun yang lebih junior dari saya' },
      { dim: 'communicationClarity', keying: 'P', text: 'Saya terstruktur dalam menyampaikan informasi sehingga audiens bisa mengikuti alur pikiran saya' },
      { dim: 'growthMindset', keying: 'P', text: 'Setiap kegagalan memberi saya wawasan baru yang mengubah cara saya bekerja ke depannya' },
    ]
  },

  // ─── SECTION 2: ALL-NEGATIVE TETRADS (T24–T31) ────────────────────────
  // All items describe less-than-ideal behavior — scoring is REVERSED
  // Most = peserta mengakui perilaku ini paling mencerminkan diri
  // Least = peserta menyangkal perilaku ini sama sekali
  // Fokus pada Layer 1 (Gate 1 dimensions)

  // ── T24 ── Ownership & Integritas focus ──────────────────────────────────
  {
    id: 24, type: 'all-negative',
    items: [
      { dim: 'ownership', keying: 'N', text: 'Ketika ada masalah yang tidak jelas siapa yang harus menangani, saya cenderung menunggu ada yang mengambil inisiatif' },
      { dim: 'integritas', keying: 'N', text: 'Dalam situasi tertentu, saya memilih tidak mengungkapkan informasi yang mungkin merugikan posisi saya' },
      { dim: 'caraBerpikir', keying: 'N', text: 'Saya lebih nyaman menyelesaikan masalah yang ada daripada mencari tahu mengapa masalah itu terus terjadi' },
      { dim: 'conscientious', keying: 'N', text: 'Ada kalanya saya melewatkan tenggat kecil karena prioritas lain terasa lebih mendesak' },
    ]
  },

  // ── T25 ── Standar Pribadi & Emotionally Controlled focus ────────────────
  {
    id: 25, type: 'all-negative',
    items: [
      { dim: 'standarPribadi', keying: 'N', text: 'Jika atasan sudah menyatakan puas dengan pekerjaan saya, saya tidak merasa perlu meningkatkannya lebih jauh' },
      { dim: 'emotionallyControlled', keying: 'N', text: 'Ketika situasi sangat menekan, saya kadang menunjukkan frustrasi yang mungkin memengaruhi suasana tim' },
      { dim: 'responsFeedback', keying: 'N', text: 'Ketika mendapat kritik yang saya rasa tidak adil, saya cenderung mempertahankan posisi saya lebih dari yang seharusnya' },
      { dim: 'resiliensi', keying: 'N', text: 'Setelah mengalami kegagalan besar, saya memerlukan waktu cukup lama sebelum bisa sepenuhnya kembali produktif' },
    ]
  },

  // ── T26 ── Integritas & Ownership focus ──────────────────────────────────
  {
    id: 26, type: 'all-negative',
    items: [
      { dim: 'integritas', keying: 'N', text: 'Ada situasi di mana saya menyesuaikan cara saya menyampaikan informasi agar tidak menimbulkan masalah bagi diri sendiri' },
      { dim: 'ownership', keying: 'N', text: 'Ketika proyek gagal, saya cenderung fokus pada faktor-faktor yang memang berada di luar kendali saya' },
      { dim: 'innovative', keying: 'N', text: 'Saya lebih memilih menjalankan cara yang sudah terbukti daripada mengusulkan cara baru yang belum jelas hasilnya' },
      { dim: 'dampakTim', keying: 'N', text: 'Saya lebih fokus memastikan pekerjaan saya sendiri beres daripada mengurusi performa rekan lain' },
    ]
  },

  // ── T27 ── Standar Pribadi & Integritas focus ─────────────────────────────
  {
    id: 27, type: 'all-negative',
    items: [
      { dim: 'standarPribadi', keying: 'N', text: 'Kualitas kerja saya cenderung lebih baik ketika ada pihak tertentu yang akan mengevaluasi hasilnya' },
      { dim: 'integritas', keying: 'N', text: 'Saya pernah tidak mengungkapkan sesuatu yang seharusnya disampaikan karena tidak ditanya langsung' },
      { dim: 'caraBerpikir', keying: 'N', text: 'Dalam situasi yang kompleks, saya lebih mengandalkan pengalaman dan intuisi daripada analisis yang terstruktur' },
      { dim: 'growthMindset', keying: 'N', text: 'Saya mengikuti training dan pengembangan diri terutama ketika itu difasilitasi atau diwajibkan perusahaan' },
    ]
  },

  // ── T28 ── Emotionally Controlled & Ownership focus ──────────────────────
  {
    id: 28, type: 'all-negative',
    items: [
      { dim: 'emotionallyControlled', keying: 'N', text: 'Ketika merasa diperlakukan tidak adil, saya kesulitan untuk tetap bersikap profesional seperti biasa' },
      { dim: 'ownership', keying: 'N', text: 'Saya lebih nyaman mengambil tanggung jawab dalam area yang sudah jelas scope-nya dibanding situasi ambigu' },
      { dim: 'decisive', keying: 'N', text: 'Ketika dihadapkan pada keputusan penting dengan informasi yang tidak lengkap, saya cenderung menunda sampai ada kejelasan lebih' },
      { dim: 'conscientious', keying: 'N', text: 'Dalam kondisi workload tinggi, beberapa detail kecil kadang terlewat dari perhatian saya' },
    ]
  },

  // ── T29 ── Integritas & Standar Pribadi focus ─────────────────────────────
  {
    id: 29, type: 'all-negative',
    items: [
      { dim: 'integritas', keying: 'N', text: 'Saya terkadang lebih berhati-hati dalam berbagi informasi negatif dengan atasan jika itu bisa berdampak buruk pada penilaian saya' },
      { dim: 'standarPribadi', keying: 'N', text: 'Ada kalanya saya merasa cukup dengan hasil yang sudah melewati standar minimum yang ditetapkan' },
      { dim: 'responsFeedback', keying: 'N', text: 'Saya lebih mudah menerima feedback jika disampaikan oleh orang yang saya anggap memahami pekerjaan saya' },
      { dim: 'dampakTim', keying: 'N', text: 'Standar dan cara kerja di tim lebih banyak dipengaruhi oleh sistem yang ada daripada oleh kehadiran saya' },
    ]
  },

  // ── T30 ── Ownership & Emotionally Controlled focus ──────────────────────
  {
    id: 30, type: 'all-negative',
    items: [
      { dim: 'ownership', keying: 'N', text: 'Saya merasa lebih efektif bekerja ketika tanggung jawab dan ekspektasi sudah didefinisikan dengan jelas oleh atasan' },
      { dim: 'emotionallyControlled', keying: 'N', text: 'Saya pernah membuat keputusan atau mengucapkan sesuatu saat emosi yang kemudian saya sesali' },
      { dim: 'communicationClarity', keying: 'N', text: 'Saya tidak selalu memiliki waktu untuk mempersiapkan penyampaian secara matang sebelum berbicara' },
      { dim: 'resiliensi', keying: 'N', text: 'Saya cenderung memilih tugas yang lebih familiar dibanding mengambil risiko pada proyek yang sangat baru bagi saya' },
    ]
  },

  // ── T31 ── All 4 L1 negative — strongest discriminator ───────────────────
  {
    id: 31, type: 'all-negative',
    items: [
      { dim: 'ownership', keying: 'N', text: 'Saya lebih fokus pada bagian pekerjaan yang menjadi tanggung jawab saya daripada mengkhawatirkan hasil tim secara keseluruhan' },
      { dim: 'standarPribadi', keying: 'N', text: 'Standar kerja yang saya terapkan dipengaruhi oleh standar yang berlaku di sekitar saya dan ekspektasi yang ditetapkan' },
      { dim: 'emotionallyControlled', keying: 'N', text: 'Kondisi emosi saya kadang cukup terlihat oleh orang di sekitar, terutama saat situasi sedang tidak berjalan baik' },
      { dim: 'integritas', keying: 'N', text: 'Saya cenderung memilih momen dan cara yang tepat untuk menyampaikan informasi sensitif, bukan langsung begitu tahu' },
    ]
  },

  // ─── SECTION 3: MIXED TETRADS (T32–T33) ──────────────────────────────────
  // 1 positive item + 3 negative items
  // Tujuan: consistency check — jika peserta memilih negative sebagai Most
  // padahal di all-positive tetrads dia memilih dimensi itu sebagai Most,
  // ini mendeteksi social desirability faking atau inkonsistensi

  // ── T32 ── Ownership consistency check ───────────────────────────────────
  {
    id: 32, type: 'mixed',
    items: [
      { dim: 'ownership', keying: 'P', text: 'Saya mengambil tanggung jawab penuh bahkan untuk masalah yang sebenarnya bukan bagian langsung dari pekerjaan saya' },
      { dim: 'ownership', keying: 'N', text: 'Ketika ada yang salah dalam proyek tim, fokus saya pertama adalah memahami bagian mana yang menjadi tanggung jawab saya' },
      { dim: 'standarPribadi', keying: 'N', text: 'Saya merasa nyaman ketika pekerjaan sudah memenuhi standar yang telah disepakati bersama' },
      { dim: 'integritas', keying: 'N', text: 'Saya memilih waktu dan forum yang tepat untuk menyampaikan keberatan, bukan langsung di setiap kesempatan' },
    ]
  },

  // ── T33 ── Integritas consistency check ──────────────────────────────────
  {
    id: 33, type: 'mixed',
    items: [
      { dim: 'integritas', keying: 'P', text: 'Saya menyampaikan kebenaran yang tidak menyenangkan secara langsung ke orang yang perlu mendengarnya, tanpa menunggu waktu yang "aman"' },
      { dim: 'integritas', keying: 'N', text: 'Ada informasi yang lebih baik saya simpan dulu sampai situasinya lebih kondusif untuk disampaikan' },
      { dim: 'emotionallyControlled', keying: 'N', text: 'Tingkat energi dan semangat kerja saya memang cukup dipengaruhi oleh suasana yang ada di sekitar saya' },
      { dim: 'standarPribadi', keying: 'N', text: 'Saya lebih terdorong untuk memberikan yang terbaik ketika pekerjaan tersebut dinilai atau dilihat oleh pihak yang penting' },
    ]
  },
]

// ─── VERIFICATION ─────────────────────────────────────────────────────────
export function verifyTetrads(): { valid: boolean; report: string[] } {
  const report: string[] = []
  const dimCount: Record<string, number> = {}
  const dimByKeying: Record<string, { P: number; N: number }> = {}

  TETRADS.forEach((t, i) => {
    // Check no duplicate dims in tetrad
    const dims = t.items.map(item => item.dim)
    if (new Set(dims).size !== 4) {
      report.push(`T${i+1}: duplicate dimension detected`)
    }
    // Count
    t.items.forEach(item => {
      dimCount[item.dim] = (dimCount[item.dim] || 0) + 1
      if (!dimByKeying[item.dim]) dimByKeying[item.dim] = { P: 0, N: 0 }
      dimByKeying[item.dim][item.keying]++
    })
  })

  // Summary
  report.push(`Total tetrads: ${TETRADS.length} (expected 33)`)
  Object.entries(dimCount).sort().forEach(([d, c]) => {
    const k = dimByKeying[d]
    report.push(`  ${d}: ${c}x total (${k.P}P + ${k.N}N)`)
  })

  const valid = TETRADS.length === 33 &&
    Object.values(dimCount).every(c => c >= 8)

  return { valid, report }
}
