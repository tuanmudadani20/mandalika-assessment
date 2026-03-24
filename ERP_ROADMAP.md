# ERP Mandalika Roadmap

## Modul Inti
- Master Data
- Purchasing
- Manufacturing
- Inventory
- POS
- Finance
- Laporan

## Batang Sistem
- Core
  - Master Data
  - Numbering Dokumen
  - Approval
  - Posting Engine
  - Audit Trail
- Operations
  - Purchasing
  - Manufacturing
  - Inventory
  - POS
- Finance
  - AP
  - AR
  - Cash / Bank
  - Journal
- Reports
  - Operational
  - Stock
  - Finance

## Master Data Final
- Gudang
- Toko
- Vendor
- Reseller
- Finished Good
- Raw Material
- BOM
- Satuan
- Kategori

## Asumsi Saat Ini
- Reseller masih placeholder kosong
- Default gudang reseller: `GFG-SBY`
- BOM belum bisa diekspor dari Accurate
- BOM diperlakukan sebagai manual reference

## Data Nyata Yang Sudah Masuk
- Gudang: 4
- Toko: 27
- Vendor: 48
- Finished Good: 217
- Raw Material: 426
- Kategori: 39
- UOM: 3

## Fase Implementasi

### Fase 1
- Bangun shell utama
- Bangun Master Data
- Finalkan Gudang, Toko, Vendor, FG, RM

### Fase 2
- Purchasing dasar
- PO
- Penerimaan RM
- Retur Vendor

### Fase 3
- Manufacturing dasar
- BOM manual
- WO
- Produksi
- QC
- Waste

### Fase 4
- Inventory dasar
- GR FG
- DO
- Transfer Gudang
- Retur
- Adjustment
- Kartu Stok

### Fase 5
- POS dasar
- Sales
- Retur Sales
- Closing

### Fase 6
- Finance dasar
- AP
- AR
- Cash / Bank
- Journal

### Fase 7
- Laporan operasional
- Laporan stok
- Laporan pembelian
- Laporan produksi
- Laporan penjualan
- Laporan hutang piutang

## Document Flow Final
1. `PR -> PO -> Penerimaan RM -> AP -> Payment Vendor`
2. `BOM -> WO -> Produksi -> QC -> Hasil FG -> Waste`
3. `Gudang FG -> DO / Transfer / Retur / Adjustment -> Kartu Stok`
4. `Toko -> POS Sales -> Closing`
5. `Purchasing + Manufacturing + Inventory + POS -> Finance Posting`

## Prioritas Build Nyata
1. `erp-shell.html`
2. `erp-master.html`
3. `erp-purchasing.html`
4. `erp-manufacturing.html`
5. `erp-inventory.html`
6. `erp-pos.html`
7. `erp-finance.html`
8. `erp-reports.html`

## File Aktif Saat Ini
- `ERP_ROADMAP.md`
- `master-data.js`
- `erp-shell.html`
- `erp-master.html`
- `erp-purchasing.html`
- `erp-manufacturing.html`
- `erp-inventory.html`
- `erp-pos.html`
- `erp-finance.html`
- `erp-reports.html`

## Status Integrasi
- Sidebar silang antar modul sudah aktif
- Shell utama sudah jadi hub ke seluruh modul
- Reports sudah dibuat sebagai modul ringkasan operasional
- Master Data sudah membaca data nyata dari file master

## Catatan Penting
- Jangan gabung semua modul sekaligus
- Stabilkan master dan alur barang dulu
- Finance mengikuti alur transaksi yang sudah matang
