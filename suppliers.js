/* ========== SUPPLIERS PAGE ========== */

function loadSuppliers() {
    const content = document.getElementById("content");

    content.innerHTML = `
        <h1>Suppliers</h1>

        <div class="card">
            <h2>Add Supplier</h2>

            <label>Supplier Name</label>
            <input id="sup-name" type="text">

            <label>Contact Info</label>
            <input id="sup-contact" type="text">

            <label>Notes</label>
            <input id="sup-notes" type="text">

            <button class="action-btn" onclick="addSupplier()">Add Supplier</button>
        </div>

        <h2>Supplier List</h2>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody id="suppliers-table"></tbody>
        </table>
    `;

    renderSuppliersTable();
}

/* ========== ADD SUPPLIER ========== */

function addSupplier() {
    const name = document.getElementById("sup-name").value.trim();
    const contact = document.getElementById("sup-contact").value.trim();
    const notes = document.getElementById("sup-notes").value.trim();

    if (!name || !contact) {
        alert("Supplier name and contact are required.");
        return;
    }

    pokemonBusinessData.suppliers.push({
        name,
        contact,
        notes
    });

    saveDataToStorage();
    loadSuppliers();
}

/* ========== RENDER SUPPLIERS TABLE ========== */

function renderSuppliersTable() {
    const table = document.getElementById("suppliers-table");
    table.innerHTML = "";

    pokemonBusinessData.suppliers.forEach(sup => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${sup.name}</td>
            <td>${sup.contact}</td>
            <td>${sup.notes || ""}</td>
        `;

        table.appendChild(row);
    });
}
