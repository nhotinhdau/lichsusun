const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// URL API gốc (thay bằng link thật của bạn)
const API_URL = "https://sun-predict-5ghi.onrender.com/api/taixiu/history";

let latestResult = null;

// Hàm fetch phiên mới nhất
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

// Endpoint: /api/tx
app.get('/api/tx', (req, res) => {
    if (!latestResult) {
        return res.status(503).json({ error: "Chưa có dữ liệu API" });
    }
    res.json(latestResult);
});

// Endpoint mặc định
app.get('/', (req, res) => {
    res.send('API Tài Xỉu. Truy cập /api/tx để xem phiên mới nhất.');
});

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
