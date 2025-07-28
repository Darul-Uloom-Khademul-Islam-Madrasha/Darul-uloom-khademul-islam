const fs = require("fs");
const path = require("path");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    const filePath = path.join(__dirname, "../../users.json");

    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No users registered yet!" }),
      };
    }

    const users = JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");

    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Login successful!", email }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid email or password" }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error", error: err.message }),
    };
  }
};
