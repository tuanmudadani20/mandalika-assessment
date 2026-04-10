// lib/questions/sjt.ts
// 30 ML-SJT Questions — Most-Least Situational Judgment
// L1 (4 dims × 3 soal = 12) | L2 (4 dims × 2 = 8) | L3 (3 dims × 2 = 6) | L4 (2 dims × 2 = 4)
//
// mostScores:  4=A Player, 3=good, 2=neutral/ok, 1=worst
// leastScores: +2=correctly avoiding worst, +1=avoiding neutral, -1=avoiding good, -2=wrongly avoiding best
// maxPossible per soal = 6, minPossible = -1
// Normalization: (raw+1) / 7 × 100

import type { DimensionKey } from '@/lib/scoring'

export interface SJTQuestion {
  id: number
  dim: DimensionKey
  layer: 1 | 2 | 3 | 4
  scenario: string
  options: [string, string, string, string]
  mostScores: [number, number, number, number]   // 1–4
  leastScores: [number, number, number, number]  // -2,-1,+1,+2
}

export const SJT_QUESTIONS: SJTQuestion[] = [

  // ════════════════════════════════════════════════════════════════
  // LAYER 1 — FONDASI KARAKTER (3 soal per dimensi)
  // ════════════════════════════════════════════════════════════════

  // ── INTEGRITAS ── (SJT-01 to 03) ─────────────────────────────────────────

  {
    id: 1, dim: 'integritas', layer: 1,
    scenario: 'Atasan sedang mempertimbangkan keputusan strategis yang menurut Anda kurang tepat berdasarkan data yang Anda miliki. Menyampaikannya bisa membuat suasana tidak nyaman.',
    options: [
      'Menyampaikan kekhawatiran secara langsung dan profesional ke atasan, dilengkapi data',
      'Menyampaikannya ke rekan dekat dulu — kalau banyak yang sepakat, baru disampaikan ke atasan bersama',
      'Diam — keputusan itu kewenangan atasan dan bukan posisi Anda untuk mempertanyakannya',
      'Menunggu keputusan berjalan, siapkan analisis jika diminta evaluasi nanti',
    ],
    mostScores:  [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },

  {
    id: 2, dim: 'integritas', layer: 1,
    scenario: 'Anda membuat kesalahan yang berdampak ke proyek tim, tapi ada peluang untuk mengarahkan persepsi ke faktor lain sehingga peran Anda tidak terlihat jelas.',
    options: [
      'Memanfaatkan situasi — semua orang menjaga reputasinya masing-masing',
      'Tidak secara aktif menyembunyikan, tapi juga tidak secara aktif mengakui jika tidak ditanya',
      'Mengakui ke atasan secara pribadi tapi tidak perlu diumumkan ke seluruh tim',
      'Mengakui kesalahan secara langsung ke atasan dan tim yang terdampak, sekaligus membawa solusi konkret',
    ],
    mostScores:  [1, 2, 3, 4],
    leastScores: [2, 1, -1, -2],
  },

  {
    id: 3, dim: 'integritas', layer: 1,
    scenario: 'Anda mengetahui rekan Anda secara konsisten melebih-lebihkan pencapaiannya dalam laporan bulanan. Atasan belum mengetahui hal ini.',
    options: [
      'Membicarakannya dengan rekan tersebut secara langsung dan mendorong dia untuk jujur ke atasan',
      'Membiarkan — itu urusan pribadi rekan Anda dan bukan tanggung jawab Anda untuk melaporkannya',
      'Melaporkan ke atasan setelah memiliki bukti yang cukup kuat agar tidak terlihat seperti mengadu',
      'Mendekati rekan Anda, jelaskan risikonya, dan berikan batas waktu untuk memperbaiki sendiri — jika tidak, Anda akan melaporkan',
    ],
    mostScores:  [3, 1, 2, 4],
    leastScores: [-1, 2, 1, -2],
  },

  // ── OWNERSHIP ── (SJT-04 to 06) ──────────────────────────────────────────

  {
    id: 4, dim: 'ownership', layer: 1,
    scenario: 'Anda mengetahui ada kesalahan laporan yang sudah dikirim ke manajemen. Kesalahan itu dilakukan rekan Anda yang sedang tidak masuk hari ini.',
    options: [
      'Menghubungi rekan tersebut agar dia yang melapor ke atasan secepatnya',
      'Langsung menghubungi atasan, mengakui ada kesalahan, dan menawarkan diri memperbaikinya hari ini',
      'Mendokumentasikan kesalahan dan menyiapkan draft perbaikan, menunggu rekan masuk besok untuk dikonfirmasi bersama',
      'Menunggu — kemungkinan manajemen belum membacanya dan masih bisa diatasi besok',
    ],
    mostScores:  [2, 4, 3, 1],
    leastScores: [1, -2, -1, 2],
  },

  {
    id: 5, dim: 'ownership', layer: 1,
    scenario: 'Tim Anda gagal mencapai target bulan ini. Atasan mengadakan sesi evaluasi dan meminta semua orang menyampaikan analisisnya.',
    options: [
      'Menyampaikan faktor-faktor eksternal yang mempengaruhi — kondisi pasar, support yang kurang, dan hal-hal di luar kendali tim',
      'Menganalisis secara jujur apa yang bisa dilakukan tim secara berbeda, termasuk kontribusi kesalahan diri sendiri, dan membawa rencana konkret',
      'Menyampaikan analisis yang seimbang antara faktor internal dan eksternal tanpa terlalu menyalahkan siapapun',
      'Mendengarkan dulu apa yang disampaikan rekan lain sebelum berbicara, menyesuaikan posisi dengan mayoritas',
    ],
    mostScores:  [1, 4, 3, 2],
    leastScores: [2, -2, -1, 1],
  },

  {
    id: 6, dim: 'ownership', layer: 1,
    scenario: 'Di akhir kuartal, Anda menyadari target yang Anda pegang kemungkinan tidak akan tercapai. Masih ada 10 hari tersisa.',
    options: [
      'Melaporkan situasi ke atasan dan meminta panduan tentang apa yang harus diprioritaskan',
      'Menerima bahwa target tidak akan tercapai dan fokus mempersiapkan kuartal berikutnya dengan lebih baik',
      'Sprint habis-habisan selama 10 hari — realokasi prioritas secara agresif dan cari creative way untuk menutup gap',
      'Menginformasikan ke atasan bahwa ada risiko tidak tercapai sambil menyajikan 3 opsi konkret untuk meresponsnya',
    ],
    mostScores:  [2, 1, 3, 4],
    leastScores: [1, 2, -1, -2],
  },

  // ── STANDAR PRIBADI ── (SJT-07 to 09) ────────────────────────────────────

  {
    id: 7, dim: 'standarPribadi', layer: 1,
    scenario: 'Anda baru menyelesaikan laporan yang diminta atasan. Atasan bilang "sudah bagus, langsung kirim." Tapi ada satu bagian yang menurut Anda datanya masih bisa diperkuat.',
    options: [
      'Mengirimkan sesuai kata atasan — dia yang paling tahu apakah sudah cukup',
      'Meminta 30 menit lagi untuk memperkuat bagian yang mengganjal, baru mengirimkan',
      'Mengirimkan, tapi mencatat bagian yang kurang untuk diperbaiki di laporan versi berikutnya',
      'Menginformasikan ke atasan bahwa ada bagian yang ingin Anda perkuat, meminta pendapatnya apakah perlu atau tidak',
    ],
    mostScores:  [1, 4, 3, 2],
    leastScores: [2, -2, -1, 1],
  },

  {
    id: 8, dim: 'standarPribadi', layer: 1,
    scenario: 'Atasan tidak masuk seharian. Tidak ada deadline mendesak. Suasana kantor sangat santai dan banyak rekan yang bersantai.',
    options: [
      'Mengerjakan semua tugas dengan standar yang sama seperti hari biasa, mengisi waktu lebih dengan hal yang produktif',
      'Menyelesaikan yang wajib terlebih dahulu, kemudian rehat dan mengobrol santai dengan rekan',
      'Mengerjakan tugas yang ada dengan ritme lebih santai — sesekali tidak apa-apa',
      'Mengisi waktu dengan membaca, belajar sesuatu yang baru, atau merapikan hal-hal yang biasanya tertunda',
    ],
    mostScores:  [4, 2, 1, 3],
    leastScores: [-2, 1, 2, -1],
  },

  {
    id: 9, dim: 'standarPribadi', layer: 1,
    scenario: 'Anda baru menyelesaikan presentasi besar dan mendapat tepuk tangan meriah dari seluruh ruangan. Atasan berkata "sempurna." Namun Anda tahu ada 2 pertanyaan yang tidak Anda jawab dengan baik.',
    options: [
      'Merasa lega — semua orang puas dan itu yang paling penting',
      'Secara proaktif mencari jawaban yang tepat dan mengirimkan follow-up ke peserta rapat',
      'Merasa sedikit tidak puas tapi memutuskan untuk tidak melakukan apapun karena tidak ada yang menuntutnya',
      'Menyampaikan ke atasan bahwa ada 2 pertanyaan yang ingin Anda tindaklanjuti dan meminta waktu untuk melakukannya',
    ],
    mostScores:  [1, 4, 2, 3],
    leastScores: [2, -2, 1, -1],
  },

  // ── EMOTIONALLY CONTROLLED ── (SJT-10 to 12) ─────────────────────────────

  {
    id: 10, dim: 'emotionallyControlled', layer: 1,
    scenario: 'Di tengah presentasi penting, seorang peserta menginterupsi dan mengkritik pekerjaan Anda dengan nada kasar di depan banyak orang.',
    options: [
      'Merespons dengan tegas bahwa cara seperti itu tidak pantas dilakukan di forum profesional',
      'Diam sejenak, merespons tenang pada substansi kritiknya bukan nadanya, lalu melanjutkan presentasi',
      'Mengakui kritiknya, meminta waktu untuk mendiskusikannya setelah sesi selesai, lalu melanjutkan',
      'Melanjutkan presentasi tanpa merespons — tidak ingin memperkeruh suasana',
    ],
    mostScores:  [1, 4, 3, 2],
    leastScores: [2, -2, -1, 1],
  },

  {
    id: 11, dim: 'emotionallyControlled', layer: 1,
    scenario: 'Tim sedang dalam tekanan tinggi karena deadline mepet dan ada konflik internal yang belum selesai. Suasana sangat tegang dan beberapa rekan terlihat frustrasi.',
    options: [
      'Menjaga emosi sendiri, fokus pada kontribusi konkret, dan berusaha menjadi penstabil tim',
      'Menyampaikan kekhawatiran tentang situasi tim ke atasan agar segera ditangani secara formal',
      'Menarik diri dari dinamika tim dan fokus pada pekerjaan sendiri agar tidak terpengaruh',
      'Mengajak tim bicara terbuka untuk melepaskan tekanan sebelum kembali bekerja',
    ],
    mostScores:  [4, 2, 1, 3],
    leastScores: [-2, 1, 2, -1],
  },

  {
    id: 12, dim: 'emotionallyControlled', layer: 1,
    scenario: 'Anda mendapat kabar mendadak bahwa proyek yang Anda kerjakan selama 2 bulan harus dihentikan karena perubahan prioritas perusahaan. Tim Anda sangat kecewa.',
    options: [
      'Luapkan kekecewaan Anda secara terbuka — wajar jika tim tahu Anda juga merasa frustrasi',
      'Menerima keputusan, mengakui kekecewaan secara singkat, lalu langsung fokus pada langkah berikutnya bersama tim',
      'Menyembunyikan kekecewaan sepenuhnya dan berpura-pura ini bukan masalah besar',
      'Mendiskusikan kekecewaan ini dengan tim secara mendalam sebelum membicarakan apa yang harus dilakukan selanjutnya',
    ],
    mostScores:  [1, 4, 2, 3],
    leastScores: [2, -2, 1, -1],
  },

  // ════════════════════════════════════════════════════════════════
  // LAYER 2 — MESIN PERFORMA (2 soal per dimensi)
  // ════════════════════════════════════════════════════════════════

  // ── CARA BERPIKIR ── (SJT-13 to 14) ──────────────────────────────────────

  {
    id: 13, dim: 'caraBerpikir', layer: 2,
    scenario: 'Masalah yang sama terus berulang di tim setiap bulan dan rekan-rekan sudah terbiasa menanganinya secara reaktif setiap kali muncul.',
    options: [
      'Menangani masalah setiap kali muncul dengan cepat dan efisien — sudah ada prosesnya',
      'Menangani masalah tersebut, lalu menganalisis akar penyebabnya dan mengusulkan solusi permanen',
      'Mendelegasikan penanganan masalah ke rekan yang lebih terbiasa, sambil fokus pada pekerjaan lain',
      'Mengangkat isu ini ke atasan agar ada keputusan struktural tentang cara penanganannya',
    ],
    mostScores:  [2, 4, 1, 3],
    leastScores: [1, -2, 2, -1],
  },

  {
    id: 14, dim: 'caraBerpikir', layer: 2,
    scenario: 'Anda diminta merekomendasikan: adopsi sistem baru yang lebih canggih tapi butuh adaptasi 2 bulan, atau tetap di sistem lama yang sudah berjalan.',
    options: [
      'Merekomendasikan sistem lama — operasional tidak boleh terganggu',
      'Merekomendasikan sistem baru — lebih canggih dan modern pasti lebih baik jangka panjang',
      'Menganalisis dampak jangka pendek vs panjang, biaya adaptasi vs manfaat, dan memberikan rekomendasi berbasis data dengan rencana transisi',
      'Mengusulkan pilot project kecil dulu untuk menguji sistem baru sebelum memutuskan secara penuh',
    ],
    mostScores:  [2, 1, 4, 3],
    leastScores: [1, 2, -2, -1],
  },

  // ── RESPONS FEEDBACK ── (SJT-15 to 16) ───────────────────────────────────

  {
    id: 15, dim: 'responsFeedback', layer: 2,
    scenario: 'Atasan mengkritik cara Anda berkomunikasi dengan klien — terlalu teknis dan kurang hangat. Anda tidak sepenuhnya setuju dengan penilaian itu.',
    options: [
      'Mengiyakan dan langsung mengubah cara komunikasi sesuai yang diminta',
      'Menyampaikan perspektif Anda dengan tenang berbasis data, tetap terbuka terhadap argumen atasan, lalu memutuskan langkah bersama',
      'Mengiyakan di depan dan mempertimbangkannya, tapi tidak berubah karena merasa cara Anda sudah tepat',
      'Meminta contoh spesifik dari situasi mana yang dianggap terlalu teknis sebelum memutuskan perlu berubah atau tidak',
    ],
    mostScores:  [2, 4, 1, 3],
    leastScores: [1, -2, 2, -1],
  },

  {
    id: 16, dim: 'responsFeedback', layer: 2,
    scenario: 'Seorang rekan junior memberi tahu bahwa cara Anda menjelaskan sesuatu sering membingungkan tim.',
    options: [
      'Berterima kasih atas masukannya dan mempertimbangkannya nanti',
      'Langsung meminta dia menjelaskan spesifik bagian mana yang membingungkan, lalu mengubah cara penjelasan mulai saat itu',
      'Mengonfirmasi ke rekan lain apakah mereka punya pengalaman yang sama sebelum mengambil kesimpulan',
      'Menjelaskan bahwa cara penyampaian Anda memang disesuaikan dengan tingkat pemahaman audiens — mungkin perlu penyesuaian konteks',
    ],
    mostScores:  [2, 4, 3, 1],
    leastScores: [1, -2, -1, 2],
  },

  // ── GROWTH MINDSET ── (SJT-17 to 18) ─────────────────────────────────────

  {
    id: 17, dim: 'growthMindset', layer: 2,
    scenario: 'Ada skill baru yang sangat relevan dengan pekerjaan Anda tapi perusahaan tidak menyediakan training-nya.',
    options: [
      'Mencari sendiri sumber belajarnya dan mulai mempelajari di waktu luang',
      'Mengajukan ke atasan agar perusahaan mengalokasikan training resmi',
      'Bertanya ke rekan yang sudah menguasainya sesekali jika ada kesempatan',
      'Menunggu sampai perusahaan menyediakan fasilitas belajarnya secara resmi',
    ],
    mostScores:  [4, 3, 2, 1],
    leastScores: [-2, -1, 1, 2],
  },

  {
    id: 18, dim: 'growthMindset', layer: 2,
    scenario: 'Anda menyadari bahwa pola kerja yang selama ini Anda andalkan kurang efektif — dan sudah berlangsung cukup lama.',
    options: [
      'Segera mengidentifikasi apa yang perlu diubah dan menerapkan cara baru secara konsisten mulai sekarang',
      'Mengubahnya secara bertahap agar transisi tidak terasa terlalu mengganggu rutinitas',
      'Mendiskusikan dengan rekan atau mentor dulu untuk memastikan analisis Anda benar sebelum berubah',
      'Mempertahankan cara lama untuk pekerjaan yang sudah berjalan, menerapkan cara baru hanya untuk pekerjaan baru',
    ],
    mostScores:  [4, 3, 2, 1],
    leastScores: [-2, -1, 1, 2],
  },

  // ── CONSCIENTIOUS ── (SJT-19 to 20) ──────────────────────────────────────

  {
    id: 19, dim: 'conscientious', layer: 2,
    scenario: 'Anda berjanji mengirimkan laporan ke rekan pukul 14.00, tapi ada pekerjaan mendadak dan baru bisa selesai pukul 15.30.',
    options: [
      'Menghubungi rekan sebelum pukul 14.00, menginformasikan keterlambatan dan estimasi baru',
      'Mengirimkan pukul 15.30 dengan permintaan maaf singkat — terlambat sedikit tidak terlalu masalah',
      'Mengirimkan draft yang belum selesai pukul 14.00 dan melengkapinya nanti',
      'Menyelesaikan pekerjaan mendadak dulu, baru mengirimkan laporan tanpa pemberitahuan awal',
    ],
    mostScores:  [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },

  {
    id: 20, dim: 'conscientious', layer: 2,
    scenario: 'Anda menemukan kesalahan kecil di pekerjaan yang sudah disubmit kemarin. Kemungkinan besar tidak ada yang menyadari.',
    options: [
      'Segera melaporkan ke atasan dan memperbaikinya hari ini',
      'Memperbaikinya secara diam-diam tanpa melaporkan — dampaknya minimal',
      'Memantau apakah ada yang menyadari — jika tidak ada reaksi, biarkan saja',
      'Melaporkan ke atasan secara proaktif sekaligus menyampaikan rencana pencegahan agar tidak terulang',
    ],
    mostScores:  [3, 2, 1, 4],
    leastScores: [-1, 1, 2, -2],
  },

  // ════════════════════════════════════════════════════════════════
  // LAYER 3 — PENGALI DAMPAK (2 soal per dimensi)
  // ════════════════════════════════════════════════════════════════

  // ── DAMPAK TIM ── (SJT-21 to 22) ─────────────────────────────────────────

  {
    id: 21, dim: 'dampakTim', layer: 3,
    scenario: 'Seorang rekan sudah beberapa minggu terlihat tidak bersemangat dan performanya menurun. Tidak ada yang menegurnya secara formal.',
    options: [
      'Mendekati rekan itu secara personal, mengecek kondisinya, dan menawarkan bantuan konkret',
      'Melaporkan situasi ini ke atasan agar ditangani secara formal dan terstruktur',
      'Membiarkan — kemungkinan masalah pribadi dan akan pulih sendiri',
      'Menyebutkan secara halus di rapat tim bahwa semangat perlu dijaga tanpa menyebut nama siapapun',
    ],
    mostScores:  [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },

  {
    id: 22, dim: 'dampakTim', layer: 3,
    scenario: 'Target tim bulan ini sudah tercapai di minggu ketiga. Masih ada satu minggu tersisa.',
    options: [
      'Menetapkan target pribadi lebih tinggi dan mengajak rekan yang belum tercapai untuk sprint bersama',
      'Mengisi waktu dengan merapikan administrasi, dokumentasi, dan hal-hal yang selama ini tertunda',
      'Beristirahat sejenak — target sudah tercapai dan perlu energi untuk bulan berikutnya',
      'Melaporkan ke atasan bahwa target tercapai dan menunggu arahan berikutnya',
    ],
    mostScores:  [4, 3, 2, 1],
    leastScores: [-2, -1, 1, 2],
  },

  // ── RESILIENSI ── (SJT-23 to 24) ─────────────────────────────────────────

  {
    id: 23, dim: 'resiliensi', layer: 3,
    scenario: 'Proyek besar yang Anda pimpin gagal total setelah 3 bulan kerja keras. Semua pihak kecewa.',
    options: [
      'Langsung menganalisis apa yang salah, mendokumentasikan pelajarannya, dan memulai proyek berikutnya dengan pendekatan yang sudah diperbarui',
      'Fokus pada pekerjaan rutin yang lebih aman dulu sebelum mengambil proyek besar lagi',
      'Meminta atasan untuk mengurangi tanggung jawab sementara sampai kepercayaan diri pulih',
      'Membutuhkan waktu beberapa minggu untuk memproses kegagalan ini sebelum bisa bergerak maju',
    ],
    mostScores:  [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },

  {
    id: 24, dim: 'resiliensi', layer: 3,
    scenario: 'Anda mendapat feedback keras dari klien penting yang menyebut pekerjaan Anda jauh di bawah ekspektasi.',
    options: [
      'Meminta klien menjelaskan spesifik apa yang di bawah ekspektasi dan menyampaikan rencana perbaikan dalam 24 jam',
      'Menjelaskan konteks dan alasan mengapa hasilnya seperti itu agar klien memahami situasinya',
      'Meminta atasan untuk ikut berbicara dengan klien agar ada dukungan dari sisi manajemen',
      'Membutuhkan beberapa hari untuk memproses feedback itu sebelum merespons secara profesional',
    ],
    mostScores:  [4, 1, 3, 2],
    leastScores: [-2, 2, -1, 1],
  },

  // ── COMMUNICATION CLARITY ── (SJT-25 to 26) ──────────────────────────────

  {
    id: 25, dim: 'communicationClarity', layer: 3,
    scenario: 'Anda harus menyampaikan laporan teknis kompleks kepada tim manajemen yang tidak berlatar belakang teknis.',
    options: [
      'Menyampaikan seluruh detail teknis agar manajemen mendapat gambaran paling lengkap dan akurat',
      'Menyiapkan 3 poin utama yang relevan bagi manajemen, dengan detail teknis sebagai lampiran jika ingin mendalami',
      'Meminta rekan teknis untuk menyampaikannya karena lebih menguasai detailnya',
      'Menyampaikan ringkasan singkat dan membuka sesi tanya jawab panjang untuk mengakomodasi semua kebutuhan',
    ],
    mostScores:  [2, 4, 1, 3],
    leastScores: [1, -2, 2, -1],
  },

  {
    id: 26, dim: 'communicationClarity', layer: 3,
    scenario: 'Setelah menjelaskan sesuatu cukup panjang, audiens terlihat bingung tapi tidak ada yang bertanya.',
    options: [
      'Melanjutkan ke poin berikutnya — jika ada yang bingung mereka akan bertanya sendiri',
      'Mengirimkan ulang materi dalam bentuk tulisan setelah sesi untuk membantu yang belum paham',
      'Berhenti, mengecek pemahaman dengan pertanyaan langsung, lalu menjelaskan ulang dengan cara berbeda',
      'Bertanya "Ada yang kurang jelas?" — jika tidak ada respons, berarti sudah dipahami',
    ],
    mostScores:  [1, 3, 4, 2],
    leastScores: [2, -1, -2, 1],
  },

  // ════════════════════════════════════════════════════════════════
  // LAYER 4 — AMPLIFIER KONTEKSTUAL (2 soal per dimensi)
  // ════════════════════════════════════════════════════════════════

  // ── DECISIVE ── (SJT-27 to 28) ───────────────────────────────────────────

  {
    id: 27, dim: 'decisive', layer: 4,
    scenario: 'Anda harus memilih vendor untuk proyek penting, tapi informasi belum lengkap, waktu habis, dan atasan tidak bisa dihubungi.',
    options: [
      'Menunggu atasan bisa dihubungi meski proyek tertunda',
      'Memilih vendor yang paling dikenal dan paling aman meski bukan yang terbaik di atas kertas',
      'Mengumpulkan informasi yang ada, menimbang risiko dengan cepat, memutuskan, dan mendokumentasikan alasan untuk dilaporkan ke atasan',
      'Mengajak rekan senior berdiskusi singkat untuk memutuskan bersama agar tanggung jawab terbagi',
    ],
    mostScores:  [1, 2, 4, 3],
    leastScores: [2, 1, -2, -1],
  },

  {
    id: 28, dim: 'decisive', layer: 4,
    scenario: 'Di tengah rapat ada perdebatan sengit. Semua meminta Anda mengambil posisi. Anda sudah punya pandangan tapi belum 100% yakin.',
    options: [
      'Menyampaikan pandangan Anda secara jelas beserta alasannya, terbuka jika ada argumen yang lebih kuat',
      'Mengatakan Anda perlu lebih banyak data sebelum mengambil posisi',
      'Mengikuti posisi mayoritas agar rapat bisa selesai produktif',
      'Mengusulkan keputusan ditunda dan dibawa ke rapat berikutnya dengan data lebih lengkap',
    ],
    mostScores:  [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },

  // ── INNOVATIVE ── (SJT-29 to 30) ─────────────────────────────────────────

  {
    id: 29, dim: 'innovative', layer: 4,
    scenario: 'Anda menemukan cara yang bisa mempersingkat proses kerja tim 40%, tapi belum pernah dicoba dan ada risiko awal.',
    options: [
      'Menyimpan ide ini sampai ada waktu dan kondisi yang lebih tepat untuk mengusulkannya',
      'Mendokumentasikan, menguji di skala kecil, lalu mempresentasikan hasilnya ke atasan dengan data',
      'Mengusulkan langsung ke atasan dan membiarkan mereka yang memutuskan apakah akan dicoba',
      'Langsung menerapkan sendiri dulu dan membandingkan hasilnya sebelum melibatkan orang lain',
    ],
    mostScores:  [1, 4, 3, 2],
    leastScores: [2, -2, -1, 1],
  },

  {
    id: 30, dim: 'innovative', layer: 4,
    scenario: 'Tim Anda sudah menggunakan cara kerja yang sama selama 2 tahun — berjalan, tapi ada celah besar untuk ditingkatkan.',
    options: [
      'Melanjutkan cara yang sudah ada — konsistensi lebih penting dari perubahan yang belum terbukti',
      'Mengubah cara kerja sendiri secara diam-diam tanpa mengubah standar tim',
      'Menyiapkan analisis perbandingan dan roadmap perubahan yang realistis, lalu mempresentasikannya ke atasan',
      'Mendiskusikan ide peningkatan ini di rapat tim untuk mendapat masukan sebelum mengusulkan ke atasan',
    ],
    mostScores:  [1, 2, 4, 3],
    leastScores: [2, 1, -2, -1],
  },
]

// ─── VERIFICATION ─────────────────────────────────────────────────────────
export function verifySJT(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  SJT_QUESTIONS.forEach(q => {
    const maxP = Math.max(...q.mostScores) + Math.max(...q.leastScores)
    const minP = Math.min(...q.mostScores) + Math.min(...q.leastScores)
    const mostUnique = new Set(q.mostScores).size === 4
    const leastValid = q.leastScores.every(s => [-2,-1,1,2].includes(s))
    const leastUnique = new Set(q.leastScores).size === 4

    if (maxP !== 6) errors.push(`SJT-${q.id}: maxPossible=${maxP} (expected 6)`)
    if (minP !== -1) errors.push(`SJT-${q.id}: minPossible=${minP} (expected -1)`)
    if (!mostUnique) errors.push(`SJT-${q.id}: mostScores not unique 1-4`)
    if (!leastValid) errors.push(`SJT-${q.id}: leastScores invalid values`)
    if (!leastUnique) errors.push(`SJT-${q.id}: leastScores not unique`)
  })

  const dimCount: Record<string, number> = {}
  SJT_QUESTIONS.forEach(q => {
    dimCount[q.dim] = (dimCount[q.dim] || 0) + 1
  })

  const expected: Record<string, number> = {
    integritas: 3, ownership: 3, standarPribadi: 3, emotionallyControlled: 3,
    caraBerpikir: 2, responsFeedback: 2, growthMindset: 2, conscientious: 2,
    dampakTim: 2, resiliensi: 2, communicationClarity: 2,
    decisive: 2, innovative: 2,
  }
  Object.entries(expected).forEach(([dim, exp]) => {
    if ((dimCount[dim] || 0) !== exp) {
      errors.push(`${dim}: ${dimCount[dim] || 0} soal (expected ${exp})`)
    }
  })

  if (SJT_QUESTIONS.length !== 30) errors.push(`Total: ${SJT_QUESTIONS.length} (expected 30)`)

  return { valid: errors.length === 0, errors }
}
