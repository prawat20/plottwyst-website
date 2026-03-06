const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrwky0s3PgFGkdXompqR_b4lI7d2Bnl7rWPaoJRQTFyvD18LSQR7j5Jgunb943Z6I/exec";

async function sendEmail(email) {

  try {

    await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    alert("Thanks! You're on the beta waitlist 🎉");

  } catch (error) {

    alert("Something went wrong. Please try again.");

  }

}

document.querySelectorAll("form").forEach(form => {

  form.addEventListener("submit", async function(e) {

    e.preventDefault();

    const emailInput = form.querySelector("input[type='email']");

    const email = emailInput.value;

    if (!email) {
      alert("Please enter a valid email");
      return;
    }

    await sendEmail(email);

    form.reset();

  });

});
