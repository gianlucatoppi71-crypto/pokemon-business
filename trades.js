/* ========== TRADES PAGE ========== */

function loadTrades() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <h1>Trades</h1>

        <div class="card">
            <h2>Add Trade</h2>

            <label>You Give (£)</label>
            <input id="trade-give" type="number" step="0.01">

            <label>You Receive (£)</label>
            <input id="trade-receive" type="number" step="0.01">

            <label>Notes</label>
            <input id="trade-notes" type="text">

            <button class="action-btn" onclick="addTrade()">Add Trade</button>
        </div>

        <h2>Trade History</h2>

        <table>
            <thead>
                <tr>
                    <th>You Give (£)</th>
                    <th>You Receive (£)</th>
                    <th>Balance (£)</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody id="trades-table"></tbody>
        </table>
    `;

    renderTradesTable();
}

/* ========== ADD TRADE ========== */

function addTrade() {
    const give = parseFloat(document.getElementById("trade-give").value);
    const receive = parseFloat(document.getElementById("trade-receive").value);
    const notes = document.getElementById("trade-notes").value.trim();

    if (isNaN(give) || isNaN(receive)) {
        alert("Please fill all fields correctly.");
        return;
    }

    const balance = receive - give;

    pokemonBusinessData.trades.push({
        give,
        receive,
        balance,
        notes
    });

    saveDataToStorage();
    loadTrades();
}

/* ========== RENDER TRADES TABLE ========== */

function renderTradesTable() {
    const table = document.getElementById("trades-table");
    table.innerHTML = "";

    pokemonBusinessData.trades.forEach(trade => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>£${trade.give.toFixed(2)}</td>
            <td>£${trade.receive.toFixed(2)}</td>
            <td>£${trade.balance.toFixed(2)}</td>
            <td>${trade.notes || ""}</td>
        `;

        table.appendChild(row);
    });
}
