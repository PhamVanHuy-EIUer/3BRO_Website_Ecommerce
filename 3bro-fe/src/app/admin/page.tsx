import Card from "@/components/admin/card/Card";
import Chart from "@/components/admin/chart/Chart";
import RightBar from "@/components/admin/rightbar/RightBar";
import Transactions from "@/components/admin/transactions/Transactions";
import React from "react";

const page = () => {
  return (
    <div className="flex gap-5 mt-5 ">
      <div className="flex-3 flex flex-col gap-5">
        <div className="flex gap-5 justify-between">
          <Card />
          <Card />
          <Card />
        </div>
        <Transactions />
        <Chart />
      </div>
      <div>
        <RightBar />
      </div>
    </div>
  );
};

export default page;
