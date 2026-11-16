
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// เปิดเว็บไซต์จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, "public")));

// ทดสอบการทำงานของเซิร์ฟเวอร์
app.get("/api/status", (req, res) => {
  res.json({
    connected: false,
    message: "GreenOak Server is running",
    moisture: null,
    pumpStatus: false,
    autoMode: false,
    adcValue: null,
    lastUpdate: new Date().toLocaleString("th-TH")
  });
});

app.listen(PORT, () => {
  console.log(`GreenOak Server running at http://localhost:${PORT}`);
});
