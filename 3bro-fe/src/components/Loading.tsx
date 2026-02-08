import { Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const PageLoading = () => {
  const { Text } = Typography;
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #fef5e7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",

        gap: 24,
      }}
    >
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        size="large"
      />
      <Text style={{ fontSize: 16, color: "#8c8c8c" }}>Loading Page...</Text>
    </div>
  );
};

export default PageLoading;
