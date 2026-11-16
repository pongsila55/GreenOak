
const API_URL = "/api/status";

async function loadDashboard() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("ไม่สามารถรับข้อมูลได้");
        }

        const data = await response.json();

        // ความชื้นดิน
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

        // สถานะปั๊ม
        document.getElementById("pumpStatus").textContent =
            data.pumpStatus ? "ON" : "OFF";

        // โหมดอัตโนมัติ
        document.getElementById("autoMode").textContent =
            data.autoMode ? "ON" : "OFF";

        // ค่าควบคุมความชื้น
        document.getElementById("startValue").textContent =
            data.startValue + "%";

        document.getElementById("stopValue").textContent =
            data.stopValue + "%";

        // การเชื่อมต่อ
        document.getElementById("connection").textContent =
            data.connected ? "ESP32 ONLINE" : "ESP32 OFFLINE";

        // เวลาอัปเดต
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
