import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const LoadingUser: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
      }}
    >
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
};

export default LoadingUser;
