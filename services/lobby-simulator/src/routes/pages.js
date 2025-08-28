const express = require("express");
const router = express.Router();

router.get(["/", "/signin", "/member", "/setting", "/ow", "/login", "/direct"], function (req, res) {
    res.render("index", { title: "Game Lobby Simulator" });
});

router.get(["/health"], function (req, res) {
    return res.send("Health check is ok");
});

module.exports = router;
