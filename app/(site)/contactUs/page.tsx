"use client";
import Image from "next/image";
import React from "react";
import hero from "@/public/images/contactUs-images/hero.jpg";
import ContactUsForm from "@/components/contactUs/contactUsForm";
import { motion } from "motion/react";

const ContactUs = () => {
  const fadeInSlideUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  return (
    <div className="w-full flex-1 flex flex-col font-sans" dir="rtl">
      <div className="relative h-[100vh] w-full flex items-center justify-center text-center px-6 overflow-hidden bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={hero}
            alt="Modern luxury real estate"
            fill
            priority
            className="object-cover opacity-40"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />

        <motion.div
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.2 }}
          className="relative z-20 max-w-4xl space-y-6 flex flex-col items-center"
        >
          <motion.span
            variants={fadeInSlideUp}
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-green-400 bg-green-500/10 rounded-full border border-green-500/20 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            نحن هنا لخدمتك دائماً
          </motion.span>

          <motion.h1
            variants={fadeInSlideUp}
            className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none"
          >
            لنبدأ رحلة البحث عن{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-green-400 to-green-300">
              عقارك المثالي
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInSlideUp}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed"
          >
            سواء كنت تبحث عن سكن فاخر، استثمار مضمون، أو إدارة محترفة لأصولك؛
            فريقنا من الخبراء مستعد للإجابة على كافة استفساراتك.
          </motion.p>
        </motion.div>
      </div>

      <div className="relative max-w-4xl mx-auto w-full px-6 -mt-20 z-30 mb-16">
        <ContactUsForm />
      </div>

      <div className="w-full h-[450px] bg-zinc-100 dark:bg-zinc-900 relative grayscale dark:grayscale-[60%] contrast-125 dark:contrast-100 hover:grayscale-0 hover:contrast-100 transition-all duration-700 border-t border-zinc-200 dark:border-zinc-800">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13684.973491299945!2d31.380693!3d31.041381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sar!2seg!4v1710000000000"
          width="100%"
          height="100%"
          className="border-0"
          loading="lazy"
          title="موقع الشركة"
        ></iframe>
        <div className="absolute inset-0 pointer-events-none dark:bg-black/10 transition-colors" />
      </div>
    </div>
  );
};

export default ContactUs;
