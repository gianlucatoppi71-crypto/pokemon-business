function initTrades(){
  const div = document.getElementById("trades");
  div.innerHTML = `
    <h2>Trades</h2>
    <button onclick="addTrade()">Add Trade</button>
    <div id="tradeList"></div>
  `;
  renderTrades();
}

function addTrade(){
  const card = prompt("Card traded:");
  const value = prompt("Value:");
  trades.push({card, value});
  renderTrades();
}

function renderTrades(){
  const list = document.getElementById("tradeList");
  list.innerHTML = trades.map(t => `
    <div class="itemCard">
      <h3>${t.card}</h3>
      <p>Value: £${t.value}</p>
    </div>
  `).join("");
}
