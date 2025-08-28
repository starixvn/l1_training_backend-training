const express = require("express");
const router = express.Router();
const fs = require("fs");
const GameClient = require("l1.client.node-js")();

router.get("/setting/data", async (req, res) => {
  const config = await fs.readFileSync("src/game-client-config.json");
  res.send({ ...JSON.parse(config), expireIn: GameClient.config.expired });
});

router.post("/setting/data", async (req, res) => {
  try {
    await fs.writeFileSync(
      "src/game-client-config.json",
      JSON.stringify(req.body, null, 2)
    );

    res.send(req.body);
  } catch (error) {
    res.send({ error });
  }
});

module.exports = router;
