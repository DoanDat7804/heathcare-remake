const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const router = express.Router();

// Lấy danh sách người dùng
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Không xóa password
    res.json(users);
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng!" });
  }
});

// Lấy thông tin chi tiết người dùng theo ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ!" });
    }
    const user = await User.findById(req.params.id); // Không xóa password
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.json(user);
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng!", error: error.message });
  }
});

// Thêm người dùng mới
router.post("/", async (req, res) => {
  try {
    console.log("Dữ liệu nhận được từ frontend:", req.body);
    const userData = req.body;
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json(newUser); // Không xóa password
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi server khi thêm người dùng!", error: error.message });
  }
});

// Cập nhật thông tin người dùng
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ!" });
    }
    const userData = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, userData, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.json(updatedUser); // Không xóa password
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi server khi cập nhật người dùng!", error: error.message });
  }
});

// Xóa người dùng
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ!" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.json({ message: "Xóa người dùng thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    res.status(500).json({ message: "Lỗi server khi xóa người dùng!", error: error.message });
  }
});

module.exports = router;