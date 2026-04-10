// lib/questions/bei.ts + scoring rubric
// Behavioral Event Interview — 8 STAR-format questions
// AI-scored using dimension-specific rubrics
// Validitas prediktif: r ≈ 0.51 (tertinggi dari semua metode)

import type { DimensionKey } from '@/lib/scoring'

// ─── TYPES ─────────────────────────────────────────────────────────────────

export interface BEIQuestion {
  id: string
  targetDims: DimensionKey[]   // dimensi utama yang diukur
  title: string
  question: string
  probe: string[]              // follow-up probes jika jawaban kurang spesifik
  minWords: number             // minimum kata untuk jawaban valid
  timeLimit: number            // detik
}

export interface BEIRubricLevel {
  score: 1 | 2 | 3 | 4 | 5
  label: string
  description: string
  indicators: string[]
}

export interface BEIRubric {
  questionId: string
  targetDims: DimensionKey[]
  levels: BEIRubricLevel[]
  redFlags: string[]           // jika ada, turunkan skor 1 level
  aiPrompt: string             // system prompt untuk AI scorer
}

// ─── BEI QUESTIONS ─────────────────────────────────────────────────────────

export const BEI_QUESTIONS: BEIQuestion[] = [

  {
    id: 'BEI-01',
    targetDims: ['integritas', 'ownership'],
    title: 'Momen kejujuran yang sulit',
    question: 'Ceritakan satu situasi konkret ketika Anda bisa saja menyembunyikan sebuah kesalahan atau informasi buruk, tapi memilih untuk tidak melakukannya. Apa situasinya, apa yang Anda lakukan, dan apa konsekuensinya?',
    probe: [
      'Apa yang membuat situasi itu sulit untuk diungkapkan?',
      'Apa yang konkret Anda lakukan — bukan hanya niat atau pikiran?',
      'Apa yang terjadi setelahnya — baik untuk Anda maupun untuk situasinya?',
      'Jika Anda melakukan hal yang berbeda, apa yang mungkin terjadi?',
    ],
    minWords: 80,
    timeLimit: 300,
  },

  {
    id: 'BEI-02',
    targetDims: ['ownership', 'resiliensi'],
    title: 'Kegagalan terbesar',
    question: 'Ceritakan kegagalan terbesar yang pernah Anda alami dalam pekerjaan. Bukan yang kecil — pilih yang benar-benar terasa berat. Apa yang terjadi, apa peran Anda di dalamnya, dan bagaimana Anda meresponsnya?',
    probe: [
      'Apa kontribusi spesifik Anda terhadap kegagalan itu?',
      'Apa yang Anda lakukan dalam 48 jam pertama setelah kegagalan itu diketahui?',
      'Apa yang berbeda dari cara Anda bekerja sekarang sebagai hasil dari pengalaman itu?',
    ],
    minWords: 100,
    timeLimit: 360,
  },

  {
    id: 'BEI-03',
    targetDims: ['standarPribadi', 'growthMindset'],
    title: 'Inisiatif pengembangan diri',
    question: 'Ceritakan perubahan paling signifikan yang Anda buat pada cara kerja atau cara berpikir Anda dalam 12 bulan terakhir — yang tidak diminta atau diwajibkan oleh perusahaan. Apa yang mendorongnya dan seperti apa hasilnya sekarang?',
    probe: [
      'Bagaimana Anda menyadari ada yang perlu diubah?',
      'Apa langkah konkret pertama yang Anda ambil?',
      'Bagaimana Anda mengukur bahwa perubahannya berhasil?',
      'Apa yang masih ingin Anda tingkatkan lagi?',
    ],
    minWords: 80,
    timeLimit: 300,
  },

  {
    id: 'BEI-04',
    targetDims: ['caraBerpikir', 'decisive'],
    title: 'Keputusan sulit dengan informasi terbatas',
    question: 'Ceritakan satu keputusan penting yang pernah Anda ambil ketika informasinya tidak lengkap dan waktu tidak bisa menunggu. Apa situasinya, bagaimana proses Anda memutuskan, dan apa yang terjadi?',
    probe: [
      'Informasi apa yang Anda punya saat itu dan apa yang tidak Anda punya?',
      'Apa pertimbangan-pertimbangan yang Anda pikirkan sebelum memutuskan?',
      'Apakah keputusan itu terbukti tepat? Jika tidak, apa yang Anda pelajari?',
    ],
    minWords: 80,
    timeLimit: 300,
  },

  {
    id: 'BEI-05',
    targetDims: ['dampakTim', 'communicationClarity'],
    title: 'Mengubah standar orang lain',
    question: 'Tanpa menyebut jabatan atau posisi formal Anda, ceritakan situasi konkret ketika Anda berhasil mengubah cara pikir, standar, atau cara kerja orang-orang di sekitar Anda. Apa yang Anda lakukan dan bagaimana Anda tahu perubahan itu terjadi?',
    probe: [
      'Apa yang spesifik Anda lakukan — bukan hanya "menjadi contoh"?',
      'Bagaimana reaksi awal orang-orang tersebut?',
      'Apa bukti konkret bahwa perubahan itu benar-benar terjadi dan bertahan?',
    ],
    minWords: 80,
    timeLimit: 300,
  },

  {
    id: 'BEI-06',
    targetDims: ['emotionallyControlled', 'resiliensi'],
    title: 'Situasi kerja paling menekan',
    question: 'Ceritakan situasi kerja yang paling menekan yang pernah Anda hadapi — bukan tekanan biasa, tapi yang benar-benar terasa di luar kapasitas Anda. Bagaimana kondisi Anda saat itu, dan strategi konkret apa yang Anda gunakan untuk tetap efektif?',
    probe: [
      'Apa yang membuat situasi itu berbeda dari tekanan kerja normal?',
      'Bagaimana pengaruhnya terhadap performa Anda — jujur?',
      'Apa yang konkret Anda lakukan untuk menjaga diri tetap berfungsi?',
      'Apa yang akan Anda lakukan berbeda jika situasi itu terjadi lagi?',
    ],
    minWords: 100,
    timeLimit: 360,
  },

  {
    id: 'BEI-07',
    targetDims: ['responsFeedback', 'standarPribadi'],
    title: 'Feedback yang mengubah Anda',
    question: 'Ceritakan feedback terkeras atau paling tidak menyenangkan yang pernah Anda terima dalam karier profesional Anda. Bagaimana reaksi awal Anda, dan apa yang Anda lakukan setelah itu?',
    probe: [
      'Apa reaksi pertama Anda saat mendengar feedback itu?',
      'Bagaimana Anda memproses antara apa yang Anda rasakan dan apa yang perlu Anda lakukan?',
      'Apa perubahan konkret yang terjadi setelah Anda menerima feedback itu?',
      'Apakah feedback itu akhirnya terbukti benar, sebagian benar, atau salah?',
    ],
    minWords: 80,
    timeLimit: 300,
  },

  {
    id: 'BEI-08',
    targetDims: ['innovative', 'caraBerpikir'],
    title: 'Inisiatif perbaikan yang dieksekusi',
    question: 'Ceritakan satu ide perbaikan proses, sistem, atau cara kerja yang Anda inisiasi sendiri — bukan disuruh — dan berhasil diimplementasikan. Apa idenya, bagaimana Anda meyakinkan orang lain, dan apa hasilnya?',
    probe: [
      'Bagaimana Anda menyadari ada peluang perbaikan di sana?',
      'Apa resistensi yang Anda hadapi dan bagaimana Anda mengatasinya?',
      'Bagaimana Anda mengukur bahwa implementasinya berhasil?',
      'Apa yang akan Anda lakukan berbeda jika memulai dari awal lagi?',
    ],
    minWords: 80,
    timeLimit: 300,
  },
]

// ─── BEI SCORING RUBRICS ────────────────────────────────────────────────────

export const BEI_RUBRICS: BEIRubric[] = [

  {
    questionId: 'BEI-01',
    targetDims: ['integritas', 'ownership'],
    levels: [
      {
        score: 5, label: 'Exceptional',
        description: 'Jujur secara proaktif dengan risiko nyata, bawa solusi, dan terbukti mendapat konsekuensi positif jangka panjang',
        indicators: [
          'Contoh sangat spesifik — ada nama situasi, waktu, orang yang terlibat',
          'Risiko yang diambil nyata dan signifikan (bukan situasi yang aman)',
          'Mengakui tanpa diminta dan sebelum ada yang menyadari',
          'Membawa solusi bersamaan dengan pengakuan',
          'Menyebutkan dampak ke orang lain dan sistem, bukan hanya diri sendiri',
        ]
      },
      {
        score: 4, label: 'Strong',
        description: 'Jujur dengan risiko yang terasa nyata, meski tidak sampai membawa solusi langsung',
        indicators: [
          'Contoh spesifik dengan konteks yang jelas',
          'Ada keberanian yang terasa genuine (bukan hanya formalitas)',
          'Dampak ke orang lain disebutkan',
          'Refleksi tentang pelajaran yang diambil',
        ]
      },
      {
        score: 3, label: 'Adequate',
        description: 'Jujur dalam situasi di mana kejujuran adalah hal yang expected',
        indicators: [
          'Contoh ada tapi risikonya minimal',
          'Situasi yang dipilih cenderung "aman" untuk diungkapkan',
          'Fokus pada outcome-nya saja, kurang pada proses dan pilihan',
        ]
      },
      {
        score: 2, label: 'Weak',
        description: 'Contoh sangat generik atau situasinya terlalu kecil untuk menunjukkan pola karakter',
        indicators: [
          'Contoh tidak spesifik — "saya selalu jujur" tanpa contoh nyata',
          'Situasi yang sangat kecil dan tidak relevan',
          'Tidak bisa menjawab probe dengan detail yang memadai',
        ]
      },
      {
        score: 1, label: 'Concerning',
        description: 'Tidak bisa memberikan contoh, atau contoh menunjukkan pola yang berlawanan',
        indicators: [
          'Tidak bisa menyebut satu contoh nyata setelah diminta',
          'Contoh justru menunjukkan bahwa dia memilih diam atau menyembunyikan',
          'Framing "tidak ada yang tahu, jadi tidak masalah"',
        ]
      },
    ],
    redFlags: [
      'Menyebut "tergantung situasinya" tanpa bisa menjelaskan kapan jujur dan kapan tidak',
      'Semua contohnya adalah situasi di mana kejujuran tidak ada risikonya',
      'Tidak bisa menjawab probe ketiga tentang konsekuensi',
    ],
    aiPrompt: `Anda adalah assessor psikologi I/O yang mengevaluasi jawaban BEI untuk dimensi INTEGRITAS dan OWNERSHIP.

Evaluasi jawaban berdasarkan rubrik berikut:
- Skor 5: Jujur proaktif dengan risiko nyata, bawa solusi, ungkap sebelum ada yang tahu
- Skor 4: Jujur dengan risiko yang genuine, reflektif, dampak ke orang lain disebut
- Skor 3: Jujur tapi dalam situasi yang expected/aman
- Skor 2: Contoh generik atau terlalu kecil
- Skor 1: Tidak bisa beri contoh, atau contoh menunjukkan pola berlawanan

Perhatikan:
1. Seberapa spesifik contohnya (nama situasi, konteks, siapa yang terlibat)
2. Seberapa nyata risikonya (bukan situasi yang aman untuk diungkapkan)
3. Apakah jawaban menggunakan "I" (saya) atau "kami/tim" berlebihan
4. Apakah ada refleksi genuine atau hanya narasi positif yang terstruktur
5. Konsistensi antara narasi dan detail yang bisa diverifikasi

Output JSON: { "score": 1-5, "confidence": "high|medium|low", "reasoning": "...", "redFlags": ["..."], "dimensionScores": { "integritas": 1-5, "ownership": 1-5 } }`,
  },

  {
    questionId: 'BEI-02',
    targetDims: ['ownership', 'resiliensi'],
    levels: [
      {
        score: 5, label: 'Exceptional',
        description: 'Kegagalan yang dipilih benar-benar signifikan, kontribusi diri diakui secara spesifik, dan ada perubahan cara kerja yang konkret dan terverifikasi',
        indicators: [
          'Kegagalan yang dipilih memang berat — bukan kegagalan kecil yang "aman"',
          'Menyebut kontribusi spesifik diri sendiri tanpa berlebihan menyalahkan faktor lain',
          'Tindakan dalam 48-72 jam pertama sangat konkret',
          'Perubahan cara kerja setelah itu spesifik dan terukur',
          'Tidak ada defensiveness atau justifikasi berlebihan',
        ]
      },
      {
        score: 4, label: 'Strong',
        description: 'Contoh kegagalan nyata dengan akuntabilitas yang genuine dan pembelajaran yang jelas',
        indicators: [
          'Contoh kegagalan cukup signifikan',
          'Akuntabilitas ada meski masih ada sedikit atribusi ke faktor eksternal',
          'Pembelajaran disebutkan dengan cukup spesifik',
        ]
      },
      {
        score: 3, label: 'Adequate',
        description: 'Kegagalan yang dipilih kecil atau akuntabilitasnya terbagi-bagi dengan banyak faktor lain',
        indicators: [
          'Kegagalan yang dipilih cenderung kecil atau sudah lama',
          'Banyak menyebut faktor eksternal meski ada akuntabilitas diri',
          'Pembelajaran ada tapi kurang spesifik',
        ]
      },
      {
        score: 2, label: 'Weak',
        description: 'Tidak bisa memilih kegagalan yang signifikan, atau kegagalan diatribusikan hampir seluruhnya ke faktor lain',
        indicators: [
          'Kegagalan yang dipilih sangat kecil atau tidak relevan',
          'Hampir seluruh narasi tentang faktor eksternal',
          'Sedikit atau tidak ada refleksi personal',
        ]
      },
      {
        score: 1, label: 'Concerning',
        description: 'Tidak bisa memberikan contoh kegagalan yang nyata, atau contoh menunjukkan tidak ada akuntabilitas sama sekali',
        indicators: [
          '"Saya tidak pernah benar-benar gagal" atau "kegagalan itu bukan salah saya"',
          'Kegagalan yang disebut sebenarnya sukses yang diframe sebagai kegagalan',
          'Sepenuhnya menyalahkan orang lain atau sistem',
        ]
      },
    ],
    redFlags: [
      '"Kegagalan terbesar saya adalah ketika tim saya yang gagal" — distansi diri dari kegagalan',
      'Tidak bisa menjawab "apa kontribusi spesifik Anda" setelah probe',
      'Kegagalan yang dipilih sangat kecil dibanding level pengalamannya',
    ],
    aiPrompt: `Anda mengevaluasi jawaban BEI untuk dimensi OWNERSHIP dan RESILIENSI.

Fokus evaluasi:
1. Signifikansi kegagalan yang dipilih (skalanya proporsional dengan pengalaman?)
2. Rasio "I" vs "kami/tim/kondisi" dalam menjelaskan penyebab
3. Konkretnya tindakan yang diambil setelah kegagalan
4. Spesifiknya perubahan cara kerja yang terjadi setelahnya
5. Ada/tidak adanya defensiveness atau justifikasi berlebihan

Skor 5 = kegagalan besar + akuntabilitas penuh + tindakan konkret + perubahan terukur
Skor 1 = tidak bisa beri contoh nyata atau seluruhnya atribusi ke faktor lain

Output JSON: { "score": 1-5, "confidence": "high|medium|low", "reasoning": "...", "redFlags": ["..."], "dimensionScores": { "ownership": 1-5, "resiliensi": 1-5 } }`,
  },

  {
    questionId: 'BEI-03',
    targetDims: ['standarPribadi', 'growthMindset'],
    levels: [
      {
        score: 5, label: 'Exceptional',
        description: 'Perubahan yang dipilih besar dan self-initiated, proses belajar mandiri terdetail, dan dampaknya terukur',
        indicators: [
          'Perubahan yang dipilih memang signifikan — bukan hal kecil',
          'Inisiasinya 100% dari diri sendiri tanpa trigger eksternal',
          'Proses belajar/perubahan spesifik dan detil',
          'Dampak yang dirasakan nyata dan bisa diukur',
          'Sudah memikirkan apa yang mau dikembangkan berikutnya',
        ]
      },
      {
        score: 4, label: 'Strong',
        description: 'Perubahan nyata yang self-initiated meski ada trigger eksternal yang membantu',
        indicators: [
          'Inisiatif genuine meski mungkin ada catalyst eksternal',
          'Proses perubahan cukup spesifik',
          'Dampak yang dirasakan real',
        ]
      },
      {
        score: 3, label: 'Adequate',
        description: 'Ada perubahan tapi sebagian besar dipicu oleh kebutuhan eksternal atau feedback dari orang lain',
        indicators: [
          'Ada trigger eksternal yang signifikan',
          'Perubahan ada tapi berskala kecil',
        ]
      },
      {
        score: 2, label: 'Weak',
        description: 'Perubahan yang disebutkan adalah mengikuti training formal atau instruksi dari atasan',
        indicators: [
          'Training yang diwajibkan perusahaan disebut sebagai "inisiatif sendiri"',
          'Tidak ada contoh perubahan yang benar-benar mandiri',
        ]
      },
      {
        score: 1, label: 'Concerning',
        description: 'Tidak bisa memberikan contoh perubahan signifikan yang self-initiated dalam 12 bulan terakhir',
        indicators: [
          '"Saya sudah cukup baik di bidang ini" atau tidak ada yang berubah',
          'Semua perubahan adalah respon terhadap tuntutan eksternal',
        ]
      },
    ],
    redFlags: [
      'Menyebut training wajib sebagai contoh pengembangan diri mandiri',
      'Tidak bisa menjawab "bagaimana Anda mengukur berhasilnya" setelah probe',
      '"Saya selalu belajar" tanpa bisa menyebut satu hal spesifik',
    ],
    aiPrompt: `Evaluasi BEI untuk STANDAR PRIBADI dan GROWTH MINDSET.

Perhatikan:
1. Apakah inisiatif benar-benar dari dalam (internal drive) atau respon eksternal?
2. Seberapa signifikan perubahannya — tidak hanya besar di mata peserta tapi secara objektif?
3. Seberapa spesifik proses belajar/perubahannya?
4. Apakah ada metrik atau indikator konkret keberhasilan?
5. Apakah peserta sudah memikirkan langkah pengembangan berikutnya?

Skor 5 = 100% self-initiated + perubahan signifikan + proses spesifik + dampak terukur + ada next step
Skor 1 = tidak ada contoh mandiri atau semua reaktif terhadap tuntutan eksternal

Output JSON: { "score": 1-5, "confidence": "high|medium|low", "reasoning": "...", "redFlags": ["..."], "dimensionScores": { "standarPribadi": 1-5, "growthMindset": 1-5 } }`,
  },

  {
    questionId: 'BEI-04',
    targetDims: ['caraBerpikir', 'decisive'],
    levels: [
      {
        score: 5, label: 'Exceptional',
        description: 'Proses pengambilan keputusan sangat terstruktur di bawah tekanan, eksplisit dalam trade-off, dan belajar dari hasilnya',
        indicators: [
          'Menjelaskan informasi yang ADA dan yang TIDAK ADA secara spesifik',
          'Proses pertimbangan trade-off yang eksplisit',
          'Keputusan diambil dengan deadline yang jelas',
          'Tidak hanya narasi hasilnya tapi juga prosesnya',
          'Jika salah, bisa menjelaskan apa yang dipelajari secara spesifik',
        ]
      },
      {
        score: 4, label: 'Strong',
        description: 'Pengambilan keputusan yang decisif dengan reasoning yang cukup terstruktur',
        indicators: [
          'Decisive meski ada ketidakpastian',
          'Reasoning cukup eksplisit',
          'Belajar dari hasilnya',
        ]
      },
      {
        score: 3, label: 'Adequate',
        description: 'Keputusan diambil tapi prosesnya kurang terstruktur atau lebih banyak mengandalkan intuisi',
        indicators: [
          'Keputusan ada tapi proses kurang terjelaskan',
          'Lebih banyak "feeling" daripada analisis',
        ]
      },
      {
        score: 2, label: 'Weak',
        description: 'Keputusan sebenarnya dilakukan bersama atau didelegasikan ke atasan',
        indicators: [
          '"Kami memutuskan bersama" tanpa peran yang jelas',
          'Eskalasi ke atasan sebagai solusi utama',
        ]
      },
      {
        score: 1, label: 'Concerning',
        description: 'Tidak bisa memberikan contoh keputusan penting yang diambil sendiri, atau selalu menunggu kepastian penuh',
        indicators: [
          '"Saya menunggu sampai semua informasi tersedia"',
          'Keputusan selalu bersama atau oleh atasan',
        ]
      },
    ],
    redFlags: [
      'Selalu menyebut "kami memutuskan" tanpa peran spesifik dirinya',
      'Contoh keputusan sangat kecil dibanding pengalaman yang dimiliki',
      'Tidak bisa menjawab "apa yang Anda pertimbangkan" dengan lebih dari satu faktor',
    ],
    aiPrompt: `Evaluasi BEI untuk CARA BERPIKIR dan DECISIVE.

Perhatikan:
1. Seberapa terstruktur proses pertimbangannya (lebih dari sekedar intuisi)?
2. Apakah benar-benar decisive atau menunggu konsensus/kepastian?
3. Apakah bisa menjelaskan trade-off yang dipertimbangkan secara eksplisit?
4. Apakah ada akuntabilitas atas keputusan tersebut — bukan "kami"?
5. Bagaimana dia belajar dari hasilnya?

Skor 5 = proses terstruktur + trade-off eksplisit + deadline dipenuhi + belajar konkret
Skor 1 = selalu menunggu kepastian atau eskalasi ke atasan

Output JSON: { "score": 1-5, "confidence": "high|medium|low", "reasoning": "...", "redFlags": ["..."], "dimensionScores": { "caraBerpikir": 1-5, "decisive": 1-5 } }`,
  },

  {
    questionId: 'BEI-05',
    targetDims: ['dampakTim', 'communicationClarity'],
    levels: [
      {
        score: 5, label: 'Exceptional',
        description: 'Dampak ke orang lain terukur dan konkret, tanpa bergantung pada otoritas formal, dan bertahan setelah mereka pergi',
        indicators: [
          'Bisa menyebut nama spesifik atau peran yang terpengaruh',
          'Mekanisme pengaruhnya dijelaskan — bukan hanya "jadi contoh"',
          'Bukti perubahan yang konkret dan bisa diverifikasi',
          'Perubahan bertahan bahkan setelah dia tidak ada',
          'Tidak mengklaim pengaruh yang sebenarnya datang dari sistem atau atasan',
        ]
      },
      {
        score: 4, label: 'Strong',
        description: 'Dampak nyata ke orang lain dengan mekanisme yang cukup jelas',
        indicators: [
          'Contoh spesifik orang yang terpengaruh',
          'Mekanisme pengaruh cukup jelas',
          'Bukti yang bisa dirujuk',
        ]
      },
      {
        score: 3, label: 'Adequate',
        description: 'Mengklaim dampak ke tim tapi buktinya kurang konkret atau mekanismenya tidak jelas',
        indicators: [
          'Klaim dampak ada tapi sulit diverifikasi',
          'Lebih banyak narasi daripada bukti',
        ]
      },
      {
        score: 2, label: 'Weak',
        description: 'Dampak yang disebutkan adalah dampak dari peran formal atau sistemnya bukan dari pengaruh personal',
        indicators: [
          'Dampak datang dari posisi atau otoritas, bukan pengaruh personal',
          'Tidak bisa bedakan dampak dirinya vs dampak sistem',
        ]
      },
      {
        score: 1, label: 'Concerning',
        description: 'Tidak bisa memberikan contoh dampak ke orang lain di luar jobdesc formal',
        indicators: [
          '"Saya hanya fokus mengerjakan bagian saya dengan baik"',
          'Tidak ada kesadaran tentang pengaruh ke orang sekitar',
        ]
      },
    ],
    redFlags: [
      '"Saya mengubah mereka dengan menjadi contoh yang baik" — terlalu generik',
      'Tidak bisa menyebut orang spesifik yang terpengaruh',
      'Semua dampak datang dari otoritas formal bukan pengaruh personal',
    ],
    aiPrompt: `Evaluasi BEI untuk DAMPAK TIM dan COMMUNICATION CLARITY.

Perhatikan:
1. Apakah dampak ke orang lain nyata dan bisa diverifikasi (bukan klaim semata)?
2. Apakah mekanisme pengaruhnya lebih dari sekadar "menjadi contoh"?
3. Apakah dampak datang dari pengaruh personal atau dari otoritas formal?
4. Seberapa jelas komunikasinya dalam cerita yang disampaikan?
5. Apakah ada bukti yang konkret (perubahan perilaku terukur, bukan perasaan)?

Skor 5 = dampak terukur + mekanisme jelas + tanpa otoritas formal + bertahan
Skor 1 = tidak ada contoh atau dampak dari otoritas saja

Output JSON: { "score": 1-5, "confidence": "high|medium|low", "reasoning": "...", "redFlags": ["..."], "dimensionScores": { "dampakTim": 1-5, "communicationClarity": 1-5 } }`,
  },

  {
    questionId: 'BEI-06',
    targetDims: ['emotionallyControlled', 'resiliensi'],
    levels: [
      {
        score: 5, label: 'Exceptional',
        description: 'Situasi tekanan yang benar-benar ekstrem, strategi self-regulation yang sangat konkret, dan performa terjaga',
        indicators: [
          'Situasi yang dipilih memang sangat berat secara objektif',
          'Mengakui dampak emosional dengan jujur tanpa dramatisasi',
          'Strategi coping yang konkret dan deliberate (bukan "saya tetap kuat")',
          'Performa tetap terjaga meski ada penurunan yang diakui',
          'Pelajaran yang diambil sangat spesifik',
        ]
      },
      {
        score: 4, label: 'Strong',
        description: 'Tekanan nyata, strategi yang cukup konkret, dan performa tidak kolaps',
        indicators: [
          'Situasi cukup berat',
          'Strategi ada dan cukup spesifik',
          'Ada pelajaran yang diambil',
        ]
      },
      {
        score: 3, label: 'Adequate',
        description: 'Situasi tekanan biasa, strategi generik, dan narasi lebih pada "saya berhasil melewati"',
        indicators: [
          'Tekanan dalam batas normal',
          'Strategi generik ("saya tetap fokus")',
          'Sedikit refleksi mendalam',
        ]
      },
      {
        score: 2, label: 'Weak',
        description: 'Tidak bisa mengakui dampak emosional, atau situasinya bukan tekanan yang nyata',
        indicators: [
          '"Saya tidak pernah terpengaruh secara emosional"',
          'Situasi yang dipilih tidak benar-benar menekan',
        ]
      },
      {
        score: 1, label: 'Concerning',
        description: 'Tidak bisa memberikan contoh, atau menunjukkan tidak ada kemampuan self-regulation',
        indicators: [
          'Tidak ada contoh yang nyata',
          'Narasi menunjukkan emosi sangat tidak terkontrol tanpa refleksi',
        ]
      },
    ],
    redFlags: [
      '"Saya tidak pernah terpengaruh emosi" — lack of self-awareness',
      'Strategi coping yang disebutkan tidak sehat (menyimpan sendiri, tidak tidur, dll)',
      'Tidak bisa menjawab "bagaimana pengaruhnya ke performa Anda" setelah probe',
    ],
    aiPrompt: `Evaluasi BEI untuk EMOTIONALLY CONTROLLED dan RESILIENSI.

Perhatikan:
1. Apakah situasi yang dipilih benar-benar berat secara objektif?
2. Apakah ada kejujuran tentang dampak emosional (tidak sekadar "saya baik-baik saja")?
3. Seberapa konkret strategi self-regulation yang disebutkan?
4. Apakah performa terjaga selama tekanan berlangsung?
5. Kualitas pelajaran yang diambil — apakah spesifik dan bisa diterapkan?

Skor 5 = situasi ekstrem + akui dampak jujur + strategi konkret + performa terjaga + pelajaran spesifik
Skor 1 = tidak ada contoh nyata atau tidak ada kemampuan self-regulation

Output JSON: { "score": 1-5, "confidence": "high|medium|low", "reasoning": "...", "redFlags": ["..."], "dimensionScores": { "emotionallyControlled": 1-5, "resiliensi": 1-5 } }`,
  },

  {
    questionId: 'BEI-07',
    targetDims: ['responsFeedback', 'standarPribadi'],
    levels: [
      {
        score: 5, label: 'Exceptional',
        description: 'Feedback yang dipilih benar-benar keras dan tidak nyaman, respons awal jujur diakui, dan perubahan nyata terjadi',
        indicators: [
          'Feedback yang dipilih memang berat dan tidak menyenangkan',
          'Reaksi awal yang jujur — termasuk resistensi atau ketidaksetujuan awal',
          'Proses memproses feedback dijelaskan secara konkret',
          'Perubahan perilaku yang terukur dan spesifik setelahnya',
          'Bisa menilai apakah feedback itu akhirnya benar atau tidak',
        ]
      },
      {
        score: 4, label: 'Strong',
        description: 'Feedback nyata, respons terbuka, dan ada perubahan yang cukup spesifik',
        indicators: [
          'Feedback cukup keras',
          'Respons yang terbuka meski ada resistance awal',
          'Perubahan ada dan cukup spesifik',
        ]
      },
      {
        score: 3, label: 'Adequate',
        description: 'Feedback biasa, respons langsung positif tanpa proses, atau perubahan generik',
        indicators: [
          '"Saya langsung menerima dan berterima kasih" — tidak ada proses',
          'Perubahan yang disebutkan generik',
        ]
      },
      {
        score: 2, label: 'Weak',
        description: 'Feedback yang dipilih sangat ringan atau respons menunjukkan tidak ada perubahan nyata',
        indicators: [
          'Feedback yang dipilih adalah pujian dengan satu kritik kecil',
          'Tidak ada bukti perubahan yang konkret',
        ]
      },
      {
        score: 1, label: 'Concerning',
        description: 'Tidak bisa memberikan contoh feedback keras yang diterima, atau menunjukkan defensiveness penuh',
        indicators: [
          '"Saya selalu welcome feedback" tanpa contoh keras',
          'Defensiveness sangat tinggi bahkan dalam narasi',
        ]
      },
    ],
    redFlags: [
      '"Feedback terkeras yang pernah saya terima adalah ketika dipuji tapi ada satu hal kecil yang dikritik"',
      'Semua feedback dalam narasi berakhir dengan "dan saya langsung setuju"',
      'Tidak bisa menyebut perubahan spesifik setelah menerima feedback',
    ],
    aiPrompt: `Evaluasi BEI untuk RESPONS FEEDBACK dan STANDAR PRIBADI.

Perhatikan:
1. Seberapa keras feedback yang dipilih — proporsional dengan pengalaman?
2. Apakah ada kejujuran tentang reaksi awal (tidak semuanya langsung positif)?
3. Seberapa konkret proses memproses feedback tersebut?
4. Apakah ada perubahan perilaku yang terukur dan spesifik?
5. Apakah peserta bisa mengevaluasi apakah feedback itu akhirnya benar/salah?

Skor 5 = feedback berat + reaksi jujur (termasuk resistensi) + proses konkret + perubahan terukur
Skor 1 = tidak ada contoh keras atau defensiveness penuh

Output JSON: { "score": 1-5, "confidence": "high|medium|low", "reasoning": "...", "redFlags": ["..."], "dimensionScores": { "responsFeedback": 1-5, "standarPribadi": 1-5 } }`,
  },

  {
    questionId: 'BEI-08',
    targetDims: ['innovative', 'caraBerpikir'],
    levels: [
      {
        score: 5, label: 'Exceptional',
        description: 'Inisiatif yang benar-benar diprakarsai sendiri, berhasil melewati resistensi, dan dampaknya terukur',
        indicators: [
          'Ide muncul dari observasi mendalam, bukan hanya intuisi',
          '100% inisiasi sendiri tanpa diminta',
          'Ada resistensi yang diatasi — bukan berjalan mulus',
          'Implementasi konkret terjadi (bukan hanya diusulkan)',
          'Dampak terukur yang bisa dikuantifikasi',
        ]
      },
      {
        score: 4, label: 'Strong',
        description: 'Inisiatif genuine dengan implementasi nyata dan dampak yang cukup jelas',
        indicators: [
          'Inisiatif genuine',
          'Implementasi terjadi',
          'Dampak ada meski kurang terukur',
        ]
      },
      {
        score: 3, label: 'Adequate',
        description: 'Ada ide tapi implementasinya partial, atau ide datang dari trigger orang lain',
        indicators: [
          'Ada catalyst eksternal',
          'Implementasi partial',
          'Dampak kurang jelas',
        ]
      },
      {
        score: 2, label: 'Weak',
        description: 'Ide yang disebutkan adalah mengikuti trend atau instruksi, bukan inisiatif mandiri',
        indicators: [
          'Ide datang dari atasan atau eksternal',
          'Implementasi dilakukan tapi tidak diinisiasi',
        ]
      },
      {
        score: 1, label: 'Concerning',
        description: 'Tidak bisa memberikan contoh inisiatif perbaikan yang benar-benar diinisiasi dan diimplementasikan sendiri',
        indicators: [
          '"Saya pernah mengusulkan tapi tidak disetujui" tanpa tindak lanjut',
          'Tidak ada inisiatif yang pernah sampai implementasi',
        ]
      },
    ],
    redFlags: [
      'Semua "inovasi" adalah mengadopsi cara yang sudah ada di tempat lain',
      'Tidak bisa menjawab "bagaimana Anda meyakinkan orang lain" — berarti tidak ada resistensi yang berarti tidak ada inisiatif nyata',
      'Tidak ada dampak yang terukur setelah probe ketiga',
    ],
    aiPrompt: `Evaluasi BEI untuk INNOVATIVE dan CARA BERPIKIR.

Perhatikan:
1. Apakah inisiatif benar-benar dari diri sendiri atau response terhadap permintaan?
2. Apakah ada resistensi yang diatasi — karena tanpa resistensi berarti bukan perubahan nyata?
3. Seberapa sistematis cara berpikir dalam mengidentifikasi peluang perbaikan?
4. Apakah implementasi benar-benar terjadi atau hanya proposal?
5. Seberapa terukur dampaknya?

Skor 5 = inisiatif mandiri + resistensi diatasi + sistematis + implementasi + dampak terukur
Skor 1 = tidak ada contoh inisiatif yang sampai implementasi

Output JSON: { "score": 1-5, "confidence": "high|medium|low", "reasoning": "...", "redFlags": ["..."], "dimensionScores": { "innovative": 1-5, "caraBerpikir": 1-5 } }`,
  },
]

// ─── SCORING INTEGRATION ───────────────────────────────────────────────────
// BEI contributes 40% to final dimension score
// Psychometric (Tetrad + SJT) contributes 60%
//
// BEI dimension score calculation:
//   1. Each BEI question scores 2 target dimensions (1-5 scale)
//   2. Average all BEI scores for each dimension
//   3. Normalize to 0-100: (avg_score - 1) / 4 * 100
//   4. Combine: Final = (Psychometric * 0.60) + (BEI_normalized * 0.40)
//
// Confidence adjustment:
//   If AI confidence = 'low': BEI weight reduced to 20%, Psychometric to 80%
//   If consistency gap > 25 points (Psychometric vs BEI): flag for HR review

export const BEI_SCORING_CONFIG = {
  beiWeight: 0.40,
  psychometricWeight: 0.60,
  lowConfidenceAdjustment: { bei: 0.20, psychometric: 0.80 },
  inconsistencyThreshold: 25,  // points gap that triggers HR review flag
  minWordsForValidAnswer: 60,
  redFlagScorePenalty: 1,      // subtract 1 from score if red flag detected
}
