"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import Navbar from "@/components/ui/Navbar";
import { signInWithEmail, signInWithGoogle } from "@/lib/firebase/auth";

function getLoginErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Email hoặc mật khẩu không đúng.";
  }

  if (code === "auth/too-many-requests") {
    return "Bạn đã thử quá nhiều lần. Vui lòng chờ một lát rồi thử lại.";
  }

  return "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email.trim(), password);
      router.push("/");
    } catch (err) {
      setError(getLoginErrorMessage(err));
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
      setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
        <section className="hidden lg:block">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            Nhà Trọ Phú Thọ
          </p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight text-slate-950 dark:text-white">
            Quản lý tin đăng và tìm phòng trọ phù hợp trong vài thao tác.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
            Đăng nhập để lưu bộ lọc, quản lý bài đăng và liên hệ chủ trọ nhanh hơn.
          </p>
        </section>

        <Card className="w-full border border-slate-200 shadow-xl dark:border-slate-800">
          <Card.Content className="p-6 sm:p-8">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 shadow-lg shadow-sky-500/25">
                <Icon icon="mdi:login" className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Đăng nhập</h2>
              <p className="mt-1 text-sm text-slate-500">Chào mừng bạn quay trở lại.</p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <Icon icon="mdi:alert-circle" className="mt-0.5 shrink-0 text-lg" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
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

              <button type="submit" disabled={loading} className="button button--primary button--lg button--full-width font-semibold">
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs font-medium text-slate-400">hoặc</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogle}
              className="button button--secondary button--lg button--full-width font-medium"
            >
              <Icon icon="devicon:google" />
              {googleLoading ? "Đang xử lý..." : "Đăng nhập với Google"}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Chưa có tài khoản?{" "}
              <Link href="/dang-ky" className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
                Đăng ký ngay
              </Link>
            </p>
          </Card.Content>
        </Card>
      </main>
    </div>
  );
}
