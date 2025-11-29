"use client";

import { ChangeEvent, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames/bind";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Input from "@/lib/components/Input";
import Button from "@/lib/components/Button";
import Form from "@/lib/components/Form";
import SafeImage from "@/lib/components/SafeImage";
import { uploadImage } from "@/lib/api";
import { updateProfile } from "@/lib/auth";
import styles from "./page.module.css";

const cx = classNames.bind(styles);

type ProfileForm = {
  nickName?: string;
  profileImageUrl: string;
};

const DEFAULT_PROFILE_IMAGE = "/assets/default-frofile.png";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const toDisplayUrl = (url?: string | null) => {
  if (!url) return DEFAULT_PROFILE_IMAGE;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/assets")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return url;
};

const toApiUrl = (url?: string | null) => {
  if (!url) return DEFAULT_PROFILE_IMAGE;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/assets")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return url;
};

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProfileForm>({
    defaultValues: {
      nickName: user?.nickName || "",
      profileImageUrl: user?.profileImageUrl || "",
    },
  });

  const profileImageValue = watch("profileImageUrl");
  const profileImageUrl = toDisplayUrl(profileImageValue);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setValue("nickName", user.nickName || "");
      setValue("profileImageUrl", user.profileImageUrl || DEFAULT_PROFILE_IMAGE);
    }
  }, [user, setValue]);

  if (loading || !user) {
    return <div className={cx("page")}>불러오는 중...</div>;
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) {
      return;
    }

    try {
      const { urls } = await uploadImage([files[0]]);
      setValue("profileImageUrl", urls[0] || "");
    } catch (error) {
      console.error("이미지 업로드 실패", error);
    }
  };

  const handleRemoveImage = () => {
    setValue("profileImageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async (data: ProfileForm) => {
    const payload = {
      nickName: data.nickName || undefined,
      profileImageUrl: toApiUrl(data.profileImageUrl),
    };

    try {
      await updateProfile(payload);
      await refresh();
      router.push("/me");
    } catch (error) {
      console.error("프로필 저장 실패", error);
    }
  };

  return (
    <div className={cx("page")}>
      <h1 className={cx("title")}>내 정보 변경</h1>
      <Form className={cx("form")} onSubmit={handleSubmit(submit)}>
        <div className={cx("table")}>
          <div className={cx("row")}>
            <div className={cx("labelCell")}>프로필 사진</div>
            <div className={cx("contentCell")}>
              <div className={cx("avatarSection")}>
                <div className={cx("avatarPreview")}>
                  <SafeImage
                    className={cx("avatarImage")}
                    src={profileImageUrl}
                    alt="profile"
                    width={180}
                    height={180}
                    fallback={
                      <div className={cx("avatarFallback")}>
                        {(user.nickName || user.username || "?").charAt(0).toUpperCase()}
                      </div>
                    }
                  />
                </div>
                <div className={cx("avatarActions")}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={cx("fileInput")}
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    appearance="minimal"
                    className={cx("actionButton")}
                    onClick={handleUploadClick}
                  >
                    사진변경
                  </Button>
                  <Button
                    type="button"
                    appearance="minimal"
                    className={cx("actionButton")}
                    onClick={handleRemoveImage}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("row")}>
            <div className={cx("labelCell")}>별명</div>
            <div className={cx("contentCell")}>
              <Input
                id="nickName"
                type="text"
                placeholder="별명을 입력하세요"
                error={errors.nickName?.message}
                className={cx("textInput")}
                {...register("nickName")}
              />
            </div>
          </div>
        </div>

        <div className={cx("actions")}>
          <Button className={cx("submit")} type="submit">
            저장
          </Button>
        </div>
      </Form>
    </div>
  );
}
