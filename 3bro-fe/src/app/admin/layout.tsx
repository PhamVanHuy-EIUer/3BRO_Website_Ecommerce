import NavBar from "@/components/admin/NavBar";
import SideBar from "@/components/admin/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 flex-shrink-0 z-20">
        <SideBar />
      </aside>

      {/* Main area */}
      <div className=" h-screen flex flex-col flex-1 overflow-hidden">
        <NavBar />
        {/* Scroll container */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
