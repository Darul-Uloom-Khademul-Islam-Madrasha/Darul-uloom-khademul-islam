exports.handler = async (event) => {
  const fetch = (await import("node-fetch")).default;

  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO =
      "Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam";
    const FILE_PATH = "users.json";
    const BRANCH = "main";

    if (!GITHUB_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "GitHub token is missing in environment variables.",
        }),
      };
    }

    const newUser = JSON.parse(event.body);

    // 1. Get the SHA and content of users.json
    const fileRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "NetlifyFunction",
        },
      }
    );

    if (!fileRes.ok)
      throw new Error(`GitHub API error: ${await fileRes.text()}`);
    const fileData = await fileRes.json();

    // Decode existing users.json
    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    const users = JSON.parse(content);

    // 2. Add the new user
    users.push(newUser);

    // 3. Encode updated content
    const updatedContent = Buffer.from(JSON.stringify(users, null, 2)).toString(
      "base64"
    );

    // 4. Commit back to GitHub
    const updateRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add new user: ${newUser.name}`,
          content: updatedContent,
          sha: fileData.sha,
          branch: BRANCH,
        }),
      }
    );

    if (!updateRes.ok)
      throw new Error(`GitHub update error: ${await updateRes.text()}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "✅ User registered successfully!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `❌ Error: ${
        error && error.message ? error.message : String(error)
      }`,
    };
  }
};
