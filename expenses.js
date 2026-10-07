// ===============================
// EXPENSES SYSTEM (UPGRADED FOR BOX + PACK + TRADES)
// ===============================

// IMPORTANT:
// expensesData is already declared in data.js
// REMOVE the duplicate declaration here.

// We ONLY use expensesData — do NOT redeclare it.

function saveExpenses() {
  localStorage.setItem("expensesData", JSON.stringify(expensesData));
}

// ===============================
// ADD EXPENSE (MANUAL)
// ===============================

function addExpense(event) {
  event.preventDefault();

  const desc = document.getElementById("expDesc").value.trim();
  const amount = parseFloat(document.getElementById("expAmount").value);
  const date = document.getElementById("expDate").value;
  const category = document.getElementById("expCategory").value.trim();

  if (!desc || isNaN(amount) || !date) return;

  expensesData.push({
    id: Date.now(),
    description: desc,
    amount,
    date,
    category: category || "Other"
  });

  saveExpenses();
  renderExpenses();

  event.target.reset();
}

// ===============================
// AUTO‑EXPENSE FROM GIFT SYSTEM
// ===============================

function addGiftExpense(item, totalCost) {
  expensesData.push({
    id: Date.now(),
    description: `Gift: ${item.name}`,
    amount: totalCost,
    date: new Date().toISOString().split("T")[0],
    category: "Gift"
  });

  saveExpenses();
}

// ===============================
// OPTIONAL: AUTO‑EXPENSE FROM TRADES
// ===============================

function addTradeExpense(item, qty) {
  let cost = 0;

  if (item.type === "BOX") {
    cost = qty * item.buyPriceBox;
  } else {
    const buyPricePack = item.type === "BOX"
      ? item.buyPriceBox / item.packsPerBox
      : item.buyPricePack;

    cost = qty * buyPricePack;
  }

  expensesData.push({
    id: Date.now(),
    description: `Trade OUT: ${item.name}`,
    amount: cost,
    date: new Date().toISOString().split("T")[0],
    category: "Trade"
  });

  saveExpenses();
}

// ===============================
// DELETE EXPENSE
// ===============================

function deleteExpense(id) {
  expensesData = expensesData.filter(e => e.id !== id);
  saveExpenses();
  renderExpenses();
}

// ===============================
// RENDER EXPENSES PAGE
// ===============================

function renderExpenses() {
  const container = document.getElementById("expensesList");
  if (!container) return;

  if (expensesData.length === 0) {
    container.innerHTML = "<p>No expenses recorded yet.</p>";
    return;
  }

  container.innerHTML = expensesData.map(e => `
    <div class="expense-card">
      <h3>${e.description}</h3>

      <p><strong>Amount:</strong> £${e.amount.toFixed(2)}</p>
      <p><strong>Date:</strong> ${e.date}</p>
      <p><strong>Category:</strong> ${e.category}</p>

      <button onclick="deleteExpense(${e.id})">Delete</button>
    </div>
  `).join("");
}

// Initial render
renderExpenses();
