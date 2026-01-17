import NavBar from "@/components/admin/NavBar";
import SideBar from "@/components/admin/SideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" overflow-hidden flex ">
      <div className="flex-1 bg-[#f5f5f5] p-5">
        <SideBar />
      </div>
      <div className="flex-4 p-5">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
