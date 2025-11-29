"use client";

import { useEffect } from "react";
import classNames from "classnames/bind";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import styles from "./page.module.css";
import SafeImage from "@/lib/components/SafeImage";

const cx = classNames.bind(styles);

const DEFAULT_PROFILE_IMAGE = "/assets/default-frofile.png";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const toDisplayUrl = (url?: string | null) => {
  if (!url) return DEFAULT_PROFILE_IMAGE;
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  if (url.startsWith("/assets")) return url; // 프론트 정적 자산
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`; // 업로드 등 백엔드 경로
  return url;
};

export default function MePage() {
  const { user, loading, refresh, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className={cx("page")}>불러오는 중...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={cx("page")}>
      <h1 className={cx("title")}>내 정보</h1>
      <div className={cx("profileRow")}>
        <div className={cx("avatarCard")}>
          <div className={cx("avatar")}>
            <SafeImage
              className={cx("avatarImage")}
              src={toDisplayUrl(user.profileImageUrl)}
              alt="profile"
              width={140}
              height={140}
              fallback={toDisplayUrl(DEFAULT_PROFILE_IMAGE)}
            />
          </div>
          <div className={cx("avatarLabel")}>{user.nickName || user.username}</div>
        </div>
        <div className={cx("card")}>
          <div><strong>아이디</strong>: {user.username}</div>
          <div><strong>닉네임</strong>: {user.nickName || "(없음)"}</div>
          <div><strong>이메일</strong>: {user.email || "(없음)"}</div>
          <div><strong>역할</strong>: {user.role}</div>
        </div>
      </div>
      <div className={cx("actions")}>
        <button className={cx("button")} onClick={() => router.push("/profile")}>내 정보 변경</button>
        <button className={cx("logout")} onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
}
