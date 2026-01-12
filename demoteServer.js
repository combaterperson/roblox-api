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

app.post("/api/demote", async (req, res) => {
    const { apiKey, userId, groupId } = req.body;

    if (apiKey !== SECRET_KEY) {
        return res.status(403).json({ success: false, message: "Invalid API key" });
    }

    try {
        const currentRank = await noblox.getRankInGroup(groupId, userId);

        const newRank = currentRank > 0 ? currentRank - 1 : 0;

        const result = await noblox.setRank(groupId, userId, newRank);
        console.log(`Demoted user ${userId} in group ${groupId} from rank ${currentRank} to ${newRank}`);

        return res.json({
            success: true,
            message: `User ${userId} demoted from rank ${currentRank} to ${newRank}`,
            result: result
        });
    } catch (err) {
        console.error("Failed to set rank:", err);

        let userMessage = "Unknown error occurred";

        if (err.message.includes("401") || err.message.toLowerCase().includes("unauthorized")) {
            userMessage = "Bot cookie is invalid or does not have permission";
        } else if (err.message.toLowerCase().includes("user not found") || err.message.toLowerCase().includes("not in group")) {
            userMessage = "Target user does not exist or is not in the group";
        } else if (err.message.toLowerCase().includes("role does not exist")) {
            userMessage = "The rankId provided is invalid (must be a Role ID, not a rank number)";
        } else if (err.message.toLowerCase().includes("cannot set rank")) {
            userMessage = "Bot does not have permission to set this rank (bot must outrank target role)";
        }

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Demote server running on port ${PORT}`);
});
