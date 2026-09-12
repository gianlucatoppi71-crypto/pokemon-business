/* ========== SUMMARY PAGE ========== */

function loadSummary() {
    const content = document.getElementById("content");

    // Calculate totals
    const totalInventoryValue = pokemonBusinessData.inventory.reduce(
        (sum, item) => sum + item.cost * item.qty,
        0
    );

    const totalSales = pokemonBusinessData.sales.reduce(
        (sum, sale) => sum + sale.price,
        0
    );

    const totalSalesProfit = pokemonBusinessData.sales.reduce(
        (sum, sale) => sum + sale.profit,
        0
    );

    const totalSinglesProfit = pokemonBusinessData.singles.reduce(
        (sum, card) => sum + card.profit,
        0
    );

    const totalTradesBalance = pokemonBusinessData.trades.reduce(
        (sum, trade) => sum + trade.balance,
        0
    );

    content.innerHTML = `
        <h1>Business Summary</h1>

        <div class="summary-box">
            <div class="summary-title">Inventory Value</div>
            <div class="summary-value">£${totalInventoryValue.toFixed(2)}</div>
        </div>

        <div class="summary-box">
            <div class="summary-title">Total Sales</div>
            <div class="summary-value">£${totalSales.toFixed(2)}</div>
        </div>

        <div class="summary-box">
            <div class="summary-title">Sales Profit</div>
            <div class="summary-value">£${totalSalesProfit.toFixed(2)}</div>
        </div>

        <div class="summary-box">
            <div class="summary-title">Singles Profit</div>
            <div class="summary-value">£${totalSinglesProfit.toFixed(2)}</div>
        </div>

        <div class="summary-box">
            <div class="summary-title">Trades Balance</div>
            <div class="summary-value">£${totalTradesBalance.toFixed(2)}</div>
        </div>
    `;
}
