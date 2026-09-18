function renderCustomerList() {
  loadData(); // loads inventoryData

  const container = document.getElementById("customerList");
  container.innerHTML = "";

  inventoryData.forEach(item => {
    const status = item.quantity > 0 ? "Available" : "Order Required";

    const card = document.createElement("div");
    card.className = "customer-card";

    card.innerHTML = `
      <img src="${item.image}" class="customer-img">

      <div class="customer-info">
        <h3>${item.name}</h3>
        <p><strong>Price:</strong> £${item.sellPrice.toFixed(2)}</p>
        <p><strong>Status:</strong> ${status}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

renderCustomerList();

function copyWhatsAppList() {
  let text = "📦 *Pokémon Products Available*\n\n";

  inventoryData.forEach(item => {
    const status = item.quantity > 0 ? "Available" : "Order Required";
    text += `• ${item.name} — £${item.sellPrice.toFixed(2)} (${status})\n`;
  });

  navigator.clipboard.writeText(text);
  alert("Copied! Paste into WhatsApp.");
}
