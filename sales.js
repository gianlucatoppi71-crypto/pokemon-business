function initSales(){
  const div = document.getElementById("salesContainer");

  div.innerHTML = `
    <h2>Sales</h2>

    <div class="formCard">
      <h3>Add Sale</h3>

      <input id="saleItem" type="text" placeholder="Item sold">
      <input id="salePrice" type="number" placeholder="Sale price (£)">
      <input id="saleBuyer" type="text" placeholder="Buyer (optional)">
      <input id="saleImg" type="text" placeholder="Image URL (optional)">
      <button onclick="addSale()">Add</button>
    </div>

    <div id="salesList" class="gridList"></div>
  `;

  renderSales();
}

function addSale(){
  const s = {
    item: document.getElementById("saleItem").value,
    price: document.getElementById("salePrice").value,
    buyer: document.getElementById("saleBuyer").value,
    img: document.getElementById("saleImg").value
  };

  if(!s.item){
    alert("Item name is required");
    return;
  }

  sales.push(s);
  renderSales();

  document.querySelectorAll(".formCard input").forEach(i => i.value = "");
}

function renderSales(){
  const list = document.getElementById("salesList");

  list.innerHTML = sales.map(s => `
    <div class="itemCard">
      ${s.img ? `<img src="${s.img}" class="cardImg">` : ""}
      <h3>${s.item}</h3>
      <p>Price: £${s.price || "0"}</p>
      <p>Buyer: ${s.buyer || "-"}</p>
    </div>
  `).join("");
}
