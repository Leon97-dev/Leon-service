'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import Modal from '@/lib/components/Modal';
import Button from '@/lib/components/Button';
import Form from '@/lib/components/Form';
import { joinGroup } from '@/lib/api';
import styles from './GroupJoinButton.module.css';
import modalStyles from './modalStyle.module.css';
import { useAuth } from '@/lib/auth-context';

const cx = classNames.bind(styles);
const modalCx = classNames.bind(modalStyles);

const GroupJoinModal = ({
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
  const { handleSubmit, setError, reset, formState } = useForm({
    mode: 'onSubmit',
  });
  const { user } = useAuth();

  const submit = async () => {
    const nickname = user?.nickName || user?.username || '';
    if (!nickname || nickname.length > 64) {
      setError('root', {
        message: '닉네임 정보를 불러오지 못했습니다. 다시 로그인해 주세요.',
      });
      return;
    }

    try {
      await joinGroup(groupId, { nickname });
      onSubmit();
      reset();
    } catch (error: unknown) {
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any)?.response?.data?.message ||
        '이미 참여한 그룹입니다';
      setError('root', {
        message,
      });
    }
  };

  return (
    <Modal className={modalCx('modal')} isOpen={isOpen} onClose={onClose}>
      <h1 className={modalCx('title')}>그룹에 참여하시겠어요?</h1>
      <p className={modalCx('description')}>버튼을 누르면 바로 참여됩니다.</p>
      <Form
        className={cx('form')}
        onSubmit={handleSubmit(submit)}
        error={formState.errors.root?.message}
      >
        <input type="hidden" name="groupId" value={groupId} />
        <div className={cx('actionRow')}>
          <Button type="button" appearance="minimal" onClick={onClose}>
            취소하기
          </Button>
          <Button type="submit" className={cx('button')}>
            참여하기
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const GroupJoinButton = ({
  className,
  groupId,
}: {
  className?: string;
  groupId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleJoinModalSubmit = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        appearance="minimal"
        className={className}
        onClick={() => setIsOpen((s) => !s)}
      >
        참여하기
      </Button>
      <GroupJoinModal
        groupId={groupId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleJoinModalSubmit}
      />
    </>
  );
};

export default GroupJoinButton;
