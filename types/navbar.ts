export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

export interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: { title: string; url: string };
    signup: { title: string; url: string };
  };
}

export const DEFAULT_LOGO = {
  url: "/",
  src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
  alt: "logo",
  title: "موقع العقارات",
};

export const DEFAULT_MENU: MenuItem[] = [
  { title: "الرئيسية", url: "/" },
  { title: "من نحن", url: "/about" },
  { title: "العقارات", url: "/properites" },
  { title: "اتصل بنا", url: "/contactUs" },
];

export const DEFAULT_AUTH = {
  login: { title: "تسجيل الدخول", url: "/login" },
  signup: { title: "إنشاء حساب", url: "/register" },
};