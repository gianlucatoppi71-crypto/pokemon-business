function initSuppliers(){
  const div = document.getElementById("suppliersContainer");

  div.innerHTML = `
    <h2>Suppliers</h2>

    <div class="formCard">
      <h3>Add Supplier</h3>

      <input id="supName" type="text" placeholder="Supplier name">
      <input id="supContact" type="text" placeholder="Contact info">
      <input id="supWebsite" type="text" placeholder="Website (optional)">
      <input id="supImg" type="text" placeholder="Logo URL (optional)">
      <button onclick="addSupplier()">Add</button>
    </div>

    <div id="supplierList" class="gridList"></div>
  `;

  renderSuppliers();
}

function addSupplier(){
  const s = {
    name: document.getElementById("supName").value,
    contact: document.getElementById("supContact").value,
    website: document.getElementById("supWebsite").value,
    img: document.getElementById("supImg").value
  };

  if(!s.name){
    alert("Supplier name is required");
    return;
  }

  suppliers.push(s);
  renderSuppliers();

  document.querySelectorAll(".formCard input").forEach(i => i.value = "");
}

function renderSuppliers(){
  const list = document.getElementById("supplierList");

  list.innerHTML = suppliers.map(s => `
    <div class="itemCard">
      ${s.img ? `<img src="${s.img}" class="cardImg">` : ""}
      <h3>${s.name}</h3>
      <p>Contact: ${s.contact || "-"}</p>
      <p>Website: ${s.website || "-"}</p>
    </div>
  `).join("");
}

