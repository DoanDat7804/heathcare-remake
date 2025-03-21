const express = require("express");
const mongoose = require("mongoose");
const Doctor = require("../models/doctor");
const router = express.Router();

// Lấy danh sách bác sĩ
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find(); // Bỏ .select("-password") để trả về password
    res.json(doctors);
  } catch (error) {
    console.error("Lỗi lấy danh sách bác sĩ:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách bác sĩ!" });
  }
});

// Lấy thông tin chi tiết bác sĩ theo ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID bác sĩ không hợp lệ!" });
    }
    const doctor = await Doctor.findById(req.params.id); // Bỏ .select("-password")
    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ!" });
    }
    res.json(doctor);
  } catch (error) {
    console.error("Lỗi lấy thông tin bác sĩ:", error);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin bác sĩ!", error: error.message });
  }
});

// Thêm bác sĩ mới
router.post("/", async (req, res) => {
  try {
    console.log("Dữ liệu nhận được từ frontend:", req.body);
    const doctorData = {
      ...req.body,
      updatedAt: Date.now(),
    };
    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();
    res.status(201).json(newDoctor); // Trả về toàn bộ dữ liệu, bao gồm password
  } catch (error) {
    console.error("Lỗi khi thêm bác sĩ:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi server khi thêm bác sĩ!", error: error.message });
  }
});

// Cập nhật thông tin bác sĩ
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID bác sĩ không hợp lệ!" });
    }

    const doctorData = {
      ...req.body,
      updatedAt: Date.now(),
    };

    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, doctorData, { new: true, runValidators: true }); // Bỏ .select("-password")
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ!" });
    }
    res.json(updatedDoctor);
  } catch (error) {
    console.error("Lỗi khi cập nhật bác sĩ:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }
    res.status(500).json({ message: "Lỗi server khi cập nhật bác sĩ!", error: error.message });
  }
});

// Xóa bác sĩ
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID bác sĩ không hợp lệ!" });
    }
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy bác sĩ!" });
    }
    res.json({ message: "Xóa bác sĩ thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa bác sĩ:", error);
    res.status(500).json({ message: "Lỗi server khi xóa bác sĩ!", error: error.message });
  }
});

module.exports = router;