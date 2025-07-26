exports.handler = async (event) => {
  const fetch = (await import('node-fetch')).default;

  if (!event.body) {
    return { statusCode: 400, body: '❌ Missing request body' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return { statusCode: 400, body: '❌ Invalid JSON: ' + error.message };
  }

  const { quote__header, quote__lead, quote__text, quote__ref } = data;

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam';
  const FILE_PATH = 'data.json';

  let sha = null;
  try {
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
    });
    const fileData = await fileRes.json();
    sha = fileData.sha;
  } catch {
    // file might not exist yet — so no sha
  }

  const body = {
    message: 'Update JSON via Netlify Function',
    content: Buffer.from(
      JSON.stringify({ quote__header, quote__lead, quote__text, quote__ref }, null, 2)
    ).toString('base64'),
    branch: 'main', // add branch explicitly
  };
  if (sha) {
    body.sha = sha; // add sha only if updating existing file
  }

  try {
    const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (updateRes.ok) {
      return { statusCode: 200, body: '✅ JSON updated on GitHub!' };
    } else {
      const errorText = await updateRes.text();
      return { statusCode: 500, body: '❌ GitHub API error: ' + errorText };
    }
  } catch (error) {
    return { statusCode: 500, body: '❌ Error: ' + error.message };
  }
};


