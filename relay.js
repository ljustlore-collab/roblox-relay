const express = require("express");
const app = express();

app.use(express.json());

const SECRET = process.env.ROBLOX_SECRET;

// Queue stored in memory
let banQueue = [];

// Root endpoint for quick health check
app.get("/", (req, res) => {
  res.send("✅ Roblox relay server is running");
});

app.post("/ban", (req, res) => {
  const { secret, userId, reason } = req.body;

  if (secret !== SECRET) {
    return res.status(401).send("Unauthorized");
  }

  if (!/^\d+$/.test(userId)) {
    return res.status(400).send("Invalid userId");
  }

  banQueue.push({
    userId,
    reason: reason || "No reason",
    time: Date.now(),
  });

  res.send("Queued");
});

app.get("/bans", (req, res) => {
  if (req.query.secret !== SECRET) {
    return res.status(401).send("Unauthorized");
  }

  res.json(banQueue.splice(0, banQueue.length));
});

// Render provides PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Relay running on port ${PORT}`));
