const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.all("/proxy", async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: "No URL specified" });
    }

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: req.headers,
            body: req.method === "POST" ? JSON.stringify(req.body) : undefined
        });

        const data = await response.text();
        res.status(response.status).send(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching URL", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}/proxy`);
});
