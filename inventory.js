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
function addInventoryItem(event) {
    event.preventDefault(); // STOP FORM RELOAD

    const name = document.getElementById('productName').value.trim();
    if (!name) return;

    const category = document.getElementById('productCategory').value.trim();
    const supplier = document.getElementById('productSupplier').value.trim();

    const buyPriceBox = parseFloat(document.getElementById('buyPriceBox').value) || 0;
    const sellPriceBox = parseFloat(document.getElementById('sellPriceBox').value) || 0;
    let sellPricePack = parseFloat(document.getElementById('sellPricePack').value) || 0;

    const packsPerBox = parseInt(document.getElementById('packsPerBox').value) || 0;
    const quantityBoxes = parseInt(document.getElementById('quantityBoxes').value) || 0;
    const loosePacks = parseInt(document.getElementById('loosePacks').value) || 0;

    const marketPrice = parseFloat(document.getElementById('marketPrice').value) || 0;
    const notes = document.getElementById('notes').value.trim();

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

    document.getElementById('productName').value = item.name;
    document.getElementById('productCategory').value = item.category;
    document.getElementById('productSupplier').value = item.supplier;
    document.getElementById('buyPriceBox').value = item.buyPriceBox;
    document.getElementById('sellPriceBox').value = item.sellPriceBox;
    document.getElementById('sellPricePack').value = item.sellPricePack;
    document.getElementById('packsPerBox').value = item.packsPerBox;
    document.getElementById('quantityBoxes').value = item.quantityBoxes;
    document.getElementById('loosePacks').value = item.loosePacks;
    document.getElementById('marketPrice').value = item.marketPrice;
    document.getElementById('notes').value = item.notes;

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
