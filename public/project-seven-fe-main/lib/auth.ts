import { axios } from './axios';
import { User } from '@/types/entities';

export async function login(identifier: string, password: string) {
  const res = await axios.post('/users/login', { username: identifier, password });
  return res.data;
}

export async function register(payload: {
  username: string;
  password: string;
  email: string;
  nickName: string;
  profileImageUrl?: string;
  birthDate: string;
  carrier: 'SKT' | 'KT' | 'LGU' | 'MVNO';
  gender: 'male' | 'female';
  nationality: 'domestic' | 'foreign';
  phoneNumber: string;
}) {
  const res = await axios.post('/users/register', payload);
  return res.data.data;
}

export async function logout() {
  await axios.post('/users/logout');
}

export async function getMe(): Promise<User | null> {
  try {
    const res = await axios.get('/users/me');
    return res.data.data as User;
  } catch {
    return null;
  }
}

export async function updateProfile(payload: { nickName?: string; profileImageUrl?: string }) {
  const res = await axios.patch('/users/name', payload);
  return res.data.data as User;
}
