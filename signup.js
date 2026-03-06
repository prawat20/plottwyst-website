const form = document.getElementById("signup-form");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;

  try {

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyrwky0s3PgFGkdXompqR_b4lI7d2Bnl7rWPaoJRQTFyvD18LSQR7j5Jgunb943Z6I/exec",
      {
        method: "POST",
        body: new URLSearchParams({
          email: email
        })
      }
    );

    alert("✅ You're on the PlotTwyst waitlist!");
    form.reset();

  } catch (error) {

    alert("❌ Something went wrong. Please try again.");

  }

});
