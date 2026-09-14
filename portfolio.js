// PORTFOLIO PAGE LOGIC

// Load saved portfolios or start empty
let portfolioData = JSON.parse(localStorage.getItem("portfolioData")) || [];

// Save to localStorage
function savePortfolio() {
  localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
}

// Add new portfolio
function addPortfolio(event) {
  event.preventDefault();

  const name = document.getElementById("portName").value.trim();
  const description = document.getElementById("portDesc").value.trim();
  const image = document.getElementById("portImage").value.trim();
  const link = document.getElementById("portLink").value.trim();

  if (!name || !description || !image || !link) {
    alert("Please fill in all fields.");
    return;
  }

  portfolioData.push({ name, description, image, link });
  savePortfolio();
  renderPortfolio();

  document.getElementById("portfolioForm").reset();
}

// Render portfolio cards
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
      <img src="${p.image}" alt="${p.name}" class="portfolio-img">
      <h3>${p.name}</h3>
      <p>${p.description}</p>

      <a href="${p.link}" target="_blank" class="portfolio-link">
        Open Portfolio
      </a>
    `;

    container.appendChild(div);
  });
}
