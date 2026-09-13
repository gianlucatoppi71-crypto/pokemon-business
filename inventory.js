function initInventory(){
  const div = document.getElementById("inventoryContainer");

  div.innerHTML = `
    <h2>Inventory</h2>

    <div class="formCard">
      <h3>Add Item</h3>
      <input id="invName" type="text" placeholder="Item name">
      <input id="invQty" type="number" placeholder="Quantity">
      <input id="invImg" type="text" placeholder="Image URL (optional)">
      <button onclick="addItem()">Add</button>
    </div>

    <div id="invList" class="gridList"></div>
  `;

  renderInventory();
}

function addItem(){
  const name = document.getElementById("invName").value;
  const qty = document.getElementById("invQty").value;
  const img = document.getElementById("invImg").value;

  if(!name || !qty){
    alert("Name and quantity required");
    return;
  }

  inventory.push({name, qty, img});
  renderInventory();

  document.getElementById("invName").value = "";
  document.getElementById("invQty").value = "";
  document.getElementById("invImg").value = "";
}

function renderInventory(){
  const list = document.getElementById("invList");

  list.innerHTML = inventory.map(i => `
    <div class="itemCard">
      ${i.img ? `<img src="${i.img}" class="cardImg">` : ""}
      <h3>${i.name}</h3>
      <p>Qty: ${i.qty}</p>
    </div>
  `).join("");
}
