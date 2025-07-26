exports.handler = async (event) => {
  const fetch = (await import('node-fetch')).default; // ✅ fixed

  // Parse form data
  const { quote__header, quote__lead, quote__text, quote__ref } = JSON.parse(event.body);
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam';
  const FILE_PATH = 'data.json';

  try {
    // 1. Get current file SHA
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });
    const fileData = await fileRes.json();

    // 2. Update the file via GitHub API
    await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update JSON via Netlify Function',
        content: Buffer.from(
          JSON.stringify({ quote__header, quote__lead, quote__text, quote__ref }, null, 2)
        ).toString('base64'),
        sha: fileData.sha,
      }),
    });

    return { statusCode: 200, body: '✅ JSON updated on GitHub!' };
  } catch (error) {
    return { statusCode: 500, body: '❌ Error: ' + error.message };
  }
};

