function initInventory(){
  const div = document.getElementById("inventory");
  div.innerHTML = `
    <h2>Inventory</h2>
    <button onclick="addItem()">Add Item</button>
    <div id="invList"></div>
  `;
  renderInventory();
}

function addItem(){
  const name = prompt("Item name:");
  const qty = prompt("Quantity:");
  inventory.push({name, qty});
  renderInventory();
}

function renderInventory(){
  const list = document.getElementById("invList");
  list.innerHTML = inventory.map(i => `
    <div class="itemCard">
      <h3>${i.name}</h3>
      <p>Qty: ${i.qty}</p>
    </div>
  `).join("");
}
