// LOAD INVENTORY
let savedInventory = localStorage.getItem("inventoryData");
if (savedInventory) {
  inventory = JSON.parse(savedInventory);
} else {
  inventory = [];
}

function saveInventory(){
  localStorage.setItem("inventoryData", JSON.stringify(inventory));
}

function initInventory(){
  const div = document.getElementById("inventoryContainer");
  div.innerHTML = `
    <h2>Inventory</h2>
    <button onclick="addItem()">Add Product</button>
    <div id="invList"></div>
  `;
  renderInventory();
}

function addItem(){
  const name = prompt("Product name:");
  const type = prompt("Type:");
  const cost = parseFloat(prompt("Cost per item (£):"));
  const stock = parseInt(prompt("How many in stock:"), 10);
  const resale = parseFloat(prompt("Selling price (£):"));
  const sold = parseInt(prompt("How many sold:"), 10);
  const image = prompt("Image URL:");

  const profit = (resale - cost) * sold;
  const stockLeft = stock - sold;

  inventory.push({
    name,
    type,
    cost,
    stock,
    resale,
    sold,
    profit,
    stockLeft,
    image
  });

  saveInventory();
  renderInventory();
}

function editItem(index){
  const item = inventory[index];

  const name = prompt("Product name:", item.name);
  const type = prompt("Type:", item.type);
  const cost = parseFloat(prompt("Cost per item (£):", item.cost));
  const stock = parseInt(prompt("How many in stock:", item.stock), 10);
  const resale = parseFloat(prompt("Selling price (£):", item.resale));
  const sold = parseInt(prompt("How many sold:", item.sold), 10);
  const image = prompt("Image URL:", item.image);

  const profit = (resale - cost) * sold;
  const stockLeft = stock - sold;

  inventory[index] = {
    name,
    type,
    cost,
    stock,
    resale,
    sold,
    profit,
    stockLeft,
    image
  };

  saveInventory();
  renderInventory();
}

function copyItem(index){
  inventory.push({ ...inventory[index] });
  saveInventory();
  renderInventory();
}

function deleteItem(index){
  if(confirm("Delete this item?")){
    inventory.splice(index, 1);
    saveInventory();
    renderInventory();
  }
}

function renderInventory(){
  const list = document.getElementById("invList");

  list.innerHTML = inventory.map((item, index) => `
    <div class="productCard">
      <img src="${item.image}" class="productImg">

      <div class="productInfo">
        <h3>${item.name}</h3>
        <p>Type: ${item.type}</p>
        <p>Cost per item: £${item.cost.toFixed(2)}</p>
        <p>Stock: ${item.stock}</p>
        <p>Selling price: £${item.resale.toFixed(2)}</p>
        <p>Sold: ${item.sold}</p>
        <p>Stock left: ${item.stockLeft}</p>
        <p>Profit: £${item.profit.toFixed(2)}</p>
      </div>

      <div class="menuWrapper">
        <button class="menuBtn">⋮</button>
        <div class="menuPopup">
          <div onclick="editItem(${index})">Edit</div>
          <div onclick="copyItem(${index})">Copy</div>
          <div onclick="deleteItem(${index})">Delete</div>
        </div>
      </div>
    </div>
  `).join("");

  activateMenus();
}

function activateMenus(){
  document.querySelectorAll(".menuBtn").forEach(btn => {
    btn.onclick = () => {
      btn.nextElementSibling.classList.toggle("showMenu");
    };
  });
}
