interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  compound: string;
  date: string;
}

interface TestimonialsSection {
  tag: string;
  title: string;
  subtitle: string;
  testimonials: TestimonialItem[];
}

interface AboutData {
  testimonials: TestimonialsSection;
}

export const aboutData: AboutData = {
  testimonials: {
    tag: "آراء عملائنا",
    title: "ماذا يقول من وثقوا بنا",
    subtitle: "آلاف العملاء وجدوا وحدتهم المثالية معنا، هذه بعض تجاربهم.",
    testimonials: [
      {
        id: 1,
        name: "أحمد محمود السيد",
        role: "مهندس مدني",
        avatar: "/images/avatars/avatar-1.jpg",
        rating: 5,
        text: "تجربة استثنائية من البداية للنهاية. الفريق ساعدني في اختيار الوحدة المناسبة وأنهى كل الإجراءات في وقت قياسي. أنصح بها بشدة لكل من يبحث عن عقار في مصر.",
        compound: "كومباوند بلوم فيلدز",
        date: "مارس 2024",
      },
      {
        id: 2,
        name: "سارة خالد إبراهيم",
        role: "طبيبة",
        avatar: "/images/avatars/avatar-2.jpg",
        rating: 5,
        text: "كنت قلقة من تعقيدات شراء العقار، لكن المنصة بسّطت كل شيء. المعلومات كانت دقيقة والسعر المعروض كان هو السعر الفعلي بدون أي رسوم مخفية.",
        compound: "كومباوند المقصد",
        date: "يناير 2024",
      },
      {
        id: 3,
        name: "محمد عبدالرحمن",
        role: "رجل أعمال",
        avatar: "/images/avatars/avatar-3.jpg",
        rating: 5,
        text: "اشتريت 3 وحدات استثمارية عبر المنصة. التحليلات المقدمة عن السوق دقيقة جداً وساعدتني في اتخاذ قرارات استثمارية ناجحة. شكراً للفريق المحترف.",
        compound: "برج النيل",
        date: "فبراير 2024",
      },
      {
        id: 4,
        name: "نهى حسن مصطفى",
        role: "مديرة تسويق",
        avatar: "/images/avatars/avatar-4.jpg",
        rating: 4,
        text: "خدمة ممتازة وفريق محترف. الموقع سهل الاستخدام جداً ويعطيك كل المعلومات اللي محتاجها قبل اتخاذ القرار. وجدت شقتي في أقل من أسبوع.",
        compound: "كومباوند سوديك وست",
        date: "أبريل 2024",
      },
    ],
  },
};