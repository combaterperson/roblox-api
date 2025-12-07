const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());


const SECRET_KEY = "JK2hu2jbwu2UJK12IGU_s";

app.post('/api/setRank', (req, res) => {
    const { apiKey, userId, groupId, rank } = req.body;

    if (apiKey !== SECRET_KEY) {
        return res.status(403).json({ success: false, message: "Invalid API key" });
    }

    console.log(`Request received: Set user ${userId} in group ${groupId} to rank ${rank}`);

    res.json({
        success: true,
        message: `Rank change request received for user ${userId}`
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoint available at http://localhost:${PORT}/api/setRank`);
});