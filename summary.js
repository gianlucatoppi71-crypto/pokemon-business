// SUMMARY PAGE LOGIC

function renderSummary() {
  loadData();

  const summaryContainer = document.getElementById('summaryPage');
  if (!summaryContainer) return;

  // TOTAL INVENTORY VALUE
  const inventoryValue = inventoryData.reduce((sum, item) => {
    return sum + (item.sellPrice * item.quantity);
  }, 0);

  // TOTAL SALES VALUE
  const salesValue = salesData.reduce((sum, sale) => {
    return sum + sale.sellPrice;
  }, 0);

  // TOTAL PROFIT (inventory + sales)
  const totalProfit = calculateTotalProfit();

  // TAX ESTIMATE
  const tax = estimateUkTax(totalProfit);

  // ITEMS COUNT
  const inventoryCount = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
  const salesCount = salesData.length;

  // AVERAGE PROFIT PER SALE
  const avgProfit = salesCount > 0
    ? salesData.reduce((sum, sale) => sum + sale.profit, 0) / salesCount
    : 0;

  // HIGHEST PROFIT ITEM
  let highestProfitItem = null;
  if (salesData.length > 0) {
    highestProfitItem = salesData.reduce((best, sale) => {
      return sale.profit > best.profit ? sale : best;
    });
  }

  // LOWEST PROFIT ITEM
  let lowestProfitItem = null;
  if (salesData.length > 0) {
    lowestProfitItem = salesData.reduce((worst, sale) => {
      return sale.profit < worst.profit ? sale : worst;
    });
  }

  // RENDER SUMMARY
  summaryContainer.innerHTML = `
    <h1>Business Summary</h1>

    <div class="item-card">
      <h3>Totals</h3>
      <div class="item-meta">
        Inventory value: £${inventoryValue.toFixed(2)}<br>
        Sales value: £${salesValue.toFixed(2)}<br>
        Total profit: £${totalProfit.toFixed(2)}<br>
        Estimated tax: £${tax.totalTax.toFixed(2)}<br>
        Net profit after tax: £${tax.netProfit.toFixed(2)}
      </div>
    </div>

    <div class="item-card">
      <h3>Counts</h3>
      <div class="item-meta">
        Items in inventory: ${inventoryCount}<br>
        Items sold: ${salesCount}<br>
        Average profit per sale: £${avgProfit.toFixed(2)}
      </div>
    </div>

    <div class="item-card">
      <h3>Best Sale</h3>
      ${
        highestProfitItem
          ? `
            <div class="item-meta">
              ${highestProfitItem.name}<br>
              Profit: £${highestProfitItem.profit.toFixed(2)}<br>
              Sold at: £${highestProfitItem.sellPrice.toFixed(2)}<br>
              Date: ${new Date(highestProfitItem.date).toLocaleString()}
            </div>
            <img src="${highestProfitItem.image}" style="width:120px; margin-top:10px;">
          `
          : `<div class="item-meta">No sales yet.</div>`
      }
    </div>

    <div class="item-card">
      <h3>Worst Sale</h3>
      ${
        lowestProfitItem
          ? `
            <div class="item-meta">
              ${lowestProfitItem.name}<br>
              Profit: £${lowestProfitItem.profit.toFixed(2)}<br>
              Sold at: £${lowestProfitItem.sellPrice.toFixed(2)}<br>
              Date: ${new Date(lowestProfitItem.date).toLocaleString()}
            </div>
            <img src="${lowestProfitItem.image}" style="width:120px; margin-top:10px;">
          `
          : `<div class="item-meta">No sales yet.</div>`
      }
    </div>
  `;
}
