/* ========== SINGLES PAGE ========== */

function loadSingles() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <h1>Singles Calculator</h1>

        <div class="card">
            <h2>Add Single Card</h2>

            <label>Card Name</label>
            <input id="single-name" type="text">

            <label>Buy Price (£)</label>
            <input id="single-buy" type="number" step="0.01">

            <label>Sell Price (£)</label>
            <input id="single-sell" type="number" step="0.01">

            <button class="action-btn" onclick="addSingle()">Add Single</button>
        </div>

        <h2>Singles List</h2>

        <table>
            <thead>
                <tr>
                    <th>Card</th>
                    <th>Buy (£)</th>
                    <th>Sell (£)</th>
                    <th>Profit (£)</th>
                </tr>
            </thead>
            <tbody id="singles-table"></tbody>
        </table>
    `;

    renderSinglesTable();
}

/* ========== ADD SINGLE ========== */

function addSingle() {
    const name = document.getElementById("single-name").value.trim();
    const buy = parseFloat(document.getElementById("single-buy").value);
    const sell = parseFloat(document.getElementById("single-sell").value);

    if (!name || isNaN(buy) || isNaN(sell)) {
        alert("Please fill all fields correctly.");
        return;
    }

    const profit = sell - buy;

    pokemonBusinessData.singles.push({
        name,
        buy,
        sell,
        profit
    });

    saveDataToStorage();
    loadSingles();
}

/* ========== RENDER TABLE ========== */

function renderSinglesTable() {
    const table = document.getElementById("singles-table");
    table.innerHTML = "";

    pokemonBusinessData.singles.forEach(card => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${card.name}</td>
            <td>£${card.buy.toFixed(2)}</td>
            <td>£${card.sell.toFixed(2)}</td>
            <td>£${card.profit.toFixed(2)}</td>
        `;

        table.appendChild(row);
    });
}
