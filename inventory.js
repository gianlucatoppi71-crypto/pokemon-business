function sellItem(index) {
  loadData();

  const item = normalizeItem(inventoryData[index]);
  if (!item || item.quantity <= 0) return;

  // Calculate profit
  const buy = Number(item.buyPrice || 0);
  const sell = Number(item.sellPrice || 0);
  const profitPerUnit = sell - buy;

  // Create sale entry (FULL structure your app expects)
  const sale = {
    id: crypto.randomUUID(),
    name: item.name,
    price: sell,          // REQUIRED by summary.js
    cost: buy,            // REQUIRED by summary.js
    profit: profitPerUnit,
    image: item.image,
    payment: "Unknown",   // REQUIRED by sales.js
    date: new Date().toISOString()
  };

  // Save sale
  salesData.push(sale);

  // Reduce inventory quantity
  item.quantity -= 1;

  if (item.quantity <= 0) {
    inventoryData.splice(index, 1);
  } else {
    inventoryData[index] = item;
  }

  saveData();

  // Refresh UI
  renderInventory();
  renderSalesInventory();
  renderSummary();
  renderTaxSummary();
}

