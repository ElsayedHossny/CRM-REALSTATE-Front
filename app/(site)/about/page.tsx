"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Headset,
  LineChart,
  BadgeCheck,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const timeline = [
  {
    year: "2019",
    title: "بداية الانطلاقة",
    description:
      "بدأت رحلتنا بهدف إعادة تعريف تجربة البحث عن العقارات الفاخرة في مصر بسؤال بسيط حول شفافية البيانات.",
  },
  {
    year: "2021",
    title: "توسّع المشاريع",
    description:
      "أضفنا مئات المشاريع المميزة داخل القاهرة الجديدة والعاصمة لخدمة عملائنا بشكل أوسع.",
  },
  {
    year: "2023",
    title: "شراكات استراتيجية",
    description:
      "أطلقنا تعاونات قوية ومباشرة مع أكبر شركات التطوير العقاري لتقديم فرص استثمارية حصرية.",
  },
  {
    year: "2025",
    title: "تجربة رقمية متكاملة",
    description:
      "طورنا منصة رقمية حديثة تجمع بين الفخامة، السرعة، والشفافية الكاملة التي يطمح لها السوق المصري.",
  },
];

const stats = [
  { label: "وحدة سكنية", value: "+1200" },
  { label: "مشروع مكتمل", value: "+45" },
  { label: "عميل راضٍ", value: "+3000" },
  { label: "سنة خبرة", value: "+12" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "توثيق كامل لكل وحدة",
    body: "كل وحدة مسجلة بمستنداتها القانونية الكاملة قبل عرضها على المنصة. لا مفاجآت، لا غموض.",
  },
  {
    icon: MapPin,
    title: "بحث جغرافي دقيق",
    body: "ابحث بالمنطقة، الحي، أو المسافة من أي معلم بخريطة تفاعلية لكل الوحدات المتاحة.",
  },
  {
    icon: Clock,
    title: "تحديث فوري للأسعار",
    body: "أسعار محدّثة لحظياً من المطورين مباشرة دون وسطاء.",
  },
  {
    icon: Headset,
    title: "دعم مبيعات 24/7",
    body: "فريق متخصص جاهز للإجابة على استفساراتك في أي وقت.",
  },
  {
    icon: LineChart,
    title: "تحليل السوق العقاري",
    body: "تقارير دورية عن اتجاهات الأسعار ومعدلات البيع لتساعدك على اتخاذ قرار استثماري صحيح.",
  },
  {
    icon: BadgeCheck,
    title: "مطورون معتمدون فقط",
    body: "شركاؤنا يمرون بعملية تحقق وتقييم صارمة قبل الانضمام.",
  },
];

export default function AboutUs() {
  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 transition-colors duration-300"
      dir="rtl"
    >
      <section className="relative min-h-[85vh] h-[100vh] flex items-center justify-center overflow-hidden bg-zinc-950">
        {/* الخلفية */}
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/about/hero.jpg"
            alt="عقارات مصر"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        {/* طبقات التدرج لتحسين القراءة */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/75 to-zinc-950/40" />
        <div className="absolute inset-0 bg-gradient-to-l from-zinc-950/60 via-transparent to-zinc-950/60" />

        {/* توهجات خضراء ديكورية */}
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-green-500/10 blur-[100px] -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[200px] bg-emerald-400/10 blur-[100px] -z-0 pointer-events-none" />

        <div className="relative z-10 container px-6 text-center text-white">
          <motion.span
            {...fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 backdrop-blur-md text-green-400 text-xs font-semibold mb-6 shadow-lg shadow-green-900/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            من نحن
          </motion.span>

          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
          >
            نبني تجربة عقارية{" "}
            <span className="bg-gradient-to-l from-green-300 via-green-400 to-green-500 bg-clip-text text-transparent">
              تليق بأسلوب حياتك
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base md:text-lg text-zinc-300 leading-8"
          >
            بدأنا رحلتنا عام 2019 بسؤال بسيط: لماذا يصعب على المصريين إيجاد
            وحدتهم المثالية في سوق مليء بالفرص؟ آمنّا بأن التكنولوجيا قادرة على
            تغيير قواعد اللعبة.
          </motion.p>

          {/* خط فاصل زخرفي */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="mt-9 flex items-center justify-center gap-2"
          >
            <span className="h-px w-10 bg-green-500/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <span className="h-px w-10 bg-green-500/40" />
          </motion.div>
        </div>

        {/* مؤشر تمرير لأسفل */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-[11px] tracking-widest uppercase">
            مرر للأسفل
          </span>
          <span className="w-5 h-9 rounded-full border border-white/30 flex items-start justify-center p-1.5">
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut",
              }}
              className="w-1 h-1.5 rounded-full bg-green-400"
            />
          </span>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="border-y mt-10 border-slate-100 dark:border-neutral-800">
        <div className="container max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-slate-100 dark:divide-neutral-800">
          {stats.map((s) => (
            <div key={s.label} className="py-10 text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-green-700 dark:text-green-400">
                {s.value}
              </p>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION / VISION + IMAGE */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div {...fadeUp}>
            <div className="relative w-full h-[320px] md:h-[460px] rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/50 dark:shadow-black/40">
              <Image
                src="/images/about/office.jpg"
                alt="مقر الشركة"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-5 right-5 bg-zinc-900 dark:bg-green-700 text-white px-5 py-3 rounded-2xl shadow-lg">
                <p className="font-bold text-green-400 dark:text-green-200 text-sm mb-0.5">
                  منذ 2019
                </p>
                <p className="text-xs text-white/80">نصنع تجارب عقارية فاخرة</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="space-y-8">
            <div>
              <h3 className="text-green-700 dark:text-green-400 font-bold text-lg mb-2">
                رؤيتنا
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                أن نكون المرجع الأول والأكثر موثوقية للعقارات الفاخرة في السوق
                المصري والعربي من خلال الابتكار المستمر.
              </p>
            </div>
            <div>
              <h3 className="text-green-700 dark:text-green-400 font-bold text-lg mb-2">
                رسالتنا
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-7">
                تبسيط رحلة البحث عن المنزل المثالي من خلال تقديم بيانات شفافة
                بالكامل وتجربة مستخدم استثنائية وسلسة.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-slate-50 dark:bg-neutral-900/40 py-20 md:py-28">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold mb-4">
              قصتنا
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white">
              محطات في مسيرتنا
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-green-950/30 transition-all duration-300"
              >
                <p className="text-3xl font-extrabold text-green-700 dark:text-green-400 mb-3">
                  {item.year}
                </p>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-6">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES / WHY US */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <motion.div {...fadeUp} className="text-center mb-14 max-w-xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold mb-4">
            لماذا نحن
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-3">
            منصة صُممت لتجربة لا مثيل لها
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            كل تفصيلة في منصتنا مبنية لتوفير رحلة بحث عقاري شفافة وسهلة
            ومتكاملة.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="group bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-green-950/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 flex items-center justify-center mb-4 group-hover:bg-green-700 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-2">
                  {v.title}
                </h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-6">
                  {v.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-green-700 dark:bg-green-700/90 text-center text-white px-8 py-16 md:py-20"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <h2 className="relative text-3xl md:text-4xl font-black mb-4">
            جاهز تبدأ رحلتك معنا؟
          </h2>
          <p className="relative max-w-xl mx-auto text-green-50 mb-8">
            تواصل مع مستشارينا العقاريين اليوم واحصل على استشارة مجانية لأفضل
            الفرص المتاحة.
          </p>
          <Link
            href="/contactUs"
            className="relative inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-3.5 rounded-2xl hover:bg-green-50 transition-colors shadow-lg"
          >
            تواصل معنا الآن
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
