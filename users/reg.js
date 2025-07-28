document.getElementById("signUp").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const rePassword = document.getElementById("regRePassword").value.trim();
  const role = document.getElementById("describe").value;
  const opinion = document.getElementById("opinion").value.trim();

  if (!name || !email || !password || !rePassword) {
    alert("❌ Please fill in all required fields.");
    return;
  }

  if (password !== rePassword) {
    alert("❌ Passwords do not match!");
    return;
  }

  const userData = { name, email, password, role, opinion };

  try {
    const res = await fetch("/.netlify/functions/registerUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Registration successful!");
      document.getElementById("signUp").reset();
    } else {
      alert("❌ Registration failed!");
    }
  } catch (error) {
    console.error("Registration Error:", error);
    alert("❌ Something went wrong!");
  }
  
});
