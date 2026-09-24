function renderCustomerList() {
  loadData();

  const container = document.getElementById("customerList");
  container.innerHTML = "";

  inventoryData.forEach(item => {
    const hasBoxes = (item.quantityBoxes || 0) > 0;
    const packsFromOpenedBoxes = (item.openedBoxes || 0) * (item.packsPerBox || 0);
    const totalLoosePacks = (item.manualPacks || 0) + packsFromOpenedBoxes;
    const hasPacks = totalLoosePacks > 0;

    const status = (hasBoxes || hasPacks) ? "Available" : "Order Required";

    let displayPrice = "N/A";
    if (item.sellPricePack) {
      displayPrice = "£" + item.sellPricePack.toFixed(2) + " (Pack)";
    } else if (item.sellPriceBox) {
      displayPrice = "£" + item.sellPriceBox.toFixed(2) + " (Box)";
    }

    const card = document.createElement("div");
    card.className = "customer-card";

    card.innerHTML =
      "<h3>" + item.name + "</h3>" +
      "<p><strong>Price:</strong> " + displayPrice + "</p>" +
      "<p><strong>Status:</strong> " + status + "</p>" +
      "<p><strong>Boxes:</strong> " + (item.quantityBoxes || 0) + "</p>" +
      "<p><strong>Packs:</strong> " + totalLoosePacks + "</p>";

    container.appendChild(card);
  });
}

renderCustomerList();

function copyWhatsAppList() {
  let text = "📦 *Pokémon Products Available*\n\n";

  inventoryData.forEach(item => {
    const hasBoxes = (item.quantityBoxes || 0) > 0;
    const packsFromOpenedBoxes = (item.openedBoxes || 0) * (item.packsPerBox || 0);
    const totalLoosePacks = (item.manualPacks || 0) + packsFromOpenedBoxes;
    const hasPacks = totalLoosePacks > 0;

    const status = (hasBoxes || hasPacks) ? "Available" : "Order Required";

    let displayPrice = "N/A";
    if (item.sellPricePack) {
      displayPrice = "£" + item.sellPricePack.toFixed(2) + " (Pack)";
    } else if (item.sellPriceBox) {
      displayPrice = "£" + item.sellPriceBox.toFixed(2) + " (Box)";
    }

    text += "• " + item.name + " — " + displayPrice + " (" + status + ")\n";
  });

  navigator.clipboard.writeText(text);
  alert("Copied! Paste into WhatsApp.");
}
