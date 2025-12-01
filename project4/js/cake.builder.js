// cake.builder.js

document.addEventListener("DOMContentLoaded", function () { //DOM loaded before js
  const buildBtn = document.getElementById("build-cake");
  const hiddenAddBtn = document.getElementById("hidden-add-cake-cart");
  const overlay = document.getElementById("cake-review-overlay");
  const reviewText = document.getElementById("cake-review-text");
  const confirmBtn = document.getElementById("confirm-cake");
  const editBtn = document.getElementById("edit-cake");
  const messageEl = document.getElementById("cake-message");//attach js to specific elements needing to be controlled

  if (!buildBtn || !hiddenAddBtn || !overlay || !reviewText) {
    return; // if essential elements are missing, dont run js
  }

  // Changeable Prices
  const basePrices = {
    "6 inch": 40,
    "8 inch": 55,
    "10 inch": 75
  };

  const fillingFeePerCake = 10;  // flat fee if they choose any filling instead of frosting filling inside

  const frostingFees = {
    "Italian meringue": 5,
    "American buttercream": 0
  }; //frosting fee for italian choice

  // review my cake button
  buildBtn.addEventListener("click", function (event) {
    event.preventDefault(); //instead of reloading the page, it allows user to bring up the review box

    // Grab selections
    const sizeInput = document.querySelector('input[name="size"]:checked');
    const flavorInput = document.querySelector('input[name="flavor"]:checked');
    const fillingInputs = document.querySelectorAll(
      'input[name="filling"]:checked'
    );
    const frostingInputs = document.querySelectorAll(
      'input[name="frosting"]:checked'
    ); //reads user selections

    // require at least size + flavor
    if (!sizeInput || !flavorInput) {
      alert("Please choose a cake size and flavor before reviewing your cake.");
      return;
    }
//Turns Nodelist into real arrays... joins options into easily readable data
    const size = sizeInput.value;      // "6 inch", "8 inch", "10 inch"
    const flavor = flavorInput.value;

    const fillingsArray = Array.from(fillingInputs).map((el) => el.value);
    const frostingsArray = Array.from(frostingInputs).map((el) => el.value);

    const fillings = fillingsArray.join(", ");
    const frostings = frostingsArray.join(", ");

    // Pricing
    const basePrice = basePrices[size] || 65; // fallback just in case

    // Fillings: flat fee if they chose at least one
    const hasFillings = fillingInputs.length > 0;
    const fillingsFee = hasFillings ? fillingFeePerCake : 0;

    // Frosting: add cost if Italian meringue is chosen
    let frostingFee = 0;
    if (frostingsArray.includes("Italian meringue")) {
      frostingFee += frostingFees["Italian meringue"];
    }

    const estimatedTotal = basePrice + fillingsFee + frostingFee; //math based on cake siz, if fillings, and if italian frosting to get final tag

    // Description string for the cart item
    const description =
      size +
      " " +
      flavor +
      (fillings ? " with " + fillings + " filling" : "") +
      (frostings ? " and " + frostings + " frosting" : "");// created readable summary text for choices to cart

    // Update hidden button for cart.js
    hiddenAddBtn.dataset.item = description;
    hiddenAddBtn.dataset.price = estimatedTotal.toFixed(2); //sends cake description to cart.js (hidden button)

    // review content
    const reviewHtml = `
      <ul>
        <li>You chose a <strong>${size}</strong> cake.</li>
        <li>The flavor selected is <strong>${flavor}</strong>.</li>
        <li>Filling choice(s): <strong>${fillings || "None selected"}</strong>.</li>
        <li>Frosted with: <strong>${frostings || "No frosting selected"}</strong>.</li>
      </ul>

      <p class="estimate-line">
        <strong>Estimated total: $${estimatedTotal.toFixed(2)}</strong>
      </p>
    `; //needed review to look nicer, this did that. 

    reviewText.innerHTML = reviewHtml;
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
  }); //makes the popup styled and have a nice list format with total. 

  // "Confirm btn...Yes, add to cart"
  confirmBtn.addEventListener("click", function () {
    hiddenAddBtn.click(); // triggers normal cart.js behavior
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");

    if (messageEl) {
      messageEl.textContent =
        "Your custom cake has been added to the cart as a sample item.";
    }
  });

  // "No, keep editing"
  editBtn.addEventListener("click", function () {
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
  });
});//hides pop up to edit choices.
