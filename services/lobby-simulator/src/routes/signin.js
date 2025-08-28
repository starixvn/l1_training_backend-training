const express = require("express");
const router = express.Router();
const GameClient = require("l1.client.node-js")();
const axios = require("axios");
const config = require("../game-client-config.json");

router.post("/signin/sso", async (req, res) => {
    try {
        const gameId = req.body.gameId;
        const result = await GameClient.auth.singleSignOn(req.body);
        const url = new URL(result.redirectUrl);
        const token = url.searchParams.get("token");

        res.send({ token, redirectUrl: `${result.redirectUrl}&gameId=${gameId}` });
    } catch (error) {
        res.send({ error });
    }
});

router.post("/signin/verify", async (req, res) => {
    try {
        const result = await GameClient.auth.verifyToken(req.body);

        res.send(result);
    } catch (error) {
        res.send({ error });
    }
});

router.get("/signin/ip", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    res.send(ip);
});

router.get("/signin/to", async (req, res) => {
    try {
        const DEFAULT_BALANCE = 20000;
        const randomPlayerId = Math.floor(Math.random() * 9000000) + 1000000; // Generate 7-digit random number
        const appType = 1;
        // Get gameId from query params, checking both cases
        const gameId = req.query.gameId || req.query.gameid;

        if (!gameId) {
            return res.status(400).send({ error: "gameId is required" });
        }

        // Validate gameId is a number
        if (isNaN(gameId)) {
            return res.status(400).send({ error: "gameId must be a number" });
        }

        // Set default balance before proceeding
        try {
            const params = new URLSearchParams({
                playerId: randomPlayerId,
                operator: "ow",
                balance: DEFAULT_BALANCE,
                systemType: config.systemType,
                username: `username_${randomPlayerId}`,
                currency: "$US",
                siteId: "4100300"
            });

            await axios.post(`${config.owUrl}/SetDefaultBalance?${params.toString()}`);
        } catch (balanceError) {
            console.error("Failed to set default balance:", balanceError);
            // Continue with sign-in even if balance setting fails
        }

        const ssoParams = {
            playerId: randomPlayerId.toString(),
            playerName: `username_${randomPlayerId}`,
            language: "en-US",
            currency: "$US",
            seq: "d,y,lumi",
            siteId: "4100300",
            siteName: "lumi",
            ip: "202.78.231.34, 10.254.5.203",
            browserUserAgent: req.headers["user-agent"],
            auth: { operatorId: "ONEworks1", operatorSecret: "ONEworks1@20luminet&" },
            gameId: gameId,
            domain: "example.com",
            appType: appType,
            isCash: true,
            partner: "1W",
            disableJackpotGames: false,
            expandAdvanceSetting: false,
            devIp: null,
            operatorToken: "ONEworks1Token",
            ref: "m_direct",
            returnUrl: "",
            disableAward: false
        };

        const result = await GameClient.auth.singleSignOn(ssoParams);

        // Remove existing gameId parameter if present and append new one
        const baseUrl = result.redirectUrl.replace(/[?&]gameId=[^&]+/gi, "");
        const separator = baseUrl.includes("?") ? "&" : "?";
        const redirectUrl = `${baseUrl}${separator}gameId=${gameId}`;

        res.redirect(redirectUrl + `&ref=m_direct&op=sp&cg=GrUSD&appType=${appType}`);
    } catch (error) {
        res.send({ error });
    }
});

module.exports = router;
