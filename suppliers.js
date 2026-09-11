function initSuppliers(){
  const div = document.getElementById("suppliers");
  div.innerHTML = `
    <h2>Suppliers</h2>
    <button onclick="addSupplier()">Add Supplier</button>
    <div id="supplierList"></div>
  `;
  renderSuppliers();
}

function addSupplier(){
  const name = prompt("Supplier name:");
  const contact = prompt("Contact:");
  suppliers.push({name, contact});
  renderSuppliers();
}

function renderSuppliers(){
  const list = document.getElementById("supplierList");
  list.innerHTML = suppliers.map(s => `
    <div class="itemCard">
      <h3>${s.name}</h3>
      <p>${s.contact}</p>
    </div>
  `).join("");
}
