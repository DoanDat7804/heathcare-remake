const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  district: { type: String, trim: true },
  city: { type: String, trim: true },
  country: { type: String, trim: true },
});

const healthInfoSchema = new mongoose.Schema({
  bloodType: { type: String, trim: true },
  allergies: [{ type: String, trim: true }],
  chronicDiseases: [{ type: String, trim: true }],
  currentMedications: [{ type: String, trim: true }],
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Tên người dùng là bắt buộc"], trim: true },
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
    dateOfBirth: { type: Date },
    gender: { type: String, required: [true, "Giới tính là bắt buộc"], enum: ["Nam", "Nữ", "Khác"] },
    address: { type: addressSchema },
    healthInfo: { type: healthInfoSchema },
    medicalHistory: [{ type: String, trim: true }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
    role: { type: String, default: "patient", enum: ["patient", "admin"] },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Bỏ logic hash mật khẩu
// userSchema.pre("save", async function (next) {
//   try {
//     if (this.isModified("password")) {
//       this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = mongoose.model("User", userSchema);