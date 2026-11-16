
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = process.env.BLYNK_TOKEN;
const BLYNK_URL = "https://sgp1.blynk.cloud";

app.use(express.static(path.join(__dirname, "public")));

async function getBlynkValue(pin) {
    const url = `${BLYNK_URL}/external/api/get?token=${encodeURIComponent(TOKEN)}&${pin}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Blynk HTTP ${response.status}`);
    }

    return await response.text();
}

app.get("/api/status", async (req, res) => {
    try {
        if (!TOKEN) {
            throw new Error("BLYNK_TOKEN is missing");
        }

        const [moisture, pump, auto, start, stop] =
            await Promise.all([
                getBlynkValue("V0"),
                getBlynkValue("V2"),
                getBlynkValue("V4"),
                getBlynkValue("V8"),
                getBlynkValue("V9")
            ]);

        res.json({
            connected: true,
            moisture: Number(moisture),
            pumpStatus: Number(pump) === 1,
            autoMode: Number(auto) === 1,
            startValue: Number(start),
            stopValue: Number(stop),
            adcValue: null,
            lastUpdate: new Date().toLocaleString("th-TH", {
                timeZone: "Asia/Bangkok"
            })
        });

    } catch (error) {
        console.error("Blynk connection error:", error.message);

        res.status(200).json({
            connected: false,
            moisture: null,
            pumpStatus: false,
            autoMode: false,
            startValue: null,
            stopValue: null,
            adcValue: null,
            message: error.message,
            lastUpdate: new Date().toLocaleString("th-TH", {
                timeZone: "Asia/Bangkok"
            })
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("GreenOak Server is running");
    console.log("Blynk Token loaded:", Boolean(TOKEN));
    console.log(`Server listening on port ${PORT}`);
});
