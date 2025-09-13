import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Link API gốc (bạn thay đúng link trong ảnh vào đây)
const API_URL = "https://sun-predict-5ghi.onrender.com/api/taixiu/history";  

app.get("/api/taixiu", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Không thể gọi API gốc");

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return res.json({ error: "Không có dữ liệu" });
    }

    const latest = data[0]; // phiên mới nhất

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
