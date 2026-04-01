import type {
  DimensionDefinition,
  DimensionKey,
  EssayQuestion,
  PlayerCategory,
  ProfileFlagDefinition,
  ProfileFlagKey,
  SJTQuestion,
  TetradQuestion,
} from './types'

export const ORG_NAME = process.env.ORG_NAME?.trim() || 'Mandalika Perfume'

export const dimensionOrder: DimensionKey[] = [
  'integritas',
  'ownership',
  'standarPribadi',
  'emotionallyControlled',
  'caraBerpikir',
  'responsFeedback',
  'growthMindset',
  'conscientious',
  'dampakTim',
  'resiliensi',
  'communicationClarity',
  'decisive',
  'innovative',
]

export const dimensions: Record<DimensionKey, DimensionDefinition> = {
  integritas: {
    key: 'integritas',
    label: 'Integritas',
    layer: 1,
    gateThreshold: 50,
    criticalThreshold: 35,
    description:
      'Konsistensi antara kata dan tindakan, kejujuran tentang kesalahan, dan keteguhan nilai bahkan saat ada tekanan untuk berkompromi.',
    aPlayerSignal:
      'Konsisten di depan dan belakang, mengakui salah secara terbuka, dan tidak bermain politik.',
  },
  ownership: {
    key: 'ownership',
    label: 'Ownership',
    layer: 1,
    gateThreshold: 50,
    criticalThreshold: 35,
    description:
      'Sejauh mana seseorang mengambil tanggung jawab penuh atas proses dan hasil kerja, termasuk saat gagal, tanpa menunggu diminta atau ditunjuk.',
    aPlayerSignal:
      'Mengambil alih tanpa diminta, fokus pada solusi bukan alasan, dan tidak menyalahkan pihak lain.',
  },
  standarPribadi: {
    key: 'standarPribadi',
    label: 'Standar Pribadi',
    layer: 1,
    gateThreshold: 45,
    criticalThreshold: 30,
    description:
      'Standar internal yang diterapkan seseorang terhadap diri sendiri, independen dari ekspektasi atasan atau pengawasan eksternal.',
    aPlayerSignal:
      'Selalu merasa belum cukup baik, mendorong perbaikan dari dalam diri, dan tidak butuh diawasi untuk menjaga kualitas.',
  },
  emotionallyControlled: {
    key: 'emotionallyControlled',
    label: 'Emotionally Controlled',
    layer: 1,
    gateThreshold: 40,
    criticalThreshold: 25,
    description:
      'Kemampuan mengelola emosi secara internal sehingga tidak menularkan stres, tidak reaktif berlebihan, dan tetap objektif di bawah tekanan.',
    aPlayerSignal:
      'Stabil di bawah tekanan, tidak drama, dan mampu memisahkan emosi dari penilaian kerja.',
  },
  caraBerpikir: {
    key: 'caraBerpikir',
    label: 'Cara Berpikir',
    layer: 2,
    criticalThreshold: 35,
    description:
      'Kemampuan berpikir sistemik, melihat pola, menganalisis akar masalah, dan mempertimbangkan dampak jangka panjang sebelum mengambil keputusan.',
    aPlayerSignal:
      'Menganalisis akar masalah, melihat koneksi lintas fungsi, dan tidak berhenti di gejala.',
  },
  responsFeedback: {
    key: 'responsFeedback',
    label: 'Respons Feedback',
    layer: 2,
    criticalThreshold: 35,
    description:
      'Keterbukaan terhadap kritik, kemauan menyampaikan pendapat berbeda secara konstruktif, dan kemampuan mengubah perilaku nyata berdasarkan feedback.',
    aPlayerSignal:
      'Meminta feedback proaktif, berani berbeda pendapat, dan benar-benar mengubah perilaku setelah mendapat masukan.',
  },
  growthMindset: {
    key: 'growthMindset',
    label: 'Growth Mindset',
    layer: 2,
    criticalThreshold: 35,
    description:
      'Kemauan aktif dan mandiri untuk terus belajar, berkembang, dan mengubah pola kerja, bukan hanya responsif terhadap training formal.',
    aPlayerSignal:
      'Belajar mandiri tanpa diminta, investasi waktu pribadi untuk berkembang, dan evaluasi diri aktif.',
  },
  conscientious: {
    key: 'conscientious',
    label: 'Conscientious',
    layer: 2,
    criticalThreshold: 35,
    description:
      'Ketelitian, keteraturan, dan konsistensi dalam menyelesaikan komitmen, sekecil apa pun, serta menjaga kualitas tanpa perlu pengingat.',
    aPlayerSignal:
      'Zero follow-up needed, detail tanpa diingatkan, dan dokumentasi rapi.',
  },
  dampakTim: {
    key: 'dampakTim',
    label: 'Dampak Tim',
    layer: 3,
    criticalThreshold: 30,
    description:
      'Pengaruh nyata kehadiran seseorang terhadap standar, budaya, dan cara kerja orang-orang di sekitarnya, baik formal maupun informal.',
    aPlayerSignal:
      'Tim ikut naik standar, pengaruh terasa tanpa jabatan formal, dan standar tetap hidup bahkan saat ia tidak hadir.',
  },
  resiliensi: {
    key: 'resiliensi',
    label: 'Resiliensi',
    layer: 3,
    criticalThreshold: 30,
    description:
      'Kemampuan bangkit, belajar, dan mempertahankan produktivitas setelah menghadapi kegagalan besar atau ketidakpastian berkepanjangan.',
    aPlayerSignal:
      'Bangkit cepat, menjadikan kegagalan bahan bakar, dan tidak membiarkan satu momen buruk mendefinisikan diri.',
  },
  communicationClarity: {
    key: 'communicationClarity',
    label: 'Communication Clarity',
    layer: 3,
    criticalThreshold: 30,
    description:
      'Kemampuan menyampaikan ide kompleks dengan sederhana, tepat sasaran, dan disesuaikan dengan audiens tanpa kehilangan substansi.',
    aPlayerSignal:
      'Pesan langsung dipahami, disesuaikan dengan audiens, dan to the point.',
  },
  decisive: {
    key: 'decisive',
    label: 'Decisive',
    layer: 4,
    description:
      'Kemampuan dan kemauan mengambil keputusan tegas di situasi ambigu, tanpa menunggu kepastian sempurna yang mungkin tidak pernah datang.',
    aPlayerSignal:
      'Memutuskan cepat dengan data yang ada, tidak paralysis, dan nyaman dengan risiko terukur.',
  },
  innovative: {
    key: 'innovative',
    label: 'Innovative',
    layer: 4,
    description:
      'Dorongan untuk mempertanyakan cara lama, mengusulkan pendekatan baru, dan bereksperimen, bahkan ketika cara yang ada masih berjalan baik.',
    aPlayerSignal:
      'Konsisten mempertanyakan asumsi, mengusulkan cara baru, dan bersedia menjadi yang pertama mencoba.',
  },
}

export const layerWeights = {
  1: 0.35,
  2: 0.3,
  3: 0.25,
  4: 0.1,
} as const

export const layerLabels = {
  1: 'Fondasi Karakter',
  2: 'Mesin Performa',
  3: 'Pengali Dampak',
  4: 'Amplifier Kontekstual',
} as const

export const categoryCaps: Record<PlayerCategory, number> = {
  'A Player': 100,
  'B Solid Player': 81,
  'B Player': 66,
  'C Player': 47,
}

export const categoryColors: Record<PlayerCategory, string> = {
  'A Player': '#1A6B43',
  'B Solid Player': '#1D4D8A',
  'B Player': '#7A4E10',
  'C Player': '#8B2020',
}

export const profileFlagMeta: Record<ProfileFlagKey, ProfileFlagDefinition> = {
  character_risk: {
    key: 'character_risk',
    label: 'Character Risk',
    alert: 'critical',
    description:
      'Satu atau lebih dimensi fondasi karakter tidak memenuhi threshold minimum.',
    placement:
      'Tidak direkomendasikan untuk posisi strategis sebelum ada perbaikan yang terukur.',
  },
  execution_powerhouse: {
    key: 'execution_powerhouse',
    label: 'Execution Powerhouse',
    alert: 'info',
    description:
      'Fondasi karakter dan mesin performa kuat, tetapi Decisive dan Innovative relatif rendah.',
    placement:
      'Ideal untuk posisi operasional, quality control, dan project execution.',
  },
  innovation_driver: {
    key: 'innovation_driver',
    label: 'Innovation Driver',
    alert: 'info',
    description:
      'Decisive dan Innovative sangat tinggi dengan fondasi karakter yang lolos gate.',
    placement:
      'Ideal untuk growth, business development, dan eksplorasi produk atau sistem baru.',
  },
  high_ceiling: {
    key: 'high_ceiling',
    label: 'High Ceiling',
    alert: 'info',
    description:
      'Karakter kuat dan growth mindset tinggi, tetapi dampak ke orang lain masih terbatas.',
    placement:
      'Profil investasi jangka panjang. Pasangkan dengan mentor dan beri tantangan bertahap.',
  },
  anchor_player: {
    key: 'anchor_player',
    label: 'Anchor Player',
    alert: 'info',
    description:
      'Profil sangat konsisten tanpa kelemahan atau keunggulan yang terlalu ekstrem.',
    placement:
      'Cocok sebagai stabilizer dalam tim yang dinamis atau fase transisi.',
  },
  strategic_thinker: {
    key: 'strategic_thinker',
    label: 'Strategic Thinker',
    alert: 'info',
    description:
      'Cara berpikir sistemik, kemampuan memutuskan cepat, dan komunikasi efektif berada di level tinggi.',
    placement:
      'Layak dipertimbangkan untuk jalur leadership dan keputusan strategis.',
  },
  culture_builder: {
    key: 'culture_builder',
    label: 'Culture Builder',
    alert: 'info',
    description:
      'Pengaruh ke standar tim kuat, integritas tinggi, dan kontrol emosi baik.',
    placement:
      'Layak ditempatkan sebagai role model atau mentor di tim yang butuh penguatan budaya.',
  },
}

export const tetradQuestions: TetradQuestion[] = [
  {
    code: 'T01',
    items: [
      { dim: 'ownership', text: 'Saya mengambil tanggung jawab penuh atas hasil pekerjaan — baik saat berhasil maupun saat gagal' },
      { dim: 'standarPribadi', text: 'Standar yang saya terapkan pada diri sendiri selalu lebih tinggi dari yang diminta atasan' },
      { dim: 'caraBerpikir', text: 'Saya selalu mempertimbangkan dampak jangka panjang sebelum mengambil keputusan penting' },
      { dim: 'responsFeedback', text: 'Saya secara aktif meminta feedback kritis bahkan ketika tidak ada yang mewajibkannya' },
    ],
  },
  {
    code: 'T02',
    items: [
      { dim: 'growthMindset', text: 'Saya mencari peluang belajar hal baru yang relevan tanpa menunggu diminta' },
      { dim: 'dampakTim', text: 'Kehadiran saya secara nyata mendorong orang lain meningkatkan standar kerja mereka' },
      { dim: 'decisive', text: 'Saya mampu mengambil keputusan tegas bahkan di situasi yang ambigu dan penuh ketidakpastian' },
      { dim: 'innovative', text: 'Saya secara aktif mengusulkan cara baru yang lebih baik meski cara lama masih berjalan' },
    ],
  },
  {
    code: 'T03',
    items: [
      { dim: 'conscientious', text: 'Saya menyelesaikan semua komitmen yang saya buat, sekecil dan sesederhana apapun' },
      { dim: 'emotionallyControlled', text: 'Saya tetap tenang dan fokus bahkan ketika tekanan di sekitar saya sangat tinggi' },
      { dim: 'integritas', text: 'Kata-kata dan tindakan saya selalu konsisten — orang bisa memegang apa yang saya ucapkan' },
      { dim: 'resiliensi', text: 'Saya bangkit lebih cepat dan lebih kuat setiap kali menghadapi kegagalan besar' },
    ],
  },
  {
    code: 'T04',
    items: [
      { dim: 'communicationClarity', text: 'Saya bisa menjelaskan ide yang kompleks dengan cara yang mudah dipahami oleh siapapun' },
      { dim: 'ownership', text: 'Saya mengambil alih masalah yang tidak ada yang mau menangani tanpa menunggu diminta' },
      { dim: 'growthMindset', text: 'Saya secara konsisten menginvestasikan waktu pribadi untuk mengembangkan kapasitas diri' },
      { dim: 'dampakTim', text: 'Standar yang saya bangun tetap terasa di tim bahkan setelah saya tidak ada di sana' },
    ],
  },
  {
    code: 'T05',
    items: [
      { dim: 'standarPribadi', text: 'Saya merasa tidak nyaman ketika hasil kerja saya hanya "cukup" — selalu ingin lebih baik' },
      { dim: 'caraBerpikir', text: 'Saya melihat pola dan koneksi antar masalah yang sering tidak terlihat orang lain' },
      { dim: 'decisive', text: 'Saya tidak menunggu informasi sempurna untuk bergerak — saya memutuskan dengan data yang ada' },
      { dim: 'innovative', text: 'Saya sering mempertanyakan asumsi yang sudah lama diterima begitu saja di tempat kerja' },
    ],
  },
  {
    code: 'T06',
    items: [
      { dim: 'responsFeedback', text: 'Saya menyampaikan pendapat berbeda secara langsung bahkan ketika saya tahu tidak populer' },
      { dim: 'conscientious', text: 'Saya sangat teliti dalam detail dan jarang membuat kesalahan yang sama dua kali' },
      { dim: 'emotionallyControlled', text: 'Saya tidak membawa masalah emosional pribadi ke dalam dinamika tim' },
      { dim: 'integritas', text: 'Saya mengakui kesalahan saya secara terbuka tanpa mencari pembenaran atau kambing hitam' },
    ],
  },
  {
    code: 'T07',
    items: [
      { dim: 'resiliensi', text: 'Kegagalan besar tidak membuat saya berhenti — justru menjadi bahan bakar untuk tindakan berikutnya' },
      { dim: 'communicationClarity', text: 'Saya menyesuaikan cara penyampaian saya dengan audiens tanpa mengorbankan substansi' },
      { dim: 'ownership', text: 'Saya menyelesaikan masalah sebelum berkembang menjadi krisis bagi tim atau organisasi' },
      { dim: 'standarPribadi', text: 'Saya memeriksa ulang pekerjaan bahkan ketika orang lain sudah menganggapnya selesai' },
    ],
  },
  {
    code: 'T08',
    items: [
      { dim: 'growthMindset', text: 'Saya aktif mencari pengetahuan baru di luar tugas formal yang diberikan kepada saya' },
      { dim: 'caraBerpikir', text: 'Saya terbiasa menganalisis akar masalah, bukan hanya menyelesaikan gejalanya' },
      { dim: 'responsFeedback', text: 'Saya mengubah cara kerja secara nyata dan konsisten setiap kali mendapat feedback valid' },
      { dim: 'decisive', text: 'Saya tidak menunda keputusan hanya karena ada ketidaknyamanan atau potensi konflik' },
    ],
  },
  {
    code: 'T09',
    items: [
      { dim: 'innovative', text: 'Saya senang bereksperimen dengan pendekatan baru meski hasilnya belum terbukti sebelumnya' },
      { dim: 'conscientious', text: 'Saya sangat terstruktur dalam merencanakan pekerjaan dan jarang melewatkan satu deadline' },
      { dim: 'emotionallyControlled', text: 'Saya bisa memisahkan emosi dari penilaian saat menghadapi situasi yang menekan' },
      { dim: 'integritas', text: 'Saya tidak pernah menyembunyikan informasi penting yang perlu diketahui orang lain' },
    ],
  },
  {
    code: 'T10',
    items: [
      { dim: 'resiliensi', text: 'Saya mempertahankan produktivitas bahkan di tengah situasi yang penuh ketidakpastian berkepanjangan' },
      { dim: 'dampakTim', text: 'Saya aktif membantu rekan berkembang, tidak hanya fokus pada pekerjaan dan target saya sendiri' },
      { dim: 'communicationClarity', text: 'Pesan yang saya sampaikan selalu tepat sasaran — tidak menimbulkan kebingungan atau multitafsir' },
      { dim: 'ownership', text: 'Saya menjaga standar kerja tetap tinggi bahkan ketika tidak ada yang mengawasi' },
    ],
  },
  {
    code: 'T11',
    items: [
      { dim: 'standarPribadi', text: 'Saya tidak pernah benar-benar puas — selalu ada yang bisa lebih baik dari apa yang saya hasilkan' },
      { dim: 'growthMindset', text: 'Saya mengevaluasi diri sendiri secara jujur dan mendalam tanpa harus diminta atau dipaksa' },
      { dim: 'innovative', text: 'Saya tidak nyaman melakukan sesuatu dengan cara yang sama berulang-ulang tanpa inovasi' },
      { dim: 'integritas', text: 'Perilaku saya tidak berubah tergantung siapa yang melihat — konsisten di depan dan di belakang' },
    ],
  },
  {
    code: 'T12',
    items: [
      { dim: 'caraBerpikir', text: 'Saya mempertimbangkan berbagai perspektif sebelum menyimpulkan atau mengambil posisi' },
      { dim: 'responsFeedback', text: 'Saya tidak defensif ketika pendapat saya dikritik — saya memisahkan identitas dari argumen' },
      { dim: 'decisive', text: 'Saya lebih memilih keputusan cepat yang bisa dikoreksi daripada keputusan lambat yang "sempurna"' },
      { dim: 'conscientious', text: 'Saya mendokumentasikan pekerjaan dengan rapi sehingga orang lain bisa melanjutkan tanpa kebingungan' },
    ],
  },
  {
    code: 'T13',
    items: [
      { dim: 'emotionallyControlled', text: 'Saya tidak bereaksi berlebihan terhadap masalah kecil yang bisa diselesaikan dengan tenang' },
      { dim: 'resiliensi', text: 'Saya belajar lebih banyak dari kegagalan daripada dari kesuksesan — dan saya menerapkannya' },
      { dim: 'dampakTim', text: 'Saya menciptakan lingkungan kerja yang mendorong kejujuran dan standar tinggi di sekitar saya' },
      { dim: 'communicationClarity', text: 'Saya mempersiapkan penyampaian dengan matang sehingga audiens langsung memahami inti pesan' },
    ],
  },
  {
    code: 'T14',
    items: [
      { dim: 'ownership', text: 'Saya bertanggung jawab atas hasil tim secara keseluruhan, bukan hanya porsi yang menjadi bagian saya' },
      { dim: 'standarPribadi', text: 'Saya terdorong memperbaiki sesuatu ketika tahu bisa lebih baik, meski tidak ada yang meminta' },
      { dim: 'innovative', text: 'Saya mendorong tim untuk mencoba pendekatan yang berbeda dari yang sudah ada dan terbukti aman' },
      { dim: 'emotionallyControlled', text: 'Saya tetap stabil dan tidak panik bahkan menghadapi berita buruk yang datang mendadak' },
    ],
  },
  {
    code: 'T15',
    items: [
      { dim: 'growthMindset', text: 'Saya senang mendapat tantangan yang memaksa keluar dari zona nyaman saya saat ini' },
      { dim: 'caraBerpikir', text: 'Saya memikirkan implikasi keputusan saya terhadap sistem dan orang-orang yang lebih luas' },
      { dim: 'conscientious', text: 'Saya bekerja dengan standar konsisten — kualitas tidak berubah tergantung siapa yang melihat' },
      { dim: 'resiliensi', text: 'Saya membangun kembali kepercayaan diri dengan cepat setelah mengalami kegagalan yang signifikan' },
    ],
  },
  {
    code: 'T16',
    items: [
      { dim: 'responsFeedback', text: 'Saya mencari perspektif yang bertentangan dengan pandangan saya untuk menguji kekuatan argumen' },
      { dim: 'decisive', text: 'Saya berani mengambil posisi yang jelas dan tegas bahkan ketika semua orang masih ragu-ragu' },
      { dim: 'dampakTim', text: 'Saya menengahi konflik tim secara konstruktif bahkan ketika bukan peran formal saya untuk itu' },
      { dim: 'integritas', text: 'Saya menyampaikan kebenaran yang tidak nyaman ketika itu memang perlu disampaikan' },
    ],
  },
  {
    code: 'T17',
    items: [
      { dim: 'communicationClarity', text: 'Saya menyederhanakan informasi yang kompleks tanpa kehilangan akurasi atau nuansi pentingnya' },
      { dim: 'ownership', text: 'Ketika gagal, saya langsung menganalisis kontribusi saya sendiri — bukan mencari faktor eksternal' },
      { dim: 'growthMindset', text: 'Saya mengubah pola kerja secara nyata setelah menyadari ada kebiasaan yang perlu diperbaiki' },
      { dim: 'conscientious', text: 'Saya memenuhi komitmen sekecil apapun — tidak ada yang "terlupakan" atau diabaikan begitu saja' },
    ],
  },
  {
    code: 'T18',
    items: [
      { dim: 'standarPribadi', text: 'Saya memiliki tolok ukur internal yang tidak tergantung pada penilaian atau persetujuan orang lain' },
      { dim: 'caraBerpikir', text: 'Saya mengidentifikasi akar masalah sistemik yang sering diabaikan atau tidak terlihat orang lain' },
      { dim: 'integritas', text: 'Saya mempertahankan nilai dan prinsip saya bahkan di situasi yang memberi keuntungan untuk berkompromi' },
      { dim: 'resiliensi', text: 'Saya tidak membiarkan satu kegagalan mendefinisikan cara saya melihat kemampuan diri saya' },
    ],
  },
  {
    code: 'T19',
    items: [
      { dim: 'responsFeedback', text: 'Saya meminta orang lain menunjukkan kelemahan saya secara spesifik, bukan pujian yang umum' },
      { dim: 'decisive', text: 'Saya membuat keputusan berdasarkan prinsip yang jelas, bukan sekadar mengikuti arus atau tekanan' },
      { dim: 'innovative', text: 'Saya secara konsisten mengusulkan ide yang menantang cara kerja yang sudah ada dan mapan' },
      { dim: 'dampakTim', text: 'Saya memastikan rekan yang kesulitan mendapat dukungan yang dibutuhkan, bukan dibiarkan sendiri' },
    ],
  },
  {
    code: 'T20',
    items: [
      { dim: 'emotionallyControlled', text: 'Saya mengelola tekanan dengan baik dan tidak membiarkannya memengaruhi kualitas keputusan' },
      { dim: 'communicationClarity', text: 'Saya memastikan pesan saya dipahami — bukan hanya didengar — oleh audiens yang beragam' },
      { dim: 'ownership', text: 'Saya tidak menunggu instruksi untuk mengambil tindakan yang saya tahu memang perlu dilakukan' },
      { dim: 'integritas', text: 'Saya bersikap sama terhadap semua orang tanpa memandang jabatan, posisi, atau pengaruh mereka' },
    ],
  },
  {
    code: 'T21',
    items: [
      { dim: 'standarPribadi', text: 'Saya secara aktif mencari cara lebih baik bahkan untuk pekerjaan rutin yang sudah berjalan lancar' },
      { dim: 'growthMindset', text: 'Saya aktif mencari mentor atau referensi yang mendorong saya ke level kemampuan berikutnya' },
      { dim: 'conscientious', text: 'Saya sangat detail dalam pekerjaan dan selalu memeriksa ulang sebelum menyerahkan hasil apapun' },
      { dim: 'decisive', text: 'Saya tidak menghindari keputusan sulit hanya karena ada risiko sosial atau ketidaknyamanan personal' },
    ],
  },
  {
    code: 'T22',
    items: [
      { dim: 'caraBerpikir', text: 'Saya mempertanyakan asumsi dasar sebelum menerima suatu keputusan atau pendekatan sebagai benar' },
      { dim: 'innovative', text: 'Saya tidak puas hanya menjalankan apa yang sudah ada — saya selalu mencari celah untuk berinovasi' },
      { dim: 'resiliensi', text: 'Saya tetap fokus pada solusi bahkan ketika situasi terasa sangat berat dan tidak ada kepastian' },
      { dim: 'dampakTim', text: 'Cara kerja saya secara tidak langsung menaikkan standar ekspektasi orang-orang di sekitar saya' },
    ],
  },
  {
    code: 'T23',
    items: [
      { dim: 'responsFeedback', text: 'Saya terbuka terhadap koreksi dari siapapun — atasan, rekan, maupun yang lebih junior dari saya' },
      { dim: 'emotionallyControlled', text: 'Kritikan keras tidak membuat saya defensif — saya memprosesnya secara objektif dan tenang' },
      { dim: 'communicationClarity', text: 'Saya terstruktur dalam menyampaikan informasi sehingga audiens bisa mengikuti alur pikiran saya' },
      { dim: 'standarPribadi', text: 'Saya tidak bisa berdamai dengan hasil kerja yang biasa-biasa saja — selalu ada yang bisa ditingkatkan' },
    ],
  },
  {
    code: 'T24',
    items: [
      { dim: 'ownership', text: 'Saya mengambil inisiatif memperbaiki sesuatu yang salah bahkan ketika itu bukan kesalahan saya' },
      { dim: 'growthMindset', text: 'Saya menginvestasikan waktu dan energi pribadi untuk belajar di luar jam kerja formal' },
      { dim: 'innovative', text: 'Saya menjadi yang pertama mengusulkan cara berbeda dalam menyelesaikan masalah yang berulang' },
      { dim: 'resiliensi', text: 'Setiap kegagalan memberi saya wawasan baru yang mengubah cara saya bekerja ke depannya' },
    ],
  },
  {
    code: 'T25',
    items: [
      { dim: 'caraBerpikir', text: 'Saya bisa menjelaskan keputusan kompleks dengan sederhana dan logis kepada audiens manapun' },
      { dim: 'decisive', text: 'Saya nyaman mengambil risiko terukur daripada terus menunggu kepastian yang mungkin tidak datang' },
      { dim: 'conscientious', text: 'Saya menjaga komitmen dengan sangat serius — jika berkata akan melakukan, saya benar-benar melakukan' },
      { dim: 'integritas', text: 'Saya tidak bermain politik atau memanipulasi informasi untuk kepentingan posisi saya sendiri' },
    ],
  },
  {
    code: 'T26',
    items: [
      { dim: 'dampakTim', text: 'Saya secara aktif membangun budaya tim yang mendorong kejujuran, pertumbuhan, dan standar tinggi' },
      { dim: 'emotionallyControlled', text: 'Saya tidak menularkan stres atau kekhawatiran saya kepada orang lain di sekitar saya' },
      { dim: 'responsFeedback', text: 'Saya mengimplementasikan feedback dengan cepat dan konsisten, bukan hanya mengiyakan' },
      { dim: 'communicationClarity', text: 'Komunikasi saya to the point dan tidak membuang waktu audiens dengan informasi yang tidak perlu' },
    ],
  },
]

export const sjtQuestions: SJTQuestion[] = [
  {
    code: 'SJT-01',
    dim: 'ownership',
    scenario:
      'Anda mengetahui ada kesalahan laporan yang sudah dikirim ke manajemen. Kesalahan itu dilakukan rekan Anda yang sedang tidak masuk hari ini.',
    options: [
      'Menghubungi rekan tersebut agar dia yang melapor ke atasan secepatnya',
      'Langsung menghubungi atasan, mengakui ada kesalahan, dan menawarkan diri memperbaikinya hari ini',
      'Mendokumentasikan kesalahan itu dan menyiapkan draft perbaikan, menunggu rekan masuk besok untuk dikonfirmasi bersama',
      'Menunggu — kemungkinan manajemen belum membacanya dan masih bisa diatasi besok',
    ],
    mostScores: [2, 4, 3, 1],
    leastScores: [1, -2, -1, 2],
  },
  {
    code: 'SJT-02',
    dim: 'ownership',
    scenario:
      'Tim Anda gagal mencapai target bulan ini. Atasan mengadakan sesi evaluasi dan meminta semua orang menyampaikan analisisnya.',
    options: [
      'Menyampaikan faktor-faktor eksternal yang mempengaruhi — kondisi pasar, support yang kurang, dan hal-hal di luar kendali tim',
      'Menganalisis secara jujur apa yang bisa dilakukan tim secara berbeda, termasuk kontribusi kesalahan diri sendiri, dan membawa rencana konkret',
      'Menyampaikan analisis yang seimbang antara faktor internal dan eksternal tanpa terlalu menyalahkan siapapun',
      'Mendengarkan dulu apa yang disampaikan rekan lain sebelum berbicara, menyesuaikan posisi dengan mayoritas',
    ],
    mostScores: [1, 4, 3, 2],
    leastScores: [2, -2, -1, 1],
  },
  {
    code: 'SJT-03',
    dim: 'standarPribadi',
    scenario:
      'Anda baru menyelesaikan laporan yang diminta atasan. Atasan bilang "sudah bagus, langsung kirim." Tapi ada satu bagian yang menurut Anda datanya masih bisa diperkuat.',
    options: [
      'Mengirimkan sesuai kata atasan — dia yang paling tahu apakah sudah cukup',
      'Meminta 30 menit lagi untuk memperkuat bagian yang mengganjal, baru mengirimkan',
      'Mengirimkan, tapi mencatat bagian yang kurang untuk diperbaiki di laporan versi berikutnya',
      'Menginformasikan ke atasan bahwa ada bagian yang ingin Anda perkuat, meminta pendapatnya apakah perlu atau tidak',
    ],
    mostScores: [1, 4, 3, 2],
    leastScores: [2, -2, -1, 1],
  },
  {
    code: 'SJT-04',
    dim: 'standarPribadi',
    scenario:
      'Atasan tidak masuk seharian. Tidak ada deadline mendesak. Suasana kantor sangat santai.',
    options: [
      'Mengerjakan semua tugas dengan standar yang sama seperti hari biasa, mengisi waktu lebih dengan hal yang produktif',
      'Menyelesaikan yang wajib terlebih dahulu, kemudian rehat dan mengobrol santai dengan rekan',
      'Mengerjakan tugas yang ada dengan ritme lebih santai — sesekali tidak apa-apa',
      'Mengisi hari dengan membaca, belajar sesuatu yang baru, atau merapikan hal-hal yang biasanya tertunda',
    ],
    mostScores: [4, 1, 2, 3],
    leastScores: [-2, 2, 1, -1],
  },
  {
    code: 'SJT-05',
    dim: 'caraBerpikir',
    scenario:
      'Masalah yang sama terus berulang di tim setiap bulan dan rekan-rekan sudah terbiasa menanganinya secara reaktif.',
    options: [
      'Menangani masalah setiap kali muncul dengan cepat dan efisien — sudah ada prosesnya',
      'Menangani masalah tersebut, lalu menganalisis akar penyebabnya dan mengusulkan solusi permanen',
      'Mendelegasikan penanganan masalah ke rekan yang lebih terbiasa, sambil fokus pada pekerjaan lain',
      'Mengangkat isu ini ke atasan agar ada keputusan struktural tentang cara penanganannya',
    ],
    mostScores: [2, 4, 1, 3],
    leastScores: [1, -2, 2, -1],
  },
  {
    code: 'SJT-06',
    dim: 'caraBerpikir',
    scenario:
      'Anda diminta merekomendasikan: adopsi sistem baru yang lebih canggih tapi butuh adaptasi 2 bulan, atau tetap di sistem lama yang sudah berjalan.',
    options: [
      'Merekomendasikan sistem lama — operasional tidak boleh terganggu',
      'Merekomendasikan sistem baru — lebih canggih dan modern pasti lebih baik jangka panjang',
      'Menganalisis dampak jangka pendek vs panjang, biaya adaptasi vs manfaat, dan memberikan rekomendasi berbasis data dengan rencana transisi',
      'Mengusulkan pilot project kecil dulu untuk menguji sistem baru sebelum memutuskan secara penuh',
    ],
    mostScores: [2, 1, 4, 3],
    leastScores: [1, 2, -2, -1],
  },
  {
    code: 'SJT-07',
    dim: 'responsFeedback',
    scenario:
      'Atasan mengkritik cara Anda berkomunikasi dengan klien — terlalu teknis dan kurang hangat. Anda tidak sepenuhnya setuju dengan penilaian itu.',
    options: [
      'Mengiyakan dan langsung mengubah cara komunikasi sesuai yang diminta',
      'Menyampaikan perspektif Anda dengan tenang berbasis data, tetap terbuka terhadap argumen atasan, lalu memutuskan langkah bersama',
      'Mengiyakan di depan dan mempertimbangkannya, tapi tidak berubah karena merasa cara Anda sudah tepat',
      'Meminta contoh spesifik dari situasi mana yang dianggap terlalu teknis sebelum memutuskan perlu berubah atau tidak',
    ],
    mostScores: [2, 4, 1, 3],
    leastScores: [1, -2, 2, -1],
  },
  {
    code: 'SJT-08',
    dim: 'responsFeedback',
    scenario:
      'Seorang rekan junior memberi tahu bahwa cara Anda menjelaskan sesuatu sering membingungkan tim.',
    options: [
      'Berterima kasih atas masukannya dan mempertimbangkannya nanti',
      'Langsung meminta dia menjelaskan spesifik bagian mana yang membingungkan, lalu mengubah cara penjelasan mulai saat itu',
      'Mengonfirmasi ke rekan lain apakah mereka punya pengalaman yang sama sebelum mengambil kesimpulan',
      'Menjelaskan bahwa cara penyampaian Anda memang disesuaikan dengan tingkat pemahaman audiens — mungkin perlu penyesuaian konteks',
    ],
    mostScores: [2, 4, 3, 1],
    leastScores: [1, -2, -1, 2],
  },
  {
    code: 'SJT-09',
    dim: 'growthMindset',
    scenario:
      'Ada skill baru yang sangat relevan dengan pekerjaan Anda tapi perusahaan tidak menyediakan training-nya.',
    options: [
      'Mencari sendiri sumber belajarnya dan mulai mempelajari di waktu luang',
      'Mengajukan ke atasan agar perusahaan mengalokasikan training resmi',
      'Bertanya ke rekan yang sudah menguasainya sesekali jika ada kesempatan',
      'Menunggu sampai perusahaan menyediakan fasilitas belajarnya secara resmi',
    ],
    mostScores: [4, 3, 2, 1],
    leastScores: [-2, -1, 1, 2],
  },
  {
    code: 'SJT-10',
    dim: 'growthMindset',
    scenario:
      'Anda menyadari bahwa pola kerja yang selama ini Anda andalkan kurang efektif — dan sudah berlangsung cukup lama.',
    options: [
      'Segera mengidentifikasi apa yang perlu diubah dan menerapkan cara baru secara konsisten mulai sekarang',
      'Mengubahnya secara bertahap agar transisi tidak terasa terlalu mengganggu rutinitas',
      'Mendiskusikan dengan rekan atau mentor dulu untuk memastikan analisis Anda benar sebelum berubah',
      'Mempertahankan cara lama untuk pekerjaan yang sudah berjalan, menerapkan cara baru hanya untuk pekerjaan baru',
    ],
    mostScores: [4, 3, 2, 1],
    leastScores: [-2, -1, 1, 2],
  },
  {
    code: 'SJT-11',
    dim: 'dampakTim',
    scenario:
      'Seorang rekan sudah beberapa minggu terlihat tidak bersemangat dan performanya menurun. Tidak ada yang menegurnya secara formal.',
    options: [
      'Mendekati rekan itu secara personal, mengecek kondisinya, dan menawarkan bantuan konkret',
      'Melaporkan situasi ini ke atasan agar ditangani secara formal dan terstruktur',
      'Membiarkan — kemungkinan masalah pribadi dan akan pulih sendiri',
      'Menyebutkan secara halus di rapat tim bahwa semangat perlu dijaga tanpa menyebut nama siapapun',
    ],
    mostScores: [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },
  {
    code: 'SJT-12',
    dim: 'dampakTim',
    scenario:
      'Target tim bulan ini sudah tercapai di minggu ketiga. Masih ada satu minggu tersisa.',
    options: [
      'Menetapkan target pribadi lebih tinggi dan mengajak rekan yang belum tercapai untuk sprint bersama',
      'Mengisi waktu dengan merapikan administrasi, dokumentasi, dan hal-hal yang selama ini tertunda',
      'Beristirahat sejenak — target sudah tercapai dan perlu energi untuk bulan berikutnya',
      'Melaporkan ke atasan bahwa target tercapai dan menunggu arahan berikutnya',
    ],
    mostScores: [4, 3, 2, 1],
    leastScores: [-2, -1, 1, 2],
  },
  {
    code: 'SJT-13',
    dim: 'decisive',
    scenario:
      'Anda harus memilih vendor untuk proyek penting, tapi informasi belum lengkap, waktu habis, dan atasan tidak bisa dihubungi.',
    options: [
      'Menunggu atasan bisa dihubungi meski proyek tertunda',
      'Memilih vendor yang paling dikenal dan paling aman meski bukan yang terbaik di atas kertas',
      'Mengumpulkan informasi yang ada, menimbang risiko dengan cepat, memutuskan, dan mendokumentasikan alasan untuk dilaporkan ke atasan',
      'Mengajak rekan senior berdiskusi singkat untuk memutuskan bersama agar tanggung jawab terbagi',
    ],
    mostScores: [1, 2, 4, 3],
    leastScores: [2, 1, -2, -1],
  },
  {
    code: 'SJT-14',
    dim: 'decisive',
    scenario:
      'Di tengah rapat ada perdebatan sengit. Semua meminta Anda mengambil posisi. Anda sudah punya pandangan tapi belum 100% yakin.',
    options: [
      'Menyampaikan pandangan Anda secara jelas beserta alasannya, terbuka jika ada argumen yang lebih kuat',
      'Mengatakan Anda perlu lebih banyak data sebelum mengambil posisi',
      'Mengikuti posisi mayoritas agar rapat bisa selesai produktif',
      'Mengusulkan keputusan ditunda dan dibawa ke rapat berikutnya dengan data lebih lengkap',
    ],
    mostScores: [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },
  {
    code: 'SJT-15',
    dim: 'innovative',
    scenario:
      'Anda menemukan cara yang bisa mempersingkat proses kerja tim 40%, tapi belum pernah dicoba dan ada risiko awal.',
    options: [
      'Menyimpan ide ini sampai ada waktu dan kondisi yang lebih tepat untuk mengusulkannya',
      'Mendokumentasikan, menguji di skala kecil, lalu mempresentasikan hasilnya ke atasan dengan data',
      'Mengusulkan langsung ke atasan dan membiarkan mereka yang memutuskan apakah akan dicoba',
      'Langsung menerapkan sendiri dulu dan membandingkan hasilnya sebelum melibatkan orang lain',
    ],
    mostScores: [1, 4, 3, 2],
    leastScores: [2, -2, -1, 1],
  },
  {
    code: 'SJT-16',
    dim: 'innovative',
    scenario:
      'Tim Anda sudah menggunakan cara kerja yang sama selama 2 tahun — berjalan, tapi ada celah besar untuk ditingkatkan.',
    options: [
      'Melanjutkan cara yang sudah ada — konsistensi lebih penting dari perubahan yang belum terbukti',
      'Mengubah cara kerja sendiri secara diam-diam tanpa mengubah standar tim',
      'Menyiapkan analisis perbandingan dan roadmap perubahan yang realistis, lalu mempresentasikannya ke atasan',
      'Mendiskusikan ide peningkatan ini di rapat tim untuk mendapat masukan sebelum mengusulkan ke atasan',
    ],
    mostScores: [1, 2, 4, 3],
    leastScores: [2, 1, -2, -1],
  },
  {
    code: 'SJT-17',
    dim: 'conscientious',
    scenario:
      'Anda berjanji mengirimkan laporan ke rekan pukul 14.00, tapi ada pekerjaan mendadak dan baru bisa selesai pukul 15.30.',
    options: [
      'Menghubungi rekan sebelum pukul 14.00, menginformasikan keterlambatan dan estimasi baru',
      'Mengirimkan pukul 15.30 dengan permintaan maaf singkat — terlambat sedikit tidak terlalu masalah',
      'Mengirimkan draft yang belum selesai pukul 14.00 dan melengkapinya nanti',
      'Menyelesaikan pekerjaan mendadak dulu, baru mengirimkan laporan tanpa pemberitahuan awal',
    ],
    mostScores: [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },
  {
    code: 'SJT-18',
    dim: 'conscientious',
    scenario:
      'Anda menemukan kesalahan kecil di pekerjaan yang sudah disubmit kemarin. Kemungkinan besar tidak ada yang menyadarinya.',
    options: [
      'Segera melaporkan ke atasan dan memperbaikinya hari ini',
      'Memperbaikinya secara diam-diam tanpa melaporkan — dampaknya minimal',
      'Memantau apakah ada yang menyadari — jika tidak ada reaksi, biarkan saja',
      'Melaporkan ke atasan secara proaktif sekaligus menyampaikan rencana pencegahan agar tidak terulang',
    ],
    mostScores: [3, 2, 1, 4],
    leastScores: [-1, 1, 2, -2],
  },
  {
    code: 'SJT-19',
    dim: 'emotionallyControlled',
    scenario:
      'Di tengah presentasi penting, seorang peserta menginterupsi dan mengkritik pekerjaan Anda dengan nada kasar di depan banyak orang.',
    options: [
      'Merespons dengan tegas bahwa cara seperti itu tidak pantas dilakukan di forum profesional',
      'Diam sejenak, merespons tenang pada substansi kritiknya bukan nadanya, lalu melanjutkan presentasi',
      'Mengakui kritiknya, meminta waktu untuk mendiskusikannya setelah sesi selesai, lalu melanjutkan',
      'Melanjutkan presentasi tanpa merespons — tidak ingin memperkeruh suasana',
    ],
    mostScores: [1, 4, 3, 2],
    leastScores: [2, -2, -1, 1],
  },
  {
    code: 'SJT-20',
    dim: 'emotionallyControlled',
    scenario:
      'Tim sedang dalam tekanan tinggi karena deadline mepet dan ada konflik internal. Suasana sangat tegang.',
    options: [
      'Menjaga emosi sendiri, fokus pada kontribusi konkret, dan berusaha menjadi penstabil tim',
      'Menyampaikan kekhawatiran tentang situasi tim ke atasan agar segera ditangani',
      'Menarik diri dari dinamika tim dan fokus pada pekerjaan sendiri agar tidak terpengaruh',
      'Mengajak tim bicara terbuka untuk melepaskan tekanan sebelum kembali bekerja',
    ],
    mostScores: [4, 2, 1, 3],
    leastScores: [-2, 1, 2, -1],
  },
  {
    code: 'SJT-21',
    dim: 'integritas',
    scenario:
      'Atasan sedang mempertimbangkan keputusan strategis yang menurut Anda kurang tepat berdasarkan data yang Anda miliki. Menyampaikannya bisa membuat suasana tidak nyaman.',
    options: [
      'Menyampaikan kekhawatiran secara langsung dan profesional ke atasan, dilengkapi data',
      'Menyampaikannya ke rekan dekat dulu — kalau banyak yang sepakat, baru disampaikan ke atasan bersama',
      'Diam — keputusan itu kewenangan atasan dan bukan posisi Anda untuk mempertanyakannya',
      'Menunggu keputusan berjalan, siapkan analisis jika diminta evaluasi nanti',
    ],
    mostScores: [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },
  {
    code: 'SJT-22',
    dim: 'integritas',
    scenario:
      'Anda membuat kesalahan yang berdampak ke proyek tim, tapi ada peluang untuk mengarahkan persepsi ke faktor lain sehingga peran Anda tidak terlihat jelas.',
    options: [
      'Memanfaatkan situasi — semua orang menjaga reputasinya masing-masing',
      'Tidak secara aktif menyembunyikan, tapi juga tidak secara aktif mengakui jika tidak ditanya',
      'Mengakui ke atasan secara pribadi tapi tidak perlu diumumkan ke seluruh tim',
      'Mengakui kesalahan secara langsung ke atasan dan tim yang terdampak, sekaligus membawa solusi konkret',
    ],
    mostScores: [1, 2, 3, 4],
    leastScores: [2, 1, -1, -2],
  },
  {
    code: 'SJT-23',
    dim: 'resiliensi',
    scenario:
      'Proyek besar yang Anda pimpin gagal total setelah 3 bulan kerja keras. Semua pihak kecewa.',
    options: [
      'Langsung menganalisis apa yang salah, mendokumentasikan pelajarannya, dan memulai proyek berikutnya dengan pendekatan yang sudah diperbarui',
      'Fokus pada pekerjaan rutin yang lebih aman dulu sebelum mengambil proyek besar lagi',
      'Meminta atasan untuk mengurangi tanggung jawab sementara sampai kepercayaan diri pulih',
      'Membutuhkan waktu beberapa minggu untuk memproses kegagalan ini sebelum bisa bergerak maju',
    ],
    mostScores: [4, 3, 1, 2],
    leastScores: [-2, -1, 2, 1],
  },
  {
    code: 'SJT-24',
    dim: 'resiliensi',
    scenario:
      'Anda mendapat feedback keras dari klien penting yang menyebut pekerjaan Anda jauh di bawah ekspektasi.',
    options: [
      'Meminta klien menjelaskan spesifik apa yang di bawah ekspektasi dan menyampaikan rencana perbaikan dalam 24 jam',
      'Menjelaskan konteks dan alasan mengapa hasilnya seperti itu agar klien memahami situasinya',
      'Meminta atasan untuk ikut berbicara dengan klien agar ada dukungan dari sisi manajemen',
      'Membutuhkan beberapa hari untuk memproses feedback itu sebelum merespons secara profesional',
    ],
    mostScores: [4, 1, 3, 2],
    leastScores: [-2, 2, -1, 1],
  },
  {
    code: 'SJT-25',
    dim: 'communicationClarity',
    scenario:
      'Anda harus menyampaikan laporan teknis kompleks kepada tim manajemen yang tidak berlatar belakang teknis.',
    options: [
      'Menyampaikan seluruh detail teknis agar manajemen mendapat gambaran paling lengkap dan akurat',
      'Menyiapkan 3 poin utama yang relevan bagi manajemen, dengan detail teknis sebagai lampiran jika ingin mendalami',
      'Meminta rekan teknis untuk menyampaikannya karena lebih menguasai detailnya',
      'Menyampaikan ringkasan singkat dan membuka sesi tanya jawab panjang untuk mengakomodasi semua kebutuhan',
    ],
    mostScores: [2, 4, 1, 3],
    leastScores: [1, -2, 2, -1],
  },
  {
    code: 'SJT-26',
    dim: 'communicationClarity',
    scenario:
      'Setelah menjelaskan sesuatu cukup panjang, audiens terlihat bingung tapi tidak ada yang bertanya.',
    options: [
      'Melanjutkan ke poin berikutnya — jika ada yang bingung mereka akan bertanya sendiri',
      'Mengirimkan ulang materi dalam bentuk tulisan setelah sesi untuk membantu yang belum paham',
      'Berhenti, mengecek pemahaman dengan pertanyaan langsung, lalu menjelaskan ulang dengan cara berbeda',
      'Bertanya "Ada yang kurang jelas?" — jika tidak ada respons, berarti sudah dipahami',
    ],
    mostScores: [1, 3, 4, 2],
    leastScores: [2, -1, -2, 1],
  },
]

export const essayQuestions: EssayQuestion[] = [
  {
    code: 'E01',
    dim: 'responsFeedback',
    question:
      'Apa kritik paling penting yang menurut Anda perlu disampaikan untuk memperbaiki cara kerja perusahaan atau tim Anda saat ini?',
    hint:
      'Fokus pada kritik yang konkret, bukan keluhan umum. Jelaskan masalah yang Anda lihat dan dampaknya.',
  },
  {
    code: 'E02',
    dim: 'ownership',
    question:
      'Jika Anda diberi kesempatan memperbaiki satu hal dalam 30 hari ke depan, apa yang akan Anda ubah dan langkah pertama apa yang Anda ambil?',
    hint:
      'Tulis saran yang realistis dan operasional. Sebutkan langkah awal, bukan hanya ide besar.',
  },
  {
    code: 'E03',
    dim: 'innovative',
    question:
      'Adakah ide efisiensi, penghematan biaya, atau penyederhanaan proses yang menurut Anda layak dicoba di perusahaan?',
    hint:
      'Pilih satu ide yang spesifik. Jelaskan bagaimana ide itu bekerja dan manfaat nyatanya.',
  },
  {
    code: 'E04',
    dim: 'caraBerpikir',
    question:
      'Apa ide baru yang menurut Anda bisa meningkatkan kualitas kerja, layanan pelanggan, atau hasil bisnis perusahaan?',
    hint:
      'Tunjukkan hubungan antara ide, eksekusi, dan dampak. Hindari jawaban yang terlalu abstrak.',
  },
  {
    code: 'E05',
    dim: 'dampakTim',
    question:
      'Jika Anda menjadi leader selama 3 bulan, area perusahaan mana yang paling Anda prioritaskan untuk dibenahi atau dikembangkan, dan kenapa?',
    hint:
      'Jawaban terbaik menunjukkan prioritas yang jelas, alasan yang kuat, dan arah tindakan yang masuk akal.',
  },
]
