const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// URL API gốc (đổi thành link thật của bạn)
const API_URL = "https://sun-predict-5ghi.onrender.com/api/taixiu/history";

// Biến lưu phiên mới nhất
let latestResult = null;

// Hàm fetch API định kỳ
async function fetchResult() {
    try {
        const response = await axios.get(API_URL);
        const json = response.data;

        if (json.state === 1 && json.data) {
            const openCode = json.data.OpenCode.split(',').map(Number);
            const tong = openCode.reduce((a, b) => a + b, 0);
            const ketQua = (tong >= 11) ? "Tài" : "Xỉu";

            latestResult = {
                Phien: parseInt(json.data.Expect),
                Xuc_xac_1: openCode[0],
                Xuc_xac_2: openCode[1],
                Xuc_xac_3: openCode[2],
                Tong: tong,
                Ket_qua: ketQua
            };

            console.log("🎲 Phiên mới nhất:", latestResult);
        }
    } catch (err) {
        console.error("❌ Lỗi fetch API:", err.message);
    }
}

// Gọi fetchResult mỗi 3 giây
setInterval(fetchResult, 3000);

// ================= API ================= //

// 1️⃣ Lấy phiên mới nhất
app.get('/api/taixiu/ws', (req, res) => {
    if (!latestResult) {
        return res.status(503).json({
            error: "Chưa có dữ liệu API",
            details: "Vui lòng thử lại sau vài giây."
        });
    }
    res.json(latestResult);
});

// 2️⃣ Lấy lịch sử (trả về 1 phiên duy nhất, format gọn)
app.get('/api/tx', async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        const json = response.data;

        if (json.state === 1 && Array.isArray(json.data) && json.data.length > 0) {
            const item = json.data[0]; // lấy phiên đầu tiên trong lịch sử
            const openCode = item.OpenCode.split(',').map(Number);
            const tong = openCode.reduce((a, b) => a + b, 0);
            const ketQua = (tong >= 11) ? "Tài" : "Xỉu";

            const formatted = {
                Phien: parseInt(item.Expect),
                Xuc_xac_1: openCode[0],
                Xuc_xac_2: openCode[1],
                Xuc_xac_3: openCode[2],
                Tong: tong,
                Ket_qua: ketQua
            };

            return res.json(formatted);
        }

        res.status(500).json({ error: "Không có dữ liệu lịch sử" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi API", details: err.message });
    }
});

// ================= SERVER ================= //

// Endpoint mặc định
app.get('/', (req, res) => {
    res.send('API HTTP Tài Xỉu. Truy cập /api/taixiu/ws hoặc /api/taixiu/history');
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
