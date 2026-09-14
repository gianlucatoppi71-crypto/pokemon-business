// PORTFOLIO PAGE LOGIC

// Add all your portfolios here
const portfolioData = [
  {
    name: "Collectr Portfolio",
    description: "Track Pokémon, MTG, YuGiOh and graded cards.",
    image: "https://getcollectr.com/assets/images/logo.png",
    link: "https://app.getcollectr.com/portfolio/products"
  },
  {
    name: "PriceCharting Collection",
    description: "Track prices for games, consoles, cards and collectibles.",
    image: "https://www.pricecharting.com/images/logo.png",
    link: "https://www.pricecharting.com"
  }

  // Add more portfolios below
  // {
  //   name: "Your Portfolio Name",
  //   description: "Short description",
  //   image: "IMAGE_URL",
  //   link: "LINK_URL"
  // }
];

function renderPortfolio() {
  const container = document.getElementById('portfolioList');
  if (!container) return;

  container.innerHTML = '';

  portfolioData.forEach((p) => {
    const div = document.createElement('div');
    div.className = 'portfolio-card';

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="portfolio-img">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <a href="${p.link}" target="_blank" class="portfolio-link">Open Portfolio</a>
    `;

    container.appendChild(div);
  });
}
