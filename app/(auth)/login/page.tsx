"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Building2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { UserContext } from "../../(site)/(Context)/Context";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { setUserToken } = userContext;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch(
        "https://back-end-crm-project.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const data = await res.json();

      // التعديل هنا: استخدام data.data.accessToken بدلاً من data.token
      if (!res.ok || !data.data?.accessToken) {
        form.setError("root", {
          message: data.message || "بيانات غير صحيحة، حاول مرة أخرى",
        });
        return;
      }

      // تخزين الـ Token الصحيح
      localStorage.setItem("userToken2", data.data.accessToken);
      setUserToken?.(data.data.accessToken);
      router.push("/");
    } catch {
      form.setError("root", { message: "حدث خطأ، يرجى المحاولة لاحقاً" });
    }
  }
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

      <div className="relative z-10 w-full max-w-2xl mx-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center">
            <Building2 className="size-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl text-white font-bold tracking-tight">
              تسجيل الدخول
            </h1>
            <p className="text-sm text-white  mt-1">
              أهلاً بعودتك، سجل دخولك للمتابعة
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Root error */}
              {form.formState.errors.root && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3 text-center">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* البريد */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      البريد الإلكتروني
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          size={15}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          placeholder="example@gmail.com"
                          className="pr-9 h-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* كلمة المرور */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-medium">
                        كلمة المرور
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-green-700 hover:underline"
                      >
                        نسيت كلمة المرور؟
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          size={15}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pr-9 h-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-green-700 hover:bg-green-800 text-white rounded-full gap-2 mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الدخول...
                  </span>
                ) : (
                  <>
                    <LogIn size={15} />
                    تسجيل الدخول
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-white  mt-5">
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            className="text-white font-medium hover:underline"
          >
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
}
