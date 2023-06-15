const express = require("express");
const mysql = require("mysql");

const app = express();

// Tạo kết nối với cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
  host: "localhost", // Thay đổi tên máy chủ nếu cần thiết
  user: "root", // Thay đổi tên người dùng và mật khẩu nếu cần thiết
  password: "",
  database: "DACS1",
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
// Kết nối tới cơ sở dữ liệu
connection.connect((error) => {
  if (error) {
    console.error("Lỗi kết nối:", error);
  } else {
    console.log("Đã kết nối thành công đến MySQL!");
    console.log("-------------REPONSIVE++++++++++");
  }
});

// Định nghĩa các endpoint API
app.get("/api/data", (req, res) => {
  const sqlQuery = "SELECT * FROM songs"; // Thay đổi tên bảng nếu cần thiết

  // Thực hiện truy vấn
  connection.query(sqlQuery, (error, results, fields) => {
    if (error) {
      console.error("Lỗi truy vấn:", error);
      res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    } else {
      // console.log("Kết quả truy vấn:", results);
      res.json(results);
    }
  });
});
const dataToInsert = {
  name: "Mãi Mãi Không Phải Anh",
  singer: "Thanh Bình",
  src: "../assets/song2.mp3",
  url: "https://i.scdn.co/image/ab67616d00001e0221227633171aaad0cb4456d8",
};
// const list = [
//   {
//     name: "Thôi Em Đừng Đi",
//     singer: "RPT MCK",
//     src: "../assets/song2.mp3",
//     url: "https://i.scdn.co/image/ab67616d00001e02b315e8bb7ef5e57e9a25bb0f",
//   },
//   {
//     name: "nếu lúc đó",
//     singer: "tlinh",
//     src: "../assets/song2.mp3",
//     url: "https://i.scdn.co/image/ab67616d00001e025b447e0566aadb805ebc5721",
//   },
//   {
//     name: "Anh Đã Từ Bỏ Rồi Đấy",
//     singer: "Nguyenn",
//     src: "../assets/song2.mp3",
//     url: "https://i.scdn.co/image/ab67616d00001e02209e80eae6638ae3c0623e02",
//   },
// ];
// list.forEach((v, i) => {
//   const query = "INSERT INTO songs SET ?";
//   connection.query(query, v, (error, results) => {
//     if (error) {
//       console.error("Lỗi:", error);
//       return;
//     }

//     console.log("Dữ liệu đã được chèn thành công:", results);
//   });
// });

app.listen(3000, () => {
  console.log("Server đang lắng nghe tại cổng 3000");
});
