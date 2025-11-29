'use client';

import _ from 'lodash';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Group, GroupCreate, GroupUpdate } from '@/types/entities';
import { useAuth } from '@/lib/auth-context';
import styles from './GroupForm.module.css';
import Card from '@/lib/components/Card';
import GroupListItem from '@/app/components/GroupListItem';
import Label from '@/lib/components/Label';
import Input, { Textarea } from '@/lib/components/Input';
import TagInput from '@/lib/components/TagInput';
import Button from '@/lib/components/Button';
import ImageInput from '@/lib/components/ImageInput';
import { createGroup, updateGroup } from '@/lib/api';
import Form from '@/lib/components/Form';
import { AxiosError } from 'axios';

const cx = classNames.bind(styles);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const toDisplayUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return url;
};

const toAbsoluteUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
  return url;
};

const GroupPreview = ({ values }: { values: GroupCreate | GroupUpdate }) => {
  const displayPhotoUrl = toDisplayUrl(values.photoUrl) || '';
  return (
    <GroupListItem
      withMeta={false}
      disabled
      group={{
        id: 0,
        name: values.name ?? '',
        description: values.description ?? '',
        photoUrl: displayPhotoUrl,
        goalRep: values.goalRep ?? 0,
        owner: {
          nickname: values.ownerNickname ?? '',
          id: 0,
          createdAt: undefined,
          updatedAt: undefined,
        },
        likeCount: 0,
        tags: values.tags ?? [],
        participants: [],
        ownerId: null,
        createdAt: undefined,
        updatedAt: undefined,
      }}
    />
  );
};

const GroupForm = ({
  type,
  group,
  onSubmit,
}: {
  type: 'create' | 'update';
  group?: Group;
  onSubmit: (groupId: number) => void;
}) => {
  const { user } = useAuth();
  const defaultValues: GroupUpdate | undefined = group
    ? {
        ..._.omit(group, ['id', 'owner', 'likeCount', 'createdAt', 'updatedAt', 'participants']),
        description: group.description ?? undefined,
        photoUrl: group.photoUrl ?? undefined,
        ownerNickname: group.owner?.nickname ?? '',
      }
    : {
        ownerNickname: user?.nickName || user?.username || '',
      };

  const { register, handleSubmit, setValue, watch, formState, setError } = useForm<
    GroupCreate | GroupUpdate
  >({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (!group && user) {
      setValue('ownerNickname', user.nickName || user.username || '');
    }
  }, [group, user, setValue]);

  const preventEnterSubmit = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      const target = event.target as HTMLElement;
      if (target.tagName === 'TEXTAREA') return;
      event.preventDefault();
    }
  };

  const values = watch();
  const displayPhotoUrl = toDisplayUrl(values.photoUrl);

  const submit = async (data: GroupCreate | GroupUpdate) => {
    const photoUrl = toAbsoluteUrl(data.photoUrl);
    const ownerNickname =
      (data as GroupCreate).ownerNickname || user?.nickName || user?.username || '';

    const basePayload = {
      name: data.name,
      description: data.description,
      goalRep: data.goalRep,
      tags: data.tags ?? [],
      ...(photoUrl ? { photoUrl } : {}),
    };

    try {
      const result =
        type === 'update' && group
          ? await updateGroup(group.id, { ...(basePayload as GroupUpdate) })
          : await createGroup({ ...(basePayload as GroupCreate), ownerNickname });
      onSubmit(result.id);
    } catch (error) {
      if (error instanceof AxiosError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError((error.response?.data?.path as any) ?? 'root', {
          message: error.response?.data?.message ?? '요청에 실패했습니다.',
        });
        return;
      }
      setError('root', { message: '알 수 없는 오류가 발생했습니다.' });
    }
  };

  return (
    <div className={cx('container')}>
      <Card className={cx('card')}>
        <h1 className={cx('title')}>{type === 'create' ? '그룹 만들기' : '그룹 수정하기'}</h1>
        <Form
          id="groupForm"
          className={cx('form')}
          onSubmit={handleSubmit(submit)}
          error={formState.errors.root?.message}
          onKeyDown={preventEnterSubmit}
        >
          <div className={cx('formLeft')}>
            <div className={cx('formItem')}>
              <Label id="name" htmlFor="name" error={!!formState.errors.name}>
                그룹명
              </Label>
              <Input
                type="text"
                placeholder="100KM 달성 챌린지"
                {...register('name', {
                  required: '그룹명을 입력해 주세요.',
                })}
                error={formState.errors.name?.message}
              />
            </div>
            <div className={cx('descriptionBlock')}>
              <Label id="description" htmlFor="description" error={!!formState.errors.description}>
                설명
              </Label>
              <Textarea
                className={cx('description')}
                placeholder="다 같이 열심히 해서 러닝으로 100KM를 찍어봐요."
                {...register('description', {
                  required: '설명을 입력해 주세요.',
                })}
                error={formState.errors.description?.message}
              />
            </div>

            {/* 디스코드 관련 입력 제거, 닉네임은 로그인 유저로 자동 설정 */}
            <div className={cx('tags')}>
              <Label id="tags" htmlFor="tags">
                태그
              </Label>
              <TagInput
                value={values.tags ?? []}
                onChange={(tags) => {
                  setValue('tags', tags);
                }}
                maxTags={3}
              />
            </div>
            <div className={cx('goalRep')}>
              <Label id="goalRep" htmlFor="goalRep" error={!!formState.errors.goalRep}>
                목표 횟수
              </Label>
              <Input
                type="number"
                placeholder="목표 횟수를 입력해 주세요."
                {...register('goalRep', {
                  valueAsNumber: true,
                  required: '목표 횟수를 입력해 주세요.',
                })}
                error={formState.errors.goalRep?.message}
              />
            </div>
          </div>
          <div className={cx('formRight')}>
            <div className={cx('thumbnail')}>
              <Label id="photoUrl" htmlFor="photoUrl">
                썸네일
              </Label>
              <ImageInput
                className={cx('thumbnailInput')}
                values={values.photoUrl ? [displayPhotoUrl] : []}
                onChange={(values: string[]) => {
                  // 서버 제출용으로는 상대/절대 그대로 저장, 미리보기는 displayPhotoUrl 사용
                  setValue('photoUrl', values[0]);
                }}
              />
            </div>
          </div>
        </Form>
      </Card>
      <div className={cx('previewWrapper')}>
        <div className={cx('preview')}>
          <div className={cx('previewTitle')}>미리보기</div>
          <GroupPreview values={values} />
        </div>
        <div className={cx('actions')}>
          <Button
            form="groupForm"
            className={cx('submitButton')}
            type="submit"
            disabled={!formState.isValid}
          >
            {type === 'create' ? '만들기' : '수정하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;
