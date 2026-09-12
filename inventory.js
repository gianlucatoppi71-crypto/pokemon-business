// Load saved inventory
let savedInventory = localStorage.getItem("inventoryData");
if(savedInventory){
  inventory = JSON.parse(savedInventory);
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
  const type = prompt("Type (Booster, Single, ETB, Accessory):");
  const cost = parseFloat(prompt("Cost (£):"));
  const resale = parseFloat(prompt("Resale (£):"));
  const stock = parseInt(prompt("Stock quantity:"), 10);
  const image = prompt("Image URL:");

  inventory.push({ name, type, cost, resale, stock, image });

  saveInventory();
  renderInventory();
}

function editItem(index){
  const item = inventory[index];

  const name = prompt("Product name:", item.name);
  const type = prompt("Type:", item.type);
  const cost = parseFloat(prompt("Cost (£):", item.cost));
  const resale = parseFloat(prompt("Resale (£):", item.resale));
  const stock = parseInt(prompt("Stock quantity:", item.stock), 10);
  const image = prompt("Image URL:", item.image);

  inventory[index] = { name, type, cost, resale, stock, image };

  saveInventory();
  renderInventory();
}

function copyItem(index){
  const item = inventory[index];
  inventory.push({ ...item });
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
      <img src="${item.image}" class="productImg" alt="Product image">

      <div class="productInfo">
        <h3>${item.name}</h3>
        <p><strong>Type:</strong> ${item.type}</p>
        <p><strong>Cost:</strong> £${item.cost.toFixed(2)}</p>
        <p><strong>Resale:</strong> £${item.resale.toFixed(2)}</p>
        <p><strong>Profit:</strong> £${(item.resale - item.cost).toFixed(2)}</p>
        <p><strong>Stock:</strong> ${item.stock}</p>
      </div>

      <div class="menuWrapper">
        <button class="menuBtn">⋮</button>
        <div class="menuPopup">
          <div onclick="editItem(${index})">✏️ Edit</div>
          <div onclick="copyItem(${index})">📄 Copy</div>
          <div onclick="deleteItem(${index})">❌ Delete</div>
        </div>
      </div>
    </div>
  `).join("");

  activateMenus();
}

function activateMenus(){
  document.querySelectorAll(".menuBtn").forEach(btn => {
    btn.onclick = () => {
      const popup = btn.nextElementSibling;
      popup.classList.toggle("showMenu");
    };
  });
}
