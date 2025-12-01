// Contact page

function validateForm(event) {
  let errors = []; //creates the validate form function, empty array for errors if we need them 

  // Required fields
  const firstName = document.getElementById("firstName").value.trim();
  const email = document.getElementById("email").value.trim();
  const allergyChoice = document.querySelector('input[name="allergy"]:checked');
  const comments = document.getElementById("comments").value.trim();// these collect the values from the form

  // REQUIRED: first name and email
  if (!firstName) errors.push("Please enter your first name.");
  if (!email) errors.push("Please enter your email address."); //if first name or email are empty, the errors pop up

  // allergy selection (radio)
  if (!allergyChoice) {
    errors.push("Please let us know if you have allergies.");
  } else if (allergyChoice.value !== "No" && !comments) {
    // Allergy YES or Sensitivity than require more information:
    errors.push(
      "Please provide allergy details so we can bake safely."
    );
  }

  // If errors, show them & stop submission
  if (errors.length > 0) {
    event.preventDefault();
    alert(errors.join("\n")); //show alert errors 
    return false;
  }

  // Thanks mesage
  event.preventDefault(); // Pause mailto so users see thank-you message

  document.body.innerHTML = `
    <main style="text-align: center; margin-top: 4rem;">
      <h1>Thank you for contacting Blissful Bakes!</h1>
      <p>We’ve received your message and will reply soon.</p>
      <p><a href="index.html">Return to homepage</a></p>
    </main>
  `;//wipes screen to show ty message

  // Allow mailto to fire after brief delay
  setTimeout(() => {
    document.getElementById("registrationForm").submit();
  }, 250);
}
