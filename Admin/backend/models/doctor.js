const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Tên bác sĩ là bắt buộc"], trim: true },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Email không hợp lệ"],
    },
    password: { type: String, required: [true, "Mật khẩu là bắt buộc"], minlength: 6 },
    phone: { type: String, required: [true, "Số điện thoại là bắt buộc"], trim: true },
    gender: { type: String, required: [true, "Giới tính là bắt buộc"], enum: ["Nam", "Nữ", "Khác"] },
    specialty: { type: String, required: [true, "Chuyên khoa là bắt buộc"], trim: true },
    subSpecialties: [{ type: String, trim: true }],
    qualifications: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: Number, required: true },
        description: { type: String },
      },
    ],
    experience: { type: Number, required: [true, "Kinh nghiệm là bắt buộc"], min: 0 },
    languages: [{ type: String, trim: true }],
    bio: { type: String, trim: true },
    hospital: {
      name: { type: String },
      address: { type: String },
      department: { type: String },
    },
    workingHours: [
      {
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        available: { type: Boolean, default: true },
      },
    ],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [
      {
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    role: { type: String, default: "doctor", enum: ["doctor"] },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);