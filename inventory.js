// =========================
// INVENTORY SYSTEM (FULL, FIXED)
// =========================

let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Save inventory
function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Render inventory list
function renderInventory() {
    const container = document.getElementById('inventoryList');
    if (!container) return;

    container.innerHTML = '';

    inventory.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'inventory-card';

        card.innerHTML = `
            <h3>${item.name}</h3>
            <p><strong>Category:</strong> ${item.category || '—'}</p>
            <p><strong>Supplier:</strong> ${item.supplier || '—'}</p>
            <p><strong>Buy price per BOX:</strong> £${(item.buyPriceBox || 0).toFixed(2)}</p>
            <p><strong>Sell price per BOX:</strong> £${(item.sellPriceBox || 0).toFixed(2)}</p>
            <p><strong>Sell price per PACK:</strong> £${(item.sellPricePack || 0).toFixed(2)}</p>
            <p><strong>Packs per box:</strong> ${item.packsPerBox || 0}</p>
            <p><strong>Quantity of BOXES:</strong> ${item.quantityBoxes || 0}</p>
            <p><strong>Loose packs:</strong> ${item.loosePacks || 0}</p>
            <p><strong>Total packs:</strong> ${item.totalPacks || 0}</p>
            <p><strong>Market price (UK):</strong> £${(item.marketPrice || 0).toFixed(2)}</p>
            <p><strong>Notes:</strong> ${item.notes || '—'}</p>

            <button onclick="sellBox(${index})">Sell BOX</button>
            <button onclick="sellPack(${index})">Sell PACK</button>
            <button onclick="editItem(${index})">Edit</button>
            <button onclick="copyItem(${index})">Copy</button>
            <button onclick="addQty(${index})">Add Qty</button>
            <button onclick="deleteItem(${index})">Delete</button>
        `;

        container.appendChild(card);
    });
}

// Add new inventory item
// Works both with form onsubmit="addInventoryItem(event)"
// and with button onclick="addInventoryItem()"
function addInventoryItem(event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }

    const getNumber = (id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const v = parseFloat(el.value);
        return isNaN(v) ? 0 : v;
    };

    const getInt = (id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const v = parseInt(el.value);
        return isNaN(v) ? 0 : v;
    };

    const getText = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    };

    const name = getText('productName');
    if (!name) {
        alert('Product name is required.');
        return;
    }

    const category = getText('productCategory');
    const supplier = getText('productSupplier');

    const buyPriceBox = getNumber('buyPriceBox');
    const sellPriceBox = getNumber('sellPriceBox');
    let sellPricePack = getNumber('sellPricePack');
    const packsPerBox = getInt('packsPerBox');
    const quantityBoxes = getInt('quantityBoxes');
    const loosePacks = getInt('loosePacks');
    const marketPrice = getNumber('marketPrice');
    const notes = getText('notes');

    // Auto-calc pack price if not provided but we have box price + packs per box
    if (!sellPricePack && sellPriceBox && packsPerBox) {
        sellPricePack = sellPriceBox / packsPerBox;
    }

    const totalPacks = (quantityBoxes * packsPerBox) + loosePacks;

    const item = {
        name,
        category,
        supplier,
        buyPriceBox,
        sellPriceBox,
        sellPricePack,
        packsPerBox,
        quantityBoxes,
        loosePacks,
        totalPacks,
        marketPrice,
        notes
    };

    inventory.push(item);
    saveInventory();
    renderInventory();

    // Clear form if fields exist
    ['productName','productCategory','productSupplier','buyPriceBox','sellPriceBox',
     'sellPricePack','packsPerBox','quantityBoxes','loosePacks','marketPrice','notes']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
}

// Sell BOX
function sellBox(index) {
    const item = inventory[index];
    if (!item) return;

    if ((item.quantityBoxes || 0) > 0) {
        item.quantityBoxes -= 1;
        item.totalPacks = (item.quantityBoxes * (item.packsPerBox || 0)) + (item.loosePacks || 0);
        saveInventory();
        renderInventory();
    }
}

// Sell PACK
function sellPack(index) {
    const item = inventory[index];
    if (!item) return;

    if ((item.totalPacks || 0) > 0) {
        if ((item.loosePacks || 0) > 0) {
            item.loosePacks -= 1;
        } else if ((item.quantityBoxes || 0) > 0 && (item.packsPerBox || 0) > 0) {
            // Take one pack from a box
            item.loosePacks = (item.packsPerBox || 0) - 1;
            item.quantityBoxes -= 1;
        }

        item.totalPacks = (item.quantityBoxes * (item.packsPerBox || 0)) + (item.loosePacks || 0);
        saveInventory();
        renderInventory();
    }
}

// Edit item
function editItem(index) {
    const item = inventory[index];
    if (!item) return;

    const setValue = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.value = value;
    };

    setValue('productName', item.name);
    setValue('productCategory', item.category);
    setValue('productSupplier', item.supplier);
    setValue('buyPriceBox', item.buyPriceBox);
    setValue('sellPriceBox', item.sellPriceBox);
    setValue('sellPricePack', item.sellPricePack);
    setValue('packsPerBox', item.packsPerBox);
    setValue('quantityBoxes', item.quantityBoxes);
    setValue('loosePacks', item.loosePacks);
    setValue('marketPrice', item.marketPrice);
    setValue('notes', item.notes);

    // Remove old item; user will re-save
    inventory.splice(index, 1);
    saveInventory();
    renderInventory();
}

// Copy item
function copyItem(index) {
    const item = inventory[index];
    if (!item) return;

    inventory.push({ ...item });
    saveInventory();
    renderInventory();
}

// Add quantity
function addQty(index) {
    const item = inventory[index];
    if (!item) return;

    item.quantityBoxes = (item.quantityBoxes || 0) + 1;
    item.totalPacks = (item.quantityBoxes * (item.packsPerBox || 0)) + (item.loosePacks || 0);
    saveInventory();
    renderInventory();
}

// Delete item
function deleteItem(index) {
    inventory.splice(index, 1);
    saveInventory();
    renderInventory();
}

// Initial render
renderInventory();
