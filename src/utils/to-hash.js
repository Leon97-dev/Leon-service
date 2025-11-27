// TODO) To-Hash: 비밀번호 해시/검증 유틸
// &) Library Import
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // 해쉬 강도

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}
