// USER REGISTRATION

const form = document.getElementById("signUp");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: document.getElementById("regEmail").value,
    password: document.getElementById("regPassword").value,
    repassword: document.getElementById("regRePassword").value,
    role: document.getElementById("describe").value,
    opinion: document.getElementById("opinion").value,
  };

  if (data.password !== data.repassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch("/.netlify/functions/saveUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.message);
  } catch (err) {
    alert("Error saving user!");
    console.error(err);
  }
});