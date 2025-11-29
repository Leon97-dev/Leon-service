'use client';

import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames/bind';
import logoImage from '@/public/assets/logo.svg';
import { useAuth } from '@/lib/auth-context';
import styles from '../layout.module.css';

const cx = classNames.bind(styles);

export function NavBar() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className={cx('nav')}>
      <Link href="/">
        <Image src={logoImage} alt="logo" className={cx('logo')} width={64} height={26} priority />
      </Link>
      <div className={cx('navRight')}>
        {loading ? null : user ? (
          <>
            <Link className={cx('navButton', 'navUserButton')} href="/me">
              {user.nickName || user.username}
            </Link>
            <button className={cx('navButton')} onClick={logout}>
              로그아웃
            </button>
          </>
        ) : (
          <Link className={cx('navButton')} href="/login">
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}
