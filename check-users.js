const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function listUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers(10);

    if (listUsersResult.users.length === 0) {
      console.log('❌ 등록된 사용자가 없습니다.');
      console.log('\n관리자 계정을 생성해야 합니다:');
      console.log('node scripts/create-admin-user.js');
    } else {
      console.log('✅ 등록된 사용자 목록:\n');
      listUsersResult.users.forEach((user, index) => {
        console.log(`${index + 1}. 이메일: ${user.email}`);
        console.log(`   UID: ${user.uid}`);
        console.log(`   생성일: ${user.metadata.creationTime}`);
        console.log(`   이메일 인증: ${user.emailVerified ? '완료' : '미완료'}`);
        console.log('');
      });

      console.log('\n💡 위 이메일 계정으로 로그인하실 수 있습니다!');
      console.log('로그인 페이지: https://shu-90th-anniversary.vercel.app/admin/login');
    }
  } catch (error) {
    console.error('오류:', error.message);
  } finally {
    process.exit(0);
  }
}

listUsers();
