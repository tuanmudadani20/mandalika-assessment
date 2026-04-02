/**
 * ASSESSMENT QUESTION BANK v2.0
 * ─────────────────────────────────────────────────────────────────────
 * Phase 1A: Psychometric Battery   → 33 Tetrads × 4 items = 132 items
 * Phase 1B: ML-SJT                 → 30 Situational Judgment Questions
 * Phase 2:  BEI                    → 5 Behavioral Event Interview Questions
 * ─────────────────────────────────────────────────────────────────────
 * 13 Dimensions:
 *   Layer 1 (CSS Gate): INT, OWN, STP, CBP
 *   Layer 2:            GRW, DCS
 *   Layer 3:            DPT, CMC, RSL
 *   Layer 4:            EMO, KOL, INS, FHS
 */

// ─── DIMENSIONS ──────────────────────────────────────────────────────────────
export const DIMENSIONS = {
  INT: { id: "INT", label: "Integritas",        layer: 1, color: "#dc2626" },
  OWN: { id: "OWN", label: "Ownership",         layer: 1, color: "#ea580c" },
  STP: { id: "STP", label: "Standar Pribadi",   layer: 1, color: "#d97706" },
  CBP: { id: "CBP", label: "Cara Berpikir",     layer: 1, color: "#ca8a04" },
  GRW: { id: "GRW", label: "Growth Mindset",    layer: 2, color: "#16a34a" },
  DCS: { id: "DCS", label: "Decisive",          layer: 2, color: "#0d9488" },
  DPT: { id: "DPT", label: "Dampak Tim",        layer: 3, color: "#0891b2" },
  CMC: { id: "CMC", label: "Comm Clarity",      layer: 3, color: "#2563eb" },
  RSL: { id: "RSL", label: "Resiliensi",        layer: 3, color: "#7c3aed" },
  EMO: { id: "EMO", label: "Emot Controlled",   layer: 4, color: "#a21caf" },
  KOL: { id: "KOL", label: "Kolaborasi",        layer: 4, color: "#be185d" },
  INS: { id: "INS", label: "Inisiatif",         layer: 4, color: "#e11d48" },
  FHS: { id: "FHS", label: "Fokus Hasil",       layer: 4, color: "#475569" },
};

// ─── CSS THRESHOLDS (Layer 1 gate) ───────────────────────────────────────────
// Score < threshold → candidate flagged / not recommended
export const LAYER1_THRESHOLDS = {
  INT: 55,  // persen
  OWN: 55,
  STP: 50,
  CBP: 50,
};

// ─── SCORING HELPERS ─────────────────────────────────────────────────────────
/**
 * Tetrad item scoring:
 *   positive item: score = rank given (4=most like me → 4 pts)
 *   negative item: score = 5 − rank given (4=most like me → 1 pt) ← penalizes self-ID with negative
 *
 * For each tetrad the respondent assigns ranks 1–4 (all unique).
 * dimensionRawScore = Σ item scores across all tetrads
 * dimensionPct = (raw − min_possible) / (max − min) × 100
 */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: PSYCHOMETRIC BATTERY — 33 TETRADS
// type: "positive" | "negative" | "mixed"
//   positive  → all 4 items are desirable statements
//   negative  → all 4 items are undesirable (L1 only); scored inverted
//   mixed     → item[0] is positive, items[1–3] are negative (consistency/faking check)
// ─────────────────────────────────────────────────────────────────────────────
export const TETRADS = [

  // ── ALL-POSITIVE TETRADS T01–T23 ──────────────────────────────────────────

  {
    id: "T01", type: "positive",
    items: [
      { dim: "GRW", text: "Saya melihat umpan balik kritis sebagai kesempatan belajar yang berharga, bukan sebagai serangan terhadap diri saya." },
      { dim: "DCS", text: "Saya mampu membuat keputusan tegas bahkan ketika informasi yang tersedia masih belum lengkap." },
      { dim: "DPT", text: "Kehadiran saya secara nyata dan terasa meningkatkan standar orang-orang yang bekerja di sekitar saya." },
      { dim: "CMC", text: "Saya bisa menyampaikan ide yang paling kompleks sekalipun dengan cara yang singkat dan langsung dipahami." },
    ]
  },
  {
    id: "T02", type: "positive",
    items: [
      { dim: "RSL", text: "Saya bangkit kembali dengan cepat setelah mengalami kegagalan atau penolakan yang signifikan." },
      { dim: "EMO", text: "Saya tidak membiarkan emosi mengambil alih keputusan saya, bahkan saat berada di bawah tekanan besar." },
      { dim: "KOL", text: "Saya secara konsisten mengutamakan kesuksesan bersama tim daripada mendapatkan kredit dan pengakuan pribadi." },
      { dim: "INS", text: "Saya melihat celah yang ada dan langsung mengisinya tanpa perlu diminta oleh siapapun." },
    ]
  },
  {
    id: "T03", type: "positive",
    items: [
      { dim: "FHS", text: "Saya selalu mengaitkan setiap pekerjaan saya secara langsung dengan hasil akhir yang ingin dicapai." },
      { dim: "GRW", text: "Saya secara aktif dan proaktif mencari ilmu baru di luar lingkup tugas utama saya." },
      { dim: "DCS", text: "Saya tidak menunda-nunda keputusan hanya karena takut membuat pilihan yang ternyata keliru." },
      { dim: "RSL", text: "Saya tetap produktif dan fokus meski berada di bawah tekanan situasi yang tinggi." },
    ]
  },
  {
    id: "T04", type: "positive",
    items: [
      { dim: "EMO", text: "Saya memproses frustrasi dan emosi dengan matang terlebih dahulu sebelum merespons situasi apapun." },
      { dim: "KOL", text: "Saya secara aktif mencari masukan dari orang-orang yang memiliki perspektif berbeda dari saya." },
      { dim: "INS", text: "Saya memulai hal-hal baru dan mengambil tindakan sebelum ada krisis yang memaksa saya untuk bergerak." },
      { dim: "DPT", text: "Orang-orang di sekitar saya cenderung bekerja lebih baik dan lebih termotivasi saat berkolaborasi bersama saya." },
    ]
  },
  {
    id: "T05", type: "positive",
    items: [
      { dim: "CMC", text: "Saya secara sadar menyesuaikan gaya dan pendekatan komunikasi saya dengan audiens yang sedang saya hadapi." },
      { dim: "FHS", text: "Saya mengukur kesuksesan saya berdasarkan outcome nyata yang dihasilkan, bukan seberapa keras usaha yang saya keluarkan." },
      { dim: "GRW", text: "Saya siap mengubah cara kerja saya dengan cepat jika ada pendekatan baru yang terbukti lebih efektif." },
      { dim: "EMO", text: "Saya tidak menularkan stres, kecemasan, atau tekanan saya kepada anggota tim di sekitar saya." },
    ]
  },
  {
    id: "T06", type: "positive",
    items: [
      { dim: "DCS", text: "Setelah keputusan diambil, saya berkomitmen penuh dan menjalankannya sampai selesai tanpa ragu-ragu." },
      { dim: "RSL", text: "Saya tidak membiarkan satu kegagalan mengguncang atau memengaruhi performa saya di area kerja lainnya." },
      { dim: "KOL", text: "Saya berbagi informasi dan sumber daya yang saya miliki secara proaktif dengan orang-orang yang membutuhkannya." },
      { dim: "INS", text: "Saya secara proaktif mengidentifikasi masalah yang ada sebelum masalah itu berkembang menjadi lebih besar." },
    ]
  },
  {
    id: "T07", type: "positive",
    items: [
      { dim: "DPT", text: "Saya memengaruhi cara kerja dan standar tim secara positif tanpa harus memiliki jabatan atau otoritas formal." },
      { dim: "CMC", text: "Saya selalu memastikan orang lain benar-benar memahami pesan saya, bukan sekadar mengangguk tanda setuju." },
      { dim: "FHS", text: "Saya secara konsisten memprioritaskan aktivitas yang memberi dampak terbesar, bukan yang paling mudah dikerjakan." },
      { dim: "GRW", text: "Saya jauh lebih menikmati tantangan baru yang belum pernah saya hadapi daripada tugas yang sudah saya kuasai sebelumnya." },
    ]
  },
  {
    id: "T08", type: "positive",
    items: [
      { dim: "DCS", text: "Saya mampu memprioritaskan hal-hal dengan cepat dan tepat ketika banyak tugas mendesak datang bersamaan." },
      { dim: "EMO", text: "Saya tetap profesional dan terkendali bahkan saat berselisih paham atau berkonflik dengan seseorang." },
      { dim: "KOL", text: "Saya mudah dan nyaman bekerja sama dengan orang-orang yang cara kerjanya sangat berbeda dari saya." },
      { dim: "RSL", text: "Ketika satu pendekatan tidak berhasil, saya dengan cepat mencari dan beralih ke jalan lain yang lebih efektif." },
    ]
  },
  {
    id: "T09", type: "positive",
    items: [
      { dim: "INS", text: "Saya mengusulkan perbaikan dan peningkatan secara aktif meski itu bukan bagian resmi dari tanggung jawab atau KPI saya." },
      { dim: "DPT", text: "Cara-cara kerja baru yang saya perkenalkan ke tim kemudian diadopsi secara lebih luas dan menjadi standar baru." },
      { dim: "CMC", text: "Saya memberikan konteks yang cukup dan relevan dalam komunikasi tanpa menjadi bertele-tele atau membingungkan." },
      { dim: "FHS", text: "Saya tidak terjebak pada aktivitas dan kesibukan tanpa memastikan ada dampak nyata dari setiap hal yang saya kerjakan." },
    ]
  },
  {
    id: "T10", type: "positive",
    items: [
      { dim: "GRW", text: "Kegagalan yang saya alami membuat saya penasaran dan ingin tahu apa yang bisa diperbaiki, bukan membuat saya putus asa." },
      { dim: "DCS", text: "Saya bisa dengan cepat memotong diskusi yang berlarut-larut dan mendorong tim menuju kesimpulan yang konkret." },
      { dim: "KOL", text: "Saya secara sadar membangun kepercayaan dengan tim jauh sebelum saya benar-benar membutuhkannya." },
      { dim: "EMO", text: "Saya bisa menerima dan memproses kritik keras dari siapapun tanpa menutup diri atau bereaksi secara defensif." },
    ]
  },
  {
    id: "T11", type: "positive",
    items: [
      { dim: "RSL", text: "Tekanan situasi justru membuat saya lebih fokus dan tajam dalam bekerja, bukan lebih kacau dan tidak terarah." },
      { dim: "INS", text: "Saya tidak pernah menunggu instruksi yang lengkap dan jelas untuk mulai bergerak dan mengambil tindakan nyata." },
      { dim: "DPT", text: "Saya berani secara langsung menegur standar yang rendah yang ada di lingkungan sekitar saya." },
      { dim: "CMC", text: "Saya selalu menyusun dan mempersiapkan pesan saya dengan matang sebelum menyampaikannya kepada orang lain." },
    ]
  },
  {
    id: "T12", type: "positive",
    items: [
      { dim: "FHS", text: "Saya terus mendorong eksekusi dengan gigih sampai hasilnya benar-benar nyata, konkret, dan terukur." },
      { dim: "GRW", text: "Saya secara rutin menginvestasikan waktu pribadi saya untuk mengembangkan kemampuan yang paling relevan dengan peran saya." },
      { dim: "EMO", text: "Saya mampu memberikan umpan balik yang sulit dan tidak nyaman tanpa nada defensif, emosional, atau menyerang." },
      { dim: "RSL", text: "Saya mengolah kegagalan sebagai data objektif yang bisa dipelajari, bukan sebagai penilaian terhadap nilai diri saya." },
    ]
  },
  {
    id: "T13", type: "positive",
    items: [
      { dim: "DCS", text: "Saya langsung bertindak ketika arah yang cukup jelas sudah terlihat, tanpa menunggu kondisi sempurna terlebih dahulu." },
      { dim: "KOL", text: "Saya secara aktif mendukung dan membangun di atas ide orang lain, bahkan jika ide awalnya bukan berasal dari saya." },
      { dim: "INS", text: "Saya membuat sesuatu menjadi lebih baik karena saya secara sadar memilih untuk melakukannya, bukan karena diminta." },
      { dim: "DPT", text: "Saya berkontribusi pada budaya dan atmosfer tim yang positif, tidak hanya pada output dan deliverable pribadi saya." },
    ]
  },
  {
    id: "T14", type: "positive",
    items: [
      { dim: "CMC", text: "Saya secara aktif menciptakan suasana di mana orang lain merasa aman untuk bertanya dan mengungkap kebingungan mereka." },
      { dim: "FHS", text: "Saya sangat sadar dan tahu perbedaan yang jelas antara 'terlihat sibuk' dan 'benar-benar produktif' dalam keseharian." },
      { dim: "GRW", text: "Saya meminta umpan balik dan masukan secara proaktif, jauh sebelum ada yang menawarkan atau mewajibkannya kepada saya." },
      { dim: "KOL", text: "Saya secara aktif membuat kontribusi dan pencapaian orang lain lebih terlihat dan diakui oleh seluruh tim." },
    ]
  },
  {
    id: "T15", type: "positive",
    items: [
      { dim: "DCS", text: "Saya tidak menghabiskan waktu terlalu lama mencari opsi yang sempurna ketika opsi yang sudah baik sudah tersedia di depan saya." },
      { dim: "EMO", text: "Saya tidak pernah bereaksi berlebihan terhadap berita buruk, melainkan langsung beralih fokus ke solusi dan langkah selanjutnya." },
      { dim: "RSL", text: "Saya secara konsisten menjaga energi dan motivasi internal saya bahkan dalam periode kerja yang panjang dan melelahkan." },
      { dim: "INS", text: "Saya mengambil langkah maju dengan berani meski ada ketidakpastian yang signifikan dan belum terpecahkan di depan." },
    ]
  },
  {
    id: "T16", type: "positive",
    items: [
      { dim: "DPT", text: "Tim saya terbukti bekerja lebih produktif dan lebih efektif ketika saya ada dan terlibat di dalamnya." },
      { dim: "CMC", text: "Saya secara sadar menghindari penggunaan jargon teknis ketika berbicara dengan orang yang bukan ahli di bidang tersebut." },
      { dim: "FHS", text: "Saya secara aktif menggunakan data dan metrik untuk memastikan saya bekerja pada hal-hal yang paling berdampak." },
      { dim: "GRW", text: "Saya nyaman dan terbuka mengakui ketidaktahuan saya dan bersedia belajar dari siapapun yang memiliki keahlian lebih." },
    ]
  },
  {
    id: "T17", type: "positive",
    items: [
      { dim: "DCS", text: "Saya merespons situasi krisis dengan cepat, tenang, dan tetap terfokus pada solusi yang bisa segera dieksekusi." },
      { dim: "KOL", text: "Saya tidak pernah menyimpan informasi penting untuk diri sendiri ketika orang lain jelas membutuhkan informasi tersebut." },
      { dim: "EMO", text: "Saya tahu kapan saya perlu mengambil jeda sejenak agar saya tidak merespons situasi secara emosional dan reaktif." },
      { dim: "RSL", text: "Saya bisa bertahan dengan baik dan tetap terarah dalam situasi yang ambigu tanpa kehilangan kompas atau tujuan." },
    ]
  },
  {
    id: "T18", type: "positive",
    items: [
      { dim: "INS", text: "Saya secara aktif menciptakan peluang baru yang belum ada sebelumnya, tidak hanya merespons peluang yang sudah tersedia." },
      { dim: "DPT", text: "Cara kerja dan standar saya menjadi referensi yang dirujuk oleh orang-orang lain di sekitar saya." },
      { dim: "CMC", text: "Saya selalu merangkum dan mengkonfirmasi pemahaman bersama secara eksplisit di akhir setiap diskusi penting." },
      { dim: "FHS", text: "Saya secara konsisten mencapai target yang ditetapkan bahkan ketika kondisi dan situasinya jauh dari ideal." },
    ]
  },
  {
    id: "T19", type: "positive",
    items: [
      { dim: "INT", text: "Saya mengakui kesalahan yang saya buat dengan jelas dan terbuka, bahkan ketika tidak ada seorangpun yang tahu tentang kesalahan itu." },
      { dim: "OWN", text: "Saya mengambil tanggung jawab penuh atas hasil kerja saya tanpa menyalahkan faktor, orang, atau kondisi eksternal." },
      { dim: "GRW", text: "Saya mengejar stretch goal yang menantang batas kemampuan saya meski ada risiko nyata dan konkret untuk gagal." },
      { dim: "DCS", text: "Saya memutuskan berdasarkan prinsip dan nilai yang saya pegang teguh, tidak hanya berdasarkan ketersediaan data semata." },
    ]
  },
  {
    id: "T20", type: "positive",
    items: [
      { dim: "STP", text: "Saya secara konsisten menetapkan standar kerja pribadi yang lebih tinggi dari apa yang secara formal diminta atau diharapkan." },
      { dim: "CBP", text: "Sebelum mengambil keputusan apapun, saya selalu menganalisis situasi dari beberapa sudut pandang yang berbeda." },
      { dim: "DPT", text: "Saya secara aktif membantu orang-orang di sekitar saya untuk melihat dan mencapai potensi yang lebih tinggi dari yang mereka kira bisa." },
      { dim: "KOL", text: "Saya terlibat aktif dan memberikan kontribusi nyata dalam setiap diskusi, bukan hanya diam mendengarkan tanpa berpartisipasi." },
    ]
  },
  {
    id: "T21", type: "positive",
    items: [
      { dim: "INT", text: "Saya berbicara dengan jujur dan apa adanya bahkan ketika kejujuran itu tidak menguntungkan posisi atau citra saya." },
      { dim: "STP", text: "Saya tidak pernah merasa puas dengan pekerjaan yang 'cukup baik' selama masih ada ruang nyata untuk membuat hasilnya lebih baik." },
      { dim: "RSL", text: "Saya pulih dari situasi-situasi sulit jauh lebih cepat dibandingkan kebanyakan orang lain yang menghadapi tekanan yang serupa." },
      { dim: "FHS", text: "Saya tidak akan terjebak mengerjakan banyak hal yang terasa produktif tanpa memastikan apakah itu benar-benar menghasilkan dampak." },
    ]
  },
  {
    id: "T22", type: "positive",
    items: [
      { dim: "OWN", text: "Ketika ada yang salah, saya langsung dan pertama-tama fokus pada apa yang bisa saya kendalikan dan lakukan untuk memperbaikinya." },
      { dim: "CBP", text: "Saya terbiasa mencari pola dan koneksi tersembunyi yang tidak terlihat jelas oleh kebanyakan orang lain dalam situasi yang sama." },
      { dim: "EMO", text: "Saya tetap tenang dan sepenuhnya terkendali bahkan ketika dikritik atau diserang di depan banyak orang sekalipun." },
      { dim: "INS", text: "Saya secara aktif bertindak atas nama tim ketika tidak ada orang lain yang bergerak untuk mengatasi masalah yang ada." },
    ]
  },
  {
    id: "T23", type: "positive",
    items: [
      { dim: "CMC", text: "Saya selalu memilih medium dan format komunikasi yang paling tepat untuk setiap jenis pesan dan audiens yang dituju." },
      { dim: "GRW", text: "Saya mendapatkan pembelajaran yang jauh lebih dalam dan berharga dari pengalaman-pengalaman sulit daripada dari pengalaman mudah." },
      { dim: "DCS", text: "Saya mampu keluar dari analysis paralysis dan mendorong diri sendiri serta tim untuk mengambil keputusan yang diperlukan." },
      { dim: "RSL", text: "Saya tidak menyerah atau berhenti di tengah jalan meski hambatan yang datang terasa sangat berat dan menguras energi." },
    ]
  },

  // ── ALL-NEGATIVE TETRADS T24–T31 (Layer 1 only, scored inverted) ──────────

  {
    id: "T24", type: "negative",
    items: [
      { dim: "INT", text: "Saya kadang menyesuaikan cara saya menyampaikan fakta agar versi yang saya sampaikan terdengar lebih menguntungkan bagi saya." },
      { dim: "OWN", text: "Ketika ada proyek yang gagal, saya cenderung menganalisis dan menyoroti kontribusi orang lain lebih dulu sebelum bagian saya." },
      { dim: "STP", text: "Saya cenderung berhenti dan puas ketika standar minimum yang diminta sudah terpenuhi, tidak lebih dari itu." },
      { dim: "CBP", text: "Saya cenderung mempercayai kesimpulan pertama yang tampak masuk akal tanpa merasa perlu menganalisisnya lebih jauh." },
    ]
  },
  {
    id: "T25", type: "negative",
    items: [
      { dim: "INT", text: "Saya tidak selalu melaporkan sesuatu yang saya ketahui jika tidak ada yang secara aktif menanyakan hal tersebut kepada saya." },
      { dim: "OWN", text: "Saya perlu dorongan atau tekanan dari luar yang nyata agar saya benar-benar mulai bergerak dan mengambil tindakan." },
      { dim: "STP", text: "Saya tidak melihat manfaat yang jelas dari mengerjakan sesuatu melebihi apa yang secara eksplisit diminta dari saya." },
      { dim: "CBP", text: "Saya lebih nyaman mengikuti pendekatan yang sudah terbukti sebelumnya daripada menganalisis ulang situasi yang ada dari awal." },
    ]
  },
  {
    id: "T26", type: "negative",
    items: [
      { dim: "INT", text: "Saya lebih memilih untuk diam dan tidak menyebut-nyebut daripada secara aktif mengungkap kesalahan yang sudah saya buat." },
      { dim: "OWN", text: "Saya sering merasa bahwa faktor-faktor eksternal di luar kendali saya yang menjadi hambatan utama pencapaian saya." },
      { dim: "STP", text: "Saya merasa cukup senang jika pekerjaan sudah selesai dan diserahkan, meski saya sadar hasilnya bisa jauh lebih baik." },
      { dim: "CBP", text: "Saya kadang mengambil kesimpulan sebelum semua data dan informasi yang relevan berhasil dikumpulkan secara lengkap." },
    ]
  },
  {
    id: "T27", type: "negative",
    items: [
      { dim: "INT", text: "Saya tidak merasa ada masalah dengan melebih-lebihkan sedikit informasi jika itu membantu situasi terlihat lebih baik." },
      { dim: "OWN", text: "Ketika ada masalah, penjelasan saya hampir selalu dimulai dari mengidentifikasi mengapa hal itu sebenarnya bukan kesalahan saya." },
      { dim: "STP", text: "Saya lebih memilih menyelesaikan pekerjaan dengan efisien daripada meluangkan ekstra effort untuk kualitas yang lebih tinggi." },
      { dim: "CBP", text: "Saya sulit dan tidak nyaman melihat masalah yang sama dari perspektif yang berbeda dari cara saya biasa memandangnya." },
    ]
  },
  {
    id: "T28", type: "negative",
    items: [
      { dim: "INT", text: "Saya terkadang menghindari mengungkap informasi tertentu yang kemungkinan akan membuat saya terlihat tidak kompeten atau tidak baik." },
      { dim: "OWN", text: "Saya cenderung menunggu sampai situasinya lebih jelas dan pasti sebelum benar-benar mengambil tanggung jawab penuh." },
      { dim: "STP", text: "Saya merasa standar yang sudah ditetapkan organisasi sudah cukup dan tidak perlu saya tingkatkan sendiri secara mandiri." },
      { dim: "CBP", text: "Saya sering mengandalkan heuristik atau pola pengalaman lama daripada menganalisis situasi baru dari perspektif yang segar." },
    ]
  },
  {
    id: "T29", type: "negative",
    items: [
      { dim: "INT", text: "Saya pernah menyetujui atau mendukung sesuatu yang sebenarnya tidak saya yakini sepenuhnya karena adanya tekanan sosial dari lingkungan." },
      { dim: "OWN", text: "Saya merasa jauh lebih mudah untuk bertindak tegas ketika ada orang lain yang memvalidasi langkah saya sebelumnya." },
      { dim: "STP", text: "Saya sering berpikir bahwa menjaga dan mendorong standar yang lebih tinggi adalah tanggung jawab manajemen, bukan karyawan." },
      { dim: "CBP", text: "Saya lebih suka menyelesaikan masalah dengan cepat daripada memastikan saya benar-benar memahami akar permasalahannya." },
    ]
  },
  {
    id: "T30", type: "negative",
    items: [
      { dim: "INT", text: "Ada kalanya saya menyampaikan versi yang sedikit lebih 'dipoles' dari kenyataan yang sebenarnya terjadi kepada atasan saya." },
      { dim: "OWN", text: "Ketika saya tidak berhasil mencapai target, respons pertama saya biasanya adalah mengidentifikasi hambatan eksternal yang ada." },
      { dim: "STP", text: "Saya merasa tidak perlu mendorong diri melampaui ekspektasi yang ada jika tidak ada reward atau insentif tambahan yang diberikan." },
      { dim: "CBP", text: "Saya cenderung lebih mempercayai intuisi dan pengalaman masa lalu daripada hasil analisis data yang mendalam dan sistematis." },
    ]
  },
  {
    id: "T31", type: "negative",
    items: [
      { dim: "INT", text: "Saya kadang membiarkan orang lain berasumsi positif tentang sesuatu meski saya mengetahui bahwa faktanya berbeda dari asumsi mereka." },
      { dim: "OWN", text: "Saya merasa lebih nyaman dan aman ketika seseorang memberikan arahan yang jelas daripada harus mengambil inisiatif dan bergerak sendiri." },
      { dim: "STP", text: "Saya menilai pekerjaan yang sudah cukup baik tidak perlu diperbaiki lebih lanjut, apalagi jika tidak ada yang memintanya." },
      { dim: "CBP", text: "Saya cenderung mengandalkan pendapat orang yang dipercaya dan berpengalaman daripada bersusah payah menganalisis sendiri." },
    ]
  },

  // ── MIXED TETRADS T32–T33 (Consistency / Faking Detection) ───────────────
  // item[0] = satu positive item; items[1–3] = negative items (L1 only)
  // Faking alert: jika positive item diberi rank rendah DAN negative items diberi rank tinggi
  // → inkonsistensi dengan skor Phase 1A positif tetrads

  {
    id: "T32", type: "mixed",
    // [0] positive, [1–3] negative
    items: [
      { dim: "DPT", positive: true,  text: "Dampak positif saya terhadap standar dan cara kerja tim terasa bahkan ketika saya tidak secara fisik hadir di sana." },
      { dim: "INT", positive: false, text: "Saya terkadang memilih untuk menceritakan versi peristiwa yang paling menguntungkan saya, meski tidak sepenuhnya akurat." },
      { dim: "OWN", positive: false, text: "Saya lebih cepat dan mudah menyebut hambatan yang saya hadapi daripada langkah-langkah nyata yang sudah saya ambil." },
      { dim: "STP", positive: false, text: "Saya merasa puas jika pekerjaan saya telah memenuhi standar minimal yang ditetapkan, tidak lebih dari itu." },
    ]
  },
  {
    id: "T33", type: "mixed",
    items: [
      { dim: "CMC", positive: true,  text: "Saya selalu memastikan ada kejelasan dan kesepakatan yang nyata di akhir setiap sesi komunikasi penting yang saya lakukan." },
      { dim: "CBP", positive: false, text: "Saat menghadapi situasi baru, saya cenderung menerapkan solusi lama yang pernah berhasil tanpa banyak analisis ulang." },
      { dim: "INT", positive: false, text: "Saya terkadang menunda mengungkap masalah yang ada dengan harapan bahwa masalah itu akan selesai dengan sendirinya." },
      { dim: "OWN", positive: false, text: "Saya merasa lebih aman dan nyaman ketika keputusan-keputusan penting diambil oleh orang lain daripada oleh saya sendiri." },
    ]
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: ML-SJT — 30 SITUATIONAL JUDGMENT QUESTIONS
// Format: pilih satu opsi terbaik → score = key[chosen_option]
// Key values: 0 (terburuk) → 4 (terbaik)
// ─────────────────────────────────────────────────────────────────────────────
export const SJT_QUESTIONS = [

  // ── LAYER 1: Integritas (3 soal) ──────────────────────────────────────────

  {
    id: "SJT01", dim: "INT", layer: 1,
    scenario: "Anda baru menyelesaikan laporan yang sudah diserahkan ke manajemen. Anda kemudian menemukan bahwa ada data yang salah yang Anda gunakan, dan data yang benar akan mengubah kesimpulan laporan secara signifikan. Tidak ada yang tahu tentang kesalahan ini.",
    options: [
      { key: "A", text: "Melaporkan kesalahan segera ke manajemen meski laporan sudah diserahkan dan akan ada konsekuensinya.", score: 4 },
      { key: "B", text: "Memeriksa terlebih dahulu seberapa besar dampak kesalahan tersebut sebelum memutuskan apakah perlu dilaporkan.", score: 2 },
      { key: "C", text: "Memperbaiki untuk laporan berikutnya tanpa menyebutkan laporan sebelumnya yang salah kepada siapapun.", score: 1 },
      { key: "D", text: "Menunggu untuk melihat apakah ada yang menanyakan atau menemukan sendiri kesalahan tersebut.", score: 0 },
    ]
  },
  {
    id: "SJT02", dim: "INT", layer: 1,
    scenario: "Dalam rapat tim, atasan Anda memuji sebuah keberhasilan dan mengaitkannya dengan keputusan yang ia buat. Anda tahu bahwa ide awalnya sebenarnya bukan dari atasan, melainkan dari rekan Anda yang tidak hadir di rapat itu.",
    options: [
      { key: "A", text: "Langsung meluruskan di rapat bahwa ide tersebut berasal dari rekan yang tidak hadir.", score: 3 },
      { key: "B", text: "Berbicara secara pribadi dengan atasan setelah rapat dan menyampaikan informasi yang sebenarnya.", score: 4 },
      { key: "C", text: "Mengirim pesan ke rekan tersebut dan membiarkan ia yang memutuskan apakah ingin mengklaim idenya.", score: 2 },
      { key: "D", text: "Membiarkan situasi berlalu karena ini tidak berdampak langsung pada pekerjaan atau hasil akhir.", score: 0 },
    ]
  },
  {
    id: "SJT03", dim: "INT", layer: 1,
    scenario: "Anda menemukan bahwa proses yang selama ini dijalankan tim Anda sebenarnya melanggar kebijakan internal perusahaan, meski hal ini tidak disengaja dan tidak pernah dipermasalahkan sebelumnya.",
    options: [
      { key: "A", text: "Melaporkan temuan ini ke atasan atau compliance team segera tanpa menunggu.", score: 4 },
      { key: "B", text: "Mencari tahu dulu apakah ada risiko nyata yang signifikan sebelum memutuskan untuk melaporkannya.", score: 2 },
      { key: "C", text: "Memperbaiki proses diam-diam ke depannya tanpa melaporkan apa yang sudah terjadi sebelumnya.", score: 1 },
      { key: "D", text: "Tidak melakukan apa-apa karena tidak ada yang tahu dan tidak ada dampak nyata yang terlihat.", score: 0 },
    ]
  },

  // ── LAYER 1: Ownership (3 soal) ───────────────────────────────────────────

  {
    id: "SJT04", dim: "OWN", layer: 1,
    scenario: "Tim Anda gagal mencapai target kuartal. Dalam sesi post-mortem, semua orang cenderung menyoroti hambatan eksternal (kondisi pasar, kurangnya support dari divisi lain, dsb). Anda sendiri merasa ada hal-hal yang bisa dilakukan tim jauh lebih baik.",
    options: [
      { key: "A", text: "Mengangkat secara spesifik hal-hal yang bisa dilakukan tim lebih baik, meski terasa kurang populer di rapat saat itu.", score: 4 },
      { key: "B", text: "Setuju dengan narasi hambatan eksternal karena memang ada kebenarannya, sambil diam-diam mencatat yang perlu diperbaiki.", score: 2 },
      { key: "C", text: "Menunggu atasan yang memimpin diskusi tentang apa saja yang perlu diperbaiki secara internal ke depannya.", score: 1 },
      { key: "D", text: "Langsung fokus pada rencana kuartal berikutnya tanpa terlalu lama membahas apa yang salah di kuartal ini.", score: 1 },
    ]
  },
  {
    id: "SJT05", dim: "OWN", layer: 1,
    scenario: "Sebuah proyek yang Anda pimpin mengalami keterlambatan signifikan. Beberapa anggota tim tidak perform sesuai harapan, dan ada juga hambatan yang memang di luar kendali Anda. Atasan Anda meminta penjelasan langsung.",
    options: [
      { key: "A", text: "Menjelaskan semua faktor secara jujur: apa yang di luar kendali, apa yang bisa dilakukan lebih baik, dan apa yang akan Anda ubah.", score: 4 },
      { key: "B", text: "Menyoroti hambatan eksternal terlebih dahulu secara detail, kemudian menyebut perbaikan yang akan dilakukan.", score: 2 },
      { key: "C", text: "Langsung menyampaikan rencana perbaikan yang konkret tanpa terlalu banyak membahas penyebab di baliknya.", score: 3 },
      { key: "D", text: "Meminta atasan untuk memahami konteks dan kompleksitas hambatan yang ada sebelum memberikan penilaian apapun.", score: 0 },
    ]
  },
  {
    id: "SJT06", dim: "OWN", layer: 1,
    scenario: "Ada masalah yang muncul di area kerja yang sebenarnya bukan tanggung jawab langsung Anda, tapi Anda tahu bahwa jika tidak segera ditangani, hal ini akan berdampak buruk pada tim secara keseluruhan.",
    options: [
      { key: "A", text: "Mengambil inisiatif untuk menangani atau mengangkat masalah ini meski secara formal bukan tugas Anda.", score: 4 },
      { key: "B", text: "Memberitahu orang yang bertanggung jawab dan memastikan mereka benar-benar menanganinya.", score: 3 },
      { key: "C", text: "Menunggu untuk melihat apakah orang yang bertanggung jawab akan menyadari dan menangani sendiri.", score: 1 },
      { key: "D", text: "Tidak ikut campur karena itu bukan wilayah tanggung jawab Anda dan ada batasnya.", score: 0 },
    ]
  },

  // ── LAYER 1: Standar Pribadi (3 soal) ────────────────────────────────────

  {
    id: "SJT07", dim: "STP", layer: 1,
    scenario: "Anda baru menyelesaikan sebuah deliverable dan secara teknis sudah memenuhi semua yang diminta. Anda menyadari ada beberapa hal yang jika diperbaiki akan membuat hasilnya jauh lebih baik, tapi itu membutuhkan 2–3 jam tambahan di luar jadwal.",
    options: [
      { key: "A", text: "Menghabiskan waktu tambahan untuk memperbaiki karena Anda menetapkan standar yang lebih tinggi dari sekadar yang diminta.", score: 4 },
      { key: "B", text: "Menyerahkan yang ada tapi menyertakan catatan tentang hal-hal yang bisa ditingkatkan lebih lanjut di kemudian hari.", score: 2 },
      { key: "C", text: "Menyelesaikan dengan standar yang diminta karena itu yang diharapkan dan ada pekerjaan lain yang sudah menunggu.", score: 1 },
      { key: "D", text: "Menanyakan ke atasan apakah ada waktu atau alasan untuk revisi tambahan sebelum akhirnya memutuskan.", score: 1 },
    ]
  },
  {
    id: "SJT08", dim: "STP", layer: 1,
    scenario: "Anda menyadari bahwa cara Anda menangani tugas tertentu selama ini sudah cukup efisien, tapi ada metode baru yang lebih baik yang membutuhkan investasi waktu belajar yang cukup signifikan di awal.",
    options: [
      { key: "A", text: "Meluangkan waktu untuk mempelajari metode baru meski lebih lambat di awal, karena hasilnya akan lebih baik jangka panjang.", score: 4 },
      { key: "B", text: "Mempelajari metode baru secara bertahap di waktu luang sambil tetap menggunakan metode lama untuk pekerjaan yang mendesak.", score: 3 },
      { key: "C", text: "Menerapkan metode baru hanya jika ada yang meminta secara eksplisit atau jika manfaat langsungnya sudah sangat jelas.", score: 1 },
      { key: "D", text: "Tetap menggunakan metode yang sudah berjalan baik karena tidak ada yang meminta perubahan dan hasilnya sudah cukup.", score: 0 },
    ]
  },
  {
    id: "SJT09", dim: "STP", layer: 1,
    scenario: "Anda diminta mempresentasikan sebuah analisis dalam 2 hari. Anda bisa membuat presentasi yang memenuhi standar dalam 1 hari, atau Anda bisa menggunakan 2 hari penuh untuk membuat sesuatu yang jauh lebih tajam, mendalam, dan insightful.",
    options: [
      { key: "A", text: "Menggunakan waktu penuh yang tersedia untuk membuat presentasi yang paling kuat, bernilai tinggi, dan berkesan.", score: 3 },
      { key: "B", text: "Menyelesaikan draft di hari pertama dan menggunakan hari kedua secara penuh untuk review mendalam dan penajaman konten.", score: 4 },
      { key: "C", text: "Menyelesaikan presentasi di hari pertama dan menggunakan sisa waktu untuk mengerjakan hal lain yang juga penting.", score: 1 },
      { key: "D", text: "Bertanya kepada atasan mana yang lebih ia prioritaskan: kualitas presentasi atau penyelesaian tugas-tugas lainnya.", score: 1 },
    ]
  },

  // ── LAYER 1: Cara Berpikir (3 soal) ──────────────────────────────────────

  {
    id: "SJT10", dim: "CBP", layer: 1,
    scenario: "Tim Anda diminta memutuskan strategi baru. Ada satu opsi yang sudah populer dalam diskusi dan kebanyakan orang sudah condong ke sana. Anda merasa ada satu asumsi penting yang belum pernah dipertanyakan oleh siapapun.",
    options: [
      { key: "A", text: "Mengangkat asumsi yang belum dipertanyakan tersebut secara langsung di forum, meski diskusi sudah condong ke satu arah.", score: 4 },
      { key: "B", text: "Menyampaikan kekhawatiran Anda secara privat kepada pengambil keputusan sebelum keputusan final diumumkan.", score: 3 },
      { key: "C", text: "Mendukung opsi yang populer karena mayoritas tim sudah sepakat, dan bisa jadi Anda yang salah memahami situasi.", score: 1 },
      { key: "D", text: "Menunggu dulu untuk melihat apakah asumsi yang Anda pertanyakan memang relevan setelah keputusan mulai diimplementasikan.", score: 0 },
    ]
  },
  {
    id: "SJT11", dim: "CBP", layer: 1,
    scenario: "Anda menerima laporan komprehensif yang menyimpulkan bahwa program A adalah pilihan terbaik. Anda membaca datanya dan melihat beberapa pola menarik yang sepertinya tidak dianalisis atau dibahas dalam laporan tersebut.",
    options: [
      { key: "A", text: "Menganalisis sendiri data tersebut secara mendalam dan mengangkat temuan Anda ke forum diskusi yang relevan.", score: 4 },
      { key: "B", text: "Meminta penjelasan kepada pembuat laporan tentang pola yang Anda lihat dan mengapa tidak dianalisis.", score: 3 },
      { key: "C", text: "Mengakui bahwa laporan yang dibuat sudah komprehensif dan kemungkinan Anda yang salah menginterpretasi data.", score: 1 },
      { key: "D", text: "Menerima kesimpulan laporan dan langsung fokus pada perencanaan implementasi program A.", score: 0 },
    ]
  },
  {
    id: "SJT12", dim: "CBP", layer: 1,
    scenario: "Anda diminta memberikan rekomendasi cepat tentang sebuah situasi bisnis. Data yang ada cukup mendukung satu kesimpulan, tapi Anda merasa ada satu sudut pandang penting yang belum dipertimbangkan sama sekali.",
    options: [
      { key: "A", text: "Mengambil waktu sejenak untuk mengeksplorasi sudut pandang yang belum dipertimbangkan sebelum memberikan rekomendasi.", score: 3 },
      { key: "B", text: "Memberikan rekomendasi berdasarkan data yang ada sambil secara eksplisit menyebutkan keterbatasan analisis Anda.", score: 4 },
      { key: "C", text: "Memberikan rekomendasi yang paling didukung oleh data yang tersedia karena itulah yang diminta saat ini.", score: 1 },
      { key: "D", text: "Meminta lebih banyak waktu dan data tambahan sebelum memberikan rekomendasi apapun.", score: 1 },
    ]
  },

  // ── LAYER 2: Growth Mindset (2 soal) ─────────────────────────────────────

  {
    id: "SJT13", dim: "GRW", layer: 2,
    scenario: "Anda menerima umpan balik dari atasan bahwa cara Anda mengelola proyek perlu perbaikan signifikan, terutama dalam hal perencanaan. Ini mengejutkan Anda karena Anda merasa sudah melakukan yang terbaik yang bisa Anda lakukan.",
    options: [
      { key: "A", text: "Langsung meminta detail spesifik tentang apa yang perlu diperbaiki dan membuat rencana pengembangan yang konkret dan terukur.", score: 4 },
      { key: "B", text: "Merenungkan feedback tersebut secara mendalam dan secara aktif mencari sumber belajar tentang project management yang lebih baik.", score: 3 },
      { key: "C", text: "Menjelaskan konteks dan tantangan yang dihadapi agar atasan memahami situasi Anda dengan lebih baik dan adil.", score: 1 },
      { key: "D", text: "Menerima feedback secara formal tapi dalam hati tetap merasa cara Anda sudah cukup baik mengingat kondisi yang ada.", score: 0 },
    ]
  },
  {
    id: "SJT14", dim: "GRW", layer: 2,
    scenario: "Anda melihat bahwa skill set yang Anda miliki saat ini sudah cukup untuk pekerjaan Anda sekarang, tapi ada satu bidang baru yang relevan yang belum Anda kuasai dan bisa meningkatkan kontribusi Anda secara sangat signifikan.",
    options: [
      { key: "A", text: "Secara proaktif merencanakan dan mulai mempelajari bidang baru tersebut dengan target dan timeline yang jelas dan terukur.", score: 4 },
      { key: "B", text: "Mempelajari bidang baru tersebut secara perlahan di waktu luang tanpa tekanan target yang spesifik.", score: 3 },
      { key: "C", text: "Menunggu sampai bidang baru tersebut benar-benar dibutuhkan dalam pekerjaan Anda sehari-hari sebelum mulai belajar.", score: 1 },
      { key: "D", text: "Fokus pada menjadi yang paling ahli di bidang yang sudah Anda kuasai dengan baik saat ini.", score: 1 },
    ]
  },

  // ── LAYER 2: Decisive (2 soal) ────────────────────────────────────────────

  {
    id: "SJT15", dim: "DCS", layer: 2,
    scenario: "Anda harus membuat keputusan penting dengan deadline besok pagi. Data yang tersedia saat ini baru 70% lengkap, dan mengumpulkan sisa data membutuhkan waktu minimal 2 hari lagi.",
    options: [
      { key: "A", text: "Membuat keputusan terbaik yang bisa diambil dengan 70% data yang ada sambil mendokumentasikan asumsi yang digunakan.", score: 4 },
      { key: "B", text: "Meminta perpanjangan deadline untuk mendapatkan data yang lebih lengkap sebelum mengambil keputusan apapun.", score: 2 },
      { key: "C", text: "Membuat keputusan sementara sambil terus mengumpulkan data untuk konfirmasi dan penyesuaian jika diperlukan.", score: 3 },
      { key: "D", text: "Mendelegasikan keputusan ke atasan karena data yang ada dirasa belum cukup memadai untuk memutuskan.", score: 0 },
    ]
  },
  {
    id: "SJT16", dim: "DCS", layer: 2,
    scenario: "Tim Anda sudah berdiskusi panjang tentang dua pendekatan yang berbeda. Kedua pihak memiliki argumen yang sama-sama kuat. Diskusi sudah berlangsung tiga kali tanpa menghasilkan keputusan yang jelas dan situasi mulai molor.",
    options: [
      { key: "A", text: "Mengambil posisi tegas dan merekomendasikan salah satu pendekatan dengan alasan yang jelas, meski ada pihak yang tidak setuju.", score: 3 },
      { key: "B", text: "Merancang dan menyepakati kriteria keputusan bersama tim, kemudian menggunakannya untuk memilih secara terstruktur dan objektif.", score: 4 },
      { key: "C", text: "Mengusulkan untuk menjalankan pilot kecil untuk kedua pendekatan terlebih dahulu sebelum memutuskan yang mana yang lebih baik.", score: 2 },
      { key: "D", text: "Mengangkat situasi ini ke atasan dan meminta mereka untuk membuat keputusan final agar perdebatan selesai.", score: 0 },
    ]
  },

  // ── LAYER 3: Dampak Tim (2 soal) ─────────────────────────────────────────

  {
    id: "SJT17", dim: "DPT", layer: 3,
    scenario: "Anda menyadari bahwa standar kerja di tim Anda secara umum lebih rendah dari yang seharusnya, tapi Anda bukan manajer atau pemimpin formal tim tersebut. Semua orang sepertinya sudah terbiasa dan nyaman dengan standar yang ada.",
    options: [
      { key: "A", text: "Secara langsung mengangkat observasi ini dan mencontohkan standar yang lebih tinggi secara konsisten melalui cara kerja Anda sendiri.", score: 4 },
      { key: "B", text: "Berbicara secara privat dengan beberapa anggota tim yang terlihat punya potensi untuk mendorong perubahan dari dalam.", score: 3 },
      { key: "C", text: "Menyampaikan observasi ini kepada manajer tim dan membiarkan manajer yang mengambil tindakan formal.", score: 2 },
      { key: "D", text: "Fokus pada mempertahankan standar pekerjaan Anda sendiri yang tinggi tanpa mencampuri cara kerja orang lain.", score: 1 },
    ]
  },
  {
    id: "SJT18", dim: "DPT", layer: 3,
    scenario: "Seorang rekan kerja Anda diminta mempresentasikan sebuah strategi yang menurut Anda kurang kuat dan perlu diperkuat. Anda bisa dengan jelas melihat cara untuk memperbaikinya secara signifikan. Presentasinya akan dilakukan dalam 2 hari.",
    options: [
      { key: "A", text: "Menawarkan waktu dan energy Anda secara langsung untuk membantu rekan tersebut memperkuat strateginya sebelum presentasi.", score: 4 },
      { key: "B", text: "Memberikan masukan spesifik yang actionable melalui pesan dan membiarkan rekan memutuskan apakah akan menggunakannya.", score: 3 },
      { key: "C", text: "Menunggu sampai setelah presentasi selesai baru memberikan feedback konstruktif agar tidak mengguncang kepercayaan dirinya.", score: 1 },
      { key: "D", text: "Tidak ikut campur sama sekali karena itu adalah presentasi dan tanggung jawab rekan Anda, bukan Anda.", score: 0 },
    ]
  },

  // ── LAYER 3: Comm Clarity (2 soal) ───────────────────────────────────────

  {
    id: "SJT19", dim: "CMC", layer: 3,
    scenario: "Anda diminta mempresentasikan hasil analisis teknis yang sangat kompleks kepada direksi yang tidak memiliki background teknis. Anda memiliki banyak data dan temuan mendalam yang ingin Anda sampaikan secara menyeluruh.",
    options: [
      { key: "A", text: "Menyederhanakan analisis menjadi 3–5 insight utama yang paling relevan dengan keputusan strategis yang perlu diambil direksi.", score: 3 },
      { key: "B", text: "Menyiapkan presentasi berlapis: ringkasan eksekutif di awal, dengan detail teknis tersedia sebagai lampiran jika ada pertanyaan lanjutan.", score: 4 },
      { key: "C", text: "Menyampaikan semua analisis secara lengkap dan mendalam agar direksi memiliki gambaran penuh dan tidak ada informasi yang hilang.", score: 1 },
      { key: "D", text: "Meminta seseorang yang lebih berpengalaman dalam komunikasi eksekutif untuk membantu Anda menyiapkan dan menyampaikan presentasi.", score: 0 },
    ]
  },
  {
    id: "SJT20", dim: "CMC", layer: 3,
    scenario: "Anda mengirimkan instruksi tertulis kepada tim tentang proses kerja yang baru. Dua hari kemudian Anda menyadari bahwa tim mengeksekusi proses tersebut secara berbeda dan tidak konsisten dengan apa yang Anda maksudkan.",
    options: [
      { key: "A", text: "Mengadakan sesi singkat untuk mengkonfirmasi pemahaman bersama dan merevisi instruksi agar jauh lebih jelas dan tidak ambigu.", score: 4 },
      { key: "B", text: "Mengirimkan pesan klarifikasi yang lebih detail dan meminta setiap anggota tim mengkonfirmasi pemahaman mereka secara eksplisit.", score: 3 },
      { key: "C", text: "Memberitahu anggota tim yang keliru secara individual satu per satu untuk mengkoreksi pendekatan mereka masing-masing.", score: 2 },
      { key: "D", text: "Menganggap perbedaan eksekusi ini sebagai variasi yang masih dalam toleransi dan menunggu hasil akhirnya terlebih dahulu.", score: 0 },
    ]
  },

  // ── LAYER 3: Resiliensi (2 soal) ─────────────────────────────────────────

  {
    id: "SJT21", dim: "RSL", layer: 3,
    scenario: "Proyek besar yang Anda kerjakan dengan penuh dedikasi selama 3 bulan baru saja dibatalkan oleh manajemen karena perubahan prioritas bisnis. Anda merasa kecewa dan tim Anda juga merasakan hal yang sama.",
    options: [
      { key: "A", text: "Memproses kekecewaan dengan cepat dan profesional, kemudian langsung fokus membantu tim move on dan mengarahkan energi ke prioritas baru.", score: 4 },
      { key: "B", text: "Mengambil waktu yang diperlukan untuk mencerna situasi ini secara utuh sebelum melanjutkan pekerjaan yang lain.", score: 2 },
      { key: "C", text: "Meminta penjelasan menyeluruh kepada manajemen tentang alasan pembatalan untuk memastikan situasi serupa tidak terulang.", score: 2 },
      { key: "D", text: "Menyampaikan kekecewaan tim secara langsung kepada manajemen agar mereka memahami dampak nyata dari keputusan tersebut.", score: 1 },
    ]
  },
  {
    id: "SJT22", dim: "RSL", layer: 3,
    scenario: "Anda mengalami serangkaian kegagalan dalam 2 minggu terakhir: proposal penting ditolak, target meleset, dan ada konflik yang belum terselesaikan dengan rekan kerja. Anda mulai merasakan kehilangan motivasi yang nyata.",
    options: [
      { key: "A", text: "Mengevaluasi secara objektif apa yang bisa dipelajari dari masing-masing situasi dan langsung membuat rencana tindakan konkret ke depan.", score: 4 },
      { key: "B", text: "Membicarakan situasi ini dengan mentor atau orang yang dipercaya untuk mendapatkan perspektif yang lebih objektif dan menyegarkan.", score: 3 },
      { key: "C", text: "Memberi diri sendiri waktu istirahat yang cukup sejenak sebelum kembali dengan energi dan fokus yang lebih segar.", score: 2 },
      { key: "D", text: "Terus bekerja seperti biasanya sambil menunggu dan berharap situasi akan membaik dengan sendirinya seiring waktu.", score: 1 },
    ]
  },

  // ── LAYER 4: Emot Controlled (2 soal) ────────────────────────────────────

  {
    id: "SJT23", dim: "EMO", layer: 4,
    scenario: "Di tengah rapat penting, seorang rekan tiba-tiba menyela presentasi Anda dengan kritik tajam yang menurut Anda tidak berdasar dan agak merendahkan, di depan semua peserta rapat yang hadir.",
    options: [
      { key: "A", text: "Mengambil napas sejenak, mengakui kritik dengan tenang dan profesional, lalu melanjutkan presentasi sambil merespons substansinya.", score: 4 },
      { key: "B", text: "Meminta waktu untuk merespons kritik tersebut secara lebih mendalam dalam sesi terpisah setelah rapat selesai.", score: 2 },
      { key: "C", text: "Langsung merespons dengan data dan argumen yang kuat untuk membantah kritik tersebut di tempat dan saat itu juga.", score: 2 },
      { key: "D", text: "Melanjutkan presentasi tanpa merespons kritik tersebut sama sekali pada saat itu.", score: 1 },
    ]
  },
  {
    id: "SJT24", dim: "EMO", layer: 4,
    scenario: "Anda mendapat kabar buruk yang cukup mengguncang dari urusan pribadi di pagi hari, dan Anda harus memimpin rapat penting dengan seluruh tim Anda pada siang harinya.",
    options: [
      { key: "A", text: "Memimpin rapat seperti biasanya dengan penuh profesionalisme, secara sadar mengelola emosi agar tidak memengaruhi dinamika rapat.", score: 4 },
      { key: "B", text: "Memulai rapat dengan sedikit transparansi bahwa Anda sedang tidak dalam kondisi terbaik hari ini, tanpa perlu memberikan detail.", score: 3 },
      { key: "C", text: "Mendelegasikan peran pemimpin rapat kepada rekan yang paling bisa diandalkan untuk mengisi posisi Anda hari ini.", score: 2 },
      { key: "D", text: "Menunda rapat jika kondisi memungkinkan karena Anda tidak ingin memimpin rapat dalam kondisi yang tidak prima.", score: 1 },
    ]
  },

  // ── LAYER 4: Kolaborasi (2 soal) ─────────────────────────────────────────

  {
    id: "SJT25", dim: "KOL", layer: 4,
    scenario: "Anda dan rekan kerja Anda memiliki perbedaan pendapat yang kuat tentang arah sebuah proyek. Anda cukup yakin bahwa pendekatan Anda lebih baik dan memiliki data yang mendukung keyakinan tersebut.",
    options: [
      { key: "A", text: "Mempresentasikan data Anda secara terbuka dan jujur, mendengarkan counter-argumen mereka dengan sungguh-sungguh, lalu mencari sintesis terbaik bersama.", score: 4 },
      { key: "B", text: "Mendiskusikan perbedaan ini secara privat terlebih dahulu sebelum membawanya ke forum atau rapat yang lebih besar.", score: 3 },
      { key: "C", text: "Mengusulkan secara langsung untuk mengadopsi pendekatan Anda dengan penjelasan yang kuat dan data yang mendukung.", score: 2 },
      { key: "D", text: "Menerima pendekatan rekan karena hubungan tim yang baik jauh lebih penting daripada memenangkan perdebatan ini.", score: 1 },
    ]
  },
  {
    id: "SJT26", dim: "KOL", layer: 4,
    scenario: "Anda sedang sangat sibuk mengerjakan proyek prioritas yang penting, tapi rekan di divisi lain membutuhkan bantuan Anda untuk sesuatu di bidang yang Anda ahli, dan tenggat mereka adalah besok pagi.",
    options: [
      { key: "A", text: "Meluangkan waktu yang cukup untuk membantu karena kesuksesan dan keberhasilan divisi lain juga penting bagi perusahaan secara keseluruhan.", score: 3 },
      { key: "B", text: "Mengirimkan panduan, referensi, atau template yang bisa membantu mereka menyelesaikan masalahnya secara lebih mandiri.", score: 2 },
      { key: "C", text: "Membantu sebagian yang paling kritis sambil mengarahkan mereka ke sumber atau orang lain untuk bagian yang tidak sempat Anda bantu.", score: 4 },
      { key: "D", text: "Menjelaskan dengan sopan bahwa Anda tidak bisa membantu saat ini karena sedang dalam mode fokus penuh pada prioritas Anda.", score: 1 },
    ]
  },

  // ── LAYER 4: Inisiatif (2 soal) ──────────────────────────────────────────

  {
    id: "SJT27", dim: "INS", layer: 4,
    scenario: "Anda menyadari ada proses yang tidak efisien di tim Anda yang sudah berjalan lama dan sudah jadi kebiasaan. Tidak ada yang meminta Anda untuk memperbaikinya dan memperbaiki proses ini juga bukan bagian dari KPI Anda.",
    options: [
      { key: "A", text: "Menganalisis masalahnya secara mendalam, merancang solusi konkret, dan mengusulkan perbaikan secara proaktif kepada atasan.", score: 4 },
      { key: "B", text: "Menyampaikan observasi dan ide perbaikan Anda kepada orang yang bertanggung jawab atas proses tersebut.", score: 3 },
      { key: "C", text: "Mendokumentasikan masalah yang Anda temukan dan menunggu waktu atau forum yang tepat untuk mengangkatnya.", score: 1 },
      { key: "D", text: "Membiarkan hal ini berjalan karena bukan tanggung jawab Anda dan ada hal lain yang lebih prioritas untuk dikerjakan.", score: 0 },
    ]
  },
  {
    id: "SJT28", dim: "INS", layer: 4,
    scenario: "Anda melihat peluang bisnis potensial yang belum ditangkap perusahaan. Ini di luar scope kerja langsung Anda dan membutuhkan effort ekstra untuk menginvestigasi serta menyiapkan proposal yang solid ke manajemen.",
    options: [
      { key: "A", text: "Menginvestigasi peluang tersebut secara mandiri dan menyiapkan proposal yang konkret dan compelling untuk dipresentasikan ke manajemen.", score: 4 },
      { key: "B", text: "Menyampaikan ide ini kepada atasan Anda dan menawarkan untuk terlibat lebih jauh jika mereka tertarik untuk mengeksplorasi.", score: 3 },
      { key: "C", text: "Berbagi ide ini secara informal kepada beberapa kolega yang relevan dan melihat apakah ada yang tertarik untuk menindaklanjuti bersama.", score: 2 },
      { key: "D", text: "Menunggu forum atau kesempatan yang tepat untuk menyampaikan ide ini secara formal sesuai jalur yang berlaku.", score: 1 },
    ]
  },

  // ── LAYER 4: Fokus Hasil (2 soal) ────────────────────────────────────────

  {
    id: "SJT29", dim: "FHS", layer: 4,
    scenario: "Anda memiliki daftar panjang tugas yang perlu diselesaikan hari ini. Semuanya tampak penting dan mendesak, tapi Anda tidak punya waktu yang cukup untuk menyelesaikan semuanya secara memadai.",
    options: [
      { key: "A", text: "Secara eksplisit mengevaluasi dampak nyata tiap tugas terhadap hasil bisnis dan mengerjakan yang memberikan dampak paling besar terlebih dahulu.", score: 4 },
      { key: "B", text: "Menyelesaikan tugas yang paling cepat selesai terlebih dahulu untuk membersihkan daftar, baru mengerjakan yang lebih besar.", score: 1 },
      { key: "C", text: "Berkonsultasi terlebih dahulu dengan atasan untuk mengkonfirmasi prioritas sebelum mulai mengerjakan tugas manapun.", score: 3 },
      { key: "D", text: "Mengerjakan tugas sesuai urutan permintaan yang masuk agar semua stakeholder merasa dilayani dengan adil.", score: 1 },
    ]
  },
  {
    id: "SJT30", dim: "FHS", layer: 4,
    scenario: "Anda sedang mengelola sebuah proyek yang sudah berjalan 2 bulan. Aktivitas berjalan lancar dan tim sangat aktif, tapi Anda mulai mempertanyakan apakah semua aktivitas yang dilakukan benar-benar mengarah pada outcome yang diinginkan.",
    options: [
      { key: "A", text: "Mengadakan sesi evaluasi mid-project untuk mengkonfirmasi arah dan memastikan setiap aktivitas terhubung langsung ke outcome yang dituju.", score: 4 },
      { key: "B", text: "Meminta update progress terbaru beserta data dari tim untuk memverifikasi apakah kita masih on track menuju tujuan.", score: 3 },
      { key: "C", text: "Mempercayai proses yang sudah dirancang dengan baik di awal dan tetap fokus pada eksekusi yang konsisten.", score: 1 },
      { key: "D", text: "Menunggu review akhir proyek yang sudah dijadwalkan untuk mengevaluasi apakah outcome berhasil tercapai sesuai rencana.", score: 0 },
    ]
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: BEHAVIORAL EVENT INTERVIEW (BEI) — 5 PERTANYAAN
// Format STAR: Situation → Task → Action → Result
// Skor per jawaban: 1–4 (dinilai oleh AI atau interviewer)
// ─────────────────────────────────────────────────────────────────────────────
export const BEI_QUESTIONS = [
  {
    id: "BEI01",
    dims: ["INT", "OWN"],
    question: "Ceritakan satu momen konkret ketika Anda bisa saja menyembunyikan kesalahan yang Anda buat, tapi Anda memilih untuk tidak melakukannya. Apa konsekuensi yang Anda hadapi, dan apa yang mendorong Anda membuat pilihan itu?",
    probes: [
      "Apa yang membuat Anda akhirnya memilih untuk mengungkapkannya?",
      "Bagaimana reaksi orang-orang di sekitar Anda?",
      "Apa yang Anda pelajari dari pengalaman tersebut?",
    ],
    scoring_rubric: {
      4: "Situasi nyata dan signifikan. Pengungkapan dilakukan secara sukarela tanpa paksaan eksternal. Konsekuensi diterima dengan matang. Motivasi yang diartikulasikan berasal dari nilai internal yang kuat (bukan sekadar takut ketahuan atau kalkulasi pragmatis).",
      3: "Situasi konkret ada. Pengungkapan dilakukan, tapi motivasi lebih pada menghindari masalah yang lebih besar, atau ada orang lain yang sudah mulai mendekati kebenaran.",
      2: "Contoh ada tapi samar atau tidak benar-benar 'bisa disembunyikan'. Banyak self-justification. Atau fokus berlebihan pada dampak positif dari pengungkapan.",
      1: "Tidak bisa memberikan contoh konkret yang relevan. Menceritakan situasi di mana ia tidak mengungkap. Atau menceritakan kesalahan orang lain.",
    },
    red_flags: [
      "Jawaban yang terlalu sempurna dan tidak ada konsekuensi nyata",
      "Pengungkapan karena terpaksa, bukan pilihan",
      "Tidak bisa mengingat situasi konkret apapun",
    ]
  },
  {
    id: "BEI02",
    dims: ["STP", "GRW"],
    question: "Apa perubahan terbesar yang Anda buat pada cara kerja atau kemampuan Anda dalam 12 bulan terakhir yang sama sekali tidak ada yang meminta atau mewajibkannya? Apa yang mendorong Anda dan apa hasilnya?",
    probes: [
      "Dari mana awalnya ide perubahan itu datang?",
      "Apa hambatan terbesar yang Anda hadapi dalam prosesnya?",
      "Bagaimana Anda mengukur bahwa perubahan itu berhasil?",
    ],
    scoring_rubric: {
      4: "Perubahan signifikan yang jelas-jelas dimotivasi sepenuhnya dari dalam (intrinsik). Ada proses belajar yang terstruktur dan disengaja. Ada dampak terukur yang konkret dan bisa diceritakan. Timeline realistis.",
      3: "Perubahan ada dan inisiatif sendiri, tapi skalanya relatif kecil atau dampaknya tidak diukur dengan jelas. Motivasinya agak campur antara internal dan eksternal.",
      2: "Perubahan ada tapi sebenarnya ada pemicu tidak langsung dari luar (umpan balik yang membuat terpaksa, situasi krisis, tekanan implisit dari lingkungan).",
      1: "Tidak bisa memberikan contoh yang jelas. Perubahan yang disebutkan merupakan respons terhadap permintaan atau tekanan eksplisit dari luar.",
    },
    red_flags: [
      "Semua 'perubahan' yang disebutkan berasal dari dorongan eksternal",
      "Tidak bisa mengukur dampak dari perubahan yang dilakukan",
      "Perubahan yang disebutkan sangat trivial untuk level posisi",
    ]
  },
  {
    id: "BEI03",
    dims: ["CBP", "DCS"],
    question: "Ceritakan satu keputusan sulit yang pernah Anda ambil dalam situasi di mana informasi yang Anda miliki tidak lengkap. Bagaimana proses berpikir Anda, apa yang Anda putuskan, dan apa yang terjadi setelahnya?",
    probes: [
      "Apa yang membuat keputusan itu terasa sulit?",
      "Informasi apa yang Anda miliki dan apa yang tidak Anda miliki?",
      "Apa yang akan Anda lakukan berbeda jika menghadapi situasi serupa?",
    ],
    scoring_rubric: {
      4: "Keputusan nyata, signifikan, dan benar-benar sulit. Proses berpikir terstruktur dan bisa diartikulasikan dengan jelas. Mampu mengidentifikasi asumsi yang digunakan dan trade-off yang diterima. Action dan outcome jelas dan jujur.",
      3: "Keputusan konkret ada, proses berpikir ada tapi kurang terstruktur atau belum bisa diartikulasikan dengan baik. Atau keputusannya relatif kecil dampaknya.",
      2: "Cerita ada tapi keputusannya sebenarnya tidak terlalu sulit, atau proses berpikir tidak dijelaskan sama sekali, atau outcome positif terlalu mudah.",
      1: "Tidak memberikan contoh konkret. Atau menceritakan bagaimana keputusan tersebut akhirnya dihindari, ditunda, atau didelegasikan ke orang lain.",
    },
    red_flags: [
      "Keputusan yang diceritakan sebenarnya keputusan kolektif, bukan individu",
      "Tidak bisa menjelaskan proses berpikirnya, hanya hasilnya",
      "Semua keputusan yang diceritakan selalu berakhir sukses tanpa pembelajaran",
    ]
  },
  {
    id: "BEI04",
    dims: ["DPT", "CMC"],
    question: "Ceritakan situasi konkret ketika Anda berhasil mengubah cara pikir, perilaku, atau standar kerja orang-orang di sekitar Anda, padahal Anda tidak memiliki otoritas formal atas mereka. Apa yang Anda lakukan dan apa yang berubah?",
    probes: [
      "Bagaimana awalnya Anda menyadari perubahan itu diperlukan?",
      "Apa resistensi yang Anda hadapi dan bagaimana Anda mengatasinya?",
      "Seberapa bertahan perubahan yang terjadi?",
    ],
    scoring_rubric: {
      4: "Situasi konkret dan signifikan. Perubahan pada orang lain jelas terukur atau sangat terasa nyata. Pendekatan yang digunakan strategis dan diartikulasikan dengan baik. Dampak perubahan bertahan dalam jangka menengah.",
      3: "Situasi ada, ada dampak pada orang lain, tapi perubahan yang terjadi tidak signifikan, tidak bertahan, atau kandidat tidak bisa mengartikulasikan kontribusi spesifiknya.",
      2: "Situasi ada tapi perubahan yang terjadi minimal. Atau sulit dibedakan apakah perubahan itu memang karena kontribusi kandidat atau faktor lain.",
      1: "Tidak bisa memberikan contoh yang relevan. Atau contoh yang diberikan adalah situasi di mana ia menggunakan otoritas formal untuk mengubah perilaku orang.",
    },
    red_flags: [
      "Contoh hanya melibatkan satu orang dan dalam jangka pendek",
      "Perubahan yang terjadi karena posisi atau kekuasaan, bukan pengaruh genuine",
      "Tidak bisa menjelaskan 'bagaimana' nya, hanya 'apa' yang terjadi",
    ]
  },
  {
    id: "BEI05",
    dims: ["RSL", "EMO"],
    question: "Kegagalan terbesar apa yang pernah Anda alami dalam konteks pekerjaan? Ceritakan secara detail apa yang terjadi, apa peran Anda, dan bagaimana Anda merespons dan pulih dari pengalaman tersebut.",
    probes: [
      "Apa peran Anda secara spesifik dalam kegagalan tersebut?",
      "Bagaimana Anda menjaga diri agar tetap bisa bergerak maju?",
      "Apa dampak jangka panjang pengalaman ini terhadap cara kerja Anda sekarang?",
    ],
    scoring_rubric: {
      4: "Kegagalan signifikan yang diakui dengan sangat jelas, jujur, tanpa defensif. Peran pribadi diakui secara penuh. Respons yang konstruktif dan matang. Pembelajaran konkret dan bisa diartikulasikan. Move forward dengan cepat dan tidak menyalahkan faktor eksternal secara berlebihan.",
      3: "Kegagalan ada dan peran personal diakui, tapi ada sedikit defensifitas atau blame. Recovery ada tapi tidak terlalu menunjukkan resiliensi yang luar biasa.",
      2: "Kegagalan yang diceritakan sebenarnya adalah 'kesuksesan yang terlambat' atau setengah-setengah. Banyak konteks pembenar. Agak terlalu defensive dalam menceritakan.",
      1: "Tidak mau atau tidak bisa menceritakan kegagalan yang nyata dan signifikan. Menceritakan kegagalan orang lain atau tim. Sangat blame-oriented terhadap faktor dan orang lain.",
    },
    red_flags: [
      "Semua 'kegagalan' ternyata berakhir sukses dengan cepat (humble brag)",
      "Tidak ada peran personal yang diakui, semua karena faktor luar",
      "Sangat emosional saat menceritakan dan tidak bisa objektif",
    ]
  },
];

// ─── BEI AI EVALUATOR SYSTEM PROMPT ──────────────────────────────────────────
// Gunakan ini sebagai system prompt ke Claude API untuk mengevaluasi jawaban BEI
export const BEI_AI_SYSTEM_PROMPT = `Kamu adalah evaluator terlatih Behavioral Event Interview (BEI) yang sangat berpengalaman dalam asesmen psikometri dan seleksi karyawan. Tugasmu adalah mengevaluasi jawaban kandidat secara objektif, adil, dan konsisten berdasarkan rubrik yang diberikan.

PRINSIP EVALUASI:
1. Cari bukti KONKRET: apakah ada situasi spesifik, action nyata, dan outcome yang bisa diverifikasi?
2. Bedakan antara WISHFUL THINKING ("saya selalu...") vs BEHAVIORAL EVIDENCE ("waktu itu saya...")
3. Perhatikan RED FLAGS: blaming others, humble bragging, tidak bisa memberi contoh konkret
4. Evaluasi KEDALAMAN refleksi, bukan hanya isi ceritanya

FORMAT OUTPUT:
Berikan evaluasi dalam format JSON berikut:
{
  "score": <1-4>,
  "justification": "<penjelasan singkat 2-3 kalimat mengapa skor ini diberikan>",
  "strengths": ["<kekuatan yang terlihat dari jawaban>"],
  "concerns": ["<kekhawatiran atau red flag yang terlihat>"],
  "follow_up_needed": <true/false>,
  "follow_up_question": "<pertanyaan follow-up jika diperlukan, atau null>"
}

PENTING: Berikan HANYA output JSON yang valid, tanpa teks tambahan apapun.`;

// ─── EXPORT DEFAULT ───────────────────────────────────────────────────────────
export default {
  DIMENSIONS,
  LAYER1_THRESHOLDS,
  TETRADS,
  SJT_QUESTIONS,
  BEI_QUESTIONS,
  BEI_AI_SYSTEM_PROMPT,
};
