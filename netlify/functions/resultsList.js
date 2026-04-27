const { log } = require("console");
const fs = require("fs");
const path = require("path");


exports.handler = async (event, context) => {
  try {
    // Path to your results folder (relative to function location)
    //const folderPath = path.join(__dirname, "../../results");

   const projectRoot = process.cwd();
   const resultsFolder = path.join(projectRoot, 'results');
    const files = fs.readdirSync(resultsFolder);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow browser access
      },
      body: JSON.stringify({ files: files }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
