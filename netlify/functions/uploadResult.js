exports.handler = async (event) => {
  try {
    const { fileName, content } = JSON.parse(event.body);

    const response = await fetch(
      `https://api.github.com/repos/Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam/contents/public/results/${fileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload result file ${fileName}`,
          content: content,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "GitHub upload failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data,
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