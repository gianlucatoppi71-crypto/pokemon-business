<!-- INVOICE PAGE -->
<section id="invoicePage" class="page" style="display:none">

  <h1>Supplier Invoices</h1>

  <div class="dashboard-card">
    <h3>Total Supplier Spend</h3>
    <p id="totalInvoiceSpend">£0.00</p>

    <h3>Invoices Saved</h3>
    <p id="invoiceCount">0</p>
  </div>

  <form id="invoiceForm">

    <input
      type="text"
      id="invoiceSupplier"
      placeholder="Supplier Name"
      required
    >

    <input
      type="text"
      id="invoiceNumber"
      placeholder="Invoice Number"
      required
    >

    <input
      type="date"
      id="invoiceDate"
      required
    >

    <input
      type="number"
      step="0.01"
      id="invoiceSubtotal"
      placeholder="Subtotal (£)"
      required
    >

    <input
      type="number"
      step="0.01"
      id="invoiceShipping"
      placeholder="Shipping (£)"
    >

    <input
      type="number"
      step="0.01"
      id="invoiceTotal"
      placeholder="Total (£)"
      required
    >

    <textarea
      id="invoiceNotes"
      placeholder="Notes"
    ></textarea>

    <button
      type="button"
      onclick="saveInvoice()"
    >
      Save Invoice
    </button>

  </form>

  <div id="invoiceList"></div>

</section>
