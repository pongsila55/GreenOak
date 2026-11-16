
const API_URL = "/api/status";

async function loadDashboard() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("ไม่สามารถรับข้อมูลได้");
        }

        const data = await response.json();

        const moisture = Number(data.moisture);

        if (Number.isFinite(moisture)) {
            const value = Math.max(0, Math.min(100, moisture));

            document.getElementById("moisture").textContent = value;
            document.getElementById("moistureBar").style.width = value + "%";

            let soilText = "ความชื้นปานกลาง";

            if (value < 40) {
                soilText = "ดินค่อนข้างแห้ง";
            } else if (value >= 60) {
                soilText = "ดินมีความชื้นสูง";
            }

            document.getElementById("soilText").textContent = soilText;
        }

        document.getElementById("pumpStatus").textContent =
            data.pumpStatus ? "ON" : "OFF";

        document.getElementById("autoMode").textContent =
            data.autoMode ? "ON" : "OFF";

        document.getElementById("manualPump").textContent =
            data.pumpStatus ? "ON" : "OFF";

        document.getElementById("startValue").textContent =
            data.startValue + "%";

        document.getElementById("stopValue").textContent =
            data.stopValue + "%";

        document.getElementById("adcValue").textContent =
            data.adcValue ?? "ไม่มีข้อมูล";

        document.getElementById("connection").textContent =
            data.connected ? "ESP32 ONLINE" : "ESP32 OFFLINE";

        document.getElementById("lastUpdate").textContent =
            data.lastUpdate || "-";

    } catch (error) {
        document.getElementById("connection").textContent =
            "CONNECTION ERROR";

        console.error("Dashboard Error:", error);
    }
}

loadDashboard();
setInterval(loadDashboard, 3000);
