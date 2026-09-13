function initTrades(){
  const div = document.getElementById("tradesContainer");

  div.innerHTML = `
    <h2>Trades</h2>

    <div class="formCard">
      <h3>Add Trade</h3>

      <input id="tradeCard" type="text" placeholder="Card traded">
      <input id="tradeValue" type="number" placeholder="Value (£)">
      <input id="tradePartner" type="text" placeholder="Trade partner (optional)">
      <input id="tradeImg" type="text" placeholder="Image URL (optional)">
      <button onclick="addTrade()">Add</button>
    </div>

    <div id="tradeList" class="gridList"></div>
  `;

  renderTrades();
}

function addTrade(){
  const t = {
    card: document.getElementById("tradeCard").value,
    value: document.getElementById("tradeValue").value,
    partner: document.getElementById("tradePartner").value,
    img: document.getElementById("tradeImg").value
  };

  if(!t.card){
    alert("Card name is required");
    return;
  }

  trades.push(t);
  renderTrades();

  document.querySelectorAll(".formCard input").forEach(i => i.value = "");
}

function renderTrades(){
  const list = document.getElementById("tradeList");

  list.innerHTML = trades.map(t => `
    <div class="itemCard">
      ${t.img ? `<img src="${t.img}" class="cardImg">` : ""}
      <h3>${t.card}</h3>
      <p>Value: £${t.value || "0"}</p>
      <p>Partner: ${t.partner || "-"}</p>
    </div>
  `).join("");
}
