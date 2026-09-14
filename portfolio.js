// PORTFOLIO PAGE LOGIC

const portfolioData = [
  {
    name: "Collectr Portfolio",
    description: "Track your Pokémon, MTG, YuGiOh and graded cards.",
    image: "https://getcollectr.com/assets/images/logo.png",
    link: "https://app.getcollectr.com/portfolio/products"
  }
  // You can add more objects here later
  // {
  //   name: "Another Portfolio",
  //   description: "Description here",
  //   image: "IMAGE_URL",
  //   link: "LINK_URL"
  // }
];

function renderPortfolio() {
  const container = document.getElementById('portfolioList');
  if (!container) return;

  container.innerHTML = '';

  if (portfolioData.length === 0) {
    container.innerHTML = '<p>No portfolios yet.</p>';
    return;
  }

  portfolioData.forEach((p) => {
    const div = document.createElement('div');
    div.className = 'portfolio-card';

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
