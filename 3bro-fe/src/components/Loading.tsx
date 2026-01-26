import { Spin } from "antd";

const PageLoading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin tip="Loading...." size="default" />
    </div>
  );
};

export default PageLoading;
