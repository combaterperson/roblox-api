const express = require("express");
const bodyParser = require("body-parser");
const noblox = require("noblox.js");

const app = express();
app.use(bodyParser.json());


const SECRET_KEY = "JK2hu2jbwu2UJK12IGU_s";


(async () => {
    try {
        await noblox.setCookie(process.env.ROBLOX_COOKIE);
        console.log("Logged into Roblox successfully!");
    } catch (err) {
        console.error("Failed to login:", err);
    }
})();


app.post("/api/promote", async (req, res) => {
    const { apiKey, userId, groupId } = req.body;

    if (apiKey !== SECRET_KEY) {
        return res.status(403).json({ success: false, message: "Invalid API key" });
    }

    try {
        const currentRank = await noblox.getRankInGroup(groupId, userId);
        const newRank = currentRank + 1; // promote by 1
        const result = await noblox.setRank(groupId, userId, newRank);

        console.log(`Promoted user ${userId} in group ${groupId} to rank ${newRank}`);

        return res.json({ success: true, newRank, result });
    } catch (err) {
        console.error("Failed to promote:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3001; // can use a different port from your setRank server
app.listen(PORT, () => {
    console.log(`Promote server running on port ${PORT}`);
});
