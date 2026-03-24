// Shared transaction foundation generated from master-data.js
(function(){
  const DATA = window.MASTER_DATA || {};
  const SCENARIO_VERSION = 'scenario-20260324-onl-1000-bsd-stock5-v1';
  try {
    if(window.localStorage.getItem('erp.scenario.version') !== SCENARIO_VERSION){
      [
        'purchase_orders','receipts','vendor_returns','work_orders','gr_fg','delivery_orders','stock_aging','sales',
        'inv_transfer','inv_return','pos_return','pos_closing'
      ].forEach(key => window.localStorage.removeItem(`erp.extra.${key}`));
      [
        'erp.do.status_overrides','erp.do.receive_meta',
        'erp.transfer.status_overrides','erp.transfer.receive_meta',
        'erp.return.status_overrides','erp.return.receive_meta',
        'erp.mfg.schedules','erp.mfg.work_orders','erp.mfg.productions','erp.mfg.qc','erp.mfg.waste','erp.mfg.rm_transfer'
      ].forEach(key => window.localStorage.removeItem(key));
      [
        'erp.extra.finance_cash','erp.extra.finance_journal','erp.extra.finance_ar',
        'erp.extra.finance_ap_settlements','erp.extra.finance_ar_settlements'
      ].forEach(key => window.localStorage.removeItem(key));
      const rmMeta = code => (DATA.rm_items || []).find(item => item.rm_code === code) || {};
      const fgMeta = code => (DATA.fg_items || []).find(item => item.fg_code === code) || { fg_code:code, fg_name:code };

      const onlyBraveReceiptNeeds = [
        { item_code:'FO-ONL', item_name:'FRAGRANCE OIL ONLY THE BRAVE', qty:4500 },
        { item_code:'FO-ALK', item_name:'ALKOHOL SOLVEN', qty:10500 },
        { item_code:'PB15-IB', item_name:'BOX INNER BOTOL 15ML', qty:1000 },
        { item_code:'GB-15ONL', item_name:'BOTOL INNER 15ML ONLY THE BRAVE', qty:1000 }
      ];

      const seedReceiptRows = onlyBraveReceiptNeeds.map((row, i) => {
        const meta = rmMeta(row.item_code);
        return {
          receipt_no:`RCV-RM-202603-${String(i + 1).padStart(4,'0')}`,
          receive_no:`RCV-RM-202603-${String(i + 1).padStart(4,'0')}`,
          receipt_date:'2026-03-24',
          receive_date:'2026-03-24',
          vendor_code:meta.default_vendor_code || '',
          vendor_name:meta.primary_supplier || 'No Supplier',
          warehouse_code:'GRM-KDGN',
          warehouse_name:'GUDANG RAW MATERIAL',
          item_code:row.item_code,
          item_name:meta.rm_name || row.item_name,
          qty:row.qty,
          amount:Number(meta.purchase_price || 0) * Number(row.qty || 0),
          status:'Posted'
        };
      });

      const seedSchedules = [
        { schedule_no:'SCH-20260324-001', schedule_date:'2026-03-24', bom_code:'BOM-15GM-ONL', fg_code:'15GM-ONL', fg_name:fgMeta('15GM-ONL').fg_name, plan_qty:1000, line_name:'', status:'Closed', note:'Produksi 1000 pcs Only The Brave', fg_wh:'GFG-SBY' }
      ];

      const seedRmTransfers = onlyBraveReceiptNeeds.map((row, i) => ({
        transfer_no:`TRRM-202603-${String(i + 1).padStart(3,'0')}`,
        transfer_date:'2026-03-24',
        rm_code:row.item_code,
        rm_name:(rmMeta(row.item_code).rm_name || row.item_name),
        from_warehouse:'GRM-KDGN',
        to_warehouse:'GRM-MADE',
        qty:row.qty,
        note:'Transfer RM untuk produksi 1000 pcs Only The Brave',
        status:'Posted'
      }));

      const seedWorkOrders = [
        { wo_no:'WO-202603-001', wo_date:'2026-03-24', fg_code:'15GM-ONL', fg_name:fgMeta('15GM-ONL').fg_name, rm_wh:'GRM-MADE', fg_wh:'GFG-SBY', target_qty:1000, status:'Closed', source_schedule_no:'SCH-20260324-001' }
      ];

      const seedProductions = [
        { prod_no:'PROD-202603-001', wo_no:'WO-202603-001', fg_code:'15GM-ONL', fg_name:fgMeta('15GM-ONL').fg_name, rm_used:17000, fg_result:1000, prod_date:'2026-03-24', status:'Done' }
      ];

      const seedQc = [
        { qc_no:'QC-202603-001', prod_no:'PROD-202603-001', fg_code:'15GM-ONL', fg_name:fgMeta('15GM-ONL').fg_name, accepted:1000, reject:0, note:'Accepted penuh', status:'Done' }
      ];

      const seedGrFgRows = [
        { gr_no:'GRFG-202603-001', gr_date:'2026-03-24', fg_code:'15GM-ONL', fg_name:fgMeta('15GM-ONL').fg_name, warehouse_code:'GFG-SBY', qty:1000, source:'Manufacturing / QC FG QC-202603-001', status:'Posted' }
      ];

      const seedFgTransfers = [
        { trf_no:'TRF-202603-001', trf_date:'2026-03-25', from_warehouse:'GFG-SBY', to_warehouse:'GFG-CBB', fg_code:'15GM-ONL', fg_name:fgMeta('15GM-ONL').fg_name, qty:10, status:'Received', note:'Transfer 10 pcs Only The Brave ke Cibubur untuk stok BSD', created_by:'SYSTEM' }
      ];

      const seedDoRows = [
        { do_no:'DO-202603-001', do_date:'2026-03-25', dest_type:'Toko', dest_name:'MANDALIKA AEON BSD', store_code:'BSD', from_warehouse:'GFG-CBB', fg_code:'15GM-ONL', fg_name:fgMeta('15GM-ONL').fg_name, qty:10, status:'Received' }
      ];

      const seedSalesRows = [
        {
          sales_no:'POS-202603-001',
          sales_date:'2026-03-25',
          store_code:'BSD',
          store_name:'MANDALIKA AEON BSD',
          fg_code:'15GM-ONL',
          fg_name:fgMeta('15GM-ONL').fg_name,
          qty:5,
          net_sales:925000,
          payment_method:'QRIS',
          cashier_id:'KSR-BSD-01',
          customer_name:'Umum',
          status:'Posted'
        }
      ];

      const seedClosingRows = [
        {
          closing_no:'CLS-202603-001',
          closing_date:'2026-03-25',
          store_name:'MANDALIKA AEON BSD',
          store_code:'BSD',
          trx_count:1,
          qty_sold:5,
          net_sales:925000,
          expected_cash:0,
          actual_cash:0,
          cash_diff:0,
          status:'Closed'
        }
      ];

      const seedFinanceCash = [
        {
          cash_no:'CB-202603-001',
          cash_date:'2026-03-25',
          type:'Receipt',
          source:'POS QRIS',
          reference:'POS-202603-001',
          amount:925000,
          status:'Posted'
        }
      ];

      const seedFinanceJournal = [
        {
          journal_no:'JV-202603-001',
          journal_date:'2026-03-25',
          source:'POS-202603-001',
          desc:'Penjualan POS BSD / QRIS / Only The Brave',
          debit:925000,
          credit:925000,
          status:'Posted'
        }
      ];

      window.localStorage.setItem('erp.extra.receipts', JSON.stringify(seedReceiptRows));
      window.localStorage.setItem('erp.mfg.schedules', JSON.stringify(seedSchedules));
      window.localStorage.setItem('erp.mfg.rm_transfer', JSON.stringify(seedRmTransfers));
      window.localStorage.setItem('erp.mfg.work_orders', JSON.stringify(seedWorkOrders));
      window.localStorage.setItem('erp.mfg.productions', JSON.stringify(seedProductions));
      window.localStorage.setItem('erp.mfg.qc', JSON.stringify(seedQc));
      window.localStorage.setItem('erp.mfg.waste', JSON.stringify([]));
      window.localStorage.setItem('erp.extra.gr_fg', JSON.stringify(seedGrFgRows));
      window.localStorage.setItem('erp.extra.inv_transfer', JSON.stringify(seedFgTransfers));
      window.localStorage.setItem('erp.extra.delivery_orders', JSON.stringify(seedDoRows));
      window.localStorage.setItem('erp.extra.sales', JSON.stringify(seedSalesRows));
      window.localStorage.setItem('erp.extra.pos_closing', JSON.stringify(seedClosingRows));
      window.localStorage.setItem('erp.extra.finance_cash', JSON.stringify(seedFinanceCash));
      window.localStorage.setItem('erp.extra.finance_journal', JSON.stringify(seedFinanceJournal));
      window.localStorage.setItem('erp.transfer.status_overrides', JSON.stringify({ 'TRF-202603-001':'Received' }));
      window.localStorage.setItem('erp.transfer.receive_meta', JSON.stringify({
        'TRF-202603-001': { result:'Sesuai', note:'Transfer 10 pcs Only The Brave diterima di GFG-CBB', expected_qty:10, received_qty:10 }
      }));
      window.localStorage.setItem('erp.do.status_overrides', JSON.stringify({ 'DO-202603-001':'Received' }));
      window.localStorage.setItem('erp.do.receive_meta', JSON.stringify({
        'DO-202603-001': { result:'Sesuai', note:'10 pcs Only The Brave diterima toko BSD, 5 pcs terjual di POS', expected_qty:10, received_qty:10 }
      }));
      window.localStorage.setItem('erp.scenario.version', SCENARIO_VERSION);
    }
  } catch (_err) {}
  const gudangs = DATA.gudangs || [];
  const tokos = DATA.tokos || [];
  const vendors = DATA.vendors || [];
  const fgItems = DATA.fg_items || [];
  const rmItems = DATA.rm_items || [];
  const resellers = DATA.resellers || [];

  const rmWarehouses = gudangs.filter(x => x.warehouse_group === 'RM');
  const fgWarehouses = gudangs.filter(x => x.warehouse_group === 'FG');
  const mainFg = fgWarehouses.find(x => /SBY/i.test(x.warehouse_code || '')) || fgWarehouses[0] || {};
  const branchFg = fgWarehouses.find(x => /CBB/i.test(x.warehouse_code || '')) || fgWarehouses[1] || mainFg;

  function pick(list, index, step){
    if(!list.length) return {};
    return list[(index * step) % list.length];
  }

  function readLocalRows(key){
    try {
      const raw = window.localStorage.getItem(`erp.extra.${key}`);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function mergeRows(base, key){
    return [...base, ...readLocalRows(key)];
  }

  const purchaseOrders = [];
  const receipts = [];
  const vendorReturns = [];
  const workOrders = [];
  const scenarioFg = code => fgItems.find(x => x.fg_code === code) || { fg_code:code, fg_name:code };
  const grFg = [];

  const pms = tokos.find(x => x.store_code === 'PMS') || {};
  const bsd = tokos.find(x => x.store_code === 'BSD') || {};
  const deliveryOrders = [];

  const stockAging = Array.from({length:14}, (_, i) => {
    const wh = pick(fgWarehouses, i, 1) || {};
    const fg = pick(fgItems, i, 5);
    const aging = 8 + (i * 3);
    return {
      warehouse:wh.warehouse_name || '-',
      warehouse_code:wh.warehouse_code || '',
      item_code:fg.fg_code || '',
      item_name:fg.fg_name || '',
      category:fg.fg_category || '',
      qty:18 + (i * 4),
      aging,
      status:aging > 35 ? 'Aging' : 'Healthy'
    };
  });

  const sales = [];

  const mergedPurchaseOrders = mergeRows(purchaseOrders, 'purchase_orders');
  const mergedReceipts = mergeRows(receipts, 'receipts');
  const mergedVendorReturns = mergeRows(vendorReturns, 'vendor_returns');
  const mergedWorkOrders = mergeRows(workOrders, 'work_orders');
  const mergedGrFg = mergeRows(grFg, 'gr_fg');
  const mergedDeliveryOrders = mergeRows(deliveryOrders, 'delivery_orders');
  const mergedStockAging = mergeRows(stockAging, 'stock_aging');
  const mergedSales = mergeRows(sales, 'sales');

  const apRows = mergedReceipts.map((rcv, i) => {
    const paid = i % 3 === 0 ? rcv.amount : Math.floor(rcv.amount * 0.35);
    return {
      ap_no:`AP-202603-${String(i + 1).padStart(3,'0')}`,
      vendor_code:rcv.vendor_code,
      vendor_name:rcv.vendor_name,
      source_doc:rcv.receive_no,
      due_date:`2026-04-${String((i % 18) + 2).padStart(2,'0')}`,
      amount:rcv.amount,
      balance:rcv.amount - paid,
      status:rcv.amount === paid ? 'Closed' : paid > 0 ? 'Partial' : 'Open'
    };
  });

  const arRows = mergedSales.slice(0, 8).map((sale, i) => {
    const received = i % 2 === 0 ? Math.floor(sale.net_sales * 0.5) : 0;
    return {
      ar_no:`AR-202603-${String(i + 1).padStart(3,'0')}`,
      partner_name:sale.store_name,
      source_doc:sale.sales_no,
      due_date:`2026-04-${String((i % 18) + 4).padStart(2,'0')}`,
      amount:sale.net_sales,
      balance:sale.net_sales - received,
      status:received > 0 ? 'Partial' : 'Open'
    };
  });

  const cashRows = [
    ...apRows.slice(0,6).map((ap, i) => ({
      cash_no:`CB-202603-${String(i + 1).padStart(3,'0')}`,
      cash_date:`2026-03-${String((i % 18) + 6).padStart(2,'0')}`,
      type:'Payment',
      source:'AP',
      reference:ap.ap_no,
      amount:ap.amount - ap.balance,
      status:'Posted'
    })),
    ...arRows.slice(0,6).map((ar, i) => ({
      cash_no:`CB-202603-${String(i + 7).padStart(3,'0')}`,
      cash_date:`2026-03-${String((i % 18) + 8).padStart(2,'0')}`,
      type:'Receipt',
      source:'AR',
      reference:ar.ar_no,
      amount:ar.amount - ar.balance,
      status:'Posted'
    }))
  ];

  const journalRows = [
    ...apRows.slice(0,5).map((ap, i) => ({
      journal_no:`JV-202603-${String(i + 1).padStart(3,'0')}`,
      journal_date:`2026-03-${String((i % 18) + 5).padStart(2,'0')}`,
      source:ap.ap_no,
      desc:'Penerimaan RM / pembentukan hutang vendor',
      debit:ap.amount,
      credit:ap.amount,
      status:'Posted'
    })),
    ...arRows.slice(0,5).map((ar, i) => ({
      journal_no:`JV-202603-${String(i + 6).padStart(3,'0')}`,
      journal_date:`2026-03-${String((i % 18) + 9).padStart(2,'0')}`,
      source:ar.ar_no,
      desc:'Penjualan toko / pembentukan piutang',
      debit:ar.amount,
      credit:ar.amount,
      status:'Posted'
    }))
  ];

  const runtime = {
    read(key){
      return readLocalRows(key);
    },
    append(key, row){
      const rows = readLocalRows(key);
      rows.push(row);
      window.localStorage.setItem(`erp.extra.${key}`, JSON.stringify(rows));
      return row;
    },
    clear(key){
      window.localStorage.removeItem(`erp.extra.${key}`);
    },
    clearAll(){
      ['purchase_orders','receipts','vendor_returns','work_orders','gr_fg','delivery_orders','stock_aging','sales','inv_transfer','inv_return','pos_return','pos_closing'].forEach(key => {
        window.localStorage.removeItem(`erp.extra.${key}`);
      });
      ['erp.do.status_overrides','erp.do.receive_meta','erp.transfer.status_overrides','erp.transfer.receive_meta','erp.return.status_overrides','erp.return.receive_meta','erp.mfg.schedules','erp.mfg.work_orders','erp.mfg.productions','erp.mfg.qc','erp.mfg.waste','erp.mfg.rm_transfer','erp.extra.finance_cash','erp.extra.finance_journal','erp.extra.finance_ar','erp.extra.finance_ap_settlements','erp.extra.finance_ar_settlements'].forEach(key => {
        window.localStorage.removeItem(key);
      });
    },
    summary(){
      return {
        purchase_orders: readLocalRows('purchase_orders').length,
        receipts: readLocalRows('receipts').length,
        vendor_returns: readLocalRows('vendor_returns').length,
        gr_fg: readLocalRows('gr_fg').length,
        delivery_orders: readLocalRows('delivery_orders').length,
        sales: readLocalRows('sales').length
      };
    }
  };

  window.TRANSACTION_DATA = {
    purchase_orders: mergedPurchaseOrders,
    receipts: mergedReceipts,
    vendor_returns: mergedVendorReturns,
    work_orders: mergedWorkOrders,
    gr_fg: mergedGrFg,
    delivery_orders: mergedDeliveryOrders,
    stock_aging: mergedStockAging,
    sales: mergedSales,
    ap_rows: apRows,
    ar_rows: arRows,
    cash_rows: cashRows,
    journal_rows: journalRows,
    context: {
      rm_warehouses: rmWarehouses,
      fg_warehouses: fgWarehouses,
      main_fg: mainFg,
      branch_fg: branchFg
    }
  };
  window.ERP_RUNTIME = runtime;
})();
