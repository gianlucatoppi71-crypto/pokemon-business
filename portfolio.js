// ===============================
// PORTFOLIO DATA
// ===============================
let portfolioData = JSON.parse(localStorage.getItem("portfolioData") || "[]");

function savePortfolio() {
  localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
}

// ===============================
// ADD PORTFOLIO
// ===============================
function addPortfolio(event) {
  event.preventDefault();

  const name = document.getElementById("portName").value;
  const desc = document.getElementById("portDesc").value;
  const image = document.getElementById("portImage").value;
  const link = document.getElementById("portLink").value;

  portfolioData.push({ name, description: desc, image, link });
  savePortfolio();
  renderPortfolio();

  event.target.reset();
}

// ===============================
// DELETE PORTFOLIO
// ===============================
function deletePortfolio(index) {
  portfolioData.splice(index, 1);
  savePortfolio();
  renderPortfolio();
}

// ===============================
// EDIT PORTFOLIO
// ===============================
function editPortfolio(index) {
  const item = portfolioData[index];

  const name = prompt("Edit name:", item.name);
  if (name === null) return;

  const description = prompt("Edit description:", item.description);
  if (description === null) return;

  const image = prompt("Edit image URL:", item.image);
  if (image === null) return;

  const link = prompt("Edit link:", item.link);
  if (link === null) return;

  portfolioData[index] = { name, description, image, link };
  savePortfolio();
  renderPortfolio();
}

// ===============================
// RENDER PORTFOLIO
// ===============================
function renderPortfolio() {
  const container = document.getElementById("portfolioList");
  container.innerHTML = "";

  if (portfolioData.length === 0) {
    container.innerHTML = "<p>No portfolios yet.</p>";
    return;
  }

  portfolioData.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "portfolio-card";

    div.innerHTML = `
      <img src="${p.image}" class="portfolio-img">
      <h3>${p.name}</h3>
      <p>${p.description}</p>

      <a href="${p.link}" target="_blank" class="portfolio-link">
        Open Portfolio
      </a>

      <div class="portfolio-actions">
        <button onclick="editPortfolio(${index})" class="portfolio-edit">Edit</button>
        <button onclick="deletePortfolio(${index})" class="portfolio-delete">Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}
