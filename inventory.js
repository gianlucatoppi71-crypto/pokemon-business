// =========================
// INVENTORY SYSTEM (FULL)
// =========================

let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Save inventory
function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Render inventory list
function renderInventory() {
    const container = document.getElementById('inventoryList');
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
            <p><strong>Market price (UK):</strong> £${item.marketPrice}</p>
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
function addInventoryItem() {
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const supplier = document.getElementById('productSupplier').value;
    const buyPriceBox = parseFloat(document.getElementById('buyPriceBox').value);
    const sellPriceBox = parseFloat(document.getElementById('sellPriceBox').value);
    const sellPricePack = parseFloat(document.getElementById('sellPricePack').value);
    const packsPerBox = parseInt(document.getElementById('packsPerBox').value);
    const quantityBoxes = parseInt(document.getElementById('quantityBoxes').value);
    const loosePacks = parseInt(document.getElementById('loosePacks').value);
    const marketPrice = parseFloat(document.getElementById('marketPrice').value);
    const notes = document.getElementById('notes').value;

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
}

// Sell BOX
function sellBox(index) {
    const item = inventory[index];

    if (item.quantityBoxes > 0) {
        item.quantityBoxes -= 1;
        item.totalPacks -= item.packsPerBox;
        saveInventory();
        renderInventory();
    }
}

// Sell PACK
function sellPack(index) {
    const item = inventory[index];

    if (item.totalPacks > 0) {
        item.totalPacks -= 1;

        if (item.loosePacks > 0) {
            item.loosePacks -= 1;
        } else {
            // Reduce box count when packs come from boxes
            item.loosePacks = 0;
        }

        saveInventory();
        renderInventory();
    }
}

// Edit item
function editItem(index) {
    const item = inventory[index];

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

    // Remove old item
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
    item.totalPacks += item.packsPerBox;
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
