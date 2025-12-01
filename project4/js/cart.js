// localStorage key: "blissfulCart"

function getCart() { //looks for key
  const cartJson = localStorage.getItem("blissfulCart");// turns Json String into array
  return cartJson ? JSON.parse(cartJson) : []; //array returned using parse or empty so code doesnt break
}

function saveCart(cart) { 
  localStorage.setItem("blissfulCart", JSON.stringify(cart));//saves cart array to local storage as Json string
}

// Attach handlers on pages that have add-to-cart buttons or cart elements
document.addEventListener("DOMContentLoaded", function () { //waits till content is loaded before filling cart 

  /*MENU PAGE: Add-to-cart buttons */

  const addButtons = document.querySelectorAll(".add-to-cart"); //find add to cart buttons on page
  const cartMessage = document.getElementById("cart-message");

  if (addButtons.length > 0) {
    addButtons.forEach(button => {
      button.addEventListener("click", function () { //listen for add to cart button to be clicked
        const name = this.dataset.item;           // reads data from button like lemon tart
        const price = parseFloat(this.dataset.price); // reads price of data item

        let cart = getCart(); //pulls items and price to cart

        // Check if item already in cart, then bump quantity
        const existing = cart.find(item => item.name === name);
        if (existing) {
          existing.quantity += 1; //if theres already one in cart, it bumps quantity to 2 etc.
        } else {
          cart.push({
            name: name,
            price: price,
            quantity: 1 //otherwise it leaves quantity at 1.
          });
        }

        saveCart(cart);// stores everything 

        // Visual message on the menu page of what was added to the cart.
        if (cartMessage) {
          cartMessage.textContent = `Added "${name}" to your cart.`;

          // Optional real popup:
          // alert(`Added "${name}" to your cart.`);

          setTimeout(() => {
            cartMessage.textContent = "";
          }, 4000); //message popup lasts 4 seconds
        }
      });
    });
  }

  /* CART - populate table and buttons (elements in cart that js needs to control) */

  const cartTableBody = document.getElementById("cart-body");
  const cartTotalCell = document.getElementById("cart-total");
  const clearCartButton = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout-btn");

  // checkout button logic
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () { //if the checkout button is clicked, load checkout.html page
      window.location.href = "checkout.html";
    });
  }

  // Only build the cart table on pages that have it
  if (cartTableBody && cartTotalCell) {
    const cart = getCart();
    cartTableBody.innerHTML = ""; //checks if tb and a td are on the page to make sure its the right place.

    let total = 0; // start calculator at 0

    if (cart.length === 0) { //no items in cart/array - build the single table row (empty cart)
      const row = document.createElement("tr"); //makes the table row
      const cell = document.createElement("td"); //makes one table cell
      cell.colSpan = 3; //one cell stretch all 3 columns
      cell.textContent = "Your cart is empty.";
      row.appendChild(cell);
      cartTableBody.appendChild(row); //these attach the table to the id cart-body

      // Disable checkout if cart is empty
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
      }

    } else {
      cart.forEach(item => { //starts loop through cart items to get a table row
        const row = document.createElement("tr"); //creates the new row(s) as needed

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        row.appendChild(nameCell); //makes td and fills it w item name

        const qtyCell = document.createElement("td");
        qtyCell.textContent = item.quantity;
        row.appendChild(qtyCell); // displays how many of that item user wants

        const priceCell = document.createElement("td");
        const lineTotal = item.price * item.quantity; //price of one item x the amt of that item desired
        priceCell.textContent = `$${lineTotal.toFixed(2)}`; //that row cost added to fixed amt, used template literal (a string inside backticks)
        row.appendChild(priceCell); //result price cell added

        total += lineTotal; //total is the total plus the line total, adds all item totals onto the final cart total
        cartTableBody.appendChild(row); //shows the row for the cart-body id
      });

      // Enable checkout if there are items
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
      }
    }

    cartTotalCell.textContent = `$${total.toFixed(2)}`; //displays grand total 
  }

  // Clear cart button (works on cart or checkout pages)
  if (clearCartButton) {
    clearCartButton.addEventListener("click", function () {
      localStorage.removeItem("blissfulCart");
      window.location.reload();
    });
  }

  /* CHECKOUT for order summary */

  const checkoutSummary = document.getElementById("checkout-summary");

  if (checkoutSummary) { //checkout summary is only pulled from pages that have that, like not from main or gallery
    const cart = getCart(); //gets carts array from local storage

    if (cart.length === 0) {
      checkoutSummary.textContent = "Your cart is empty. Please add items from the menu first.";
      return;
    }

    let total = 0;
    const list = document.createElement("ul"); //make list of items in cart

    cart.forEach(item => { //go thrjough whats been added to the cart (the array)
      const li = document.createElement("li"); // makes li row for ea item
      const lineTotal = item.price * item.quantity; //make the math for multiply any items by quantity chosen
      li.textContent = `${item.quantity} × ${item.name} - $${lineTotal.toFixed(2)}`; //do the math (3 lemon tarts cost $54)
      list.appendChild(li);//add that list item (3 lemon terts) to the list
      total += lineTotal; //adds all items to 0.
    });

    const totalP = document.createElement("p"); // p for final total
    totalP.innerHTML = `<strong>Estimated total:</strong> $${total.toFixed(2)}`; //display final price boldly inside p

    checkoutSummary.innerHTML = ""; //clear out old content
    checkoutSummary.appendChild(list);//add item list
    checkoutSummary.appendChild(totalP);//total below list
  }

});
