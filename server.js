import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// API lấy phiên mới nhất
app.get("/api/taixiu", async (req, res) => {
  try {
    const response = await fetch("https://sun-predict-5ghi.onrender.com/api/taixiu/history");
    const historyData = await response.json();

    if (!Array.isArray(historyData) || historyData.length === 0) {
      return res.json({ error: "Chưa có dữ liệu API" });
    }

    const latest = historyData[0];

    const result = {
      Phien: latest.session,
      Xuc_xac_1: latest.dice[0],
      Xuc_xac_2: latest.dice[1],
      Xuc_xac_3: latest.dice[2],
      Tong: latest.total,
      Ket_qua: latest.result
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.json({ error: "Không thể lấy dữ liệu API" });
  }
});

// API history
app.get("/api/tx", async (req, res) => {
  try {
    const response = await fetch("https://sun-predict-5ghi.onrender.com/api/taixiu/history");
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.json({ error: "Không thể lấy dữ liệu history" });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
