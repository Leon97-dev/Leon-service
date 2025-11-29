'use server';

import { getGroups } from '@/lib/api';

export const getGroupsAction = async (query?: Record<string, string>) => {
  return getGroups(query);
};
