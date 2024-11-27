const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Route
app.post("/api/getLiveChatId", async (req, res) => {
  const { streamId, apiKey } = req.body;

  if (!streamId || !apiKey) {
    return res
      .status(400)
      .json({ error: "Stream ID and API Key are required." });
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${streamId}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const liveChatId =
      response.data?.items[0]?.liveStreamingDetails?.activeLiveChatId;

    if (!liveChatId) {
      return res.status(404).json({ error: "Active Live Chat ID not found." });
    }

    res.json({ activeLiveChatId: liveChatId });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "An error occurred while fetching data.",
        details: error.message,
      });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
