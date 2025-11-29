"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames/bind";
import Input from "@/lib/components/Input";
import Label from "@/lib/components/Label";
import Button from "@/lib/components/Button";
import Form from "@/lib/components/Form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import styles from "./page.module.css";

const cx = classNames.bind(styles);

type LoginForm = {
  identifier: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { identifier: "", password: "" },
  });

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  const submit = async (data: LoginForm) => {
    try {
      await login(data.identifier, data.password);
      router.push("/");
    } catch (e: any) {
      setError("root", { message: e?.response?.data?.message || "로그인에 실패했습니다" });
    }
  };

  return (
    <div className={cx("page")}>
      <h1 className={cx("title")}>로그인</h1>
      <Form className={cx("form")} onSubmit={handleSubmit(submit)} error={errors.root?.message}>
        <Label htmlFor="identifier" error={!!errors.identifier}>
          아이디 또는 이메일
        </Label>
        <Input
          id="identifier"
          type="text"
          placeholder="아이디 또는 이메일"
          error={errors.identifier?.message}
          {...register("identifier", { required: "아이디 또는 이메일을 입력해 주세요." })}
        />

        <Label htmlFor="password" error={!!errors.password}>
          비밀번호
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호"
          error={errors.password?.message}
          {...register("password", { required: "비밀번호를 입력해 주세요." })}
        />

        <Button className={cx("submit")} type="submit" disabled={isSubmitting}>
          로그인
        </Button>
        <Link href="/register">회원가입 하기</Link>
      </Form>
    </div>
  );
}
