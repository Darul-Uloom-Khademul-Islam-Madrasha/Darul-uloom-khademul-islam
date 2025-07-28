exports.handler = async () => {
  const fetch = (await import("node-fetch")).default;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam"; // Replace this
  const FILE_PATH = "user.json"; // Replace if named differently

  try {
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    const fileData = await fileRes.json();
    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    const users = JSON.parse(content);

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};