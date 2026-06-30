export const fields = [
  {
    id: "type",
    label: "المساحه",
    options: ["الكل", "100متر", "100-250متر", "300متر", "400متر", "500متر"],
    default: "الكل",
  },
  {
    id: "beds",
    label: "الدور",
    options: ["الكل", "الارضي", "01", "02", "03", "04+"],
    default: "الكل",
  },
  {
    id: "location",
    label: "المكان",
    options: ["الكل", "شرم الشيخ", "القاهره", "الشرقيه", "الغربيه", "المنوفيه"],
    default: "الكل",
  },
  {
    id: "price",
    label: "السعر",
    options: ["الكل", "Under 500K", "500K – 1M", "AED 1,000,000", "1M – 2M", "3M+"],
    default: "الكل",
  },
  {
    id: "bookType",
    label: "Book Type",
    options: ["الكل", "Daily", "Weekly", "Monthly", "Yearly"],
    default: "الكل",
  },
];