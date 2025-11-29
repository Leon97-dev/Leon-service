import { AxiosError } from 'axios';
import {
  Group,
  GroupCreate,
  GroupDelete,
  GroupJoin,
  GroupUpdate,
  Rank,
  RankDuration,
  Record,
  RecordCreate,
} from '@/types/entities';
import { PaginationQuery, PaginationResponse } from '@/types/pagination';
import { axios } from './axios';

export const DEFAULT_GROUPS_PAGINATION_QUERY: PaginationQuery = {
  page: 1,
  limit: 6,
  order: 'desc',
  orderBy: 'createdAt',
  search: '',
};

const logError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const response = error.response;
    if (response) {
      const message =
        response.data?.message ||
        response.data?.error ||
        response.data;
      console.error(
        `[프론트] ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status}`,
        message,
      );
    }
  }
};

export const getGroups = async (query?: Partial<PaginationQuery>): Promise<PaginationResponse<Group>> => {
  try {
    const response = await axios.get('/groups', {
      params: {
        ...DEFAULT_GROUPS_PAGINATION_QUERY,
        ...query,
      },
    });
    const { data, total } = response.data;
    return { data, total };
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getGroup = async (groupId: number): Promise<Group> => {
  try {
    const response = await axios.get(`/groups/${groupId}`);
    return response.data.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const createGroup = async (group: GroupCreate, authToken?: string): Promise<Group> => {
  try {
    const response = await axios.post('/groups', group, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });
    return response.data.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const updateGroup = async (
  groupId: number,
  group: GroupUpdate,
  authToken?: string,
): Promise<Group> => {
  try {
    const response = await axios.patch(`/groups/${groupId}`, group, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });
    return response.data.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const deleteGroup = (groupId: number, _data?: GroupDelete) => {
  return axios.delete(`/groups/${groupId}`).catch((error) => {
    logError(error);
    throw error;
  });
};

export const joinGroup = async (groupId: number, data: Partial<GroupJoin> = {}): Promise<void> => {
  try {
    await axios.post(`/groups/${groupId}/join`, data);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const leaveGroup = async (groupId: number): Promise<void> => {
  try {
    await axios.delete(`/groups/${groupId}/leave`);
  } catch (error) {
    logError(error);
    throw error;
  }
};

// 좋아요
export const likeGroup = async (groupId: number): Promise<{ likeCount: number }> => {
  try {
    const response = await axios.post(`/groups/${groupId}/like`);
    return response.data.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};

// 좋아요 취소
export const unlikeGroup = async (groupId: number): Promise<{ likeCount: number }> => {
  try {
    const response = await axios.delete(`/groups/${groupId}/like`);
    return response.data.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getGroupLikeStatus = async (
  groupId: number,
): Promise<{ liked: boolean; likeCount: number; groupId: number }> => {
  try {
    const response = await axios.get(`/groups/${groupId}/like`);
    return response.data.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const DEFAULT_RECORDS_PAGINATION_QUERY: PaginationQuery = {
  page: 1,
  limit: 6,
  order: 'desc',
  orderBy: 'createdAt',
  search: '',
};

export const getRecords = async (
  groupId: number,
  query?: Partial<PaginationQuery>,
): Promise<PaginationResponse<Record>> => {
  try {
    const response = await axios.get(`/groups/${groupId}/records`, {
      params: {
        ...DEFAULT_RECORDS_PAGINATION_QUERY,
        ...query,
      },
    });
    const { data, total } = response.data;
    return { data, total };
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const createRecord = async (groupId: number, record: RecordCreate): Promise<Record> => {
  try {
    const response = await axios.post(`/groups/${groupId}/records`, record);
    return response.data.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getRanks = async (groupId: number, duration: RankDuration): Promise<Rank[]> => {
  try {
    const response = await axios.get(`/groups/${groupId}/rankings`, {
      params: { period: duration === RankDuration.MONTH ? 'month' : 'week' },
    });
    const ranks: Rank[] = response.data.data?.ranks ?? [];
    return ranks;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const uploadImage = async (
  files: File[],
): Promise<{
  urls: string[];
}> => {
  try {
    const formData = new FormData();
    if (files[0]) {
      formData.append('image', files[0]);
    }
    const response = await axios.postForm('/upload', formData);
    const url = response.data.data?.url ?? '';
    return { urls: url ? [url] : [] };
  } catch (error) {
    // 회원가입 과정에서는 인증이 없을 수 있으므로 401이면 업로드를 건너뜁니다.
    if (error instanceof AxiosError && error.response?.status === 401) {
      return { urls: [] };
    }
    logError(error);
    throw error;
  }
};

export const checkAvailability = async (params: {
  username?: string;
  email?: string;
  nickName?: string;
}): Promise<{
  username: boolean | null;
  email: boolean | null;
  nickName: boolean | null;
}> => {
  try {
    const response = await axios.get('/users/check', { params });
    return response.data.data;
  } catch (error) {
    logError(error);
    throw error;
  }
};
