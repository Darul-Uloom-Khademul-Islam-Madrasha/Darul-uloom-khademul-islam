// USER LOGIN

document.getElementById("profileForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  

  try {
    const res = await fetch("/.netlify/functions/loginUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Login successful! Welcome " + data.email);
    } else {
      alert("❌ Login failed: " + data.message);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("❌ Something went wrong during login.");
  }
});