const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const user = JSON.parse(event.body);
    const filePath = path.join(__dirname, 'users.json');

    let users = [];

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      users = JSON.parse(fileData);
    }

    users.push({
      email: user.email,
      password: user.password, // 🔐 Normally you would hash this!
      role: user.role,
      opinion: user.opinion,
      date: new Date().toISOString(),
    });

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User saved successfully!' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to save user', error: err.message }),
    };
  }
};
