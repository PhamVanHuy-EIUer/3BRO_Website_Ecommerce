"use client";

import TopProductChart from "@/components/admin/dashboard/TopProductChart";
import SalesOverviewChart from "@/components/admin/dashboard/SalesOverviewChart";
import CategoryChart from "@/components/admin/dashboard/CategoryChart";
import ItemCards from "@/components/ItemsCard";
import { useAuth } from "@/context/AuthContext";
import ForbiddenPage from "../forbindden/page";
import PageLoading from "@/components/Loading";

const Dashboard = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="flex-1 relative z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <ItemCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TopProductChart />
          <SalesOverviewChart />
          <CategoryChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
