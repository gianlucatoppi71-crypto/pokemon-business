// ==========================================
// FLUX TCG INVENTORY GLOBAL ENGINE
// ==========================================

// Global Storage Handlers
if (typeof window.inventoryData === 'undefined') {
  window.inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];
}
if (typeof window.suppliersData === 'undefined') {
  window.suppliersData = JSON.parse(localStorage.getItem('suppliersData')) || [];
}

// Global Core Sync Utility
function saveInventoryState() {
  localStorage.setItem('inventoryData', JSON.stringify(window.inventoryData));
}

// Initial Sync Operations on Load
window.addEventListener('DOMContentLoaded', () => {
  const typeSelect = document.getElementById('invType');
  const boxFields = document.getElementById('boxFields');
  const packFields = document.getElementById('packFields');

  if (typeSelect && boxFields && packFields) {
    typeSelect.addEventListener('change', () => {
      if (typeSelect.value === 'BOX') {
        boxFields.style.display = 'block';
        packFields.style.display = 'none';
      } else if (typeSelect.value === 'PACK') {
        boxFields.style.display = 'none';
        packFields.style.display = 'block';
      } else {
        boxFields.style.display = 'none';
        packFields.style.display = 'none';
      }
    });
  }
});

// ==========================================
// CORE DATA INTAKE & ITEM REGISTRATION
// ==========================================
function addInventoryItem(event) {
  event.preventDefault();

  const type = document.getElementById('invType').value;
  const name = document.getElementById('invName').value;
  const category = document.getElementById('invCategory').value;
  const supplierSelect = document.getElementById('invSupplier');
  const supplier = supplierSelect ? (supplierSelect.value || 'None') : 'None';
  const marketPrice = parseFloat(document.getElementById('invMarketPrice').value) || 0;
  const image = document.getElementById('invImage').value || 'Logo.png';
  const notes = document.getElementById('invNotes').value || '';

  // Universal Item Object Map Blueprint
  const newItem = {
    id: Date.now(),
    type: type,
    name: name,
    category: category,
    supplier: supplier,
    marketPrice: marketPrice,
    image: image,
    notes: notes,
    buyPriceBox: 0,
    packsPerBox: 1,
    sellPriceBox: 0,
    sellPricePack: 0,
    quantityBoxes: 0,
    manualPacks: 0,
    openedBoxes: 0,
    buyPricePack: 0,
    quantityPacks: 0
  };

  // Conditional parsing depending on chosen product profile type structure
  if (type === 'BOX') {
    newItem.buyPriceBox = parseFloat(document.getElementById('invBuyPriceBox')?.value) || 0;
    newItem.packsPerBox = parseInt(document.getElementById('invPacksPerBox')?.value) || 1;
    newItem.sellPriceBox = parseFloat(document.getElementById('invSellPriceBox')?.value) || 0;
    newItem.sellPricePack = parseFloat(document.getElementById('invSellPricePack')?.value) || 0;
    newItem.quantityBoxes = parseInt(document.getElementById('invQuantityBoxes')?.value) || 0;
    newItem.manualPacks = parseInt(document.getElementById('invManualPacks')?.value) || 0;
  } else if (type === 'PACK') {
    newItem.buyPricePack = parseFloat(document.getElementById('invBuyPricePack')?.value) || 0;
    newItem.sellPricePack = parseFloat(document.getElementById('invSellPricePack')?.value) || 0;
    newItem.quantityPacks = parseInt(document.getElementById('invQuantityPacks')?.value) || 0;
  }

  // Push straight to data stack array structure layers
  window.inventoryData.push(newItem);
  saveInventoryState();

  // Reset form layout cleanly back to stock configuration defaults
  const activeForm = document.getElementById('inventoryForm');
  if (activeForm) activeForm.reset();

  // Trigger view screen element sync renders
  renderInventory();
}

// Global action hook listener target mappings to bypass page layout layer fallbacks
window.addInventoryItemAction = addInventoryItem;

// ==========================================
// INVENTORY GRID RENDER MODULE
// ==========================================
function renderInventory() {
  // Pull background local data layer arrays
  if (typeof loadData === 'function') {
    loadData();
  } else if (localStorage.getItem('inventoryData')) {
    window.inventoryData = JSON.parse(localStorage.getItem('inventoryData')) || [];
  }

  const container = document.getElementById("inventoryList");
  if (!container) return;

  container.innerHTML = "";

  if (!window.inventoryData || window.inventoryData.length === 0) {
    container.innerHTML = "<p style='color:#bbb; padding:20px; font-family:sans-serif;'>No stock entries found. Add items above.</p>";
    return;
  }

  // Create standard spreadsheet table style
  let html = `
    <div style="overflow-x:auto; margin-top:20px; border:1px solid #333; border-radius:6px;">
      <table style="width:100%; border-collapse:collapse; background:#18181c; text-align:left; font-family:sans-serif; color:#fff;">
        <thead>
          <tr style="background:#242428; border-bottom:2px solid #333;">
            <th style="padding:12px; font-size:13px; color:#ffd700;">Image</th>
            <th style="padding:12px; font-size:13px; color:#ffd700;">Product Title</th>
            <th style="padding:12px; font-size:13px; color:#ffd700;">Type</th>
            <th style="padding:12px; font-size:13px; color:#ffd700;">Category</th>
            <th style="padding:12px; font-size:13px; color:#ffd700;">Supplier</th>
            <th style="padding:12px; font-size:13px; color:#ffd700;">Available Units</th>
            <th style="padding:12px; font-size:13px; color:#ffd700;">Market Price</th>
            <th style="padding:12px; font-size:13px; color:#ffd700;">Transaction Desk</th>
          </tr>
        </thead>
        <tbody>`;

  window.inventoryData.forEach(item => {
    let stockDisplay = "";
    if (item.type === 'BOX') {
      const bQty = item.quantityBoxes || 0;
      const pQty = item.manualPacks || 0;
      stockDisplay = `${bQty} Boxes` + (pQty > 0 ? ` / ${pQty} Loose` : '');
    } else {
      stockDisplay = `${item.quantityPacks || 0} Packs`;
    }

    const valueDisplay = parseFloat(item.marketPrice || 0).toFixed(2);
    const imgSrc = item.image && item.image.trim() !== "" ? item.image : "Logo.png";

    html += `
      <tr style="border-bottom:1px solid #2a2a30; font-size:14px; background:transparent;">
        <td style="padding:10px;">
          <img src="${imgSrc}" style="width:40px; height:40px; object-fit:contain; border-radius:4px; background:#222; border:1px solid #444;" onerror="this.src='Logo.png'">
        </td>
        <td style="padding:10px; font-weight:bold; color:#fff;">${item.name}</td>
        <td style="padding:10px; color:#aaa;">${item.type}</td>
        <td style="padding:10px; color:#aaa;">${item.category || '—'}</td>
        <td style="padding:10px; color:#aaa;">${item.supplier || '—'}</td>
        <td style="padding:10px; font-weight:bold; color:#00ff88;">${stockDisplay}</td>
        <td style="padding:10px; font-weight:bold; color:#ffd700;">£${valueDisplay}</td>
        <td style="padding:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <select id="saleType_${item.id}" style="background:#2a2a30; color:#fff; border:1px solid #444; border-radius:4px; padding:4px; font-size:12px;">
              <option value="business">Business</option>
              <option value="personal">Personal</option>
            </select>
            ${item.type === 'BOX' ? `
              <button onclick="if(typeof sellBox==='function') sellBox(\${item.id}); else alert('Sales system link offline')" style="background:#ffd700; color:#000; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:12px;">Sell Box</button>
            ` : ''}
            <button onclick="if(typeof sellPack==='function') sellPack(${item.id}); else alert('Sales system link offline')" style="background:#00ff88; color:#000; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:12px;">Sell Pack</button>
          </div>
        </td>
      </tr>`;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

// Global window registration map
window.renderInventory = renderInventory;
