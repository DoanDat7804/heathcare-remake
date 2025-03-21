const bcrypt = require('bcrypt');

const password = 'password123'; // Mật khẩu thô bạn muốn mã hóa
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed password:', hash);
});