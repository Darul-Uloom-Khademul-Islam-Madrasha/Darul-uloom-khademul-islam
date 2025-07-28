const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Only POST allowed" }),
    };
  }

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email and password required" }),
    };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO = process.env.GITHUB_REPO; // e.g., "your-username/Darul-uloom-khademul-islam"
  const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || "users.json";

  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (!res.ok) {
      throw new Error("❌ Failed to fetch users.json from GitHub.");
    }

    const users = await res.json();

    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "✅ Login successful!",
          email: foundUser.email,
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "❌ Invalid email or password." }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "❌ Internal error",
        error: err.message,
      }),
    };
  }
};