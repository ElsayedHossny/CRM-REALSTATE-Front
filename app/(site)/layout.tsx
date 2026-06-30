import Footer from "@/components/footer";
import Navbar from "@/components/navbar/Navbar";
import UserContextProvider from "./(Context)/Context";
import { FavoritesProvider } from "@/app/(site)/favorites/(FavoritesContext)/FavoritesContext";
import { ThemeProvider } from "@/components/theme-provider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserContextProvider>
        <FavoritesProvider>
          <Navbar />
          <main suppressHydrationWarning>{children}</main>
          <Footer />
        </FavoritesProvider>
      </UserContextProvider>
    </ThemeProvider>
  );
}
