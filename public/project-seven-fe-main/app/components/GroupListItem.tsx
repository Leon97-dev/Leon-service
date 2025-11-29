'use client';

import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import { Group } from '@/types/entities';
import Chip from '@/lib/components/Chip';
import userImage from '@/public/assets/user.svg';
import thumbsUpImage from '@/public/assets/thumbs-up.svg';
import checkCircleImage from '@/public/assets/check-circle.svg';
import placeholderImage from '@/public/assets/placeholder.svg';
import styles from './GroupListItem.module.css';
import SafeImage from '@/lib/components/SafeImage';

const cx = classNames.bind(styles);
const placeholderSrc =
  typeof placeholderImage === 'string' ? placeholderImage : placeholderImage.src;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const toDisplayUrl = (url?: string | null) => {
  if (!url) return placeholderSrc;
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/assets')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return url;
};

const GroupListItem = ({
  group,
  withMeta = true,
  disabled = false,
}: {
  group: Group;
  withMeta?: boolean;
  disabled?: boolean;
}) => {
  const ownerDisplay =
    group.ownerNickname ||
    group.owner?.nickname ||
    group.participants?.find((p) => p.id === group.ownerId)?.nickname ||
    group.participants?.[0]?.nickname ||
    '익명';

  return (
    <div>
      <Link
        className={cx('groupCard', { disabled })}
        href={disabled ? '#' : `/groups/${group.id}/records`}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
      >
        <SafeImage
          className={cx('groupImage')}
          src={toDisplayUrl(group.photoUrl)}
          alt="group image"
          width={93}
          height={60}
          fallback={placeholderSrc}
        />
        <span className={cx('groupName')}>{group.name}</span>
        <span className={cx('groupOwner')}>by {ownerDisplay}</span>
        <div className={cx('participantCount')}>
          <Image src={userImage} alt="user image" width={16} height={16} />
          {group.participants?.length ?? 0}명 참여 중
        </div>
      </Link>
      {withMeta && (
        <div className={cx('groupMeta')}>
          <div className={cx('tags')}>
            {group.tags.map((tag) => (
              <Chip key={tag}>#{tag}</Chip>
            ))}
          </div>
          <div className={cx('counts')}>
            <div className={cx('likeCount')}>
              <Image src={thumbsUpImage} width={18} height={18} alt="like" />
              {group.likeCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupListItem;
