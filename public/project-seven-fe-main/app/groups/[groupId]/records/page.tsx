import GroupDetail from '../components/GroupDetail';
import GroupTab from '../components/GroupTab';
import RecordList from './components/RecordList';
import RecordTabHeader from './components/RecordTabHeader';
import { getGroupAction } from '../../actions';
import { getRecordsAction } from './actions';

const GroupRecordsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<Record<string, string>>;
}) => {
  const groupId = Number((await params).groupId);
  const group = await getGroupAction(groupId);

  const queryParams = await searchParams;
  const search = queryParams.search ?? '';
  const orderBy = queryParams.orderBy ?? 'createdAt';
  const { data: records, total: recordsTotal } = await getRecordsAction(groupId, {
    search,
    orderBy,
  });

  const recordsTotalCount = recordsTotal ?? records.length;

  return (
    <>
      <GroupDetail group={group} />
      <GroupTab groupId={groupId} selectedTab="records">
        <RecordTabHeader groupId={groupId} recordsTotal={recordsTotalCount} />
      </GroupTab>
      <RecordList groupId={groupId} initialValues={records} />
    </>
  );
};

export default GroupRecordsPage;
