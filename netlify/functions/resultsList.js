exports.handler = async () => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/Darul-Uloom-Khademul-Islam-Madrasha/Darul-uloom-khademul-islam/contents/public/results",
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub files");
    }

    const data = await response.json();

    const files = data
      .filter(file => file.name.endsWith(".xlsx"))
      .map(file => file.name)
      .sort((a, b) => b.localeCompare(a));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ files }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};