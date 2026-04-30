exports.handler = async (event) => {
  try {
    const { fileName } = JSON.parse(event.body);

    const repo = "Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam";
    const filePath = `public/results/${fileName}`;

    const token = process.env.GITHUB_TOKEN;

    // 1. Get file info (to get SHA)
    const fileRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const fileData = await fileRes.json();

    if (!fileRes.ok) {
      throw new Error(fileData.message || "File not found");
    }

    const sha = fileData.sha;

    // 2. Delete file
    const deleteRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: `Delete result file ${fileName}`,
          sha: sha,
        }),
      }
    );

    const result = await deleteRes.json();

    if (!deleteRes.ok) {
      throw new Error(result.message || "Delete failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "File deleted",
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};