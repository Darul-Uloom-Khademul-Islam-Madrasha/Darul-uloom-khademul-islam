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
  const GITHUB_REPO = "Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam";
  const GITHUB_FILE_PATH = "users.json";

  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw", // Should return raw JSON
      },
    });

    let users;

    if (res.headers.get("content-type").includes("application/json")) {
      // If we still got a base64 response
      const data = await res.json();
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      users = JSON.parse(content);
    } else {
      // If we got raw JSON
      users = await res.json();
    }

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
