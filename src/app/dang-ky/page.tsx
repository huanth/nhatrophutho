"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/ui/Navbar";
import { signInWithGoogle, signUpWithEmail } from "@/lib/firebase/auth";

type RegisterRole = "user" | "landlord";

function getRegisterErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  if (code === "auth/email-already-in-use") {
    return "Email này đã được sử dụng.";
  }

  if (code === "auth/invalid-email") {
    return "Email không hợp lệ.";
  }

  if (code === "auth/weak-password") {
    return "Mật khẩu quá yếu. Vui lòng dùng ít nhất 6 ký tự.";
  }

  return "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.";
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterRole>("user");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const displayName = name.trim();
    const normalizedEmail = email.trim();

    if (!displayName) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      await signUpWithEmail(normalizedEmail, password, displayName, role);
      router.push("/");
    } catch (err) {
      setError(getRegisterErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      router.push("/");
    } catch {
      setError("Đăng ký bằng Google thất bại. Vui lòng thử lại.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_460px] lg:px-8">
        <section className="hidden lg:block">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Bắt đầu miễn phí
          </p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight text-slate-950 dark:text-white">
            Tạo tài khoản để tìm phòng hoặc đăng tin cho thuê tại Phú Thọ.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
            Người thuê có thể lưu lựa chọn phù hợp. Chủ trọ có thể đăng bài và quản lý trạng thái duyệt tin.
          </p>
        </section>

        <Card className="w-full border border-slate-200 shadow-xl dark:border-slate-800">
          <Card.Content className="p-6 sm:p-8">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/25">
                <Icon icon="mdi:account-plus" className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Tạo tài khoản</h2>
              <p className="mt-1 text-sm text-slate-500">Chọn vai trò phù hợp với nhu cầu của bạn.</p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <Icon icon="mdi:alert-circle" className="mt-0.5 shrink-0 text-lg" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Họ và tên</span>
                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900">
                  <Icon icon="mdi:account" className="text-lg text-slate-400" />
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900">
                  <Icon icon="mdi:email" className="text-lg text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    placeholder="ban@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</span>
                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900">
                  <Icon icon="mdi:lock" className="text-lg text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    placeholder="Tối thiểu 6 ký tự"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="text-lg" />
                  </button>
                </div>
              </label>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Bạn là?</legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <RoleOption
                    checked={role === "user"}
                    description="Tìm và lưu phòng trọ"
                    icon="mdi:home-search"
                    label="Người tìm trọ"
                    onChange={() => setRole("user")}
                  />
                  <RoleOption
                    checked={role === "landlord"}
                    description="Đăng phòng cho thuê"
                    icon="mdi:home-plus"
                    label="Chủ nhà trọ"
                    onChange={() => setRole("landlord")}
                  />
                </div>
              </fieldset>

              <button type="submit" disabled={loading} className="button button--primary button--lg button--full-width font-semibold">
                {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs font-medium text-slate-400">hoặc</span>
              <Separator className="flex-1" />
            </div>

            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogle}
              className="button button--secondary button--lg button--full-width font-medium"
            >
              <Icon icon="devicon:google" />
              {googleLoading ? "Đang xử lý..." : "Đăng ký với Google"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Đã có tài khoản?{" "}
              <Link href="/dang-nhap" className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
                Đăng nhập
              </Link>
            </p>
          </Card.Content>
        </Card>
      </main>
    </div>
  );
}

function RoleOption({
  checked,
  description,
  icon,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  icon: string;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
        checked
          ? "border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/15 dark:bg-sky-950/40 dark:text-sky-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      }`}
    >
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sky-600 dark:bg-slate-800">
        <Icon icon={icon} className="text-xl" />
      </span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{description}</span>
      </span>
    </label>
  );
}
