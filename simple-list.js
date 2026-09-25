function renderSimpleList() {
  loadData();

  const box = document.getElementById("simpleList");
  box.innerHTML = "";

  inventoryData.forEach(item => {
    const hasBoxes = (item.quantityBoxes || 0) > 0;
    const packsFromOpened = (item.openedBoxes || 0) * (item.packsPerBox || 0);
    const totalPacks = (item.manualPacks || 0) + packsFromOpened;
    const hasPacks = totalPacks > 0;

    const status = (hasBoxes || hasPacks) ? "Available" : "Order Required";

    let price = "N/A";
    if (item.sellPricePack) {
      price = "£" + item.sellPricePack.toFixed(2) + " (Pack)";
    } else if (item.sellPriceBox) {
      price = "£" + item.sellPriceBox.toFixed(2) + " (Box)";
    }

    const div = document.createElement("div");
    div.className = "customer-card";

    div.innerHTML =
      "<h3>" + item.name + "</h3>" +
      "<p><strong>Price:</strong> " + price + "</p>" +
      "<p><strong>Status:</strong> " + status + "</p>";

    box.appendChild(div);
  });
}

renderSimpleList();

function copySimpleWhatsApp() {
  let text = "📦 *Available Products*\n\n";

  inventoryData.forEach(item => {
    const hasBoxes = (item.quantityBoxes || 0) > 0;
    const packsFromOpened = (item.openedBoxes || 0) * (item.packsPerBox || 0);
    const totalPacks = (item.manualPacks || 0) + packsFromOpened;
    const hasPacks = totalPacks > 0;

    const status = (hasBoxes || hasPacks) ? "Available" : "Order Required";

    let price = "N/A";
    if (item.sellPricePack) {
      price = "£" + item.sellPricePack.toFixed(2) + " (Pack)";
    } else if (item.sellPriceBox) {
      price = "£" + item.sellPriceBox.toFixed(2) + " (Box)";
    }

    text += "• " + item.name + " — " + price + " (" + status + ")\n";
  });

  navigator.clipboard.writeText(text);
  alert("Copied!");
}

