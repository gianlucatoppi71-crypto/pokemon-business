// ========== GLOBAL DATA STORAGE ==========

// All data lives in one object so it's easy to save/load.
let pokemonBusinessData = {
    inventory: [],
    sales: [],
    singles: [],
    trades: [],
    suppliers: []
};

// Load from localStorage on startup
function loadDataFromStorage() {
    const raw = localStorage.getItem("pokemonBusinessData");
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            // Basic safety: only overwrite if structure looks right
            if (parsed.inventory && parsed.sales && parsed.singles && parsed.trades && parsed.suppliers) {
                pokemonBusinessData = parsed;
            }
        } catch (e) {
            console.error("Error parsing stored data:", e);
        }
    }
}

// Save to localStorage after any change
function saveDataToStorage() {
    localStorage.setItem("pokemonBusinessData", JSON.stringify(pokemonBusinessData));
}

// Call once when site loads
loadDataFromStorage();
