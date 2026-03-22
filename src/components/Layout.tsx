import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${isHome ? "" : "pt-[88px]"}`}>{children}</main>
      <Footer />
    </div>
  );
}
