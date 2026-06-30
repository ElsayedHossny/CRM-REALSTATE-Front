"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/services/getProperties.services";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginAdmin(email, password);
      alert("تم تسجيل الدخول بنجاح!");
      router.push("/controlPanel");
    } catch (err) {
      alert("خطأ: تأكد من الإيميل والباسورد");
    }
  };

  return (
    <div
      className="relative flex h-screen items-center justify-center"
      dir="rtl"
    >
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
        alt="عقار"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-1 text-white">دخول لوحة التحكم</h1>
        <p className="text-white/60 text-sm mb-8">أدخل بياناتك للمتابعة</p>

        <form onSubmit={handleLogin}>
          <label className="block text-sm text-white/80 mb-1.5">
            البريد الإلكتروني
          </label>
          <div className="flex items-center gap-2.5 border border-white/30 rounded-xl px-3.5 bg-white/10 mb-4 focus-within:border-white/70 transition-colors">
            <svg
              className="w-4 h-4 text-white/50 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              type="email"
              className="flex-1 bg-transparent py-3 text-sm text-right text-white placeholder-white/40 outline-none"
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label className="block text-sm text-white/80 mb-1.5">
            كلمة المرور
          </label>
          <div className="flex items-center gap-2.5 border border-white/30 rounded-xl px-3.5 bg-white/10 mb-8 focus-within:border-white/70 transition-colors">
            <svg
              className="w-4 h-4 text-white/50 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              type="password"
              className="flex-1 bg-transparent py-3 text-sm text-right text-white placeholder-white/40 outline-none"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0F6E56] hover:bg-[#085041] text-white py-3 rounded-xl font-medium transition-colors"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
