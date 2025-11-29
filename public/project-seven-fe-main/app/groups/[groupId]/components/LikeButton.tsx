'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import thumbsUpImage from '@/public/assets/thumbs-up-w.svg';
import thumbsUpImageFilled from '@/public/assets/thumbs-up-w-filled.svg';
import Button from '@/lib/components/Button';
import { getGroupLikeStatus, likeGroup, unlikeGroup } from '@/lib/api';
import styles from './LikeButton.module.css';

const cx = classNames.bind(styles);

const LikeButton = ({
  className,
  groupId,
  likeCount,
}: {
  className?: string;
  groupId: number;
  likeCount: number;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(likeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const status = await getGroupLikeStatus(groupId);
        if (!mounted) return;
        setIsLiked(status.liked);
        setCount(status.likeCount ?? likeCount);
      } catch (error) {
        // 미인증 등으로 실패해도 기본값 유지
        console.error(error);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [groupId, likeCount]);

  const handleLikeClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isLiked) {
        const result = await unlikeGroup(groupId);
        setIsLiked(false);
        setCount((prev) => Math.max(0, result.likeCount ?? prev - 1));
      } else {
        const result = await likeGroup(groupId);
        setIsLiked(true);
        setCount((prev) => result.likeCount ?? prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [groupId, isLiked, loading]);

  return (
    <Button
      type="button"
      className={cx('likeButton', className)}
      onClick={handleLikeClick}
      disabled={loading}
    >
      <Image
        src={isLiked ? thumbsUpImageFilled : thumbsUpImage}
        alt="like"
        width={16}
        height={16}
      />{' '}
      {count}
    </Button>
  );
};

export default LikeButton;
