'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import { GroupDelete } from '@/types/entities';
import Modal from '@/lib/components/Modal';
import Form from '@/lib/components/Form';
import Button from '@/lib/components/Button';
import styles from './GroupDeleteButton.module.css';
import modalStyles from './modalStyle.module.css';
import { deleteGroupAction } from '../../actions';

const cx = classNames.bind(styles);
const modalCx = classNames.bind(modalStyles);

const GroupDeleteModal = ({
  isOpen,
  groupId,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  groupId: number;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const { handleSubmit, setError, formState } = useForm<GroupDelete>();

  const submit = async (data: GroupDelete) => {
    const response = await deleteGroupAction(groupId, data);
    if (response.status !== 200) {
      setError('root', {
        message: response.error.message,
      });
      return;
    }
    return onSubmit();
  };

  return (
    <Modal className={modalCx('modal')} isOpen={isOpen} onClose={onClose}>
      <h1 className={modalCx('title')}>그룹을 삭제하시겠어요?</h1>
      <p className={modalCx('description')}>
        해당 그룹에 속한 모든 기록이 삭제됩니다.
      </p>
      <Form
        onSubmit={handleSubmit(submit)}
        error={formState.errors.root?.message}
      >
        <input type="hidden" name="groupId" value={groupId} />
        <p className={modalCx('description')}>이 작업은 되돌릴 수 없습니다.</p>
        <Button
          className={cx('button')}
          type="submit"
          disabled={formState.isSubmitting}
        >
          삭제하기
        </Button>
      </Form>
    </Modal>
  );
};

const GroupDeleteButton = ({
  className,
  groupId,
}: {
  className: string;
  groupId: number;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleJoinModalSubmit = () => {
    setIsOpen(false);
    router.push('/');
  };

  return (
    <>
      <span className={className} onClick={() => setIsOpen(true)}>
        그룹 삭제
      </span>
      <GroupDeleteModal
        isOpen={isOpen}
        groupId={groupId}
        onClose={() => setIsOpen(false)}
        onSubmit={handleJoinModalSubmit}
      />
    </>
  );
};

export default GroupDeleteButton;
