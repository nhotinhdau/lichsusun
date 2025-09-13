import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// URL API gốc của bạn (thay link thật vào đây)
const API_URL = "https://sun-predict-5ghi.onrender.com/api/taixiu/history";  

app.get("/api/taixiu", async (req, res) => {
  try {
    // gọi API gốc
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Không thể gọi API gốc");
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return res.json({ error: "Không có dữ liệu" });
    }

    // lấy phiên mới nhất (phần tử đầu tiên)
    const latest = data[0];

    res.json({
      Phien: latest.session,
      Xuc_xac_1: latest.dice[0],
      Xuc_xac_2: latest.dice[1],
      Xuc_xac_3: latest.dice[2],
      Tong: latest.total,
      Ket_qua: latest.result
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
