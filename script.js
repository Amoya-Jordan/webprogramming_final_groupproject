// Auriva Essential Oils — External JavaScript
// Module: CIT2011 Web Programming | Final Group Project
// Members: Amoya Jordan - 2302539, Antwone Lamont -,Kyle Walker - 2403246, Victoria Wilson - 2207197

// 2 a. Product list using array of objects
var products = JSON.parse(localStorage.getItem("AllProducts")) || [
  { name: "Eucalyptus Oil",  price: 1200, description: "Refreshing and clearing oil.", image: "E_Oil.jpg" },
  { name: "Frankincense Oil", price: 1800, description: "Calming and grounding oil.", image: "F_Oil.jpg" },
  { name: "Lavender Oil", price: 1400, description: "Relaxing and soothing oil.", image: "L_Oil.jpg" },
  { name: "Lemongrass Oil", price: 1100, description: "Fresh citrus scent.", image: "LG_Oil.jpg" },
  { name: "Orange Oil", price: 1000, description: "Sweet uplifting aroma.", image: "O_Oil.jpg" },
  { name: "Peppermint Oil", price: 1300, description: "Cooling and energizing.", image: "P_Oil.jpg" },
  { name: "Rosemary Oil", price: 1250, description: "Herbal and stimulating.", image: "R_Oil.jpg" },
  { name: "Tea Tree Oil", price: 1350, description: "Purifying and cleansing.", image: "T_Oil.jpg" }
];

// Saving to localStorage
localStorage.setItem("AllProducts", JSON.stringify(products));

// Displaying products dynamically
function displayProducts() {
  var container = document.getElementById("product-grid");
  if (!container) return;

  container.innerHTML = "";

  for (var i = 0; i < products.length; i++) {
    var p = products[i];

    var div = document.createElement("div");
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



// CART — localStorage persistence across pages

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
    var item = cart[i];
    var itemPrice = item.isBundle ? item.price * 0.90 : item.price; // Arithmetic — 10% bundle discount
    var itemTotal = itemPrice * item.qty;
    subtotal += itemTotal;

    var div = document.createElement("div"); // DOM manipulation — create and inject cart item
    div.className = "cart-item";
    div.innerHTML =
      '<img src="Assets/images/' + item.image + '" alt="' + item.name + '" width="80" height="80">' +
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

// Question 1. User Authentication — Registration and Login using localStorage
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
    document.getElementById("reset-trn").value    = "";
    document.getElementById("reset-newpass").value = "";
    showToast("Password updated successfully. Please log in.");
  } else {
    showToast("No account found with that TRN.");
  }
}

// Question 6 a. Show User Frequency — analyse users by gender and age group
// Counts how many users fall into each category and displays the result
function showUserFrequency() {

  var users = getRegistrationData();

  var genderCount = {
    Male   : 0,
    Female : 0,
    Other  : 0
  };

  var ageGroups = {
    "18-25" : 0,
    "26-35" : 0,
    "36-50" : 0,
    "50+"   : 0
  };

  for (var i = 0; i < users.length; i++) {
    var user = users[i];

    // Counting Gender
    if (genderCount[user.gender] !== undefined) {
      genderCount[user.gender]++;
    }

    // Calculating Age
    var age = calculateAge(user.dateOfBirth);

    // Counting Age Groups
    if (age >= 18 && age <= 25) {
      ageGroups["18-25"]++;
    } else if (age <= 35) {
      ageGroups["26-35"]++;
    } else if (age <= 50) {
      ageGroups["36-50"]++;
    } else {
      ageGroups["50+"]++;
    }
  }

  //6 a. iii) Displaying Results
  var container = document.getElementById("user-frequency");
  if (!container) return;

  container.innerHTML =
    "<h3>User Frequency</h3>" +
    "<p><strong>Gender:</strong></p>" +
    "<p>Male: " + genderCount.Male + "</p>" +
    "<p>Female: " + genderCount.Female + "</p>" +
    "<p>Other: " + genderCount.Other + "</p>" +
    "<p><strong>Age Groups:</strong></p>" +
    "<p>18-25: " + ageGroups["18-25"] + "</p>" +
    "<p>26-35: " + ageGroups["26-35"] + "</p>" +
    "<p>36-50: " + ageGroups["36-50"] + "</p>" +
    "<p>50+: " + ageGroups["50+"] + "</p>";
}



// Question 2b. Event Handling — DOMContentLoaded listener
// Attach all form submit handlers after the page has fully loaded

document.addEventListener("DOMContentLoaded", function() {

  ///calling display function
  if (document.getElementById("product-grid")) {
     displayProducts();
 }

  if (document.getElementById("cart-items")) {
    updateCart(); // Initialise cart display on cart page
  }

// User Frequency — run if container exists
  if (document.getElementById("user-frequency")) {
    showUserFrequency();
  }

  // Question 1b. Login Page — validate TRN and password against RegistrationData in localStorage
  // Give the visitor 3 attempts; redirect to locked.html if all attempts are exhausted
  var loginForm = document.getElementById("login-form");
  if (loginForm) {

    var loginAttempts = parseInt(sessionStorage.getItem("loginAttempts")) || 0;
    var MAX_ATTEMPTS  = 3;

    // Question 1b(vi). Show or hide the Reset Password panel when the link is clicked
    // Toggle the display property of #reset-panel between block and none
    var resetLink = document.getElementById("reset-password-link");
    if (resetLink) {
      resetLink.addEventListener("click", function(e) {
        e.preventDefault();
        var panel = document.getElementById("reset-panel");
        panel.style.display = (panel.style.display === "none") ? "block" : "none";
      });
    }

    // Question 1b(ii). Validate the entered TRN and password against RegistrationData
    // Count failed attempts and redirect to locked.html after the third failed attempt
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
        sessionStorage.removeItem("loginAttempts");  // Reset attempt counter on success
        localStorage.setItem("loggedInTRN", trn);    // Store logged-in session
        showToast("Welcome back, " + user.firstName + "!");
        setTimeout(function() {
          window.location.href = "product.html";      // Q1b(iii) — redirect to product catalogue
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
  }

  // Question 1a. Registration Page — validate all fields and store a new user object in localStorage
  // Check: all fields filled, age 18+, TRN format (000-000-000), TRN unique, password min 8 chars
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

      // Question 1a(ii). Validate that all fields are filled using JavaScript error handling
      // Display an error message below any field that is left empty
      if (firstName === "") { showError("reg-firstname", "First name is required.");  valid = false; }
      if (lastName  === "") { showError("reg-lastname",  "Last name is required.");   valid = false; }

      // Question 1a(iv). Calculate the visitor's age and reject registration if under 18
      // Use calculateAge() with the entered date of birth to determine eligibility
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

      // Question 1a(v). Validate TRN format (000-000-000) and ensure it is unique in RegistrationData
      // TRN is used instead of a username for login — it must not already exist in the system
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

      // Question 1a(iii). Validate that the password is at least 8 characters long
      // Display an error below the password field if the requirement is not met
      if (password === "") {
        showError("reg-password", "Password is required.");
        valid = false;
      } else if (password.length < 8) {
        showError("reg-password", "Password must be at least 8 characters.");
        valid = false;
      }

      // Question 1a(vi). Build the user object and append it to the RegistrationData array in localStorage
      // Store firstName, lastName, dateOfBirth, gender, phone, email, trn, password, dateOfRegistration, cart{}, invoices[]
      if (valid) {
        var newUser = {
          firstName         : firstName,
          lastName          : lastName,
          dateOfBirth       : dob,
          gender            : gender,
          phone             : phone,
          email             : email,
          trn               : trn,
          password          : password,
          dateOfRegistration: new Date().toISOString(),
          cart              : {},  // Empty cart object
          invoices          : []   // Empty invoices array
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
  }

  // Question 2c. Checkout Form — validate shipping details before generating an invoice
  // Ensure name, address, phone, and payment amount are all provided and valid
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
        showError("co-amount", "Enter a valid payment amount."); valid = false;
      }
      if (valid) {
        showToast("Order confirmed! Thank you for shopping with Auriva.");
        clearCart();
        checkoutForm.reset();
      }
    });
  }

});


// Question 2c. Validation Helpers — shared functions used across all forms


// Question 2c. showError — inject a red error message below a form field and highlight its border
// Takes the field's id and a message string; appends a .error-msg span inside the field's parent
function showError(fieldId, message) {
  var field = document.getElementById(fieldId);
  if (!field) return;
  if (message.trim() !== "") {
    var err = document.createElement("span");
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

// Question 2c. isValidEmail — check that an email address contains the correct format
// Uses a regular expression to verify the pattern: characters @ characters . characters
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
