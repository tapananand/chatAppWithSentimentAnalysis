const Pusher = require('pusher');
const express = require("express");
const next = require("next");
const bodyParser = require('body-parser');
const Sentiment = require("sentiment");

require("dotenv").config();

const isDev = process.env.NODE_ENV !== "production";
const app = next({ dev: isDev });
const handler = app.getRequestHandler();

const port = process.env.PORT || 3000;

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true
});

app.prepare().then(() => {
    const server = express();
    const sentiment = new Sentiment();
    const chatHistory = {
        messages: []
    };

    server.use(bodyParser.json());

    server.get("/messages", (req, resp, next) => {
        resp.json(chatHistory);
    });

    server.get("*", (req, resp, next) => {
        return handler(req, resp);
    });

    server.post("/message", (req, resp, next) => {
        const { user = null, message = "", timeStamp = new Date().toString() } = req.body;
        const sentimentScore = sentiment.analyze(message).score;
        const chat = {
            user,
            message,
            timeStamp,
            sentimentScore
        };
        chatHistory.messages.push(chat);

        pusher.trigger("chat-messages", "new-message", chat);
    })

    server.listen(port, (err) => {
        if (err) {
            throw err;
        }
        console.log(`1> Ready on http://localhost:${port}`);
    });
}).catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
});