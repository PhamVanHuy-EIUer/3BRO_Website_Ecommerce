import NavBar from "@/components/admin/NavBar";
import SideBar from "@/components/admin/SideBar";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="h-screen overflow-hidden flex bg-gray-50">
        {/* Sidebar - Fixed */}
        <aside className="flex-shrink-0 z-30">
          <SideBar />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar - Sticky */}
          <NavBar />

          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {/* Content Container */}
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Content Card/Wrapper */}
              <div className="max-w-[1600px] mx-auto">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
