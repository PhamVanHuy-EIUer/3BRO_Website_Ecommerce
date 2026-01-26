import Footer from "@/components/home/Footer";
import NavBar from "@/components/home/NavBar";
import Notification from "@/components/home/Notification";
import { AuthProvider } from "@/context/AuthContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AuthProvider>
        <Notification />
        <NavBar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </AuthProvider>
    </div>
  );
}
