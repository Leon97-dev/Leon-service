'use server';

import { revalidatePath } from 'next/cache';
import * as api from '@/lib/api';
import { GroupCreate, GroupDelete, GroupJoin, GroupUpdate } from '@/types/entities';
import handleError from '@/lib/handleError';
import { createGroup } from '@/lib/api';

export const revalidateGroup = async (groupId: number) => {
  await revalidatePath(`/groups/${groupId}/**/page`);
};

export const getGroupAction = async (groupId: number) => {
  return api.getGroup(groupId);
};

export const likeGroupAction = handleError(async (groupId: number) => {
  // API 스펙에 따라 선택적 사용: 없는 경우 noop
  if (api.likeGroup) await api.likeGroup(groupId);
  await revalidateGroup(groupId);
});

export const unlikeGroupAction = handleError(async (groupId: number) => {
  if (api.unlikeGroup) await api.unlikeGroup(groupId);
  await revalidateGroup(groupId);
});

export const deleteGroupAction = handleError(
  async (groupId: number, _data?: GroupDelete) => {
    await api.deleteGroup(groupId);
  },
);

export const joinGroupAction = handleError(
  async (groupId: number, data: GroupJoin) => {
    await api.joinGroup(groupId, data);
    await revalidateGroup(groupId);
  },
);

export const leaveGroupAction = handleError(
  async (groupId: number, _data?: GroupJoin) => {
    await api.leaveGroup(groupId);
    await revalidateGroup(groupId);
  },
);

export const updateGroupAction = handleError(
  async (groupId: number, data: GroupUpdate, authToken?: string) => {
    const group = await api.updateGroup(groupId, data, authToken);
    await revalidateGroup(groupId);
    return group;
  }
);

export const createGroupAction = handleError(async (data: GroupCreate, authToken?: string) => {
  const group = await createGroup(data, authToken);
  return group;
});
