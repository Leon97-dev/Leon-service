import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import { Exercise, RecordCreate } from '@/types/entities';
import styles from './RecordForm.module.css';
import Dropdown from '@/lib/components/Dropdown';
import Form from '@/lib/components/Form';
import Input, { Textarea } from '@/lib/components/Input';
import Label from '@/lib/components/Label';
import Button from '@/lib/components/Button';
import Card from '@/lib/components/Card';
import ImageInput from '@/lib/components/ImageInput';
import { createRecordAction } from '../actions';
import { axios } from '@/lib/axios';

const cx = classNames.bind(styles);

const defaultValues: RecordCreate = {
  photos: [],
  description: '',
  distance: undefined,
  time: undefined,
  count: undefined,
};

const RecordForm = ({
  groupId,
  onSubmit,
}: {
  groupId: number;
  onSubmit: () => void;
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { register, setValue, watch, handleSubmit, setError, formState } =
    useForm<RecordCreate>({
      defaultValues: {
        ...defaultValues,
      },
    });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get('/exercises');
        const list: Exercise[] = res.data.data ?? [];
        setExercises(list);
        if (list[0]) {
          setValue('exerciseId', list[0].id);
        }
        setLoadError(null);
      } catch (e) {
        console.error(e);
        setLoadError('운동 종목을 불러오지 못했습니다. 새로고침 해 주세요.');
      } finally {
        setLoading(false);
      }
    })();
  }, [setValue]);

  const submit = async (data: RecordCreate) => {
    const reuslt = await createRecordAction(groupId, data);
    if (reuslt.status !== 200) {
      setError('root', {
        message: reuslt.error.message,
      });
      return;
    }
    onSubmit();
  };

  return (
    <Card className={cx('container')}>
      <h1 className={cx('heading')}>기록 생성하기</h1>
      <Form
        className={cx('form')}
        onSubmit={handleSubmit(submit)}
        error={formState.errors.root?.message || loadError || undefined}
      >
        <div>
          <Label htmlFor="exerciseId">운동 종류</Label>
          <Dropdown
            options={exercises.map((ex) => ({
              label: ex.name,
              value: ex.id.toString(),
            }))}
            value={watch('exerciseId')?.toString()}
            onChange={(value: string) => {
              setValue('exerciseId', Number(value));
            }}
            disabled={loading || !!loadError}
          />
        </div>

        <div className={cx('photos')}>
          <Label htmlFor="photos">사진</Label>
          <ImageInput
            className={cx('photosInput')}
            maxCount={3}
            values={watch('photos')}
            onChange={(urls) => {
              setValue('photos', urls);
            }}
          />
        </div>

        <div>
          <Label htmlFor="description" error={!!formState.errors.description}>
            설명
          </Label>
          <Textarea
            id="description"
            error={formState.errors.description?.message}
            {...register('description')}
          />
        </div>

        <div>
          <Label htmlFor="distance">거리(KM)</Label>
          <Input
            type="number"
            id="distance"
            error={formState.errors.distance?.message}
            {...register('distance', {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <Label>시간(초)</Label>
          <Input
            type="number"
            error={formState.errors.time?.message}
            {...register('time', { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label htmlFor="count">횟수</Label>
          <Input
            type="number"
            id="count"
            error={formState.errors.count?.message}
            {...register('count', {
              valueAsNumber: true,
            })}
          />
        </div>

        <Button type="submit" className={cx('submit')} disabled={!formState.isValid}>
          생성하기
        </Button>
      </Form>
    </Card>
  );
};

export default RecordForm;
