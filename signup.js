const form = document.getElementById("signup-form");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;

  try {

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzEBB-zKBRPyli3-v3PemLfQcyR11Dr8I5FEd5yr5uy93SxsVGGHw37jEPUy77xexI/exec",
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
