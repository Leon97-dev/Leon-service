'use client';

import Image from 'next/image';
import classNames from 'classnames/bind';
import heroImage from '@/public/assets/hero.png';
import GroupList from './components/GroupList';
import styles from './page.module.css';

const cx = classNames.bind(styles);

export default function Home() {
  return (
    <div className={cx('page')}>
      <h1 className={cx('heading')}>
        기록 기반의
        <br />
        운동 커뮤니티, 세븐
      </h1>
      <Image
        className={cx('hero')}
        src={heroImage}
        alt="hero"
        width={1440}
        height={307}
      />
      <GroupList initialValues={[]} total={0} />
    </div>
  );
}
