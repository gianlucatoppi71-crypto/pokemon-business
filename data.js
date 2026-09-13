// Simple localStorage data layer

let inventoryData = [];
let salesData = [];
let suppliersData = [];
let tradesData = [];

function loadData() {
  inventoryData = JSON.parse(localStorage.getItem('inventoryData') || '[]');
  salesData = JSON.parse(localStorage.getItem('salesData') || '[]');
  suppliersData = JSON.parse(localStorage.getItem('suppliersData') || '[]');
  tradesData = JSON.parse(localStorage.getItem('tradesData') || '[]');
}

function saveData() {
  localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
  localStorage.setItem('salesData', JSON.stringify(salesData));
  localStorage.setItem('suppliersData', JSON.stringify(suppliersData));
  localStorage.setItem('tradesData', JSON.stringify(tradesData));
}
