function initSingles(){
  const div = document.getElementById("singlesContainer");

  div.innerHTML = `
    <h2>Singles</h2>

    <div class="formCard">
      <h3>Add Single Card</h3>

      <input id="singleName" type="text" placeholder="Card name">
      <input id="singleSet" type="text" placeholder="Set (e.g., Base Set)">
      <input id="singleRarity" type="text" placeholder="Rarity (e.g., Rare Holo)">
      <input id="singleLang" type="text" placeholder="Language (e.g., EN)">
      <input id="singleCond" type="text" placeholder="Condition (e.g., NM)">
      <input id="singlePrice" type="number" placeholder="Price (£)">
      <input id="singleQty" type="number" placeholder="Quantity">
      <input id="singleSupplier" type="text" placeholder="Supplier">
      <input id="singleImg" type="text" placeholder="Image URL (optional)">

      <button onclick="addSingle()">Add</button>
    </div>

    <div id="singleList" class="gridList"></div>
  `;

  renderSingles();
}

function addSingle(){
  const s = {
    name: document.getElementById("singleName").value,
    set: document.getElementById("singleSet").value,
    rarity: document.getElementById("singleRarity").value,
    lang: document.getElementById("singleLang").value,
    cond: document.getElementById("singleCond").value,
    price: document.getElementById("singlePrice").value,
    qty: document.getElementById("singleQty").value,
    supplier: document.getElementById("singleSupplier").value,
    img: document.getElementById("singleImg").value
  };

  if(!s.name){
    alert("Card name is required");
    return;
  }

  singles.push(s);
  renderSingles();

  document.querySelectorAll(".formCard input").forEach(i => i.value = "");
}

function renderSingles(){
  const list = document.getElementById("singleList");

  list.innerHTML = singles.map(s => `
    <div class="itemCard">
      ${s.img ? `<img src="${s.img}" class="cardImg">` : ""}
      <h3>${s.name}</h3>
      <p>Set: ${s.set || "-"}</p>
      <p>Rarity: ${s.rarity || "-"}</p>
      <p>Lang: ${s.lang || "-"}</p>
      <p>Cond: ${s.cond || "-"}</p>
      <p>Price: £${s.price || "0"}</p>
      <p>Qty: ${s.qty || "1"}</p>
      <p>Supplier: ${s.supplier || "-"}</p>
    </div>
  `).join("");
}
