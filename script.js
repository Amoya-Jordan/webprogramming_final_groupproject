// Auriva Essential Oils — External JavaScript
// Module: CIT2011 Web Programming | Final Group Project
// Members: Amoya Jordan - 2302539, Antwone Lamont - 2406412, Kyle Walker - 2403246, Victoria Wilson - 2207197

// ─── Question 2a. Product List — array of product objects ────────────────────
// Each object holds the name, price, description, and image filename for one product
var products = JSON.parse(localStorage.getItem("AllProducts")) || [
  { name: "Eucalyptus Oil",   price: 1200, description: "Refreshing and clearing oil.",  image: "E_Oil.jpg"  },
  { name: "Frankincense Oil", price: 1800, description: "Calming and grounding oil.",    image: "F_Oil.jpg"  },
  { name: "Lavender Oil",     price: 1400, description: "Relaxing and soothing oil.",    image: "L_Oil.jpg"  },
  { name: "Lemongrass Oil",   price: 1100, description: "Fresh citrus scent.",           image: "LG_Oil.jpg" },
  { name: "Orange Oil",       price: 1000, description: "Sweet uplifting aroma.",        image: "O_Oil.jpg"  },
  { name: "Peppermint Oil",   price: 1300, description: "Cooling and energizing.",       image: "P_Oil.jpg"  },
  { name: "Rosemary Oil",     price: 1250, description: "Herbal and stimulating.",       image: "R_Oil.jpg"  },
  { name: "Tea Tree Oil",     price: 1350, description: "Purifying and cleansing.",      image: "T_Oil.jpg"  }
];

// Question 2b. Keep AllProducts in localStorage so the list persists across pages
localStorage.setItem("AllProducts", JSON.stringify(products));

// Question 2c. Display products dynamically — loop through the array and inject product cards
// Each card has an image, name, description, price, and an "Add to Cart" button
function displayProducts() {
  var container = document.getElementById("product-grid");
  if (!container) return;

  container.innerHTML = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];

    var div = document.createElement("div"); // DOM manipulation — create product card
    div.className = "product-card";
    div.innerHTML =
      '<img class="card-img" src="Assets/images/' + p.image + '" alt="' + p.name + '">' +
      '<div class="card-body">' +
        '<h3>' + p.name + '</h3>' +
        '<p>' + p.description + '</p>' +
        '<p class="price">JMD $' + p.price + '</p>' +
        '<button class="btn btn-outline" onclick="addToCart(\'' + p.name + '\',' + p.price + ',\'' + p.image + '\')">Add to Cart</button>' +
      '</div>';

    container.appendChild(div);
  }
}


// ─── CART — localStorage persistence across pages ────────────────────────────

// Question 2. Load the cart array from localStorage so data persists across pages
// Use JSON.parse() to convert the stored string back into a JavaScript array
var cart = JSON.parse(localStorage.getItem("auriva_cart")) || [];

// Question 2. Save the cart array to localStorage after every change
// Use JSON.stringify() to convert the array into a string for storage
function saveCart() {
  localStorage.setItem("auriva_cart", JSON.stringify(cart));
}

// Question 2a. DOM Manipulation — add a product to the cart array and update the display
// Check if the item already exists in the cart; if so increment qty, otherwise push a new object
function addToCart(productName, price, image, isBundle) {
  if (isBundle === undefined) { isBundle = false; }

  var existing = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === productName) { existing = cart[i]; break; }
  }

  if (existing) {
    existing.qty++; // Arithmetic — increment quantity
  } else {
    cart.push({ name: productName, price: price, qty: 1, image: image, isBundle: isBundle });
  }

  saveCart();
  updateCart();
  showToast(productName + " added to cart!");
}

// Question 2a. DOM Manipulation — dynamically rebuild the cart display and recalculate totals
// Loop through the cart array, build HTML for each item, then inject it into #cart-items
function updateCart() {
  var cartDiv = document.getElementById("cart-items"); // getElementById — DOM access
  if (!cartDiv) return;

  if (cart.length === 0) { // Control structure — empty cart state
    cartDiv.innerHTML =
      '<div class="empty-cart">' +
        '<p>Your cart is empty.</p>' +
        '<a href="product.html" class="btn">Continue Shopping</a>' +
      '</div>';
    resetSummary();
    return;
  }

  cartDiv.innerHTML = "";
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) { // Loop through cart items
    var item      = cart[i];
    var itemPrice = item.isBundle ? item.price * 0.90 : item.price; // Arithmetic — 10% bundle discount
    var itemTotal = itemPrice * item.qty;
    subtotal += itemTotal;

    var div = document.createElement("div"); // DOM manipulation — create and inject cart item
    div.className = "cart-item";
    div.innerHTML =
      '<img src="../Assets/images/' + item.image + '" alt="' + item.name + '" width="80" height="80">' +
      '<div>' +
        '<h4>' + item.name + '</h4>' +
        '<p>' + (item.isBundle ? "Bundle (10% off)" : "Single Oil") + '</p>' +
        '<p>JMD $' + itemPrice.toFixed(0) + ' each</p>' +
      '</div>' +
      '<div class="qty-controls">' +
        '<button onclick="decreaseQty(' + i + ')" aria-label="Decrease">&#8722;</button>' +
        '<span>' + item.qty + '</span>' +
        '<button onclick="increaseQty(' + i + ')" aria-label="Increase">&#43;</button>' +
      '</div>' +
      '<div style="min-width:100px;text-align:right;">' +
        '<p style="font-weight:600;color:var(--dark-green);">JMD $' + itemTotal.toFixed(0) + '</p>' +
        '<button class="btn btn-outline" style="font-size:0.65rem;padding:0.4rem 0.8rem;margin-top:0.4rem;animation:none;" onclick="removeItem(' + i + ')">Remove</button>' +
      '</div>';
    cartDiv.appendChild(div);
  }

  var tax   = subtotal * 0.15; // Arithmetic — calculate 15% tax
  var total = subtotal + tax;  // Arithmetic — grand total

  var sub   = document.getElementById("cart-subtotal"); // DOM manipulation — update summary
  var taxEl = document.getElementById("cart-tax");
  var totEl = document.getElementById("cart-total");
  if (sub)   sub.innerText   = "Subtotal: JMD $" + subtotal.toFixed(0);
  if (taxEl) taxEl.innerText = "Tax (15%): JMD $" + tax.toFixed(0);
  if (totEl) totEl.innerText = "Grand Total: JMD $" + total.toFixed(0);
}

// Question 2a. DOM Manipulation — reset the order summary fields back to zero
// Called when the cart is empty to clear subtotal, tax, and total display
function resetSummary() {
  var sub   = document.getElementById("cart-subtotal");
  var taxEl = document.getElementById("cart-tax");
  var totEl = document.getElementById("cart-total");
  if (sub)   sub.innerText   = "Subtotal: JMD $0";
  if (taxEl) taxEl.innerText = "Tax (15%): JMD $0";
  if (totEl) totEl.innerText = "Grand Total: JMD $0";
}

// Question 2d. Arithmetic — increase the quantity of a cart item by 1
// Update localStorage and refresh the cart display after the change
function increaseQty(index) {
  cart[index].qty++;
  saveCart();
  updateCart();
}

// Question 2d. Arithmetic — decrease quantity by 1, or remove item if qty reaches 0
// Uses splice() to remove the item from the array entirely when qty would fall below 1
function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1); // Remove item from array
  }
  saveCart();
  updateCart();
}

// Question 2d. Array Manipulation — remove a specific item from the cart by its index
// Uses splice() to delete the element, then saves and refreshes the display
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

// Question 2b. Event Handling — clear all items from the cart when Clear Cart button is clicked
// Resets the cart array to empty, updates localStorage, and refreshes the display
function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

// Question 2a. DOM Manipulation — create and display a temporary toast notification on screen
// Appends a styled div to the body, then fades it out and removes it after 2.5 seconds
function showToast(message) {
  var toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText =
    "position:fixed;bottom:2rem;right:2rem;z-index:9999;" +
    "background:var(--dark-green);color:var(--cream);" +
    "padding:0.9rem 1.6rem;border-radius:2px;" +
    "font-family:var(--font-sans);font-size:0.8rem;letter-spacing:0.1em;" +
    "box-shadow:0 4px 20px rgba(0,0,0,0.2);" +
    "border-left:3px solid var(--gold);";
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s";
    setTimeout(function() { toast.remove(); }, 400);
  }, 2500);
}


// ─── Question 1. User Authentication — Registration and Login using localStorage ───
// All user records are stored under the key "RegistrationData" as an array of objects

// Question 1a(vi). Retrieve the RegistrationData array from localStorage
// Returns a parsed JavaScript array of user objects, or an empty array if none exist
function getRegistrationData() {
  return JSON.parse(localStorage.getItem("RegistrationData")) || [];
}

// Question 1a(vi). Write the updated RegistrationData array back to localStorage
// Uses JSON.stringify() to convert the array of objects into a storable string
function saveRegistrationData(data) {
  localStorage.setItem("RegistrationData", JSON.stringify(data));
}

// Question 1a(iv). Calculate the user's age in full years from their date of birth
// Returns a number used to enforce the rule that visitors must be over 18 to register
function calculateAge(dob) {
  var today     = new Date();
  var birth     = new Date(dob);
  var age       = today.getFullYear() - birth.getFullYear();
  var monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--; // Birthday hasn't occurred yet this year — subtract 1
  }
  return age;
}

// Question 1a(v). Validate that the TRN matches the required format 000-000-000
// Returns true if the string is exactly 9 digits split by two hyphens, false otherwise
function isValidTRN(trn) {
  return /^\d{3}-\d{3}-\d{3}$/.test(trn);
}

// Question 1a(v). Check that no existing user in RegistrationData has the same TRN
// Returns true if the TRN is unique (not already registered), false if a duplicate is found
function isTRNUnique(trn) {
  var users = getRegistrationData();
  for (var i = 0; i < users.length; i++) {
    if (users[i].trn === trn) { return false; }
  }
  return true;
}

// Question 1b(ii). Search RegistrationData for a user whose TRN matches the given value
// Returns the matching user object if found, or null if no match exists
function findUserByTRN(trn) {
  var users = getRegistrationData();
  for (var i = 0; i < users.length; i++) {
    if (users[i].trn === trn) { return users[i]; }
  }
  return null;
}

// Question 1b(vi). Allow the user to change their password by matching their TRN
// Finds the user record in RegistrationData, updates the password field, and saves back to localStorage
function resetPassword() {
  var trn     = document.getElementById("reset-trn").value.trim();
  var newPass = document.getElementById("reset-newpass").value.trim();

  if (!isValidTRN(trn)) {
    showToast("Please enter a valid TRN (000-000-000).");
    return;
  }
  if (newPass.length < 8) {
    showToast("New password must be at least 8 characters.");
    return;
  }

  var users = getRegistrationData();
  var found = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].trn === trn) {
      users[i].password = newPass; // Update the password in the array
      found = true;
      break;
    }
  }

  if (found) {
    saveRegistrationData(users); // Write updated array back to localStorage
    document.getElementById("reset-panel").style.display = "none";
    document.getElementById("reset-trn").value     = "";
    document.getElementById("reset-newpass").value = "";
    showToast("Password updated successfully. Please log in.");
  } else {
    showToast("No account found with that TRN.");
  }
}


// ─── Question 4. Checkout — read-only cart summary ───────────────────────────

// Question 4a. Display a read-only summary of the cart on the checkout page
// Renders each item without quantity controls so the user can review before confirming
function displayCartSummary() {
  var cartDiv = document.getElementById("cart-items");
  if (!cartDiv) return;

  if (cart.length === 0) { // Control structure — empty cart state
    cartDiv.innerHTML = '<p>Your cart is empty. <a href="product.html">Continue Shopping</a></p>';
    resetSummary();
    return;
  }

  cartDiv.innerHTML = "";
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) { // Loop through cart items
    var item      = cart[i];
    var itemPrice = item.isBundle ? item.price * 0.90 : item.price; // Arithmetic — 10% bundle discount
    var itemTotal = itemPrice * item.qty;
    subtotal += itemTotal;

    var div = document.createElement("div"); // DOM manipulation — create read-only summary row
    div.className = "cart-item";
    div.innerHTML =
      '<img src="../Assets/images/' + item.image + '" alt="' + item.name + '" width="80" height="80">' +
      '<div>' +
        '<h4>' + item.name + '</h4>' +
        '<p>' + (item.isBundle ? "Bundle (10% off)" : "Single Oil") + '</p>' +
        '<p>JMD $' + itemPrice.toFixed(0) + ' each &times; ' + item.qty + '</p>' +
      '</div>' +
      '<div style="min-width:100px;text-align:right;">' +
        '<p style="font-weight:600;color:var(--dark-green);">JMD $' + itemTotal.toFixed(0) + '</p>' +
      '</div>';
    cartDiv.appendChild(div);
  }

  var tax   = subtotal * 0.15; // Arithmetic — calculate 15% tax
  var total = subtotal + tax;  // Arithmetic — grand total

  var sub   = document.getElementById("cart-subtotal"); // DOM manipulation — update summary
  var taxEl = document.getElementById("cart-tax");
  var totEl = document.getElementById("cart-total");
  if (sub)   sub.innerText   = "Subtotal: JMD $" + subtotal.toFixed(0);
  if (taxEl) taxEl.innerText = "Tax (15%): JMD $" + tax.toFixed(0);
  if (totEl) totEl.innerText = "Grand Total: JMD $" + total.toFixed(0);
}


// ─── Question 5. Invoice Generation ─────────────────────────────────────────

// Question 5a. Build and inject the invoice HTML into #invoice-content on invoice.html
// Question 5b. Save the invoice object to AllInvoices and to the user's invoices[] in RegistrationData
function generateInvoice(name, address, phone, amount) {
  var subtotal  = 0;
  var itemsHtml = "";
  var itemsData = [];

  for (var i = 0; i < cart.length; i++) { // Loop through cart to build line items
    var item      = cart[i];
    var itemPrice = item.isBundle ? item.price * 0.90 : item.price; // Arithmetic — bundle discount
    var itemTotal = itemPrice * item.qty;
    subtotal += itemTotal;

    itemsHtml +=
      '<tr>' +
        '<td>' + item.name + '</td>' +
        '<td>' + item.qty  + '</td>' +
        '<td>' + (item.isBundle ? "10% off" : "—") + '</td>' +
        '<td>JMD $' + itemPrice.toFixed(0) + '</td>' +
        '<td>JMD $' + itemTotal.toFixed(0) + '</td>' +
      '</tr>';

    itemsData.push({
      name    : item.name,
      qty     : item.qty,
      price   : itemPrice,
      total   : itemTotal,
      isBundle: item.isBundle
    });
  }

  var tax         = subtotal * 0.15; // Arithmetic — 15% tax
  var total       = subtotal + tax;  // Arithmetic — grand total
  var invoiceNum  = "INV-" + Date.now(); // Unique invoice number using timestamp
  var invoiceDate = new Date().toLocaleDateString();
  var loggedInTRN = localStorage.getItem("loggedInTRN") || "N/A";

  // Build the invoice object
  var invoiceObj = {
    invoiceNumber : invoiceNum,
    date          : invoiceDate,
    trn           : loggedInTRN,
    name          : name,
    address       : address,
    phone         : phone,
    amountPaid    : amount,
    items         : itemsData,
    subtotal      : subtotal,
    tax           : tax,
    total         : total
  };

  // Save invoice to AllInvoices in localStorage
  var allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
  allInvoices.push(invoiceObj);
  localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

  // Also append to the logged-in user's invoices[] inside RegistrationData
  var users = getRegistrationData();
  for (var j = 0; j < users.length; j++) {
    if (users[j].trn === loggedInTRN) {
      if (!users[j].invoices) { users[j].invoices = []; }
      users[j].invoices.push(invoiceObj);
      break;
    }
  }
  saveRegistrationData(users);

  // Store the latest invoice temporarily so invoice.html can render it
  localStorage.setItem("latestInvoice", JSON.stringify(invoiceObj));
}

// Question 5a. Render the most recently generated invoice on invoice.html
// Reads the latestInvoice key from localStorage and injects full HTML into #invoice-content
function displayInvoice() {
  var invoiceDiv = document.getElementById("invoice-content");
  if (!invoiceDiv) return;

  var inv = JSON.parse(localStorage.getItem("latestInvoice"));
  if (!inv) {
    invoiceDiv.innerHTML = "<p>No invoice found. Please complete a checkout first.</p>";
    return;
  }

  var itemsHtml = "";
  for (var i = 0; i < inv.items.length; i++) {
    var it = inv.items[i];
    itemsHtml +=
      '<tr>' +
        '<td>' + it.name + '</td>' +
        '<td>' + it.qty  + '</td>' +
        '<td>' + (it.isBundle ? "10% off" : "—") + '</td>' +
        '<td>JMD $' + it.price.toFixed(0) + '</td>' +
        '<td>JMD $' + it.total.toFixed(0) + '</td>' +
      '</tr>';
  }

  // Question 5a. DOM Manipulation — inject full invoice HTML into #invoice-content
  invoiceDiv.innerHTML =
    '<div style="max-width:650px;margin:auto;font-family:var(--font-sans);">' +
      '<h2 style="text-align:center;margin-bottom:0.2rem;">Auriva Essential Oils</h2>' +
      '<p style="text-align:center;font-size:0.8rem;color:#777;">Invoice Receipt</p>' +
      '<hr style="margin:1rem 0;">' +
      '<p><strong>Invoice #:</strong> '        + inv.invoiceNumber + '</p>' +
      '<p><strong>Date:</strong> '             + inv.date          + '</p>' +
      '<p><strong>TRN:</strong> '              + inv.trn           + '</p>' +
      '<hr style="margin:1rem 0;">' +
      '<p><strong>Name:</strong> '             + inv.name          + '</p>' +
      '<p><strong>Address:</strong> '          + inv.address        + '</p>' +
      '<p><strong>Phone:</strong> '            + inv.phone          + '</p>' +
      '<p><strong>Amount Paid:</strong> JMD $' + inv.amountPaid     + '</p>' +
      '<hr style="margin:1rem 0;">' +
      '<table class="invoice-table" style="width:100%;border-collapse:collapse;">' +
        '<thead>' +
          '<tr style="background:var(--dark-green);color:var(--cream);">' +
            '<th style="padding:0.5rem;text-align:left;">Item</th>' +
            '<th style="padding:0.5rem;">Qty</th>' +
            '<th style="padding:0.5rem;">Discount</th>' +
            '<th style="padding:0.5rem;">Price</th>' +
            '<th style="padding:0.5rem;">Total</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          itemsHtml +
        '</tbody>' +
        '<tfoot>' +
          '<tr><td colspan="4" style="padding:0.4rem;text-align:right;"><strong>Subtotal</strong></td>' +
            '<td style="padding:0.4rem;">JMD $' + inv.subtotal.toFixed(0) + '</td></tr>' +
          '<tr><td colspan="4" style="padding:0.4rem;text-align:right;"><strong>Tax (15%)</strong></td>' +
            '<td style="padding:0.4rem;">JMD $' + inv.tax.toFixed(0) + '</td></tr>' +
          '<tr style="background:#f5f5f5;"><td colspan="4" style="padding:0.4rem;text-align:right;"><strong>Grand Total</strong></td>' +
            '<td style="padding:0.4rem;font-weight:700;color:var(--dark-green);">JMD $' + inv.total.toFixed(0) + '</td></tr>' +
        '</tfoot>' +
      '</table>' +
      '<p style="margin-top:1.5rem;text-align:center;color:var(--dark-green);">' +
        '&#10003; A receipt has been sent to your email. Thank you for shopping with Auriva!' +
      '</p>' +
    '</div>';
}


// ─── Question 6. Additional Functionality ────────────────────────────────────

// Question 6a. ShowUserFrequency() — render gender and age-group bar charts on the dashboard
// Reads RegistrationData, counts users per category, then injects CSS bar chart HTML
function ShowUserFrequency() {
  var users     = getRegistrationData();
  var genderDiv = document.getElementById("gender-chart");
  var ageDiv    = document.getElementById("age-chart");
  if (!genderDiv && !ageDiv) { return; } // Only runs on the dashboard page

  // Count gender frequencies
  var genderCounts = { Male: 0, Female: 0, Other: 0 };
  // Count age-group frequencies
  var ageCounts    = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };

  for (var i = 0; i < users.length; i++) { // Loop through all registered users
    var u = users[i];

    // Gender tally — control structure
    var g = (u.gender || "").toLowerCase();
    if      (g === "male")   { genderCounts.Male++;   }
    else if (g === "female") { genderCounts.Female++; }
    else                     { genderCounts.Other++;  }

    // Age-group tally — arithmetic and control structure
    var age = calculateAge(u.dateOfBirth);
    if      (age >= 18 && age <= 25) { ageCounts["18-25"]++; }
    else if (age >= 26 && age <= 35) { ageCounts["26-35"]++; }
    else if (age >= 36 && age <= 50) { ageCounts["36-50"]++; }
    else if (age >  50)              { ageCounts["50+"]++;   }
  }

  // Helper — build one CSS bar row (no image needed)
  function buildBar(label, count, max, color) {
    var pct = max > 0 ? Math.round((count / max) * 100) : 0;
    return (
      '<div style="display:flex;align-items:center;gap:0.8rem;margin-bottom:0.75rem;">' +
        '<span style="min-width:70px;font-size:0.82rem;color:var(--text-muted);">' + label + '</span>' +
        '<div style="flex:1;height:22px;background:var(--cream);border:1px solid var(--border);border-radius:2px;overflow:hidden;">' +
          '<div style="width:' + pct + '%;height:100%;background:' + color + ';border-radius:2px 0 0 2px;"></div>' +
        '</div>' +
        '<span style="min-width:24px;font-size:0.82rem;font-weight:500;color:var(--dark-green);text-align:right;">' + count + '</span>' +
      '</div>'
    );
  }

  // Question 6a(i) — render gender chart into #gender-chart
  if (genderDiv) {
    var maxGender = Math.max(genderCounts.Male, genderCounts.Female, genderCounts.Other, 1);
    var gHtml = "";
    gHtml += buildBar("Male",   genderCounts.Male,   maxGender, "var(--dark-green)");
    gHtml += buildBar("Female", genderCounts.Female, maxGender, "var(--gold)");
    gHtml += buildBar("Other",  genderCounts.Other,  maxGender, "var(--text-muted)");
    genderDiv.innerHTML = gHtml;
  }

  // Question 6a(ii) — render age-group chart into #age-chart
  if (ageDiv) {
    var maxAge = Math.max(ageCounts["18-25"], ageCounts["26-35"], ageCounts["36-50"], ageCounts["50+"], 1);
    var aHtml = "";
    aHtml += buildBar("18-25", ageCounts["18-25"], maxAge, "var(--dark-green)");
    aHtml += buildBar("26-35", ageCounts["26-35"], maxAge, "var(--dark-green)");
    aHtml += buildBar("36-50", ageCounts["36-50"], maxAge, "var(--dark-green)");
    aHtml += buildBar("50+",   ageCounts["50+"],   maxAge, "var(--gold)");
    ageDiv.innerHTML = aHtml;
  }
}

// Question 6b. ShowInvoices() — log all invoices from AllInvoices to the console
// Pass a TRN string to filter by user, or pass "" / no argument to show every invoice
function ShowInvoices(filterTRN) {
  var allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
  if (!filterTRN || filterTRN.trim() === "") {
    console.log("=== All Invoices ===");
    console.log(allInvoices);
  } else {
    var filtered = [];
    for (var i = 0; i < allInvoices.length; i++) {
      if (allInvoices[i].trn === filterTRN.trim()) { filtered.push(allInvoices[i]); }
    }
    console.log("=== Invoices for TRN: " + filterTRN + " ===");
    console.log(filtered);
  }
}

// Question 6c. GetUserInvoices() — display all invoices for a specific user by TRN
// Reads the invoices[] array stored on the user object inside RegistrationData
function GetUserInvoices(trn) {
  var user = findUserByTRN(trn);
  if (!user) {
    console.log("No user found with TRN: " + trn);
    return;
  }
  console.log("=== Invoices for " + user.firstName + " " + user.lastName + " ===");
  console.log(user.invoices || []);
}

// Question 6a(iii). showUserFrequency() — legacy alias used if #user-frequency container exists
// Counts gender and age groups and injects plain text results into #user-frequency
function showUserFrequency() {
  var users = getRegistrationData();

  var genderCount = { Male: 0, Female: 0, Other: 0 };
  var ageGroups   = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };

  for (var i = 0; i < users.length; i++) {
    var user = users[i];

    // Counting gender
    if (genderCount[user.gender] !== undefined) {
      genderCount[user.gender]++;
    } else {
      genderCount.Other++;
    }

    // Calculating and counting age group
    var age = calculateAge(user.dateOfBirth);
    if      (age >= 18 && age <= 25) { ageGroups["18-25"]++; }
    else if (age >= 26 && age <= 35) { ageGroups["26-35"]++; }
    else if (age >= 36 && age <= 50) { ageGroups["36-50"]++; }
    else                             { ageGroups["50+"]++;   }
  }

  var container = document.getElementById("user-frequency");
  if (!container) return;

  container.innerHTML =
    "<h3>User Frequency</h3>" +
    "<p><strong>Gender:</strong></p>" +
    "<p>Male: "   + genderCount.Male   + "</p>" +
    "<p>Female: " + genderCount.Female + "</p>" +
    "<p>Other: "  + genderCount.Other  + "</p>" +
    "<p><strong>Age Groups:</strong></p>" +
    "<p>18-25: " + ageGroups["18-25"] + "</p>" +
    "<p>26-35: " + ageGroups["26-35"] + "</p>" +
    "<p>36-50: " + ageGroups["36-50"] + "</p>" +
    "<p>50+: "   + ageGroups["50+"]   + "</p>";
}


// ─── Question 2b. Event Handling — DOMContentLoaded listener ─────────────────
// Attach all form submit handlers and initialise page-specific UI after the DOM is ready

document.addEventListener("DOMContentLoaded", function() {

  // Question 2c. Product catalogue — display product grid if the container exists
  if (document.getElementById("product-grid")) {
    displayProducts();
  }

  // Question 2a. Cart page — initialise interactive cart display
  // Question 4a. Checkout page — show read-only summary instead
  if (document.getElementById("cart-items")) {
    if (document.getElementById("checkout-form")) {
      displayCartSummary(); // Read-only summary for checkout page
    } else {
      updateCart(); // Full interactive cart on cart page
    }
  }

  // Question 5a. Invoice page — render the latest invoice from localStorage
  if (document.getElementById("invoice-content")) {
    displayInvoice();
  }

  // Question 6a. Dashboard page — run frequency bar charts if containers exist
  ShowUserFrequency();

  // Question 6a(iii). Plain-text frequency fallback if #user-frequency div exists
  if (document.getElementById("user-frequency")) {
    showUserFrequency();
  }


  // ─── Question 1b. Login Page ────────────────────────────────────────────────
  // Validate TRN and password against RegistrationData; 3 attempts before lockout
  var loginForm = document.getElementById("login-form");
  if (loginForm) {

    var loginAttempts = parseInt(sessionStorage.getItem("loginAttempts")) || 0;
    var MAX_ATTEMPTS  = 3;

    // Question 1b(vi). Toggle the Reset Password panel when the hyperlink is clicked
    var resetLink = document.getElementById("reset-password-link");
    if (resetLink) {
      resetLink.addEventListener("click", function(e) {
        e.preventDefault();
        var panel = document.getElementById("reset-panel");
        panel.style.display = (panel.style.display === "none" || panel.style.display === "") ? "block" : "none";
      });
    }

    // Question 1b(ii). Validate TRN and password on form submit
    // Question 1b(iii). Count failed attempts; redirect to locked.html after 3 failures
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      clearErrors();

      if (loginAttempts >= MAX_ATTEMPTS) { // Q1b(iii) — block if already locked
        window.location.href = "locked.html";
        return;
      }

      var trn      = document.getElementById("login-trn").value.trim();
      var password = document.getElementById("login-password").value.trim();
      var valid    = true;

      if (trn === "")            { showError("login-trn",      "TRN is required.");          valid = false; }
      else if (!isValidTRN(trn)) { showError("login-trn",      "Enter TRN as 000-000-000."); valid = false; }
      if (password === "")       { showError("login-password", "Password is required.");     valid = false; }

      if (!valid) return;

      var user         = findUserByTRN(trn); // Q1b(ii) — look up user in RegistrationData
      var attemptMsgEl = document.getElementById("attempt-msg");
      var remaining;

      if (user && user.password === password) {
        sessionStorage.removeItem("loginAttempts");   // Reset attempt counter on success
        localStorage.setItem("loggedInTRN", trn);     // Store logged-in session
        showToast("Welcome back, " + user.firstName + "!");
        setTimeout(function() {
          window.location.href = "product.html";       // Q1b(iii) — redirect to product catalogue
        }, 1200);

      } else {
        loginAttempts++;
        sessionStorage.setItem("loginAttempts", loginAttempts);
        remaining = MAX_ATTEMPTS - loginAttempts;

        if (loginAttempts >= MAX_ATTEMPTS) {
          window.location.href = "locked.html"; // Q1b(iii) — redirect to error/locked page
        } else {
          if (attemptMsgEl) {
            attemptMsgEl.textContent =
              "Incorrect TRN or password. " + remaining + " attempt" +
              (remaining === 1 ? "" : "s") + " remaining.";
          }
          showError("login-trn",      " ");
          showError("login-password", " ");
        }
      }
    });

    // Question 1b(v). Cancel button — clear login form fields
    var cancelLogin = document.getElementById("login-cancel");
    if (cancelLogin) {
      cancelLogin.addEventListener("click", function() {
        loginForm.reset();
        clearErrors();
      });
    }
  }


  // ─── Question 1a. Registration Page ─────────────────────────────────────────
  // Validate all fields, calculate age, check TRN format and uniqueness, store user object
  var registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
      e.preventDefault();
      clearErrors();

      var firstName = document.getElementById("reg-firstname").value.trim();
      var lastName  = document.getElementById("reg-lastname").value.trim();
      var dob       = document.getElementById("reg-dob").value;
      var gender    = document.getElementById("reg-gender").value;
      var phone     = document.getElementById("reg-phone").value.trim();
      var email     = document.getElementById("reg-email").value.trim();
      var trn       = document.getElementById("reg-trn").value.trim();
      var password  = document.getElementById("reg-password").value.trim();
      var valid     = true;

      // Question 1a(ii). Validate that all fields are filled — JavaScript error handling
      if (firstName === "") { showError("reg-firstname", "First name is required.");  valid = false; }
      if (lastName  === "") { showError("reg-lastname",  "Last name is required.");   valid = false; }

      // Question 1a(iv). Calculate age and reject if under 18
      if (dob === "") {
        showError("reg-dob", "Date of birth is required.");
        valid = false;
      } else if (calculateAge(dob) < 18) {
        showError("reg-dob", "You must be 18 or older to register.");
        valid = false;
      }

      if (gender === "") { showError("reg-gender", "Please select your gender."); valid = false; }
      if (phone  === "") { showError("reg-phone",  "Phone number is required.");  valid = false; }

      if (email === "") {
        showError("reg-email", "Email is required.");
        valid = false;
      } else if (!isValidEmail(email)) {
        showError("reg-email", "Enter a valid email address.");
        valid = false;
      }

      // Question 1a(v). Validate TRN format and uniqueness
      if (trn === "") {
        showError("reg-trn", "TRN is required.");
        valid = false;
      } else if (!isValidTRN(trn)) {
        showError("reg-trn", "TRN must be in the format 000-000-000.");
        valid = false;
      } else if (!isTRNUnique(trn)) {
        showError("reg-trn", "This TRN is already registered.");
        valid = false;
      }

      // Question 1a(iii). Validate password length (minimum 8 characters)
      if (password === "") {
        showError("reg-password", "Password is required.");
        valid = false;
      } else if (password.length < 8) {
        showError("reg-password", "Password must be at least 8 characters.");
        valid = false;
      }

      // Question 1a(vi). Build user object and append to RegistrationData in localStorage
      if (valid) {
        var newUser = {
          firstName          : firstName,
          lastName           : lastName,
          dateOfBirth        : dob,
          gender             : gender,
          phone              : phone,
          email              : email,
          trn                : trn,
          password           : password,
          dateOfRegistration : new Date().toISOString(),
          cart               : {},  // Empty cart object
          invoices           : []   // Empty invoices array
        };

        var users = getRegistrationData(); // Retrieve existing array from localStorage
        users.push(newUser);              // Append new user object to the array
        saveRegistrationData(users);      // Write updated array back to localStorage

        showToast("Registration successful! Welcome to Auriva, " + firstName + ".");
        registerForm.reset();

        setTimeout(function() {
          window.location.href = "login.html"; // Redirect to login after successful registration
        }, 1800);
      }
    });

    // Question 1a(viii). Cancel button — clear the registration form
    var cancelReg = document.getElementById("reg-cancel");
    if (cancelReg) {
      cancelReg.addEventListener("click", function() {
        registerForm.reset();
        clearErrors();
      });
    }
  }


  // ─── Question 2c / Question 4. Checkout Form ─────────────────────────────
  // Validate shipping details then generate an invoice and redirect to invoice.html
  var checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(e) {
      e.preventDefault();
      clearErrors();

      var name    = document.getElementById("co-name").value.trim();
      var address = document.getElementById("co-address").value.trim();
      var phone   = document.getElementById("co-phone").value.trim();
      var amount  = document.getElementById("co-amount").value.trim();
      var valid   = true;

      if (name    === "") { showError("co-name",    "Name is required.");    valid = false; }
      if (address === "") { showError("co-address", "Address is required."); valid = false; }
      if (phone   === "") { showError("co-phone",   "Phone is required.");   valid = false; }
      if (amount  === "" || isNaN(amount) || Number(amount) <= 0) {
        showError("co-amount", "Enter a valid payment amount.");
        valid = false;
      }

      if (valid) {
        // Question 5. Generate invoice, save to localStorage, clear cart, redirect to invoice.html
        generateInvoice(name, address, phone, amount);
        clearCart();
        showToast("Order confirmed! Redirecting to your invoice...");
        setTimeout(function() {
          window.location.href = "invoice.html"; // Q5a — display full invoice on dedicated page
        }, 1400);
      }
    });

    // Question 4e. Cancel button on checkout — go back to cart
    var cancelCheckout = document.getElementById("co-cancel");
    if (cancelCheckout) {
      cancelCheckout.addEventListener("click", function() {
        window.location.href = "cart.html";
      });
    }
  }

});

// ─── Question 6C AND 6B. Additional Function ──────────────

    /* Load stat card numbers from localStorage */
    function loadStats() {
      var users    = JSON.parse(localStorage.getItem("RegistrationData")) || [];
      var invoices = JSON.parse(localStorage.getItem("AllInvoices"))      || [];
      var revenue  = 0;
      for (var i = 0; i < invoices.length; i++) { revenue += Number(invoices[i].total) || 0; }

      var u = document.getElementById("stat-users");
      var v = document.getElementById("stat-invoices");
      var r = document.getElementById("stat-revenue");
      if (u) u.textContent = users.length;
      if (v) v.textContent = invoices.length;
      if (r) r.textContent = "JMD $" + Math.round(revenue).toLocaleString();
    }

    /* Build a styled bar chart — overrides the thinbar.jpg version for this page */
    function buildBarChart(containerId, rows, fills) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var max = 1;
      for (var i = 0; i < rows.length; i++) { if (rows[i].count > max) max = rows[i].count; }

      var html = "";
      for (var j = 0; j < rows.length; j++) {
        var pct       = Math.round((rows[j].count / max) * 100);
        var fillClass = fills[j % fills.length];
        html +=
          '<div class="bar-row">' +
            '<span class="bar-label">' + rows[j].label + '</span>' +
            '<div class="bar-track"><div class="' + fillClass + '" style="width:' + pct + '%;"></div></div>' +
            '<span class="bar-count">' + rows[j].count + '</span>' +
          '</div>';
      }

      container.innerHTML = html || '<p class="no-data">No registered users yet.</p>';
    }

    /* Question 6a — override ShowUserFrequency for dashboard page */
    function ShowUserFrequency() {
      var users        = JSON.parse(localStorage.getItem("RegistrationData")) || [];
      var genderCounts = { Male: 0, Female: 0, Other: 0 };
      var ageCounts    = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };

      for (var i = 0; i < users.length; i++) {
        var u = users[i];
        var g = (u.gender || "").toLowerCase();
        if      (g === "male")   { genderCounts.Male++;   }
        else if (g === "female") { genderCounts.Female++; }
        else                     { genderCounts.Other++;  }

        var age = calculateAge(u.dateOfBirth);
        if      (age >= 18 && age <= 25) { ageCounts["18-25"]++; }
        else if (age >= 26 && age <= 35) { ageCounts["26-35"]++; }
        else if (age >= 36 && age <= 50) { ageCounts["36-50"]++; }
        else if (age > 50)               { ageCounts["50+"]++;   }
      }

      buildBarChart("gender-chart", [
        { label: "Male",   count: genderCounts.Male   },
        { label: "Female", count: genderCounts.Female },
        { label: "Other",  count: genderCounts.Other  }
      ], ["bar-green", "bar-gold", "bar-muted"]);

      buildBarChart("age-chart", [
        { label: "18-25", count: ageCounts["18-25"] },
        { label: "26-35", count: ageCounts["26-35"] },
        { label: "36-50", count: ageCounts["36-50"] },
        { label: "50+",   count: ageCounts["50+"]   }
      ], ["bar-green", "bar-green", "bar-green", "bar-gold"]);
    }

    /* Question 6b — search invoices and display results + log to console */
    function searchInvoices(forceTRN) {
      var trn = (forceTRN !== undefined)
        ? forceTRN
        : document.getElementById("invoice-search-trn").value.trim();

      ShowInvoices(trn); // logs to console as required

      var all     = JSON.parse(localStorage.getItem("AllInvoices")) || [];
      var results = trn === "" ? all : all.filter(function(inv) { return inv.trn === trn; });
      renderInvoiceTable(results, "invoice-results");
    }

    /* Question 6c — get user invoices and display + log to console */
    function loadUserInvoices() {
      var trn = document.getElementById("user-invoice-trn").value.trim();
      GetUserInvoices(trn); // logs to console as required

      var user = findUserByTRN(trn);
      if (!user) {
        document.getElementById("user-invoice-results").innerHTML =
          '<p class="no-data">No user found with TRN: ' + trn + '</p>';
        return;
      }
      renderInvoiceTable(user.invoices || [], "user-invoice-results");
    }

    /* Render array of invoices as a styled table */
    function renderInvoiceTable(invoices, containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      if (!invoices || invoices.length === 0) {
        container.innerHTML = '<p class="no-data">No invoices found.</p>';
        return;
      }

      var rows = "";
      for (var i = 0; i < invoices.length; i++) {
        var inv = invoices[i];
        rows +=
          '<tr>' +
            '<td><span class="inv-badge">' + inv.invoiceNumber + '</span></td>' +
            '<td>' + inv.date + '</td>' +
            '<td>' + inv.trn  + '</td>' +
            '<td>' + inv.name + '</td>' +
            '<td>JMD $' + Math.round(Number(inv.total)).toLocaleString() + '</td>' +
          '</tr>';
      }

      container.innerHTML =
        '<table class="inv-table">' +
          '<thead><tr>' +
            '<th>Invoice #</th><th>Date</th><th>TRN</th><th>Name</th><th>Total</th>' +
          '</tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>';
    }

    /* Init on load */
    document.addEventListener("DOMContentLoaded", function() {
      loadStats();
      ShowUserFrequency();
    });


// ─── Question 2c. Validation Helpers — shared across all forms ───────────────

// Question 2c. showError — inject a red error message below a form field and highlight its border
// Takes the field's id and a message string; appends a .error-msg span inside the field's parent
function showError(fieldId, message) {
  var field = document.getElementById(fieldId);
  if (!field) return;
  if (message.trim() !== "") {
    var err       = document.createElement("span");
    err.className   = "error-msg";
    err.textContent = message;
    field.parentNode.appendChild(err);
  }
  field.style.borderColor = "#c0392b"; // Red border to flag the invalid field
}

// Question 2c. clearErrors — remove all error messages and reset field border colours
// Uses querySelectorAll to find every .error-msg span and every input/select on the page
function clearErrors() {
  var errors = document.querySelectorAll(".error-msg");
  for (var i = 0; i < errors.length; i++) { errors[i].remove(); }
  var inputs = document.querySelectorAll("input, select");
  for (var i = 0; i < inputs.length; i++) { inputs[i].style.borderColor = ""; }
}

// Question 2c. isValidEmail — check that an email address matches the required format
// Uses a regular expression to verify the pattern: characters @ characters . characters
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
