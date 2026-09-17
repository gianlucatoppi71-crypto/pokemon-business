// ===============================
// EXPENSES SYSTEM
// ===============================

// Load existing expenses or create empty array
let expensesData = JSON.parse(localStorage.getItem("expensesData") || "[]");

// Save expenses to localStorage
function saveExpenses() {
  localStorage.setItem("expensesData", JSON.stringify(expensesData));
}

// Add a new expense
function addExpense(event) {
  event.preventDefault();

  const desc = document.getElementById("expDesc").value;
  const amount = parseFloat(document.getElementById("expAmount").value);
  const date = document.getElementById("expDate").value;
  const category = document.getElementById("expCategory").value || "General";

  expensesData.push({
    id: Date.now(),
    description: desc,
    amount,
    date,
    category
  });

  saveExpenses();
  renderExpenses();
  event.target.reset();
}

// Delete an expense
function deleteExpense(id) {
  expensesData = expensesData.filter(e => e.id !== id);
  saveExpenses();
  renderExpenses();
}

// Render expenses list
function renderExpenses() {
  const container = document.getElementById("expensesList");
  if (!container) return;

  if (expensesData.length === 0) {
    container.innerHTML = "<p>No expenses added yet.</p>";
    return;
  }

  container.innerHTML = expensesData.map(exp => `
    <div class="expense-card">
      <p><strong>${exp.description}</strong></p>
      <p>£${exp.amount.toFixed(2)}</p>
      <p>${exp.date}</p>
      <p>${exp.category}</p>
      <button onclick="deleteExpense(${exp.id})">Delete</button>
    </div>
  `).join("");
}
