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


app.post("/api/setRank", async (req, res) => {
    const { apiKey, userId, Rank, Group } = req.body;

    if (key !== SECRET_KEY) {
        return res.status(403).json({ success: false, message: "Invalid API key" });
    }

    const targetGroupId = Group;

    try {
        const result = await noblox.setRank(targetGroupId, userId, rankId);
        console.log(`Set user ${userId} in group ${targetGroupId} to rank ${Rank}`);
        return res.json({
            success: true,
            message: `Rank updated for user ${userId}`,
            result: result
        });
    } catch (err) {
        console.error("Failed to set rank:", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
