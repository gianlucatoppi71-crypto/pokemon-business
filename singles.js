function initSingles(){
  const div = document.getElementById("singles");
  div.innerHTML = `
    <h2>Singles</h2>
    <button onclick="addSingle()">Add Single</button>
    <div id="singleList"></div>
  `;
  renderSingles();
}

function addSingle(){
  const name = prompt("Card name:");
  const price = prompt("Price:");
  singles.push({name, price});
  renderSingles();
}

function renderSingles(){
  const list = document.getElementById("singleList");
  list.innerHTML = singles.map(s => `
    <div class="itemCard">
      <h3>${s.name}</h3>
      <p>£${s.price}</p>
    </div>
  `).join("");
}
