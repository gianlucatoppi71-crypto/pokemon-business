let inventory = [];
let inventoryFilter = "all";
let inventorySearch = "";
let inventorySort = "az";

function initInventory(){
  const div = document.getElementById("inventoryContainer");

  div.innerHTML = `
    <h2>Inventory</h2>

    <!-- SEARCH + FILTER + SORT -->
    <div class="formCard">
      <input id="invSearch" type="text" placeholder="Search items..." oninput="updateInvSearch()">

      <select id="invCategoryFilter" onchange="updateInvFilter()">
        <option value="all">All Categories</option>
        <option value="sealed">Sealed</option>
        <option value="singles">Singles</option>
        <option value="accessories">Accessories</option>
        <option value="other">Other</option>
      </select>

      <select id="invSort" onchange="updateInvSort()">
        <option value="az">Sort A → Z</option>
        <option value="za">Sort Z → A</option>
        <option value="qtyHigh">Qty High → Low</option>
        <option value="qtyLow">Qty Low → High</option>
      </select>
    </div>

    <!-- ADD ITEM -->
    <div class="formCard">
      <h3>Add Item</h3>

      <input id="invName" type="text" placeholder="Item name">
      <input id="invQty" type="number" placeholder="Quantity">
      <input id="invCategory" type="text" placeholder="Category (sealed/singles/accessories)">
      <input id="invSupplier" type="text" placeholder="Supplier (optional)">
      <input id="invImg" type="text" placeholder="Image URL (optional)">
      <button onclick="addItem()">Add</button>
    </div>

    <div id="invList" class="gridList"></div>

    <!-- POPUP -->
    <div id="invPopup" class="hidden popup"></div>
  `;

  renderInventory();
}

function updateInvSearch(){
  inventorySearch = document.getElementById("invSearch").value.toLowerCase();
  renderInventory();
}

function updateInvFilter(){
  inventoryFilter = document.getElementById("invCategoryFilter").value;
  renderInventory();
}

function updateInvSort(){
  inventorySort = document.getElementById("invSort").value;
  renderInventory();
}

function addItem(){
  const name = document.getElementById("invName").value;
  const qty = Number(document.getElementById("invQty").value);
  const category = document.getElementById("invCategory").value.toLowerCase();
  const supplier = document.getElementById("invSupplier").value;
  const img = document.getElementById("invImg").value;

  if(!name || !qty){
    alert("Name and quantity required");
    return;
  }

  inventory.push({
    name,
    qty,
    category: category || "other",
    supplier,
    img
  });

  document.querySelectorAll(".formCard input").forEach(i => i.value = "");
  renderInventory();
}

function renderInventory(){
  let list = [...inventory];

  // SEARCH
  if(inventorySearch){
    list = list.filter(i => i.name.toLowerCase().includes(inventorySearch));
  }

  // FILTER
  if(inventoryFilter !== "all"){
    list = list.filter(i => i.category === inventoryFilter);
  }

  // SORT
  if(inventorySort === "az") list.sort((a,b)=>a.name.localeCompare(b.name));
  if(inventorySort === "za") list.sort((a,b)=>b.name.localeCompare(a.name));
  if(inventorySort === "qtyHigh") list.sort((a,b)=>b.qty - a.qty);
  if(inventorySort === "qtyLow") list.sort((a,b)=>a.qty - b.qty);

  const div = document.getElementById("invList");

  div.innerHTML = list.map((i, index) => `
    <div class="itemCard">
      <img src="${i.img || 'https://via.placeholder.com/200x180/111/ffd700?text=No+Image'}" class="cardImg">

      <h3>${i.name}</h3>
      <p>Qty: ${i.qty}</p>
      <p>Category: ${i.category}</p>
      <p>Supplier: ${i.supplier || "-"}</p>

      <button onclick="invQtyPlus(${index})">+ Qty</button>
      <button onclick="invQtyMinus(${index})">- Qty</button>
      <button onclick="openInvPopup(${index})">Details</button>
      <button onclick="editInv(${index})">Edit</button>
      <button onclick="deleteInv(${index})">Delete</button>
    </div>
  `).join("");
}

function invQtyPlus(index){
  inventory[index].qty++;
  renderInventory();
}

function invQtyMinus(index){
  if(inventory[index].qty > 0){
    inventory[index].qty--;
  }
  renderInventory();
}

function deleteInv(index){
  if(confirm("Delete this item?")){
    inventory.splice(index, 1);
    renderInventory();
  }
}

function editInv(index){
  const item = inventory[index];

  const newName = prompt("New name:", item.name);
  const newQty = prompt("New quantity:", item.qty);
  const newCat = prompt("New category:", item.category);
  const newSup = prompt("New supplier:", item.supplier);
  const newImg = prompt("New image URL:", item.img);

  inventory[index] = {
    name: newName || item.name,
    qty: Number(newQty) || item.qty,
    category: newCat || item.category,
    supplier: newSup || item.supplier,
    img: newImg || item.img
  };

  renderInventory();
}

function openInvPopup(index){
  const i = inventory[index];
  const popup = document.getElementById("invPopup");

  popup.innerHTML = `
    <div class="popupCard">
      <img src="${i.img || 'https://via.placeholder.com/200x180/111/ffd700?text=No+Image'}" class="cardImg">
      <h3>${i.name}</h3>
      <p>Quantity: ${i.qty}</p>
      <p>Category: ${i.category}</p>
      <p>Supplier: ${i.supplier || "-"}</p>
      <button onclick="closeInvPopup()">Close</button>
    </div>
  `;

  popup.classList.remove("hidden");
}

function closeInvPopup(){
  document.getElementById("invPopup").classList.add("hidden");
}
