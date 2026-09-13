// SALES PAGE LOGIC — FINAL STABLE VERSION

// SAFETY: normalize sale object
function normalizeSale(sale) {
  return {
    id: sale.id || crypto.randomUUID(),
    name: sale.name || "",
    price: Number(sale.price || sale.sellPrice || 0),
    payment: sale.payment || "Unknown",
    cost: Number(sale.cost || 0),
    profit: Number(sale.profit || (sale.price - sale.cost) || 0),
    image: sale.image || "",
    date: sale.date || new Date().toISOString()
  };
}

// RENDER SALES PAGE
function renderSalesInventory() {
  loadData();

  const list = document.getElementById("salesInventoryList");
  if (!list) return;

  list.innerHTML = "";

  if (!Array.isArray(salesData)) salesData = [];

  if (salesData.length === 0) {
    list.innerHTML = "<p>No sales recorded yet.</p>";
    return;
  }

  salesData = salesData.map(normalizeSale);

  salesData.forEach((sale, index) => {
    const div = document.createElement("div");
    div.className = "item-card";

    div.innerHTML = `
      <div class="item-header">
        <h3>${sale.name}</h3>
        <span class="item-meta">${new Date(sale.date).toLocaleString()}</span>
      </div>

      <img src="${sale.image}" alt="${sale.name}"
           style="width:120px; border:1px solid #333; margin:10px 0;">

      <div class="item-meta">
        Sale Price: £${sale.price.toFixed(2)}<br>
        Cost: £${sale.cost.toFixed(2)}<br>
        Profit: <span style="color:${sale.profit >= 0 ? 'lime' : 'red'};">
          £${sale.profit.toFixed(2)}
        </span><br>
        Payment Method: ${sale.payment}
      </div>

      <div style="margin-top:10px;">
        <button class="sell-button" style="background:#ffa500;"
                onclick="editSale(${index})">Edit</button>

        <button class="sell-button" style="background:#888;"
                onclick="copySale(${index})">Copy</button>

        <button class="sell-button" style="background:red; color:white;"
                onclick="deleteSale(${index})">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });
}

// ADD SALE FROM INVENTORY SELL BUTTON
function addSaleFromInventory(item) {
  const sale = normalizeSale({
    name: item.name,
    price: item.sellPrice,
    cost: item.buyPrice,
    profit: item.sellPrice - item.buyPrice,
    image: item.image,
    payment: "Unknown",
    date: new Date().toISOString()
  });

  salesData.push(sale);
  saveData();
  renderSalesInventory();
  renderTaxSummary();
}

// DELETE SALE
function deleteSale(index) {
  salesData.splice(index, 1);
  saveData();
  renderSalesInventory();
  renderTaxSummary();
}

// COPY SALE
function copySale(index) {
  const sale = normalizeSale(salesData[index]);

  const copy = normalizeSale({
    ...sale,
    id: crypto.randomUUID(),
    name: sale.name + " (copy)"
  });

  salesData.push(copy);
  saveData();
  renderSalesInventory();
  renderTaxSummary();
}

// EDIT SALE
function editSale(index) {
  const sale = normalizeSale(salesData[index]);

  const newPrice = prompt("New sale price (£):", sale.price);
  const newCost = prompt("New cost (£):", sale.cost);
  const newPayment = prompt("Payment method:", sale.payment);

  sale.price = Number(newPrice || sale.price);
  sale.cost = Number(newCost || sale.cost);
  sale.payment = newPayment || sale.payment;
  sale.profit = sale.price - sale.cost;

  salesData[index] = sale;

  saveData();
  renderSalesInventory();
  renderTaxSummary();
}
