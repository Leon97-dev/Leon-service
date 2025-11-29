// public/project-seven-fe-main/app/groups/[groupId]/records/components/
'use client';

import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Record } from '@/types/entities';
import styles from './RecordList.module.css';
import RecordListItem from './RecordListItem';

const cx = classNames.bind(styles);

const RecordList = ({ initialValues = [] }: { initialValues: Record[] }) => {
  const [records, setRecords] = useState(initialValues);

  useEffect(() => {
    setRecords(initialValues);
  }, [initialValues]);

  return (
    <div className={cx('recordList')}>
      {records.map((record) => (
        <RecordListItem key={record.id} record={record} />
      ))}
    </div>
  );
};

export default RecordList;
