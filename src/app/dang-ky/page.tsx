"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Input, Button, Divider, RadioGroup, Radio } from "@heroui/react";
import { Icon } from "@iconify/react";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import Navbar from "@/components/ui/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "landlord">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Mật khẩu tối thiểu 6 ký tự"); return; }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name, role);
      router.push("/");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") setError("Email đã được sử dụng");
      else setError("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch { setError("Đăng nhập Google thất bại"); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12 sm:py-16">
        <Card className="w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700">
          <Card.Content className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mb-3 shadow-lg shadow-sky-500/25">
                <Icon icon="mdi:account-plus" className="text-white text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tạo tài khoản</h1>
              <p className="text-sm text-slate-500 mt-1">Tham gia cộng đồng tìm trọ Phú Thọ</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <Icon icon="mdi:alert-circle" />{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Họ và tên" variant="bordered" value={name} onValueChange={setName} startContent={<Icon icon="mdi:account" className="text-slate-400" />} isRequired />
              <Input label="Email" type="email" variant="bordered" value={email} onValueChange={setEmail} startContent={<Icon icon="mdi:email" className="text-slate-400" />} isRequired />
              <Input label="Mật khẩu" type={showPassword ? "text" : "password"} variant="bordered" value={password} onValueChange={setPassword}
                startContent={<Icon icon="mdi:lock" className="text-slate-400" />}
                endContent={<button type="button" onClick={() => setShowPassword(!showPassword)}><Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="text-slate-400" /></button>}
                isRequired />

              <RadioGroup label="Bạn là?" orientation="horizontal" value={role} onValueChange={(v) => setRole(v as "user" | "landlord")} classNames={{ label: "text-sm font-medium text-slate-700 dark:text-slate-300" }}>
                <Radio value="user" description="Tìm phòng trọ">
                  <span className="text-sm">Người tìm trọ</span>
                </Radio>
                <Radio value="landlord" description="Đăng phòng cho thuê">
                  <span className="text-sm">Chủ nhà trọ</span>
                </Radio>
              </RadioGroup>

              <Button type="submit" color="primary" fullWidth size="lg" isLoading={loading} className="font-semibold shadow-lg shadow-sky-500/25">
                Đăng ký
              </Button>
            </form>

            <Divider className="my-5" />

            <Button fullWidth variant="bordered" size="lg" onPress={handleGoogle} startContent={<Icon icon="devicon:google" />} className="font-medium">
              Đăng ký với Google
            </Button>

            <p className="text-center text-sm text-slate-500 mt-5">
              Đã có tài khoản?{" "}
              <Link href="/dang-nhap" className="text-sky-600 font-semibold hover:underline">Đăng nhập</Link>
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

