// =========================
// INVENTORY SYSTEM (FULLY FIXED FOR YOUR HTML)
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
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Supplier:</strong> ${item.supplier}</p>
            <p><strong>Buy price per BOX:</strong> £${item.buyPriceBox.toFixed(2)}</p>
            <p><strong>Sell price per BOX:</strong> £${item.sellPriceBox.toFixed(2)}</p>
            <p><strong>Sell price per PACK:</strong> £${item.sellPricePack.toFixed(2)}</p>
            <p><strong>Packs per box:</strong> ${item.packsPerBox}</p>
            <p><strong>Quantity of BOXES:</strong> ${item.quantityBoxes}</p>
            <p><strong>Loose packs:</strong> ${item.loosePacks}</p>
            <p><strong>Total packs:</strong> ${item.totalPacks}</p>
            <p><strong>Market price (UK):</strong> £${item.marketPrice.toFixed(2)}</p>
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
function addInventoryItem(event) {
    event.preventDefault();

    const type = document.getElementById('invType').value;
    const name = document.getElementById('invName').value.trim();
    const category = document.getElementById('invCategory').value.trim();
    const supplier = document.getElementById('invSupplier').value.trim();

    let buyPriceBox = 0;
    let sellPriceBox = 0;
    let sellPricePack = 0;
    let packsPerBox = 0;
    let quantityBoxes = 0;
    let loosePacks = 0;

    if (type === "BOX") {
        buyPriceBox = parseFloat(document.getElementById('invBuyPriceBox').value) || 0;
        sellPriceBox = parseFloat(document.getElementById('invSellPriceBox').value) || 0;
        sellPricePack = parseFloat(document.getElementById('invSellPricePack').value) || 0;
        packsPerBox = parseInt(document.getElementById('invPacksPerBox').value) || 0;
        quantityBoxes = parseInt(document.getElementById('invQuantityBoxes').value) || 0;
        loosePacks = parseInt(document.getElementById('invManualPacks').value) || 0;

        if (!sellPricePack && sellPriceBox && packsPerBox) {
            sellPricePack = sellPriceBox / packsPerBox;
        }
    }

    if (type === "PACK") {
        sellPricePack = parseFloat(document.getElementById('invSellPricePack').value) || 0;
        loosePacks = parseInt(document.getElementById('invQuantityPacks').value) || 0;
    }

    const marketPrice = parseFloat(document.getElementById('invMarketPrice').value) || 0;
    const notes = document.getElementById('invNotes').value.trim();

    const totalPacks = (quantityBoxes * packsPerBox) + loosePacks;

    const item = {
        type,
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

    document.getElementById('inventoryForm').reset();
}

// Sell BOX
function sellBox(index) {
    const item = inventory[index];
    if (!item) return;

    if (item.quantityBoxes > 0) {
        item.quantityBoxes -= 1;
        item.totalPacks = (item.quantityBoxes * item.packsPerBox) + item.loosePacks;
        saveInventory();
        renderInventory();
    }
}

// Sell PACK
function sellPack(index) {
    const item = inventory[index];
    if (!item) return;

    if (item.totalPacks > 0) {
        if (item.loosePacks > 0) {
            item.loosePacks -= 1;
        } else if (item.quantityBoxes > 0) {
            item.quantityBoxes -= 1;
            item.loosePacks = item.packsPerBox - 1;
        }

        item.totalPacks = (item.quantityBoxes * item.packsPerBox) + item.loosePacks;
        saveInventory();
        renderInventory();
    }
}

// Edit item
function editItem(index) {
    const item = inventory[index];
    if (!item) return;

    document.getElementById('invType').value = item.type;
    document.getElementById('invName').value = item.name;
    document.getElementById('invCategory').value = item.category;
    document.getElementById('invSupplier').value = item.supplier;

    if (item.type === "BOX") {
        document.getElementById('invBuyPriceBox').value = item.buyPriceBox;
        document.getElementById('invSellPriceBox').value = item.sellPriceBox;
        document.getElementById('invSellPricePack').value = item.sellPricePack;
        document.getElementById('invPacksPerBox').value = item.packsPerBox;
        document.getElementById('invQuantityBoxes').value = item.quantityBoxes;
        document.getElementById('invManualPacks').value = item.loosePacks;
    }

    if (item.type === "PACK") {
        document.getElementById('invSellPricePack').value = item.sellPricePack;
        document.getElementById('invQuantityPacks').value = item.loosePacks;
    }

    document.getElementById('invMarketPrice').value = item.marketPrice;
    document.getElementById('invNotes').value = item.notes;

    inventory.splice(index, 1);
    saveInventory();
    renderInventory();
}

// Copy item
function copyItem(index) {
    const item = inventory[index];
    inventory.push({ ...item });
    saveInventory();
    renderInventory();
}

// Add quantity
function addQty(index) {
    const item = inventory[index];
    item.quantityBoxes += 1;
    item.totalPacks = (item.quantityBoxes * item.packsPerBox) + item.loosePacks;
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
