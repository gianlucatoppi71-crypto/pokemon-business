function sellItem(index) {
  const item = normalizeItem(inventoryData[index]);
  if (item.quantity <= 0) return;

  // Calculate profit
  const profitPerUnit = item.sellPrice - item.buyPrice;

  // Create sale entry compatible with advanced summary
  const sale = {
    id: crypto.randomUUID(),
    name: item.name,
    price: item.sellPrice,
    cost: item.buyPrice,
    profit: profitPerUnit,
    image: item.image,
    payment: "Unknown",
    date: new Date().toISOString()
  };

  // Save sale
  salesData.push(sale);

  // Reduce inventory
  item.quantity -= 1;

  if (item.quantity <= 0) {
    inventoryData.splice(index, 1);
  } else {
    inventoryData[index] = item;
  }

  saveData();

  renderInventory();
  renderSalesInventory();
  renderTaxSummary();
}
