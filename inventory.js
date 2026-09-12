/* ========== INVENTORY PAGE (WITH EDIT + DELETE + COPY + CATEGORY DROPDOWN) ========== */

function loadInventory() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <h1>Inventory</h1>

        <div class="card">
            <h2>Add Product</h2>

            <label>Name</label>
            <input id="inv-name" type="text">

            <label>Category</label>
            <select id="inv-category">
                <option value="">Select category...</option>

                <!-- Main Pokémon Product Types -->
                <option value="Booster Box">Booster Box</option>
                <option value="Booster Pack">Booster Pack</option>
                <option value="Elite Trainer Box">Elite Trainer Box</option>
                <option value="Blister">Blister</option>
                <option value="Single Card">Single Card</option>
                <option value="Promo">Promo</option>
                <option value="Tin">Tin</option>
                <option value="Collection Box">Collection Box</option>
                <option value="Deck">Deck</option>
                <option value="Bundle">Bundle</option>
                <option value="Mystery Box">Mystery Box</option>

                <!-- Japanese Products -->
                <option value="Japanese Box">Japanese Box</option>
                <option value="Japanese Pack">Japanese Pack</option>

                <!-- Accessories -->
                <option value="Sleeves">Sleeves</option>
                <option value="Binder">Binder</option>
                <option value="Toploaders">Toploaders</option>
                <option value="Accessory">Accessory (General)</option>

                <!-- Misc -->
                <option value="Other">Other</option>
            </select>

            <label>Cost Price (£)</label>
            <input id="inv-cost" type="number" step="0.01">

            <label>Quantity</label>
            <input id="inv-qty" type="number">

            <button class="action-btn" onclick="addInventoryItem()">Add Item</button>
        </div>

        <h2>Inventory List</h2>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Cost (£)</th>
                    <th>Qty</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="inventory-table"></tbody>
        </table>
    `;

    renderInventoryTable();
}

/* ========== ADD ITEM ========== */

function addInventoryItem() {
    const name = document.getElementById("inv-name").value.trim();
    const category = document.getElementById("inv-category").value.trim();
    const cost = parseFloat(document.getElementById("inv-cost").value);
    const qty = parseInt(document.getElementById("inv-qty").value);

    if (!name || !category || isNaN(cost) || isNaN(qty)) {
        alert("Please fill all fields correctly.");
        return;
    }

    pokemonBusinessData.inventory.push({
        name,
        category,
        cost,
        qty
    });

    saveDataToStorage();
    loadInventory();
}

/* ========== RENDER TABLE ========== */

function renderInventoryTable() {
    const table = document.getElementById("inventory-table");
    table.innerHTML = "";

    pokemonBusinessData.inventory.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>£${item.cost.toFixed(2)}</td>
            <td>${item.qty}</td>
            <td>
                <button class="action-btn" onclick="editInventoryItem(${index})">Edit</button>
                <button class="action-btn" onclick="copyInventoryItem(${index})">Copy</button>
                <button class="action-btn" onclick="deleteInventoryItem(${index})">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

/* ========== DELETE ITEM ========== */

function deleteInventoryItem(index) {
    pokemonBusinessData.inventory.splice(index, 1);
    saveDataToStorage();
    loadInventory();
}

/* ========== COPY ITEM ========== */

function copyInventoryItem(index) {
    const original = pokemonBusinessData.inventory[index];
    const copy = { ...original };
    copy.name = original.name + " (Copy)";
    pokemonBusinessData.inventory.push(copy);

    saveDataToStorage();
    loadInventory();
}

/* ========== EDIT ITEM ========== */

function editInventoryItem(index) {
    const item = pokemonBusinessData.inventory[index];

    const newName = prompt("New name:", item.name);
    if (newName === null) return;

    const newCategory = prompt("New category:", item.category);
    if (newCategory === null) return;

    const newCost = parseFloat(prompt("New cost (£):", item.cost));
    if (isNaN(newCost)) return;

    const newQty = parseInt(prompt("New quantity:", item.qty));
    if (isNaN(newQty)) return;

    pokemonBusinessData.inventory[index] = {
        name: newName.trim(),
        category: newCategory.trim(),
        cost: newCost,
        qty: newQty
    };

    saveDataToStorage();
    loadInventory();
}
