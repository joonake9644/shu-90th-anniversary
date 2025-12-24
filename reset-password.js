const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'joonake@naver.com';
const newPassword = process.argv[2];

if (!newPassword) {
  console.log('사용법: node reset-password.js [새비밀번호]');
  console.log('예시: node reset-password.js myNewPassword123');
  process.exit(1);
}

admin.auth().updateUser('qZrR47jeBtgG3p0vl7r1qn2Nd0I2', {
  password: newPassword
})
.then(() => {
  console.log('✅ 비밀번호가 재설정되었습니다!');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('이메일:', email);
  console.log('새 비밀번호:', newPassword);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('로그인 페이지:');
  console.log('https://shu-90th-anniversary.vercel.app/admin/login');
  process.exit(0);
})
.catch(error => {
  console.error('❌ 오류:', error.message);
  process.exit(1);
});
