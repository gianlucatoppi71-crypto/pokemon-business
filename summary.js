function renderSummary() {
  loadData();

  const statsDiv = document.getElementById('summaryStats');
  if (!statsDiv) return;

  if (!Array.isArray(salesData)) salesData = [];

  const normalizedSales = salesData.map(s => ({
    price: Number(s.price || s.sellPrice || 0),
    cost: Number(s.cost || 0),
    profit: Number(s.profit || (Number(s.price || 0) - Number(s.cost || 0)) || 0),
    name: s.name || 'Unknown',
    date: s.date || new Date().toISOString()
  }));

  const totalRevenue = normalizedSales.reduce((sum, s) => sum + s.price, 0);
  const totalCost = normalizedSales.reduce((sum, s) => sum + s.cost, 0);
  const totalProfit = normalizedSales.reduce((sum, s) => sum + s.profit, 0);

  statsDiv.innerHTML = `
    <p><strong>Total revenue:</strong> £${totalRevenue.toFixed(2)}</p>
    <p><strong>Total cost:</strong> £${totalCost.toFixed(2)}</p>
    <p><strong>Total profit:</strong> £${totalProfit.toFixed(2)}</p>
  `;

  // You can wire charts here later if you want.
}
