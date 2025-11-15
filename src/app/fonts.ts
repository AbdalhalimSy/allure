import localFont from "next/font/local";

export const ubuntu = localFont({
  src: [
    { path: "../../public/fonts/ubuntu/Ubuntu-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/ubuntu/Ubuntu-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/ubuntu/Ubuntu-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/ubuntu/Ubuntu-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-en",
  display: "swap",
});

export const notoKufiArabic = localFont({
  src: [
    { path: "../../public/fonts/noto-kufi-arabic/NotoKufiArabic-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/noto-kufi-arabic/NotoKufiArabic-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/noto-kufi-arabic/NotoKufiArabic-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/noto-kufi-arabic/NotoKufiArabic-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/noto-kufi-arabic/NotoKufiArabic-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-ar",
  display: "swap",
});
