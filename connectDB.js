import mongoose from "mongoose";

// Hàm kết nối với MongoDB
export async function connectDB() {
  try {
    // Kết nối với MongoDB sử dụng mongoose
    await mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Đã kết nối với MongoDB!");

    // Thực hiện các thao tác với cơ sở dữ liệu ở đây nếu cần
  } catch (error) {
    console.error("Lỗi kết nối với MongoDB:", error);
    // Xử lý lỗi kết nối nếu cần
  }
}
