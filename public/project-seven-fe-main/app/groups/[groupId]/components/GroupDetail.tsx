'use client';

import Image from 'next/image';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Group } from '@/types/entities';
import placeholderImage from '@/public/assets/placeholder.svg';
import GroupJoinButton from './GroupJoinButton';
import LikeButton from './LikeButton';
import GroupLeaveButton from './GroupLeaveButton';
import Chip from '@/lib/components/Chip';
import userIcon from '@/public/assets/user.svg';
import SettingMenu from './SettingMenu';
import styles from './GroupDetail.module.css';
import { useAuth } from '@/lib/auth-context';
import Button from '@/lib/components/Button';

const cx = classNames.bind(styles);
const STARRED_KEY = 'starredGroups';

const GroupDetail = ({ group }: { group: Group }) => {
  const { user } = useAuth();
  const isOwner =
    !!user &&
    (group.ownerId === user.id ||
      group.owner?.userId === user.id);

  const ownerDisplay =
    group.ownerNickname ||
    group.owner?.nickname ||
    group.participants?.find((p) => p.id === group.ownerId)?.nickname ||
    group.participants?.[0]?.nickname ||
    '익명';

  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STARRED_KEY);
    const ids = saved ? saved.split(',').filter(Boolean) : [];
    setIsStarred(ids.includes(group.id.toString()));
  }, [group.id]);

  const toggleStar = () => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(STARRED_KEY);
    const ids = saved ? saved.split(',').filter(Boolean) : [];
    const exists = ids.includes(group.id.toString());
    const next = exists
      ? ids.filter((id) => id !== group.id.toString())
      : [...ids, group.id.toString()];
    window.localStorage.setItem(STARRED_KEY, next.join(','));
    setIsStarred(!exists);
  };

  return (
    <div className={cx('container')}>
      <Image
        className={cx('thumbnail')}
        src={group.photoUrl ?? placeholderImage}
        alt="Group Image"
        width={200}
        height={200}
      />

      <div className={cx('info')}>
        <div className={cx('tags')}>
          <Chip className={cx('participants', 'tag')} appearance="dark">
            <Image src={userIcon} alt="participants" width={14} height={14} />
            <span>{group.participants?.length ?? 0}명 참여중</span>
          </Chip>
          {group.tags.map((tag) => (
            <Chip key={tag} className={cx('tag')} appearance="dark">
              #{tag}
            </Chip>
          ))}
        </div>
        <h1 className={cx('groupName')}>{group.name}</h1>
        <p className={cx('description')}>
          by {ownerDisplay} · {group.description}
        </p>
        <div className={cx('goalReps')}>목표 횟수: {group.goalRep}개</div>
        <div className={cx('buttons')}>
          <LikeButton
            className={cx('button')}
            groupId={group.id}
            likeCount={group.likeCount}
          />
          <Button
            type="button"
            appearance="default"
            className={cx('starButton', 'button')}
            onClick={toggleStar}
          >
            <Image
              src={isStarred ? '/assets/push_star.png' : '/assets/base_star.png'}
              alt="즐겨찾기"
              width={20}
              height={20}
              className={cx('starIcon')}
            />
          </Button>
          <Button
            type="button"
            appearance="default"
            className={cx('shareButton', 'button')}
          >
            <Image
              src="/assets/share.png"
              alt="공유"
              width={20}
              height={20}
              className={cx('shareIcon')}
            />
          </Button>
        </div>
      </div>
      <div className={cx('actions')}>
        <GroupLeaveButton className={cx('action')} groupId={group.id} />
        <GroupJoinButton className={cx('action')} groupId={group.id} />
      </div>
      {isOwner && <SettingMenu className={cx('settingButton')} groupId={group.id} />}
    </div>
  );
};

export default GroupDetail;
