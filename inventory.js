let inventoryData = [
  {
    name: "Japanese 30th Anniversary Box",
    category: "Box",
    supplier: "Invicta TCG",
    buy: 178.27,
    sell: 185.00,
    qty: 1,
    img: "https://i.imgur.com/8qO4z0F.png"
  },
  {
    name: "Chinese 30th Anniversary Pack",
    category: "Anniversary box",
    supplier: "Invicta TCG",
    buy: 70.00,
    sell: 120.00,
    qty: 1,
    img: "https://i.imgur.com/8qO4z0F.png"
  }
];

function initInventory(){
  renderInventory();
}

function renderInventory(){
  let html = `
    <h2>Inventory</h2>
    <button onclick="showAddForm()">Add New Item</button>
    <button onclick="saveInventory()">Save Data</button>
    <button onclick="loadInventory()">Load Data</button>

    <div id="addForm" class="hidden">
      <h3>Add Item</h3>
      <input id="newName" placeholder="Name">
      <input id="newCategory" placeholder="Category">
      <input id="newSupplier" placeholder="Supplier">
      <input id="newBuy" type="number" step="0.01" placeholder="Buy cost">
      <input id="newSell" type="number" step="0.01" placeholder="Sell price">
      <input id="newQty" type="number" placeholder="Quantity">
      <input id="newImg" placeholder="Image URL">

      <button onclick="addItem()">Save Item</button>
      <button onclick="hideAddForm()">Cancel</button>
    </div>

    <div id="inventoryList"></div>
  `;

  document.getElementById('inventory').innerHTML = html;

  let list = document.getElementById('inventoryList');
  list.innerHTML = "";

  inventoryData.forEach((item, index) => {
    let profitPerItem = (item.sell - item.buy).toFixed(2);
    let totalProfit = (item.qty * (item.sell - item.buy)).toFixed(2);

    list.innerHTML += `
      <div class="itemCard">
        <h3>${item.name}</h3>
        ${item.img ? `<img src="${item.img}" class="itemImg">` : ""}
        <p><b>Category:</b> ${item.category}</p>
        <p><b>Supplier:</b> ${item.supplier}</p>
        <p><b>Buy (cost):</b> £${item.buy.toFixed(2)}</p>
        <p><b>Sell (price):</b> £${item.sell.toFixed(2)}</p>
        <p><b>Qty:</b> ${item.qty}</p>
        <p><b>Profit per item:</b> £${profitPerItem}</p>
        <p><b>Total profit:</b> £${totalProfit}</p>

        <button onclick="editItem(${index})">Edit</button>
        <button onclick="deleteItem(${index})">Delete</button>
        <button onclick="copyItem(${index})">Copy</button>
      </div>
    `;
  });
}

function showAddForm(){
  document.getElementById("addForm").classList.remove("hidden");
}

function hideAddForm(){
  document.getElementById("addForm").classList.add("hidden");
}

function addItem(){
  let item = {
    name: document.getElementById("newName").value,
    category: document.getElementById("newCategory").value,
    supplier: document.getElementById("newSupplier").value,
    buy: parseFloat(document.getElementById("newBuy").value),
    sell: parseFloat(document.getElementById("newSell").value),
    qty: parseInt(document.getElementById("newQty").value),
    img: document.getElementById("newImg").value
  };

  inventoryData.push(item);
  hideAddForm();
  renderInventory();
}

function editItem(index){
  alert("Edit item coming next");
}

function deleteItem(index){
  inventoryData.splice(index, 1);
  renderInventory();
}

function copyItem(index){
  let original = inventoryData[index];
  let copy = JSON.parse(JSON.stringify(original));
  copy.name = original.name + " (Copy)";
  inventoryData.push(copy);
  renderInventory();
}

function saveInventory(){
  localStorage.setItem("inventoryData", JSON.stringify(inventoryData));
  alert("Inventory saved");
}

function loadInventory(){
  let data = localStorage.getItem("inventoryData");
  if(data){
    inventoryData = JSON.parse(data);
    renderInventory();
    alert("Inventory loaded");
  } else {
    alert("No saved data found");
  }
}
