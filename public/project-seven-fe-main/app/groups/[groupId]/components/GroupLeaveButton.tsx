'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import Modal from '@/lib/components/Modal';
import Button from '@/lib/components/Button';
import Label from '@/lib/components/Label';
import Input from '@/lib/components/Input';
import { leaveGroup } from '@/lib/api';
import styles from './GroupLeaveButton.module.css';
import modalStyle from './modalStyle.module.css';
import Form from '@/lib/components/Form';
import { useRouter } from 'next/navigation';

const cx = classNames.bind(styles);
const modalCx = classNames.bind(modalStyle);

const GroupLeaveModal = ({
  groupId,
  isOpen,
  onClose,
  onSubmit,
}: {
  groupId: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const { handleSubmit, formState, setError, reset } = useForm({
    mode: 'onSubmit',
  });
  const router = useRouter();

  const submit = async () => {
    try {
      await leaveGroup(groupId);
      reset();
      onSubmit();
      router.push('/');
    } catch (error: unknown) {
      setError('root', {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message: (error as any)?.response?.data?.message || '나가기에 실패했습니다.',
      });
      return;
    }

    reset();
    onSubmit();
  };

  return (
    <Modal className={modalCx('modal')} isOpen={isOpen} onClose={onClose}>
      <h1 className={modalCx('title')}>그룹에서 나가시겠어요?</h1>
      <p className={modalCx('description')}>
        그룹을 나가면 지금까지 기록한 운동 기록이 모두 삭제됩니다. 정말 나가시겠습니까?
      </p>
      <Form
        className={cx('form')}
        onSubmit={handleSubmit(submit)}
        error={formState.errors.root?.message}
      >
        <div className={cx('actionRow')}>
          <Button type="button" appearance="minimal" onClick={onClose}>
            취소하기
          </Button>
          <Button type="submit" className={cx('button')}>
            나가기
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const GroupLeaveButton = ({
  className,
  groupId,
}: {
  className?: string;
  groupId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        className={cx('groupLeaveButton', className)}
        onClick={() => setIsOpen((s) => !s)}
      >
        나가기
      </Button>
      <GroupLeaveModal
        groupId={groupId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default GroupLeaveButton;
