exports.handler = async (event) => {
  const fetch = (await import('node-fetch')).default;

  try {
    const { quote__header, quote__lead, quote__text, quote__ref } = JSON.parse(event.body);
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = 'Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam';
    const FILE_PATH = 'data.json';

    // 1. Get current file SHA
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });

    if (!fileRes.ok) throw new Error(`GitHub API error: ${await fileRes.text()}`);
    const fileData = await fileRes.json();

    // 2. Prepare new content
    const newContent = {
      quote__header,
      quote__lead,
      quote__text,
      quote__ref
    };

    const base64Content = Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64');

    // 3. Update file
    const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Updated via Netlify Function',
        content: base64Content,
        sha: fileData.sha,
      }),
    });

    if (!updateRes.ok) throw new Error(`GitHub update error: ${await updateRes.text()}`);
    return { statusCode: 200, body: '✅ Successfully updated data.json!' };

  } catch (error) {
    return { statusCode: 500, body: `❌ Error: ${error.message}` };
  }
};




