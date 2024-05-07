// Import thư viện Express
import express from "express";
import { connectDB } from "./connectDB.js";
import cors from "cors";
import Water from "./models/water.js";
import User from "./models/user.js";
import dotenv from "dotenv";

// Load các biến môi trường từ tập tin .env
dotenv.config();

// Tạo một ứng dụng Express mới
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.post("/users", async (req, res) => {
  try {
    // Lấy dữ liệu từ yêu cầu
    const { gender, weight, wakupTime, bedTime } = req.body;

    // Tạo một người dùng mới dựa trên dữ liệu từ yêu cầu
    const newUser = new User({
      gender,
      weight,
      wakupTime,
      bedTime
    });

    // Lưu người dùng mới vào cơ sở dữ liệu
    const savedUser = await newUser.save();

    // Trả về kết quả
    return res.status(201).json(savedUser);
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi tạo người dùng mới:", error);
    return res.status(500).send("Đã xảy ra lỗi khi tạo người dùng mới");
  }
});

// Định nghĩa route để in ra "hello" khi truy cập vào địa chỉ gốc "/"
app.get("/water", async (req, res) => {
  try {
    // Sử dụng phương thức find() của Mongoose để lấy tất cả các user từ bảng "User"
    const waters = await Water.find({});
    console.log(waters);

    // Trả về kết quả
    res.json(waters);
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi lấy dữ liệu user:", error);
    res.status(500).send("Đã xảy ra lỗi khi lấy dữ liệu user");
  }
});

app.get("/water/:userId/:date", async (req, res) => {
  try {
    // Lấy userId và date từ params của yêu cầu
    const { userId, date } = req.params;

    // Chuyển đổi ngày từ string sang đối tượng Date
    const searchDate = new Date(date);

    // Tạo một đối tượng Date mới để lấy ngày kế tiếp
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Sử dụng phương thức find() của Mongoose để lấy các bản ghi "water" trong khoảng thời gian từ date đến nextDay và có userId tương ứng
    const waters = await Water.find({
      userId: userId,
      date: {
        $gte: searchDate,
        $lt: nextDay
      }
    });

    // Trả về kết quả
    res.json(waters);
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi lấy dữ liệu water:", error);
    res.status(500).send("Đã xảy ra lỗi khi lấy dữ liệu water");
  }
});

app.put("/water/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { weather, sports } = req.body;

    // Tìm người dùng theo id
    const user = await User.findById(userId);

    // Kiểm tra nếu người dùng không tồn tại
    if (!user) {
      return res.status(404).send("Không tìm thấy người dùng");
    }

    // Tạo hoặc cập nhật dữ liệu "water" cho người dùng
    const waterData = await Water.findOneAndUpdate(
      { userId: userId },
      { weather, sports },
      { upsert: true, new: true }
    );

    // Trả về kết quả
    res.json(waterData);
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi cập nhật dữ liệu water:", error);
    res.status(500).send("Đã xảy ra lỗi khi cập nhật dữ liệu water");
  }
});

app.post("/water", async (req, res) => {
  try {
    // Lấy dữ liệu từ yêu cầu
    const { weather, sports, userId, date } = req.body;

    // Tạo một bản ghi "water" mới với dữ liệu từ yêu cầu
    const newWaterRecord = new Water({
      weather,
      sports,
      date,
      userId
    });

    // Lưu bản ghi "water" mới vào cơ sở dữ liệu
    const savedWaterRecord = await newWaterRecord.save();

    // Trả về kết quả
    return res.status(201).json(savedWaterRecord);
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi tạo bản ghi water mới:", error);
    return res.status(500).send("Đã xảy ra lỗi khi tạo bản ghi water mới");
  }
});

// Khởi động server và lắng nghe trên cổng 3000
app.listen(3000, () => {
  console.log("Server đang chạy trên cổng 3000...");
});
