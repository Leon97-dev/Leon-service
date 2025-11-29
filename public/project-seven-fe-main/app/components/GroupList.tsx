'use client';

import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Group } from '@/types/entities';
import { LinkButton } from '@/lib/components/Button';
import GroupListItem from './GroupListItem';
import styles from './GroupList.module.css';
import { axios } from '@/lib/axios';
import { DEFAULT_GROUPS_PAGINATION_QUERY } from '@/lib/api';

const cx = classNames.bind(styles);

const GroupListHeader = () => (
  <div className={cx('listHeader')}>
    <h2 className={cx('title')}>진행 중인 그룹</h2>
    <div className={cx('actions')}>
      <LinkButton appearance="minimal" href="/groups/new">
        + 새 그룹 만들기
      </LinkButton>
    </div>
  </div>
);

const GroupList = ({ initialValues = [], total = 0 }: { initialValues: Group[]; total?: number }) => {
  const [groups, setGroups] = useState<Group[]>(initialValues);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [totalCount, setTotalCount] = useState<number>(total ?? initialValues.length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGroups(initialValues);
    setTotalCount(total ?? initialValues.length);
  }, [initialValues, total]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get('/groups', {
          params: { ...DEFAULT_GROUPS_PAGINATION_QUERY, search, orderBy },
        });
        setGroups(res.data.data ?? []);
        setTotalCount(res.data.total ?? 0);
        setError(null);
      } catch (e) {
        console.error(e);
        setError('그룹을 불러오지 못했습니다. 새로고침 해 주세요.');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [search, orderBy]);

  return (
    <div className={cx('container')}>
      <GroupListHeader />
      <div className={cx('searchRow')}>
        <input
          className={cx('searchInput')}
          placeholder="그룹명 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={cx('orderSelect')}
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="createdAt">최신순</option>
          <option value="likeCount">좋아요</option>
          <option value="goalRep">목표횟수</option>
        </select>
        <span className={cx('total')}>총 {totalCount}개</span>
      </div>
      {error && <div className={cx('error')}>{error}</div>}
      <ul className={cx('list')}>
        {groups.map((group) => (
          <li key={group.id}>
            <GroupListItem group={group} />
          </li>
        ))}
      </ul>
      {loading && <div className={cx('loading')}>불러오는 중...</div>}
    </div>
  );
};

export default GroupList;
