'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import Input from '@/lib/components/Input';
import Label from '@/lib/components/Label';
import Button from '@/lib/components/Button';
import Form from '@/lib/components/Form';
import { register as registerApi } from '@/lib/auth';
import SafeImage from '@/lib/components/SafeImage';
import { checkAvailability, uploadImage } from '@/lib/api';
import styles from './page.module.css';

const cx = classNames.bind(styles);
const DEFAULT_PROFILE_IMAGE = '/assets/default-frofile.png';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const carriers = ['SKT', 'KT', 'LGU', 'MVNO'] as const;
const genders = ['male', 'female'] as const;
const nationalities = ['domestic', 'foreign'] as const;

type RegisterForm = {
  username: string;
  password: string;
  passwordConfirm?: string;
  email: string;
  nickName: string;
  profileImageUrl?: string;
  birthDate: string;
  carrier: (typeof carriers)[number];
  gender: (typeof genders)[number];
  nationality: (typeof nationalities)[number];
  phoneNumber: string;
  description?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterForm & { passwordConfirm: string }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      nickName: '',
      profileImageUrl: '',
      birthDate: '',
      carrier: 'SKT',
      gender: 'male',
      nationality: 'domestic',
      phoneNumber: '',
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availability, setAvailability] = useState<{
    username: boolean | null;
    nickName: boolean | null;
    email: boolean | null;
  }>({
    username: null,
    nickName: null,
    email: null,
  });
  const profileImageUrl = watch('profileImageUrl');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const usernameValue = watch('username');
  const nickNameValue = watch('nickName');
  const emailValue = watch('email');
  const birthDateValue = watch('birthDate');
  const passwordValue = watch('password');
  const toPreviewUrl = (url?: string | null) => {
    if (!url) return DEFAULT_PROFILE_IMAGE;
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/assets')) return url; // 프론트 정적 자산
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`; // 업로드 등 백엔드 경로
    return url;
  };
  const previewSrc = toPreviewUrl(previewImage || profileImageUrl);
  const availabilityTimer = useRef<NodeJS.Timeout | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  useEffect(() => {
    if (!passwordValue) {
      setPasswordValid(null);
      return;
    }
    setPasswordValid(passwordValue.length >= 8);
  }, [passwordValue]);

  useEffect(() => {
    const confirm = watch('passwordConfirm');
    if (!confirm) {
      setPasswordMatch(null);
      return;
    }
    setPasswordMatch(confirm === passwordValue);
  }, [watch('passwordConfirm'), passwordValue, watch]);

  useEffect(() => {
    if (!birthDateValue) {
      clearErrors('birthDate');
      return;
    }
    if (!/^\d{8}$/.test(birthDateValue)) {
      setError('birthDate', { message: '생년월일은 8자리 숫자(YYYYMMDD)로 입력해 주세요.' });
    } else {
      clearErrors('birthDate');
    }
  }, [birthDateValue, setError, clearErrors]);

  useEffect(() => {
    const controller = new AbortController();
    if (availabilityTimer.current) clearTimeout(availabilityTimer.current);

    availabilityTimer.current = setTimeout(async () => {
      try {
        const params = {
          username: usernameValue || undefined,
          nickName: nickNameValue || undefined,
          email: emailValue || undefined,
        };
        // 값이 모두 비어있으면 상태 리셋 후 호출하지 않음
        if (!params.username && !params.nickName && !params.email) {
          setAvailability({ username: null, nickName: null, email: null });
          clearErrors(['username', 'nickName', 'email']);
          return;
        }
        const validEmail = params.email
          ? /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.[A-Za-z]{2,}$/.test(params.email)
          : false;

        // 이메일 형식이 올바르지 않으면 중복 체크도 하지 않고 에러로 표시
        if (params.email && !validEmail) {
          setError('email', { message: '이메일 형식을 확인해 주세요.' });
          setAvailability((prev) => ({ ...prev, email: null }));
        }

        const data = await checkAvailability(params);

        if (params.username) {
          if (data.username === false) {
            setError('username', { message: '이미 사용 중인 아이디입니다.' });
            setAvailability((prev) => ({ ...prev, username: false }));
          } else {
            clearErrors('username');
            setAvailability((prev) => ({ ...prev, username: data.username }));
          }
        }

        if (params.nickName) {
          if (data.nickName === false) {
            setError('nickName', { message: '이미 사용 중인 닉네임입니다.' });
            setAvailability((prev) => ({ ...prev, nickName: false }));
          } else {
            clearErrors('nickName');
            setAvailability((prev) => ({ ...prev, nickName: data.nickName }));
          }
        }

        if (params.email && validEmail) {
          if (data.email === false) {
            setError('email', { message: '이미 사용 중인 이메일입니다.' });
            setAvailability((prev) => ({ ...prev, email: false }));
          } else {
            clearErrors('email');
            setAvailability((prev) => ({ ...prev, email: data.email }));
          }
        }
      } catch {
        // 무시: 중복 확인 실패해도 폼 사용은 계속
      }
    }, 500);

    return () => {
      if (availabilityTimer.current) clearTimeout(availabilityTimer.current);
      controller.abort();
    };
  }, [usernameValue, nickNameValue, emailValue, setError]);

  const submit = async (data: RegisterForm) => {
    try {
      const { passwordConfirm, ...payload } = data as RegisterForm & { passwordConfirm?: string };
      const img = payload.profileImageUrl ?? '';
      const sanitizedImage =
        img.startsWith('http://') ||
        img.startsWith('https://') ||
        img.startsWith('/assets') ||
        img.startsWith('/uploads');
      payload.profileImageUrl = sanitizedImage ? img : DEFAULT_PROFILE_IMAGE;

      // email은 필수이므로 타입을 문자열로 고정
      payload.email = payload.email || '';

      const formattedPhone = formatPhoneNumber(payload.phoneNumber || '');
      payload.phoneNumber =
        formattedPhone.replace(/\D/g, '').length === 11 ? formattedPhone : payload.phoneNumber;

      await registerApi(payload);
      router.push('/login');
    } catch (e: any) {
      const message = e?.response?.data?.message || '회원가입에 실패했습니다';
      if (message.includes('nickName') || message.toLowerCase().includes('nickname')) {
        setError('nickName', { message: '이미 사용 중인 닉네임입니다.' });
        return;
      }
      if (message.includes('username')) {
        setError('username', { message: '이미 사용 중인 아이디입니다.' });
        return;
      }
      if (message.includes('email')) {
        setError('email', { message: '이미 사용 중인 이메일입니다.' });
        return;
      }
      setError('root', { message });
    }
  };

  return (
    <div className={cx('page')}>
      <h1 className={cx('title')}>회원가입</h1>
      <Form className={cx('form')} onSubmit={handleSubmit(submit)} error={errors.root?.message}>
        <div className={cx('leftCol')}>
          <div>
            <Label htmlFor="username" error={!!errors.username}>
              아이디
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="아이디"
              error={errors.username?.message}
              {...register('username', { required: '아이디를 입력해 주세요.' })}
            />
            {availability.username && !errors.username && (
              <p className={cx('success')}>사용 가능한 아이디입니다.</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" error={!!errors.password}>
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호"
              error={errors.password?.message}
              {...register('password', {
                required: '비밀번호를 입력해 주세요.',
                minLength: { value: 8, message: '비밀번호는 8자 이상 입력해 주세요.' },
              })}
            />
            {!errors.password && passwordValid && (
              <p className={cx('success')}>사용 가능한 비밀번호입니다.</p>
            )}
          </div>

          <div>
            <Label htmlFor="passwordConfirm" error={!!errors.passwordConfirm}>
              비밀번호 재확인
            </Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호 재입력"
              error={errors.passwordConfirm?.message}
              {...register('passwordConfirm', {
                required: '비밀번호를 다시 입력해 주세요.',
                validate: (value) => value === passwordValue || '비밀번호가 일치하지 않습니다.',
              })}
            />
            {!errors.passwordConfirm && passwordMatch && (
              <p className={cx('success')}>비밀번호가 일치합니다.</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" error={!!errors.email}>
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email"
              error={errors.email?.message}
              {...register('email', {
                required: '이메일을 입력해 주세요.',
                pattern: { value: /^\S+@\S+\.\S+$/, message: '이메일 형식을 확인해 주세요.' },
              })}
            />
            {availability.email && !errors.email && (
              <p className={cx('success')}>사용 가능한 이메일입니다.</p>
            )}
          </div>

          <div className={cx('double')}>
            <div>
              <Label htmlFor="birthDate" error={!!errors.birthDate}>
                생년월일(YYYYMMDD)
              </Label>
              <Input
                id="birthDate"
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="19900101"
                error={errors.birthDate?.message}
                {...register('birthDate', {
                  required: '생년월일을 입력해 주세요.',
                  pattern: {
                    value: /^\d{8}$/,
                    message: '생년월일은 8자리 숫자로 입력해 주세요.',
                  },
                  onChange: (e) => {
                    const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                    setValue('birthDate', v, { shouldValidate: true, shouldDirty: true });
                  },
                })}
              />
            </div>
            <div>
              <Label htmlFor="gender" error={!!errors.gender}>
                성별
              </Label>
              <select
                id="gender"
                className={cx('select')}
                {...register('gender', { required: true })}
              >
                <option value="male">남</option>
                <option value="female">여</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="nationality" error={!!errors.nationality}>
              국적
            </Label>
            <select
              id="nationality"
              className={cx('select')}
              {...register('nationality', { required: true })}
            >
              <option value="domestic">내국인</option>
              <option value="foreign">외국인</option>
            </select>
          </div>

          <div>
            <Label htmlFor="carrier" error={!!errors.carrier}>
              통신사
            </Label>
            <select
              id="carrier"
              className={cx('select')}
              {...register('carrier', { required: true })}
            >
              {carriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="phoneNumber" error={!!errors.phoneNumber}>
              전화번호
            </Label>
            <Input
              id="phoneNumber"
              type="text"
              placeholder="010-1234-5678"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber', {
                required: '전화번호를 입력해 주세요.',
                validate: (value) =>
                  value.replace(/\D/g, '').length === 11 || '전화번호는 11자리로 입력해 주세요.',
                onChange: (e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setValue('phoneNumber', formatted, { shouldValidate: true, shouldDirty: true });
                },
              })}
            />
          </div>
        </div>

        <div className={cx('rightColWrap')}>
          <div>
            <Label htmlFor="nickName" error={!!errors.nickName}>
              닉네임
            </Label>
            <Input
              id="nickName"
              type="text"
              placeholder="별명"
              error={errors.nickName?.message}
              {...register('nickName', {
                required: '닉네임을 입력해 주세요.',
                minLength: { value: 1, message: '닉네임을 입력해 주세요.' },
              })}
            />
            {availability.nickName && !errors.nickName && (
              <p className={cx('success')}>사용 가능한 닉네임입니다.</p>
            )}
          </div>

          <div className={cx('profileCard')}>
            <div className={cx('profileHeader')}>
              <div className={cx('profileLabel')}>
                <Label htmlFor="profileImageUrl" error={!!errors.profileImageUrl}>
                  프로필 이미지(선택)
                </Label>
              </div>
              <div className={cx('headerActions')}>
                <input
                  ref={fileInputRef}
                  id="profileImageUrl"
                  type="file"
                  accept="image/*"
                  className={cx('hiddenFile')}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const { urls } = await uploadImage([file]);
                      if (urls[0]) {
                        setPreviewImage(urls[0]);
                        setValue('profileImageUrl', urls[0], { shouldValidate: true, shouldDirty: true });
                        return;
                      }
                    } catch {
                      // ignore, fallback below
                    }
                    const localUrl = URL.createObjectURL(file);
                    setPreviewImage(localUrl);
                    setValue('profileImageUrl', '', { shouldValidate: true, shouldDirty: true });
                  }}
                />
                <Button
                  type="button"
                  sizes="small"
                  appearance="minimal"
                  className={cx('uploadButton')}
                  onClick={() => {
                    if (profileImageUrl && profileImageUrl !== DEFAULT_PROFILE_IMAGE) {
                      setPreviewImage(null);
                      setValue('profileImageUrl', DEFAULT_PROFILE_IMAGE);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    } else {
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  {profileImageUrl && profileImageUrl !== DEFAULT_PROFILE_IMAGE ? '×' : '+'}
                </Button>
              </div>
            </div>
            <div className={cx('imagePreviewBox')}>
              <SafeImage
                className={cx('imagePreview')}
                src={previewSrc}
                alt="profile preview"
                width={260}
                height={160}
                style={{ objectFit: 'contain', background: '#f5f5f5' }}
                fallback={<div className={cx('imagePreviewFallback')}>이미지 미리보기</div>}
              />
            </div>
          </div>
        </div>

        <Button className={cx('submit')} type="submit" disabled={isSubmitting}>
          가입하기
        </Button>
      </Form>
    </div>
  );
}
