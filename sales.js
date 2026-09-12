/* ========== SALES PAGE ========== */

function loadSales() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <h1>Sales</h1>

        <div class="card">
            <h2>Add Sale</h2>

            <label>Date</label>
            <input id="sale-date" type="date">

            <label>Item Name</label>
            <input id="sale-item" type="text">

            <label>Sale Price (£)</label>
            <input id="sale-price" type="number" step="0.01">

            <label>Cost (£)</label>
            <input id="sale-cost" type="number" step="0.01">

            <label>Payment Method</label>
            <select id="sale-payment">
                <option value="eBay">eBay</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
            </select>

            <button class="action-btn" onclick="addSale()">Add Sale</button>
        </div>

        <h2>Sales History</h2>

        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Sale (£)</th>
                    <th>Cost (£)</th>
                    <th>Profit (£)</th>
                    <th>Payment</th>
                </tr>
            </thead>
            <tbody id="sales-table"></tbody>
        </table>
    `;

    renderSalesTable();
}

/* ========== ADD SALE ========== */

function addSale() {
    const date = document.getElementById("sale-date").value;
    const item = document.getElementById("sale-item").value.trim();
    const price = parseFloat(document.getElementById("sale-price").value);
    const cost = parseFloat(document.getElementById("sale-cost").value);
    const payment = document.getElementById("sale-payment").value;

    if (!date || !item || isNaN(price) || isNaN(cost)) {
        alert("Please fill all fields correctly.");
        return;
    }

    const profit = price - cost;

    pokemonBusinessData.sales.push({
        date,
        item,
        price,
        cost,
        profit,
        payment
    });

    saveDataToStorage();
    loadSales();
}

/* ========== RENDER SALES TABLE ========== */

function renderSalesTable() {
    const table = document.getElementById("sales-table");
    table.innerHTML = "";

    pokemonBusinessData.sales.forEach(sale => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.item}</td>
            <td>£${sale.price.toFixed(2)}</td>
            <td>£${sale.cost.toFixed(2)}</td>
            <td>£${sale.profit.toFixed(2)}</td>
            <td>${sale.payment}</td>
        `;

        table.appendChild(row);
    });
}
