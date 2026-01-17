"use client";
import { Avatar } from "antd";
import Link from "next/link";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
import { UserOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
const menuItems = [
  {
    id: 1,
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/admin",
        icon: <MdDashboard />,
      },
      {
        title: "Users",
        path: "/admin/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Products",
        path: "/admin/products",
        icon: <MdShoppingBag />,
      },
      {
        title: "Transactions",
        path: "/admin/transactions",
        icon: <MdAttachMoney />,
      },
    ],
  },
  {
    id: 2,
    title: "Analytics",
    list: [
      {
        title: "Revenue",
        path: "/admin/revenue",
        icon: <MdWork />,
      },
      {
        title: "Reports",
        path: "/admin/reports",
        icon: <MdAnalytics />,
      },
      {
        title: "Teams",
        path: "/admin/teams",
        icon: <MdPeople />,
      },
    ],
  },
  {
    id: 3,
    title: "User",
    list: [
      {
        title: "Settings",
        path: "/admin/settings",
        icon: <MdOutlineSettings />,
      },
      {
        title: "Help",
        path: "/admin/help",
        icon: <MdHelpCenter />,
      },
    ],
  },
];
const SideBar = () => {
  const pathName = usePathname();

  return (
    <div className="sticky top-10">
      <div className="flex items-center gap-5">
        <Avatar size="large" icon={<UserOutlined />} />
        <div className="flex flex-col">
          <span className="font-medium">Test</span>
          <span className="text-xs text-gray-700">Administrator</span>
        </div>
      </div>
      <ul>
        {menuItems.map((cat) => (
          <li key={cat.id}>
            <span className="font-bold text-sm my-3">{cat.title}</span>
            {cat.list.map((item) => (
              <Link
                key={item.title}
                href={item.path}
                className={`px-5 py-3 flex items-center gap-2 my-1 rounded-xl hover:bg-gray-300 ${
                  pathName == item.path && "bg-gray-300"
                }`}
              >
                {item.icon} {item.title}
              </Link>
            ))}
          </li>
        ))}
      </ul>
      <button className="w-full px-5 py-3 flex items-center gap-2 my-1 rounded-xl hover:bg-gray-300">
        <MdLogout /> Logout
      </button>
    </div>
  );
};

export default SideBar;
