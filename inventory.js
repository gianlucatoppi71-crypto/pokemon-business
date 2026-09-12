// ========== INVENTORY PAGE ==========

// Renders the inventory page
function loadInventory() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <h1>Inventory</h1>

        <div class="card">
            <h2>Add Product</h2>

            <label>Name</label>
            <input id="inv-name" type="text">

            <label>Category</label>
            <input id="inv-category" type="text">

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
                </tr>
            </thead>
            <tbody id="inventory-table"></tbody>
        </table>
    `;

    renderInventoryTable();
}

// Adds a new item to inventory
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

// Renders inventory table
function renderInventoryTable() {
    const table = document.getElementById("inventory-table");
    table.innerHTML = "";

    pokemonBusinessData.inventory.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>£${item.cost.toFixed(2)}</td>
            <td>${item.qty}</td>
        `;

        table.appendChild(row);
    });
}
