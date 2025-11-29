'use server';

import { createRecord, getRecords } from '@/lib/api';
import handleError from '@/lib/handleError';
import { RecordCreate } from '@/types/entities';
import { revalidatePath } from 'next/cache';

export const getRecordsAction = async (groupId: number, query?: Record<string, string>) => {
  return getRecords(groupId, query);
};

export const createRecordAction = handleError(
  async (groupId: number, record: RecordCreate) => {
    await createRecord(groupId, record);
    await revalidatePath(`/groups/${groupId}/records`);
  }
);
